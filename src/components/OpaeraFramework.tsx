const stages = [
  ['O', 'Objetivo', 'O que o estudante deverá saber ou conseguir fazer ao final?'],
  ['P', 'Papel da IA', 'Que função a ferramenta desempenhará e quem fará o uso?'],
  ['A', 'Ação do estudante', 'O que ele fará além de solicitar uma resposta?'],
  ['E', 'Evidência', 'Que registro permitirá reconhecer a aprendizagem?'],
  ['R', 'Riscos e regras', 'Que limites de privacidade, acesso, autoria e segurança serão explícitos?'],
  ['A', 'Avaliação', 'Quais critérios observarão raciocínio, decisões e contribuição autoral?'],
]

export function OpaeraFramework() {
  return (
    <figure className="opaera-framework" aria-labelledby="opaera-caption">
      <div className="opaera-framework__track">
        {stages.map(([letter, title, description], index) => (
          <article key={`${letter}-${title}`}>
            <span aria-hidden="true">{letter}</span>
            <div><small>Etapa {index + 1}</small><h3>{title}</h3><p>{description}</p></div>
          </article>
        ))}
      </div>
      <figcaption id="opaera-caption">OPAERA organiza o planejamento da intenção pedagógica à avaliação, mantendo a tecnologia a serviço da aprendizagem.</figcaption>
    </figure>
  )
}
