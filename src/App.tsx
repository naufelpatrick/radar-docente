import { LandingPage } from './pages/LandingPage'
import { RadarPage } from './pages/RadarPage'

export default function App() {
  return window.location.pathname === '/radar' ? <RadarPage /> : <LandingPage />
}
