import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MARKETING_CONSENT_GRANTED_EVENT } from '../services/cookieConsent'
import { trackMetaPageView } from '../services/metaPixel'

export function MetaPageViewTracker() {
  const location = useLocation()

  useEffect(() => {
    trackMetaPageView()
  }, [location.pathname, location.search])

  useEffect(() => {
    const handleMarketingConsent = () => trackMetaPageView()
    window.addEventListener(MARKETING_CONSENT_GRANTED_EVENT, handleMarketingConsent)
    return () => window.removeEventListener(MARKETING_CONSENT_GRANTED_EVENT, handleMarketingConsent)
  }, [])

  return null
}
