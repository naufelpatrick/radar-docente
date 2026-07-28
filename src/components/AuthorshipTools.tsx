import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

const levels = [
  { tone: 'green', label: 'Permitido', text: 'Apoios que não substituem o objetivo principal e dispensam autorização adicional.', examples: 'Perguntas de revisão, explicações alternativas, acessibilidade ou organização de ideias próprias.' },
  { tone: 'yellow', label: 'Declarar', text: 'Usos que influenciam significativamente o produto ou o processo.', examples: 'Estrutura inicial, trechos para revisão, imagens, código sugerido, resumos ou reformulação.' },
  { tone: 'red', label: 'Não permitido', text: 'Usos que substituem a competência ou decisão avaliada nesta atividade.', examples: 'Resposta integral, análise central, dados pessoais, referências não verificadas ou uso oculto.' },
]

const declarations = [
  { title: 'Modelo breve', text: 'Usei [ferramenta] para [finalidade]. Mantive, modifiquei ou rejeitei as sugestões da seguinte forma: [síntese]. Verifiquei o conteúdo por meio de [fontes ou procedimento].' },
  { title: 'Modelo por etapas', text: 'Planejamento: [como a IA participou]. Produção: [contribuições utilizadas]. Revisão: [o que foi alterado ou descartado]. Verificação: [como conferi informações e referências]. Responsabilidade: [decisões que permaneceram comigo].' },
  { title: 'Modelo reflexivo', text: 'O que a ferramenta acrescentou? Onde errou ou simplificou? Qual decisão foi mais importante? O que eu faria de forma diferente?' },
]

export function AuthorshipTrafficLight() {
  return (
    <figure className="authorship-light" aria-labelledby="authorship-light-caption">
      <div className="authorship-light__stack" aria-hidden="true"><i /><i /><i /></div>
      <div className="authorship-light__levels">{levels.map((level) => <article className={`authorship-light__level authorship-light__level--${level.tone}`} key={level.label}><small>{level.label}</small><h3>{level.text}</h3><p>{level.examples}</p></article>)}</div>
      <figcaption id="authorship-light-caption">Semáforo orientativo. As permissões precisam ser adaptadas ao objetivo e aos critérios de cada atividade.</figcaption>
    </figure>
  )
}

function CopyCard({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  return (
    <article className="declaration-card">
      <h3>{title}</h3><p>{text}</p>
      <button type="button" onClick={copy} aria-live="polite">{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied ? 'Copiado' : 'Copiar modelo'}</button>
    </article>
  )
}

export function DeclarationCopyCards() {
  return <div className="declaration-cards">{declarations.map((model) => <CopyCard key={model.title} {...model} />)}</div>
}
