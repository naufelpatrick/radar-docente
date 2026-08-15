import { useEffect } from 'react'
import { trackRadarCompletionAfterReport } from '../services/radarCompletionAnalytics'

export function RadarCompletionTracker({ completionId, totalQuestions, completionTimeSeconds, scoreRange }: { completionId: string; totalQuestions: number; completionTimeSeconds: number; scoreRange: string }) {
  useEffect(() => {
    trackRadarCompletionAfterReport(completionId, { totalQuestions, completionTimeSeconds, scoreRange })
  }, [completionId, completionTimeSeconds, scoreRange, totalQuestions])

  return null
}
