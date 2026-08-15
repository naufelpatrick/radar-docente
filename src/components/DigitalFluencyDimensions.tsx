import { Accessibility, BookOpenCheck, RefreshCw, Scale, Sparkles, Target } from 'lucide-react'

const dimensions = [
  { icon: Target, title: 'Intencionalidade pedagógica', text: 'Escolher tecnologia a partir do que os estudantes precisam compreender, praticar, criar ou explicar.' },
  { icon: BookOpenCheck, title: 'Curadoria e avaliação crítica', text: 'Verificar fontes, reconhecer simplificações e vieses e decidir o que merece ser levado para a aula.' },
  { icon: Sparkles, title: 'Criação e adaptação', text: 'Transformar recursos para a linguagem, o tempo, o repertório e as necessidades de uma turma real.' },
  { icon: Accessibility, title: 'Inclusão e acessibilidade', text: 'Considerar acesso, conectividade, dispositivos, formatos e diferentes formas de participação.' },
  { icon: Scale, title: 'Ética, privacidade e cidadania', text: 'Cuidar de dados, direitos autorais, exposição, segurança e convivência responsável no digital.' },
  { icon: RefreshCw, title: 'Aprendizagem contínua', text: 'Experimentar com critério, aprender quando fizer sentido e revisar a prática a partir dos resultados.' },
]

export function DigitalFluencyDimensions() {
  return <div className="digital-fluency-dimensions" aria-label="Seis dimensões da fluência digital docente">
    {dimensions.map(({ icon: Icon, title, text }, index) => <article key={title}>
      <span className="digital-fluency-dimensions__number">{String(index + 1).padStart(2, '0')}</span>
      <Icon aria-hidden="true" />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>)}
  </div>
}
