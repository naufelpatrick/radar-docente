import { FileText, Linkedin } from 'lucide-react'
import { team } from '../data/team'
import { Link } from 'react-router-dom'

interface TeamProfilesProps {
  compact?: boolean
  showPhotos?: boolean
}

export function TeamProfiles({ compact = false, showPhotos = false }: TeamProfilesProps) {
  return (
    <div className={`team-profiles${compact ? ' team-profiles--compact' : ''}`}>
      {team.map((member) => (
        <article className="team-profile" key={member.id} data-reveal="up">
          <div className={`team-profile__portrait${showPhotos ? ' team-profile__portrait--photo' : ''}`} role={showPhotos ? undefined : 'img'} aria-label={showPhotos ? undefined : `Identificação visual de ${member.name}`}>
            {showPhotos && member.photo
              ? <img src={member.photo.src} alt={member.photo.alt} width={member.photo.width} height={member.photo.height} loading="lazy" decoding="async" />
              : <><span>{member.initials}</span><i /><i /></>}
          </div>
          <div className="team-profile__content">
            <h3><Link to={`/autores/${member.id}`}>{member.name}</Link></h3>
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
