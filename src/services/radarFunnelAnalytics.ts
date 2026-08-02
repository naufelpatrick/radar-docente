import { analyticsAllowed, loadGoogleAnalytics } from './cookieConsent'

export const RADAR_FUNNEL_VERSION = 'beta-0.1'
const EVENT_PREFIX = 'praxia:ga4:radar-funnel:'
const PENDING_KEY = 'praxia:ga4:pending-radar-funnel'
const ATTEMPT_KEY = 'praxia:ga4:radar-attempt'
const TRAFFIC_KEY = 'praxia:ga4:radar-traffic'
const ABANDON_AFTER_MS = 30 * 60 * 1000

type RadarEventName =
  | 'radar_landing_view'
  | 'radar_start_click'
  | 'radar_consent_accepted'
  | 'radar_profile_started'
  | 'radar_profile_complete'
  | 'radar_questionnaire_started'
  | 'radar_progress'
  | 'radar_abandon'
  | 'radar_complete'
  | 'radar_result_view'

type EventValue = string | number | boolean
type RadarEventParameters = Record<string, EventValue | undefined>

type PendingEvent = {
  name: RadarEventName
  dedupeKey: string
  parameters: Record<string, EventValue>
}

type AttemptState = {
  attemptId: string
  lastStep: string
  lastQuestion: number
  progressPercent: number
  lastActivityAt: number
  completed: boolean
}

const prohibitedKeys = /name|email|phone|telefone|institution(?!_type)|city|answer|response|score$|lead|supabase|text/i

function safeStorage() {
  return typeof window === 'undefined' ? null : window.localStorage
}

function clean(parameters: RadarEventParameters) {
  return Object.fromEntries(Object.entries(parameters).filter(([key, value]) => (
    value !== undefined && value !== null && !prohibitedKeys.test(key) && ['string', 'number', 'boolean'].includes(typeof value)
  ))) as Record<string, EventValue>
}

function deviceType() {
  if (typeof window === 'undefined') return undefined
  if (window.innerWidth < 768) return 'mobile'
  if (window.innerWidth < 1024) return 'tablet'
  return 'desktop'
}

function readTraffic() {
  if (typeof window === 'undefined') return {}
  const query = new URLSearchParams(window.location.search)
  const current = {
    traffic_source: query.get('utm_source') || undefined,
    traffic_medium: query.get('utm_medium') || undefined,
    traffic_campaign: query.get('utm_campaign') || undefined,
  }
  if (current.traffic_source || current.traffic_medium || current.traffic_campaign) {
    window.sessionStorage?.setItem(TRAFFIC_KEY, JSON.stringify(current))
    return current
  }
  try {
    return JSON.parse(window.sessionStorage?.getItem(TRAFFIC_KEY) || '{}') as typeof current
  } catch {
    return {}
  }
}

function commonParameters() {
  return clean({
    funnel_version: RADAR_FUNNEL_VERSION,
    page_path: typeof window === 'undefined' ? undefined : window.location.pathname,
    device_type: deviceType(),
    ...readTraffic(),
  })
}

function readPending(): PendingEvent[] {
  try {
    return JSON.parse(safeStorage()?.getItem(PENDING_KEY) || '[]') as PendingEvent[]
  } catch {
    return []
  }
}

function savePending(events: PendingEvent[]) {
  const storage = safeStorage()
  if (!storage) return
  if (events.length) storage.setItem(PENDING_KEY, JSON.stringify(events))
  else storage.removeItem(PENDING_KEY)
}

function sentKey(dedupeKey: string) {
  return `${EVENT_PREFIX}${dedupeKey}`
}

function dispatch(event: PendingEvent) {
  const storage = safeStorage()
  if (!storage || storage.getItem(sentKey(event.dedupeKey))) return false
  if (!analyticsAllowed()) return false
  loadGoogleAnalytics()
  if (typeof window.gtag !== 'function') return false
  window.gtag('event', event.name, { ...commonParameters(), ...event.parameters })
  storage.setItem(sentKey(event.dedupeKey), 'sent')
  return true
}

export function trackRadarEventOnce(name: RadarEventName, attemptId: string, parameters: RadarEventParameters = {}, suffix: string = name) {
  const storage = safeStorage()
  if (!storage || !attemptId) return false
  const event: PendingEvent = { name, dedupeKey: `${attemptId}:${suffix}`, parameters: clean(parameters) }
  if (storage.getItem(sentKey(event.dedupeKey))) return false
  if (dispatch(event)) return true
  const pending = readPending().filter(({ dedupeKey }) => dedupeKey !== event.dedupeKey)
  savePending([...pending, event])
  return false
}

export function flushPendingRadarEvents() {
  if (!analyticsAllowed()) return
  const remaining = readPending().filter((event) => !dispatch(event))
  savePending(remaining)
}

export function trackRadarLanding(attemptId: string) {
  return trackRadarEventOnce('radar_landing_view', attemptId)
}

export function trackRadarStart(attemptId: string, ctaId: string, ctaLocation: string) {
  return trackRadarEventOnce('radar_start_click', attemptId, { cta_id: ctaId, cta_location: ctaLocation })
}

export function trackRadarConsentAccepted(attemptId: string) {
  return trackRadarEventOnce('radar_consent_accepted', attemptId)
}

export function trackRadarProfileStarted(attemptId: string) {
  return trackRadarEventOnce('radar_profile_started', attemptId)
}

export function trackRadarProfileComplete(attemptId: string, educationLevel: string) {
  return trackRadarEventOnce('radar_profile_complete', attemptId, { education_level: educationLevel })
}

export function trackRadarQuestion(attemptId: string, questionNumber: number, totalQuestions: number) {
  recordRadarStep(attemptId, 'questionnaire', questionNumber, totalQuestions)
  if (questionNumber === 1) {
    trackRadarEventOnce('radar_questionnaire_started', attemptId, { total_questions: totalQuestions })
  }
  if (![1, 10, 20, 30].includes(questionNumber)) return
  trackRadarEventOnce('radar_progress', attemptId, {
    question_number: questionNumber,
    total_questions: totalQuestions,
    progress_percent: Math.round((questionNumber / totalQuestions) * 100),
  }, `radar_progress:${questionNumber}`)
}

export function recordRadarStep(attemptId: string, lastStep: string, lastQuestion = 0, totalQuestions = 30) {
  const storage = safeStorage()
  if (!storage || !attemptId) return
  const now = Date.now()
  const previous = readAttempt()
  if (previous?.attemptId === attemptId && previous.completed) return
  if (previous && !previous.completed && now - previous.lastActivityAt >= ABANDON_AFTER_MS) {
    trackExpiredRadarAbandon(now)
  }
  const state: AttemptState = {
    attemptId,
    lastStep,
    lastQuestion,
    progressPercent: Math.round((lastQuestion / totalQuestions) * 100),
    lastActivityAt: now,
    completed: false,
  }
  storage.setItem(ATTEMPT_KEY, JSON.stringify(state))
}

export function markRadarAttemptComplete(attemptId: string) {
  const storage = safeStorage()
  if (!storage) return
  const state = readAttempt()
  if (state?.attemptId === attemptId) storage.setItem(ATTEMPT_KEY, JSON.stringify({ ...state, completed: true, lastStep: 'result', lastActivityAt: Date.now() }))
}

function readAttempt(): AttemptState | null {
  try {
    return JSON.parse(safeStorage()?.getItem(ATTEMPT_KEY) || 'null') as AttemptState | null
  } catch {
    return null
  }
}

export function trackExpiredRadarAbandon(now = Date.now()) {
  const state = readAttempt()
  if (!state || state.completed || now - state.lastActivityAt < ABANDON_AFTER_MS) return false
  const tracked = trackRadarEventOnce('radar_abandon', state.attemptId, {
    last_step: state.lastStep,
    last_question: state.lastQuestion,
    progress_percent: state.progressPercent,
  })
  safeStorage()?.setItem(ATTEMPT_KEY, JSON.stringify({ ...state, completed: true }))
  return tracked
}

export function trackRadarResult(attemptId: string, totalQuestions: number, completionTimeSeconds: number, scoreRange: string) {
  trackRadarEventOnce('radar_complete', attemptId, {
    source: 'radar_praxia',
    total_questions: totalQuestions,
    completion_time_seconds: completionTimeSeconds,
    score_range: scoreRange,
  })
  trackRadarEventOnce('radar_result_view', attemptId, { total_questions: totalQuestions })
  markRadarAttemptComplete(attemptId)
}
