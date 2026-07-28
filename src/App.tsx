import { Route, Routes } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { LandingPage } from './pages/LandingPage'
import { RadarFlow } from './pages/radar/RadarFlow'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/radar/*" element={<RadarFlow />} />
      </Routes>
    </>
  )
}
