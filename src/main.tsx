import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { initializeAnalyticsFromStoredConsent, initializeMarketingFromStoredConsent } from './services/cookieConsent'
import { loadMetaPixel } from './services/metaPixel'
import './styles.css'

initializeAnalyticsFromStoredConsent()
initializeMarketingFromStoredConsent()
loadMetaPixel()

const rootElement = document.getElementById('root')!
const application = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Puppeteer captures the DOM after visual effects have settled. Reusing that
// mutated tree for hydration would produce mismatches with React's initial
// render, so the client takes ownership of the root before mounting normally.
if (rootElement.hasChildNodes()) rootElement.replaceChildren()
createRoot(rootElement).render(application)
