import { Route, Routes, useLocation } from 'react-router-dom'
import { RadarFlowLayout } from '../../components/RadarFlowLayout'
import { Seo } from '../../components/Seo'
import { RadarSessionProvider } from '../../context/RadarSessionContext'
import { RadarIntroPage } from './RadarIntroPage'
import { RadarProfilePage } from './RadarProfilePage'
import { RadarQuestionPage } from './RadarQuestionPage'
import { RadarResultPage } from './RadarResultPage'
import { RadarReviewPage } from './RadarReviewPage'

export function RadarFlow() {
  const location = useLocation()

  return (
    <RadarSessionProvider>
      <Seo
        title="Radar Docente"
        description="Responda ao Radar Docente PráxIA e receba uma leitura orientativa da sua fluência digital e em inteligência artificial."
        path={location.pathname}
        robots="noindex, follow"
      />
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
