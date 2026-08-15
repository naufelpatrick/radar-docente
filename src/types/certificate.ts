export type CertificateStatus = 'emitido' | 'revogado'

export type Certificate = {
  id?: string
  nome_participante: string
  codigo_validacao: string
  workshop_slug?: string
  workshop_titulo: string
  carga_horaria: number
  data_realizacao: string
  data_emissao: string
  status: CertificateStatus
  created_at?: string
}
