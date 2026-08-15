import { Award, CheckCircle2, Clipboard, ExternalLink, Search, ShieldX } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { Footer } from '../components/Footer'
import { Seo } from '../components/Seo'
import { validateCertificate } from '../services/certificateApi'
import type { Certificate } from '../types/certificate'

const SITE_URL = 'https://radarpraxia.com'
const date = (value: string) => new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(`${value.slice(0, 10)}T12:00:00Z`))

export function CertificatePage() {
  const { codigo = '' } = useParams(); const navigate = useNavigate(); const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [query, setQuery] = useState(''); const [queryError, setQueryError] = useState('')
  const [loading, setLoading] = useState(Boolean(codigo)); const [failed, setFailed] = useState(false); const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!codigo) return
    let active = true
    validateCertificate(codigo).then(({ certificate: found }) => { if (active) setCertificate(found) }).catch(() => { if (active) setFailed(true) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [codigo])
  const valid = certificate?.status === 'emitido'
  const credentialUrl = `${SITE_URL}/certificados/${certificate?.codigo_validacao || codigo}`
  const linkedInUrl = certificate ? `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certificate.workshop_titulo)}&organizationName=${encodeURIComponent('PraxIA')}&issueYear=${certificate.data_realizacao.slice(0, 4)}&issueMonth=${Number(certificate.data_realizacao.slice(5, 7))}&certId=${encodeURIComponent(certificate.codigo_validacao)}&certUrl=${encodeURIComponent(credentialUrl)}` : ''
  async function copyCredential() {
    if (!certificate) return
    await navigator.clipboard.writeText(`Nome: ${certificate.workshop_titulo}\nOrganização emissora: PraxIA\nData de emissão: ${date(certificate.data_realizacao)}\nID da credencial: ${certificate.codigo_validacao}\nURL da credencial: ${credentialUrl}`)
    setCopied(true); window.setTimeout(() => setCopied(false), 2500)
  }
  function searchCertificate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = query.trim().toUpperCase()
    if (!normalized) { setQueryError('Digite o código de validação do certificado.'); return }
    setQueryError(''); navigate(`/certificados/${encodeURIComponent(normalized)}`)
  }
  return <>
    <Seo title="Validação de certificado | PraxIA" description="Consulte a autenticidade de um certificado emitido pela PraxIA." path={codigo ? `/certificados/${codigo}` : '/certificados'} robots="noindex, follow" />
    <main className="certificate-page"><header className="certificate-header"><a href="/" aria-label="Página inicial da PraxIA"><BrandMark inverse /></a><span>Validação de credencial</span></header>
      <section className="certificate-shell" aria-live="polite">
        {!codigo ? <div className="certificate-lookup"><div className="certificate-lookup__icon"><Award /></div><p className="eyebrow"><span />Credenciais PraxIA</p><h1>Validar certificado</h1><p>Digite o código que aparece no certificado para consultar sua autenticidade.</p><form onSubmit={searchCertificate} noValidate><label htmlFor="certificate-code">Código de validação</label><div><input id="certificate-code" value={query} onChange={(event) => { setQuery(event.target.value); setQueryError('') }} placeholder="Ex.: PRAXIA-…" autoComplete="off" autoCapitalize="characters" aria-describedby={queryError ? 'certificate-code-error' : undefined} /><button type="submit"><Search />Validar certificado</button></div>{queryError && <span id="certificate-code-error" role="alert">{queryError}</span>}</form><small>Você também pode acessar diretamente pelo QR Code impresso no certificado.</small></div> : loading ? <div className="certificate-state"><span className="certificate-loader" /><h1>Validando certificado…</h1><p>Estamos consultando a credencial de forma segura.</p></div> : failed ? <div className="certificate-state certificate-state--invalid"><ShieldX /><h1>Validação indisponível</h1><p>Tente novamente em alguns instantes.</p></div> : !valid ? <div className="certificate-state certificate-state--invalid"><ShieldX /><span>Certificado não localizado/revogado</span><h1>Não foi possível confirmar esta credencial</h1><p>Confira o endereço informado ou entre em contato com a PraxIA.</p><code>{codigo}</code></div> : <article className="certificate-card">
          <div className="certificate-card__status"><CheckCircle2 /><span>Certificado válido</span></div>
          <div className="certificate-card__intro"><div><p>Certificamos a participação de</p><h1>{certificate.nome_participante}</h1></div><Award aria-hidden="true" /></div>
          <dl><div><dt>Workshop</dt><dd>{certificate.workshop_titulo}</dd></div><div><dt>Carga horária</dt><dd>{certificate.carga_horaria} horas</dd></div><div><dt>Data de realização</dt><dd>{date(certificate.data_realizacao)}</dd></div><div><dt>Data de emissão</dt><dd>{new Date(certificate.data_emissao).toLocaleDateString('pt-BR')}</dd></div><div className="certificate-card__code"><dt>Código de validação</dt><dd>{certificate.codigo_validacao}</dd></div></dl>
          <div className="certificate-card__actions"><a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="certificate-linkedin">Adicionar credencial ao LinkedIn <ExternalLink /></a><button type="button" onClick={() => void copyCredential()}><Clipboard />{copied ? 'Dados copiados' : 'Copiar dados da credencial'}</button></div>
          <p className="certificate-card__note">O LinkedIn pode solicitar a confirmação ou o preenchimento de alguns campos.</p>
        </article>}
      </section>
    </main><Footer />
  </>
}
