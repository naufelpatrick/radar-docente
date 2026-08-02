import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { RadarFlowLayout } from '../../components/RadarFlowLayout'
import { RadarSessionProvider } from '../../context/RadarSessionContext'
import { RadarIntroPage } from './RadarIntroPage'
import { RadarProfilePage } from './RadarProfilePage'
import { RadarQuestionPage } from './RadarQuestionPage'
import { RadarResultPage } from './RadarResultPage'
import { RadarReviewPage } from './RadarReviewPage'
import { trackExpiredRadarAbandon } from '../../services/radarFunnelAnalytics'

export function RadarFlow() {
  useEffect(() => {
    trackExpiredRadarAbandon()
  }, [])

  return (
    <RadarSessionProvider>
      <RadarFlowLayout>
        <Routes>
          <Route index element={<RadarIntroPage />} />
          <Route path="perfil" element={<RadarProfilePage />} />
          <Route path="questoes/:questionNumber" element={<RadarQuestionPage />} />
          <Route path="revisao" element={<RadarReviewPage />} />
          <Route path="resultado" element={<RadarResultPage />} />
        </Routes>
      </RadarFlowLayout>
    </RadarSessionProvider>
  )
}
