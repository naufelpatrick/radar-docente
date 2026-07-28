import { FileText, Linkedin } from 'lucide-react'
import { team } from '../data/team'

interface TeamProfilesProps {
  compact?: boolean
}

export function TeamProfiles({ compact = false }: TeamProfilesProps) {
  return (
    <div className={`team-profiles${compact ? ' team-profiles--compact' : ''}`}>
      {team.map((member) => (
        <article className="team-profile" key={member.id} data-reveal="up">
          <div className="team-profile__portrait" role="img" aria-label={`Espaço reservado para retrato de ${member.name}`}>
            <span>{member.initials}</span><i /><i />
          </div>
          <div className="team-profile__content">
            <h3>{member.name}</h3>
            <p>{compact ? member.shortBio : member.fullBio}</p>
            {!compact && (
              <div className="team-profile__links">
                {member.links.map((link) => {
                  const Icon = link.type === 'linkedin' ? Linkedin : FileText
                  return (
                    <a
                      href={link.href}
                      key={link.type}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${link.label} de ${member.name}, abre em nova guia`}
                    >
                      <Icon aria-hidden="true" />{link.label}
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
