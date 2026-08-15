import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Seo } from '../../components/Seo'
import { RadarFlowLayout } from '../../components/RadarFlowLayout'
import { RadarSessionProvider } from '../../context/RadarSessionContext'
import { RadarIntroPage } from './RadarIntroPage'
import { RadarProfilePage } from './RadarProfilePage'
import { RadarQuestionPage } from './RadarQuestionPage'
import { RadarResultPage } from './RadarResultPage'
import { RadarReviewPage } from './RadarReviewPage'
import { trackExpiredRadarAbandon } from '../../services/radarFunnelAnalytics'

export function RadarFlow() {
  const location = useLocation()
  useEffect(() => {
    trackExpiredRadarAbandon()
  }, [])

  return (
    <RadarSessionProvider>
      <Seo title="Radar Docente" description="Aplicação de autorreflexão do Radar Docente PraxIA." path={location.pathname} robots="noindex, follow" omitCanonical />
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
