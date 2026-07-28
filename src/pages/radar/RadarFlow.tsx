import { Route, Routes } from 'react-router-dom'
import { RadarFlowLayout } from '../../components/RadarFlowLayout'
import { RadarSessionProvider } from '../../context/RadarSessionContext'
import { RadarIntroPage } from './RadarIntroPage'
import { RadarProfilePage } from './RadarProfilePage'
import { RadarQuestionPage } from './RadarQuestionPage'
import { RadarResultPage } from './RadarResultPage'
import { RadarReviewPage } from './RadarReviewPage'

export function RadarFlow() {
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
