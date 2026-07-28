interface FaqItem {
  question: string
  answer: string
}

interface FaqSectionProps {
  items: FaqItem[]
  title?: string
}

export function FaqSection({ items, title = 'Perguntas frequentes' }: FaqSectionProps) {
  return (
    <section className="method-section method-faq" aria-labelledby="faq-title">
      <div className="shell method-section__split">
        <div>
          <p className="method-kicker">PARA CONSULTAR</p>
          <h2 id="faq-title">{title}</h2>
          <p>Respostas diretas sobre o alcance e os limites do Radar Docente.</p>
        </div>
        <div className="method-faq__list">
          {items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}<span aria-hidden="true">+</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
