import { describe, expect, it } from 'vitest'
import { createIcs, googleCalendarUrl, validCpf } from './workshop.js'

const edition = {
  id: '11111111-1111-1111-1111-111111111111',
  titulo: 'WORKSHOP | IA para Prática Docente',
  descricao: 'Formação prática.',
  inicio_em: '2026-08-29T11:30:00.000Z',
  fim_em: '2026-08-29T15:30:00.000Z',
  timezone: 'America/Sao_Paulo',
  meeting_url: 'https://meet.google.com/coh-eusf-exg',
  telefone_alternativo: '+55 11 4560-8092',
  meeting_pin: '852 055 146#',
}

describe('workshop registration helpers', () => {
  it('validates CPF check digits', () => {
    expect(validCpf('529.982.247-25')).toBe(true)
    expect(validCpf('529.982.247-24')).toBe(false)
    expect(validCpf('111.111.111-11')).toBe(false)
  })

  it('creates a prefilled Google Calendar URL', () => {
    const url = new URL(googleCalendarUrl(edition))
    expect(url.hostname).toBe('calendar.google.com')
    expect(url.searchParams.get('text')).toBe(edition.titulo)
    expect(url.searchParams.get('dates')).toBe('20260829T113000Z/20260829T153000Z')
    expect(url.searchParams.get('ctz')).toBe('America/Sao_Paulo')
    expect(url.searchParams.get('details')).toContain(edition.meeting_url)
  })

  it('creates a standards-compatible ICS with UTC event times', () => {
    const ics = createIcs(edition)
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('DTSTART:20260829T113000Z')
    expect(ics).toContain('DTEND:20260829T153000Z')
    expect(ics).toContain('https://meet.google.com/coh-eusf-exg')
    expect(ics).toContain('END:VCALENDAR')
  })
})

