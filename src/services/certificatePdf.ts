import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import logoNegative from '../assets/logo-praxia-negative.svg'
import type { Certificate } from '../types/certificate'

const SITE_URL = 'https://radarpraxia.com'
const formatDate = (date: string) => new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(`${date.slice(0, 10)}T12:00:00Z`))

async function rasterizeLogo() {
  const source = await fetch(logoNegative).then((response) => response.text())
  const blob = new Blob([source], { type: 'image/svg+xml' }); const url = URL.createObjectURL(blob)
  try {
    const image = new Image(); image.src = url; await image.decode()
    const canvas = document.createElement('canvas'); canvas.width = 1000; canvas.height = 272
    canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png')
  } finally { URL.revokeObjectURL(url) }
}

export async function downloadCertificatePdf(certificate: Certificate) {
  const validationUrl = `${SITE_URL}/certificados/${certificate.codigo_validacao}`
  const qr = await QRCode.toDataURL(validationUrl, { width: 720, margin: 1, color: { dark: '#20232a', light: '#ffffff' }, errorCorrectionLevel: 'H' })
  const logo = await rasterizeLogo()
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const width = pdf.internal.pageSize.getWidth(); const height = pdf.internal.pageSize.getHeight()
  pdf.setFillColor(32, 35, 42); pdf.rect(0, 0, width, height, 'F')
  pdf.setFillColor(81, 66, 232); pdf.circle(width - 25, 24, 62, 'F')
  pdf.setDrawColor(196, 255, 88); pdf.setLineWidth(1.2); pdf.rect(10, 10, width - 20, height - 20)
  pdf.addImage(logo, 'PNG', 22, 20, 36, 9.8)
  pdf.setTextColor(255, 255, 255); pdf.setFontSize(31); pdf.text('CERTIFICADO', 22, 56)
  pdf.setTextColor(188, 193, 204); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(12); pdf.text('Certificamos que', 22, 75)
  pdf.setTextColor(255, 255, 255); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(25)
  pdf.text(certificate.nome_participante, 22, 93, { maxWidth: 205 })
  pdf.setTextColor(188, 193, 204); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(12)
  pdf.text(`participou do workshop “${certificate.workshop_titulo}”,`, 22, 112)
  pdf.text(`realizado em ${formatDate(certificate.data_realizacao)}, com carga horária total de ${certificate.carga_horaria} horas.`, 22, 121)
  const signatures = [
    { center: 66, name: 'Prof. Patrick A. Giusti Naufel' },
    { center: 161, name: 'Prof. Me. Giovani Letti' },
  ]
  signatures.forEach(({ center, name }) => {
    pdf.setDrawColor(188, 193, 204); pdf.setLineWidth(.25); pdf.line(center - 35, 158, center + 35, 158)
    pdf.setTextColor(255, 255, 255); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9.5); pdf.text(name, center, 164, { align: 'center' })
    pdf.setTextColor(188, 193, 204); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.5); pdf.text('Responsável pelo workshop', center, 169, { align: 'center' })
  })
  pdf.setFillColor(255, 255, 255); pdf.roundedRect(width - 63, height - 70, 43, 43, 2, 2, 'F'); pdf.addImage(qr, 'PNG', width - 60.5, height - 67.5, 38, 38)
  pdf.setTextColor(188, 193, 204); pdf.setFontSize(8); pdf.text('Valide pelo QR Code', width - 63, height - 21)
  pdf.setFont('courier', 'normal'); pdf.setFontSize(7.5); pdf.text(certificate.codigo_validacao, 22, height - 30)
  pdf.setFont('helvetica', 'normal'); pdf.text(`Emitido em ${new Date(certificate.data_emissao).toLocaleDateString('pt-BR')}`, 22, height - 21)
  pdf.save(`certificado-${certificate.nome_participante.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')}.pdf`)
}
