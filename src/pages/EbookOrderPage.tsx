import { CheckCircle2, Clock3, Download, RefreshCw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'
import { trackEbookPurchase } from '../services/ebookConversion'

type OrderStatus = 'checking' | 'pending' | 'paid' | 'canceled' | 'expired' | 'failed' | 'invalid'

export function EbookOrderPage() {
  const [params] = useSearchParams()
  const pedido = params.get('pedido') || ''
  const token = params.get('token') || ''
  const [status, setStatus] = useState<OrderStatus>(pedido && token ? 'checking' : 'invalid')
  const query = useMemo(() => new URLSearchParams({ pedido, token }).toString(), [pedido, token])

  useEffect(() => {
    if (!pedido || !token) {
      return
    }
    let active = true
    let attempts = 0
    async function check() {
      try {
        const response = await fetch(`/api/ebook/order?${query}`, { cache: 'no-store' })
        const body = await response.json()
        if (!active) return
        setStatus(response.ok ? body.status : 'invalid')
        if (body.status === 'pending' && attempts++ < 20) window.setTimeout(check, 3000)
      } catch {
        if (active) setStatus('failed')
      }
    }
    check()
    return () => { active = false }
  }, [pedido, query, token])

  const paid = status === 'paid'

  useEffect(() => {
    if (status === 'paid') trackEbookPurchase(pedido)
  }, [pedido, status])

  function returnHomeAfterDownload() {
    window.setTimeout(() => window.location.assign('/'), 1200)
  }
  return (
    <>
      <Seo title="Acesso ao e-book" description="Confirmação e acesso ao e-book IA na prática docente." path="/ebook/obrigado" />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader currentPage="ebook" />
      <main id="conteudo-principal" className="ebook-order-page">
        <section className="shell ebook-order-card">
          {paid ? <CheckCircle2 aria-hidden="true" /> : <Clock3 aria-hidden="true" />}
          <p className="eyebrow eyebrow--dark">{paid ? 'PAGAMENTO CONFIRMADO' : 'CONFIRMAÇÃO DO ASAAS'}</p>
          <h1>{paid ? 'Seu caderno está pronto.' : 'Estamos confirmando seu pagamento.'}</h1>
          <p>{paid
            ? 'O link abaixo é temporário e protege o acesso ao material adquirido.'
            : 'Pix costuma ser confirmado em poucos instantes. Esta página será atualizada automaticamente.'}</p>
          {paid ? (
            <a
              className="button-link button-link--primary"
              href={`/api/ebook/download?${query}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={returnHomeAfterDownload}
            >
              <Download aria-hidden="true" />Baixar meu e-book
            </a>
          ) : (
            <button className="button-link button-link--primary" type="button" onClick={() => window.location.reload()}>
              <RefreshCw aria-hidden="true" />Verificar novamente
            </button>
          )}
          {paid && <small>Após iniciar o download, você voltará à página inicial da PráxIA.</small>}
          {(status === 'invalid' || status === 'failed' || status === 'canceled' || status === 'expired') && (
            <p className="ebook-order-card__alert">Não foi possível liberar o arquivo. <Link to="/contato">Fale com a PráxIA</Link> informando o e-mail usado na compra.</p>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
