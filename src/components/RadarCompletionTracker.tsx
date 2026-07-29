import { useEffect } from 'react'
import { trackRadarCompletionAfterReport } from '../services/radarCompletionAnalytics'

export function RadarCompletionTracker({ completionId }: { completionId: string }) {
  useEffect(() => {
    trackRadarCompletionAfterReport(completionId)
  }, [completionId])

  return null
}
