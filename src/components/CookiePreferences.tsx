import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  COOKIE_PREFERENCES_EVENT,
  loadGoogleAnalytics,
  readCookiePreference,
  saveCookiePreference,
  type CookiePreference,
} from '../services/cookieConsent'

export function CookiePreferences() {
  const [visible, setVisible] = useState(() => readCookiePreference() === null)
  const [customizing, setCustomizing] = useState(false)
  const [analytics, setAnalytics] = useState(() => readCookiePreference() === 'accepted')
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (readCookiePreference() === 'accepted') loadGoogleAnalytics()
    const open = () => {
      setAnalytics(readCookiePreference() === 'accepted')
      setCustomizing(true)
      setVisible(true)
    }
    window.addEventListener(COOKIE_PREFERENCES_EVENT, open)
    return () => window.removeEventListener(COOKIE_PREFERENCES_EVENT, open)
  }, [])

  useEffect(() => {
    if (visible) headingRef.current?.focus()
  }, [visible, customizing])

  const choose = (preference: CookiePreference) => {
    saveCookiePreference(preference)
    if (preference === 'accepted') loadGoogleAnalytics()
    setVisible(false)
    setCustomizing(false)
  }

  if (!visible) return null

  return (
    <aside className="cookie-preferences" aria-labelledby="cookie-title" role="dialog" aria-modal="false">
      <div>
        <p className="cookie-preferences__label">PRIVACIDADE E MEDIÇÃO</p>
        <h2 id="cookie-title" ref={headingRef} tabIndex={-1}>{customizing ? 'Preferências de cookies' : 'Você escolhe sobre o Analytics.'}</h2>
        <p>Usamos armazenamento local necessário ao funcionamento do Radar e, somente com sua autorização, Google Analytics para compreender o uso do site. <Link to="/privacidade">Leia a Política de Privacidade</Link>.</p>
        {customizing && (
          <div className="cookie-preferences__options">
            <label><input type="checkbox" checked disabled /><span><strong>Necessários</strong> Mantêm sua preferência e o progresso do Radar neste navegador.</span></label>
            <label><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /><span><strong>Analytics</strong> Ajuda a medir navegação e desempenho, sem enviar respostas, scores ou dados dos formulários.</span></label>
          </div>
        )}
      </div>
      <div className="cookie-preferences__actions">
        {customizing ? (
          <button type="button" onClick={() => choose(analytics ? 'accepted' : 'essential_only')}>Salvar preferências</button>
        ) : (
          <>
            <button type="button" onClick={() => choose('accepted')}>Aceitar todos</button>
            <button type="button" className="cookie-button--secondary" onClick={() => choose('essential_only')}>Recusar não essenciais</button>
            <button type="button" className="cookie-button--text" onClick={() => setCustomizing(true)}>Personalizar</button>
          </>
        )}
      </div>
    </aside>
  )
}
