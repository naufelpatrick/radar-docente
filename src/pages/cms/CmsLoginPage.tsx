import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { BrandMark } from '../../components/BrandMark'
import { login } from '../../services/cmsApi'

export function CmsLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (sessionStorage.getItem('praxia_cms_csrf')) return <Navigate to="/admin" replace />
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try { await login(username, password); navigate('/admin') } catch (caught) { setError(caught instanceof Error ? caught.message : 'Não foi possível entrar') } finally { setBusy(false) }
  }
  return <main className="cms-login"><form onSubmit={submit}>
    <BrandMark /><p className="eyebrow eyebrow--dark"><span />Área editorial</p><h1>Entrar no CMS</h1><p>Crie, revise e publique artigos da PráxIA.</p>
    {error && <p className="cms-alert cms-alert--error" role="alert">{error}</p>}
    <label htmlFor="cms-username">Usuário</label><input id="cms-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
    <label htmlFor="cms-password">Senha</label><input id="cms-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
    <button className="button-link button-link--primary" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
  </form></main>
}
