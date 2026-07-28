import { Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { RadarFlow } from './pages/radar/RadarFlow'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/radar/*" element={<RadarFlow />} />
    </Routes>
  )
}
