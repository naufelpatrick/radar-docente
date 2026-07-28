import type { ResultNarrative, ScoreResult } from '../types/result'

const colors = {
  graphite: [21, 27, 39] as const,
  indigo: [81, 66, 232] as const,
  lime: [200, 240, 62] as const,
  cyan: [35, 200, 208] as const,
  muted: [87, 98, 116] as const,
  line: [222, 225, 234] as const,
  pale: [247, 248, 252] as const,
  white: [255, 255, 255] as const,
}

type PdfDocument = InstanceType<(typeof import('jspdf'))['jsPDF']>

function addPageFooter(doc: PdfDocument, page: number) {
  doc.setDrawColor(...colors.line)
  doc.line(18, 282, 192, 282)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...colors.muted)
  doc.text('PráxIA - Radar de Fluência Digital e IA', 18, 288)
  doc.text(`Página ${page}`, 192, 288, { align: 'right' })
}

function addSectionTitle(doc: PdfDocument, eyebrow: string, title: string, y: number) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...colors.indigo)
  doc.text(eyebrow.toUpperCase(), 18, y)
  doc.setFontSize(21)
  doc.setTextColor(...colors.graphite)
  doc.text(title, 18, y + 10)
  return y + 19
}

function addWrappedText(doc: PdfDocument, text: string, x: number, y: number, width: number, size = 10, lineHeight = 5.2) {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(size)
  doc.setTextColor(...colors.muted)
  const lines = doc.splitTextToSize(text, width)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

function addPageOne(doc: PdfDocument, result: ScoreResult, narrative: ResultNarrative) {
  doc.setFillColor(...colors.graphite)
  doc.rect(0, 0, 210, 122, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(17)
  doc.setTextColor(...colors.white)
  doc.text('PráxIA', 18, 20)
  doc.setFontSize(8)
  doc.setTextColor(...colors.lime)
  doc.text('SEU RESULTADO - BETA 0.1', 18, 36)
  doc.setFontSize(31)
  doc.setTextColor(...colors.white)
  doc.text('Score PráxIA', 18, 55)
  doc.setFontSize(48)
  doc.setTextColor(...colors.lime)
  doc.text(String(result.displayedOverallScore), 18, 85)
  doc.setFontSize(14)
  doc.setTextColor(...colors.white)
  doc.text('/100', 47, 85)
  doc.setFillColor(...colors.indigo)
  doc.roundedRect(132, 45, 60, 44, 5, 5, 'F')
  doc.setFontSize(9)
  doc.setTextColor(...colors.lime)
  doc.text('FAIXA DE DESENVOLVIMENTO', 162, 60, { align: 'center' })
  doc.setFontSize(18)
  doc.setTextColor(...colors.white)
  doc.text(result.band.name, 162, 76, { align: 'center' })
  doc.setFontSize(8)
  doc.setTextColor(170, 176, 188)
  doc.text('Resultado orientativo e baseado em autorrelato.', 18, 105)

  let y = addSectionTitle(doc, 'Leitura personalizada', 'O que seu resultado revela', 139)
  y = addWrappedText(doc, narrative.summary, 18, y, 174, 10.5, 5.5) + 9

  doc.setFillColor(...colors.pale)
  doc.roundedRect(18, y, 174, 32, 4, 4, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...colors.indigo)
  doc.text('PERGUNTA PARA LEVAR COM VOCÊ', 25, y + 10)
  addWrappedText(doc, narrative.reflectionQuestion, 25, y + 19, 160, 10, 5)
  addPageFooter(doc, 1)
}

function addDimensionsPage(doc: PdfDocument, narrative: ResultNarrative) {
  doc.addPage()
  let y = addSectionTitle(doc, 'Leitura dimensional', 'As seis dimensões', 22)
  doc.setFontSize(9)
  doc.setTextColor(...colors.muted)
  doc.text('Os scores explicam a composição do resultado geral.', 18, y)
  y += 12

  for (const dimension of narrative.dimensionInterpretations) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...colors.graphite)
    doc.text(dimension.dimensionName, 18, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...colors.indigo)
    doc.text(`${dimension.bandName} - ${Math.round(dimension.score)}/100`, 192, y, { align: 'right' })
    doc.setFillColor(...colors.line)
    doc.roundedRect(18, y + 4, 174, 3, 1.5, 1.5, 'F')
    doc.setFillColor(...colors.indigo)
    doc.roundedRect(18, y + 4, 174 * (dimension.score / 100), 3, 1.5, 1.5, 'F')
    y = addWrappedText(doc, dimension.content.suggests, 18, y + 14, 174, 9.5, 4.8) + 7
  }

  if (narrative.balancedExplanation) {
    doc.setFillColor(238, 236, 255)
    doc.roundedRect(18, y, 174, 24, 4, 4, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...colors.indigo)
    doc.text('PERFIL EQUILIBRADO', 25, y + 9)
    addWrappedText(doc, narrative.balancedExplanation, 25, y + 16, 160, 8.5, 4.2)
  }
  addPageFooter(doc, 2)
}

function addPlanPage(doc: PdfDocument, result: ScoreResult, narrative: ResultNarrative) {
  const plan = narrative.developmentPlan
  doc.addPage()
  let y = addSectionTitle(doc, 'Próximo experimento', 'Seu plano de desenvolvimento', 22)
  doc.setFillColor(...colors.graphite)
  doc.roundedRect(18, y, 174, 37, 5, 5, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...colors.lime)
  doc.text('DIMENSÃO PRIORIZADA', 26, y + 11)
  doc.setFontSize(17)
  doc.setTextColor(...colors.white)
  doc.text(result.dimensionScores.find(({ dimensionId }) => dimensionId === plan.dimensionId)?.dimensionName ?? plan.dimensionId, 26, y + 26)
  y += 49

  const sections = [
    ['POR QUE FOI PRIORIZADA', plan.whyPrioritized],
    ['OBJETIVO DE DESENVOLVIMENTO', plan.objective],
    ['AÇÃO PARA A PRÓXIMA ATIVIDADE', plan.nextActivityAction],
    ['EVIDÊNCIA OBSERVÁVEL', plan.observableEvidence],
    ['TEMPO DE PREPARAÇÃO', plan.preparationTime],
  ] as const
  for (const [label, text] of sections) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...colors.indigo)
    doc.text(label, 18, y)
    y = addWrappedText(doc, text, 18, y + 8, 174, 10, 5) + 9
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...colors.indigo)
  doc.text('CRITÉRIOS PARA EXECUTAR', 18, y)
  y += 8
  for (const criterion of plan.criteria) {
    doc.setFillColor(...colors.cyan)
    doc.circle(21, y - 1.2, 1.3, 'F')
    y = addWrappedText(doc, criterion, 26, y, 164, 9.5, 4.8) + 3
  }

  doc.setFillColor(...colors.indigo)
  doc.roundedRect(18, y + 3, 174, 30, 4, 4, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...colors.lime)
  doc.text('DEPOIS DA EXPERIÊNCIA, PERGUNTE-SE', 25, y + 13)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...colors.white)
  doc.text(doc.splitTextToSize(plan.reflection, 160), 25, y + 22)
  addPageFooter(doc, 3)
}

export async function createResultPdf(result: ScoreResult, narrative: ResultNarrative) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  doc.setProperties({
    title: `Resultado PráxIA - ${result.displayedOverallScore}/100`,
    subject: 'Radar de Fluência Digital e IA',
    author: 'PráxIA',
    creator: 'PráxIA',
  })
  addPageOne(doc, result, narrative)
  addDimensionsPage(doc, narrative)
  addPlanPage(doc, result, narrative)
  return doc
}

export async function exportResultPdf(result: ScoreResult, narrative: ResultNarrative) {
  const doc = await createResultPdf(result, narrative)
  doc.save(`resultado-praxia-${result.displayedOverallScore}.pdf`)
}
