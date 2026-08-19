import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  COOKIE_PREFERENCES_EVENT,
  initializeAnalyticsFromStoredConsent,
  initializeMarketingFromStoredConsent,
  loadGoogleAds,
  loadGoogleAnalytics,
  readCookiePreferences,
  saveCookiePreferences,
  type CookiePreferencesState,
} from '../services/cookieConsent'
import { flushPendingEbookPurchase } from '../services/ebookConversion'
import { loadMetaPixel } from '../services/metaPixel'
import { flushPendingRadarCompletion } from '../services/radarCompletionAnalytics'
import { flushPendingRadarEvents } from '../services/radarFunnelAnalytics'
import { captureTrafficAttribution } from '../services/trafficAttribution'

const emptyPreferences: CookiePreferencesState = { analytics: false, marketing: false }

export function CookiePreferences() {
  const [visible, setVisible] = useState(() => readCookiePreferences() === null)
  const [customizing, setCustomizing] = useState(false)
  const initial = readCookiePreferences() ?? emptyPreferences
  const [analytics, setAnalytics] = useState(initial.analytics)
  const [marketing, setMarketing] = useState(initial.marketing)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (initializeAnalyticsFromStoredConsent()) {
      captureTrafficAttribution()
      flushPendingRadarCompletion()
      flushPendingRadarEvents()
    }
    if (initializeMarketingFromStoredConsent()) flushPendingEbookPurchase()
    loadMetaPixel()

    const open = () => {
      const preferences = readCookiePreferences() ?? emptyPreferences
      setAnalytics(preferences.analytics)
      setMarketing(preferences.marketing)
      setCustomizing(true)
      setVisible(true)
    }
    window.addEventListener(COOKIE_PREFERENCES_EVENT, open)
    return () => window.removeEventListener(COOKIE_PREFERENCES_EVENT, open)
  }, [])

  useEffect(() => {
    if (visible) headingRef.current?.focus()
  }, [visible, customizing])

  const choose = (preferences: CookiePreferencesState) => {
    saveCookiePreferences(preferences)

    if (preferences.analytics) {
      loadGoogleAnalytics()
      captureTrafficAttribution()
      flushPendingRadarCompletion()
      flushPendingRadarEvents()
    }

    if (preferences.marketing) {
      loadGoogleAds()
      loadMetaPixel()
      flushPendingEbookPurchase()
    }

    setVisible(false)
    setCustomizing(false)
  }

  if (!visible) return null

  return (
    <aside className="cookie-preferences" aria-labelledby="cookie-title" role="dialog" aria-modal="false">
      <div>
        <p className="cookie-preferences__label">PRIVACIDADE E MEDIÇÃO</p>
        <h2 id="cookie-title" ref={headingRef} tabIndex={-1}>{customizing ? 'Preferências de cookies' : 'Você escolhe como seus dados de navegação são usados.'}</h2>
        <p>Usamos armazenamento local necessário ao funcionamento do Radar. Com sua autorização, podemos medir o uso do site e usar tecnologias de publicidade para avaliar campanhas e públicos. <Link to="/privacidade">Leia a Política de Privacidade</Link>.</p>
        {customizing && (
          <div className="cookie-preferences__options">
            <label><input type="checkbox" checked disabled /><span><strong>Necessários</strong> Mantêm sua preferência e o progresso do Radar neste navegador.</span></label>
            <label><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /><span><strong>Analytics</strong> Usa Google Analytics para medir navegação, leitura e conclusão do Radar, sem enviar respostas individuais, scores, CPF ou campos livres.</span></label>
            <label><input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} /><span><strong>Marketing</strong> Permite Meta Pixel e Google Ads para medir campanhas, criar públicos e atribuir conversões. Não enviamos respostas do Radar, scores, CPF ou conteúdo de formulários.</span></label>
          </div>
        )}
      </div>
      <div className="cookie-preferences__actions">
        {customizing ? (
          <button type="button" onClick={() => choose({ analytics, marketing })}>Salvar preferências</button>
        ) : (
          <>
            <button type="button" onClick={() => choose({ analytics: true, marketing: true })}>Aceitar todos</button>
            <button type="button" className="cookie-button--secondary" onClick={() => choose(emptyPreferences)}>Recusar não essenciais</button>
            <button type="button" className="cookie-button--text" onClick={() => setCustomizing(true)}>Personalizar</button>
          </>
        )}
      </div>
    </aside>
  )
}
