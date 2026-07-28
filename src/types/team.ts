export interface TeamLink {
  label: 'LinkedIn' | 'Currículo Lattes'
  href: string
  type: 'linkedin' | 'lattes'
}

export interface TeamMember {
  id: 'patrick-naufel' | 'giovani-letti'
  name: string
  role: string | null
  initials: string
  shortBio: string
  fullBio: string
  photo: string | null
  links: TeamLink[]
  displayOrder: number
}
