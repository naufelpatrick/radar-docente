import type { ReactNode } from 'react'

interface TimelineItem {
  label: string
  title: string
  text: string
}

export function Timeline({ items, ariaLabel }: { items: TimelineItem[]; ariaLabel: string }) {
  return (
    <ol className="content-timeline" aria-label={ariaLabel}>
      {items.map((item) => (
        <li key={item.title}>
          <span>{item.label}</span>
          <div><h3>{item.title}</h3><p>{item.text}</p></div>
        </li>
      ))}
    </ol>
  )
}

export function Stepper({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="content-stepper">
      {items.map((item, index) => (
        <li key={item.title}>
          <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <div><small>{item.label}</small><h3>{item.title}</h3><p>{item.text}</p></div>
        </li>
      ))}
    </ol>
  )
}

export function Testimonial({ children, author, context }: { children: ReactNode; author: string; context: string }) {
  return (
    <figure className="content-testimonial">
      <blockquote>{children}</blockquote>
      <figcaption><strong>{author}</strong><span>{context}</span></figcaption>
    </figure>
  )
}

interface ComparisonRow {
  criterion: string
  first: string
  second: string
}

export function ComparisonTable({ firstLabel, secondLabel, rows, caption }: { firstLabel: string; secondLabel: string; rows: ComparisonRow[]; caption: string }) {
  return (
    <div className="comparison-table" tabIndex={0} role="region" aria-label={caption}>
      <table>
        <caption>{caption}</caption>
        <thead><tr><th scope="col">Critério</th><th scope="col">{firstLabel}</th><th scope="col">{secondLabel}</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.criterion}><th scope="row">{row.criterion}</th><td>{row.first}</td><td>{row.second}</td></tr>)}</tbody>
      </table>
    </div>
  )
}
