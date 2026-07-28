import type { TeamMember } from '../types/team'

export const teamIntroduction = 'A PráxIA reúne experiência em educação, tecnologia, design e inovação para apoiar professores e instituições na integração crítica e pedagogicamente intencional da inteligência artificial.'

export const team: TeamMember[] = [
  {
    id: 'patrick-naufel',
    name: 'Patrick Naufel',
    role: null,
    initials: 'PN',
    shortBio: 'Professor e pesquisador nas áreas de Design Centrado no Usuário, inovação e transformação digital.',
    fullBio: 'Professor e pesquisador nas áreas de Design Centrado no Usuário, inovação e transformação digital. Atua no ensino superior e técnico, desenvolvendo projetos que aproximam design, tecnologia, gestão e resolução de problemas reais. É mestrando em Engenharia e Gestão de Sistemas Produtivos, com pesquisa voltada à maturidade digital e à inovação organizacional.',
    photo: null,
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/patricknaufel', type: 'linkedin' },
      { label: 'Currículo Lattes', href: 'http://lattes.cnpq.br/0026328778886854', type: 'lattes' },
    ],
    displayOrder: 1,
  },
  {
    id: 'giovani-letti',
    name: 'Giovani Letti',
    role: null,
    initials: 'GL',
    shortBio: 'Professor e pesquisador com formação interdisciplinar em comunicação, tecnologia e educação.',
    fullBio: 'Professor e pesquisador com formação interdisciplinar em comunicação, tecnologia e educação. É graduado em Comunicação Social, com habilitação em Publicidade e Propaganda, pela UFRGS, e mestre em Ciência da Computação, com ênfase em Sistemas de Conhecimento, pela UFSC. Atua como professor universitário e desenvolve trabalhos relacionados à aprendizagem, inovação e integração da tecnologia em diferentes contextos.',
    photo: null,
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/giovani-letti-1332a1/', type: 'linkedin' },
      { label: 'Currículo Lattes', href: 'http://lattes.cnpq.br/2124565480075229', type: 'lattes' },
    ],
    displayOrder: 2,
  },
]
