import type { DimensionId } from '../types/instrument'
import type { DimensionScore, ResultNarrative, ScoreResult, TeachingImplication } from '../types/result'

const colors = {
  graphite: [21, 27, 39] as const,
  indigo: [81, 66, 232] as const,
  lime: [200, 240, 62] as const,
  cyan: [35, 200, 208] as const,
  coral: [255, 112, 92] as const,
  muted: [87, 98, 116] as const,
  line: [222, 225, 234] as const,
  pale: [247, 248, 252] as const,
  lavender: [238, 236, 255] as const,
  white: [255, 255, 255] as const,
}

type PdfDocument = InstanceType<(typeof import('jspdf'))['jsPDF']>

const dimensionName = (result: ScoreResult, id: DimensionId) =>
  result.dimensionScores.find(({ dimensionId }) => dimensionId === id)?.dimensionName ?? id

function addA4Page(doc: PdfDocument) {
  doc.addPage('a4', 'portrait')
  doc.setPage(doc.getNumberOfPages())
  doc.setFillColor(...colors.white)
  doc.rect(0, 0, 210, 297, 'F')
}

function addPageFooter(doc: PdfDocument) {
  const page = doc.getNumberOfPages()
  doc.setDrawColor(...colors.line)
  doc.line(18, 282, 192, 282)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...colors.muted)
  doc.text('PraxIA - Radar de Fluência Digital e IA', 18, 288)
  doc.text(`Página ${page}`, 192, 288, { align: 'right' })
}

function addPageHeader(doc: PdfDocument, eyebrow: string, title: string, lead?: string) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...colors.indigo)
  doc.text(eyebrow.toUpperCase(), 18, 22)
  doc.setFontSize(22)
  doc.setTextColor(...colors.graphite)
  doc.text(title, 18, 34)
  if (lead) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...colors.muted)
    doc.text(lead, 18, 44)
    return 55
  }
  return 47
}

function addWrappedText(doc: PdfDocument, text: string, x: number, y: number, width: number, size = 10, lineHeight = 5.2) {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(size)
  doc.setTextColor(...colors.muted)
  const lines = doc.splitTextToSize(text, width)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

function addLabel(
  doc: PdfDocument,
  label: string,
  x: number,
  y: number,
  color: readonly [number, number, number] = colors.indigo,
) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...color)
  doc.text(label.toUpperCase(), x, y)
}

function addCoverPage(doc: PdfDocument, result: ScoreResult, narrative: ResultNarrative) {
  doc.setFillColor(...colors.graphite)
  doc.rect(0, 0, 210, 122, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(17)
  doc.setTextColor(...colors.white)
  doc.text('PraxIA', 18, 20)
  doc.setFontSize(8)
  doc.setTextColor(...colors.lime)
  doc.text('SEU RESULTADO - BETA 0.1', 18, 36)
  doc.setFontSize(31)
  doc.setTextColor(...colors.white)
  doc.text('Score PraxIA', 18, 55)
  doc.setFontSize(48)
  doc.setTextColor(...colors.lime)
  doc.text(String(result.displayedOverallScore), 18, 85)
  doc.setFontSize(14)
  doc.setTextColor(...colors.white)
  doc.text('/100', 47, 85)
  doc.setFillColor(...colors.indigo)
  doc.roundedRect(132, 45, 60, 44, 5, 5, 'F')
  addLabel(doc, 'Faixa de desenvolvimento', 162, 60, colors.lime)
  doc.setFontSize(18)
  doc.setTextColor(...colors.white)
  doc.text(result.band.name, 162, 76, { align: 'center' })
  doc.setFontSize(8)
  doc.setTextColor(170, 176, 188)
  doc.text('Resultado orientativo e baseado em autorrelato.', 18, 105)

  addLabel(doc, 'Leitura personalizada', 18, 139)
  doc.setFontSize(21)
  doc.setTextColor(...colors.graphite)
  doc.text('O que seu resultado revela', 18, 149)
  const y = addWrappedText(doc, narrative.summary, 18, 162, 174, 10.5, 5.5) + 8
  doc.setFillColor(...colors.pale)
  doc.roundedRect(18, y, 174, 32, 4, 4, 'F')
  addLabel(doc, 'Pergunta para levar com você', 25, y + 10)
  addWrappedText(doc, narrative.reflectionQuestion, 25, y + 19, 160, 10, 5)
  addPageFooter(doc)
}

function drawRadar(doc: PdfDocument, scores: DimensionScore[], centerX: number, centerY: number, radius: number) {
  const angle = (index: number) => -Math.PI / 2 + index * (Math.PI * 2 / 6)
  const point = (index: number, scale: number) => ({
    x: centerX + Math.cos(angle(index)) * radius * scale,
    y: centerY + Math.sin(angle(index)) * radius * scale,
  })
  for (const scale of [0.25, 0.5, 0.75, 1]) {
    doc.setDrawColor(...colors.line)
    doc.setLineWidth(0.35)
    for (let index = 0; index < 6; index += 1) {
      const current = point(index, scale)
      const next = point((index + 1) % 6, scale)
      doc.line(current.x, current.y, next.x, next.y)
    }
  }
  for (let index = 0; index < 6; index += 1) {
    const outer = point(index, 1)
    doc.line(centerX, centerY, outer.x, outer.y)
  }
  const dataPoints = scores.map(({ score }, index) => point(index, score / 100))
  doc.setFillColor(81, 66, 232)
  doc.setDrawColor(...colors.indigo)
  doc.setLineWidth(1)
  for (let index = 0; index < dataPoints.length; index += 1) {
    const current = dataPoints[index]
    const next = dataPoints[(index + 1) % dataPoints.length]
    doc.line(current.x, current.y, next.x, next.y)
    doc.circle(current.x, current.y, 1.2, 'F')
  }
}

function addOverviewPage(doc: PdfDocument, result: ScoreResult, narrative: ResultNarrative) {
  addA4Page(doc)
  addPageHeader(doc, 'Leitura dimensional', 'O que compõe seu score', 'O radar mostra como as seis dimensões se relacionam.')
  drawRadar(doc, result.dimensionScores, 72, 111, 45)
  let y = 66
  for (const dimension of narrative.dimensionInterpretations) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...colors.graphite)
    doc.text(dimension.dimensionName, 127, y)
    doc.setFontSize(8)
    doc.setTextColor(...colors.indigo)
    doc.text(`${Math.round(dimension.score)}/100`, 192, y, { align: 'right' })
    doc.setFillColor(...colors.line)
    doc.roundedRect(127, y + 3, 65, 2.5, 1.2, 1.2, 'F')
    doc.setFillColor(...colors.indigo)
    doc.roundedRect(127, y + 3, 65 * (dimension.score / 100), 2.5, 1.2, 1.2, 'F')
    y += 17
  }
  y = 177
  if (narrative.balancedExplanation) {
    doc.setFillColor(...colors.lavender)
    doc.roundedRect(18, y, 174, 27, 4, 4, 'F')
    addLabel(doc, 'Perfil equilibrado', 25, y + 10)
    addWrappedText(doc, narrative.balancedExplanation, 25, y + 18, 160, 8.5, 4.2)
    y += 38
  }
  addLabel(doc, 'Como ler estes scores', 18, y)
  addWrappedText(
    doc,
    'Cada dimensão utiliza a mesma escala de 0 a 100. A leitura dimensional explica a composição do score geral e deve ser interpretada junto ao contexto, sem transformar diferenças em julgamento.',
    18,
    y + 9,
    174,
    9.5,
    4.8,
  )
  addPageFooter(doc)
}

function addImplicationCard(doc: PdfDocument, implication: TeachingImplication, index: number, x: number, y: number) {
  doc.setFillColor(...colors.pale)
  doc.roundedRect(x, y, 84, 83, 4, 4, 'F')
  addLabel(doc, String(index).padStart(2, '0'), x + 7, y + 10, colors.cyan)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...colors.graphite)
  doc.text(implication.title, x + 7, y + 23)
  const cursor = addWrappedText(doc, implication.manifestation, x + 7, y + 34, 70, 9, 4.5) + 6
  doc.setDrawColor(...colors.line)
  doc.line(x + 7, cursor, x + 77, cursor)
  addLabel(doc, 'Impacto possível', x + 7, cursor + 9)
  addWrappedText(doc, implication.impact, x + 7, cursor + 17, 70, 8.7, 4.3)
}

function addImplicationsPage(doc: PdfDocument, narrative: ResultNarrative) {
  addA4Page(doc)
  addPageHeader(
    doc,
    'Na prática',
    'Como isso pode aparecer na sua docência',
    'Possibilidades de leitura - não afirmações sobre você ou seus estudantes.',
  )
  narrative.implications.forEach((implication, index) => {
    const column = index % 2
    const row = Math.floor(index / 2)
    addImplicationCard(doc, implication, index + 1, 18 + column * 90, 59 + row * 93)
  })
  addPageFooter(doc)
}

function addDimensionBlock(
  doc: PdfDocument,
  dimension: ResultNarrative['dimensionInterpretations'][number],
  y: number,
) {
  doc.setFillColor(...colors.graphite)
  doc.roundedRect(18, y, 174, 27, 4, 4, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(...colors.white)
  doc.text(dimension.dimensionName, 25, y + 12)
  doc.setFontSize(8)
  doc.setTextColor(...colors.lime)
  doc.text(`${dimension.bandName} - ${Math.round(dimension.score)}/100`, 185, y + 12, { align: 'right' })
  addLabel(doc, 'O que a dimensão avalia', 25, y + 21, colors.cyan)
  y += 37
  y = addWrappedText(doc, dimension.content.evaluates, 18, y, 174, 9.5, 4.7) + 8

  const columns = [
    ['O que o resultado sugere', dimension.content.suggests],
    ['Como pode aparecer', dimension.content.inPractice],
    ['Impacto possível', dimension.content.impact],
  ] as const
  columns.forEach(([label, text], index) => {
    const x = 18 + index * 59
    addLabel(doc, label, x, y)
    addWrappedText(doc, text, x, y + 8, 54, 8.4, 4.2)
  })
  y += 51
  doc.setFillColor(...colors.lavender)
  doc.roundedRect(18, y, 84, 34, 3, 3, 'F')
  addLabel(doc, 'Uma prática para manter', 24, y + 10)
  addWrappedText(doc, dimension.content.practiceToMaintain, 24, y + 18, 72, 8.4, 4.2)
  doc.setFillColor(248, 255, 228)
  doc.roundedRect(108, y, 84, 34, 3, 3, 'F')
  addLabel(doc, 'Uma ação para avançar', 114, y + 10)
  addWrappedText(doc, dimension.content.actionToAdvance, 114, y + 18, 72, 8.4, 4.2)
}

function addDimensionPages(doc: PdfDocument, narrative: ResultNarrative) {
  for (let pageIndex = 0; pageIndex < 6; pageIndex += 1) {
    addA4Page(doc)
    addPageHeader(doc, 'Leitura aprofundada', 'Entenda cada dimensão', `Dimensão ${pageIndex + 1} de 6.`)
    addDimensionBlock(doc, narrative.dimensionInterpretations[pageIndex], 58)
    addPageFooter(doc)
  }
}

function addInsightPanel(doc: PdfDocument, label: string, title: string, text: string, y: number, accent: readonly [number, number, number]) {
  doc.setFillColor(...colors.pale)
  doc.roundedRect(18, y, 174, 48, 4, 4, 'F')
  doc.setFillColor(...accent)
  doc.rect(18, y, 3, 48, 'F')
  addLabel(doc, label, 28, y + 11, accent)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...colors.graphite)
  doc.text(title, 28, y + 23)
  addWrappedText(doc, text, 28, y + 33, 154, 8.8, 4.3)
}

function addInsightsPage(doc: PdfDocument, result: ScoreResult, narrative: ResultNarrative) {
  addA4Page(doc)
  addPageHeader(doc, 'Leitura do perfil', 'Forças, desenvolvimento e cuidados')
  let y = 52
  if (result.similarPerformance) {
    addInsightPanel(
      doc,
      'Perfil equilibrado',
      'Sem contraste suficiente',
      narrative.balancedExplanation ?? 'As dimensões aparecem próximas entre si.',
      y,
      colors.cyan,
    )
    y += 58
  } else {
    addInsightPanel(
      doc,
      'Forças',
      result.strengths.map((id) => dimensionName(result, id)).join(' e '),
      'Estas dimensões representam práticas relativamente mais consolidadas no conjunto do resultado.',
      y,
      colors.cyan,
    )
    y += 58
    addInsightPanel(
      doc,
      'Zonas de desenvolvimento',
      result.developmentZones.map((id) => dimensionName(result, id)).join(' e '),
      'Estas dimensões oferecem oportunidades concretas para aproximar intenção, critérios e consistência.',
      y,
      colors.lime,
    )
    y += 58
  }
  const profileTitle = result.balanceProfile === 'heterogeneous'
    ? 'Competências em estágios diferentes'
    : 'Desenvolvimento equilibrado'
  const profileText = result.balanceProfile === 'heterogeneous'
    ? 'Há indícios de práticas mais desenvolvidas coexistindo com dimensões que ainda precisam de atenção.'
    : 'O próximo passo é aumentar a consistência das práticas e transformá-las em repertório consciente.'
  addInsightPanel(doc, 'Leitura do perfil', profileTitle, profileText, y, colors.indigo)
  y += 58

  if (result.attentionSignals.length > 0) {
    doc.setFillColor(255, 241, 238)
    const height = 24 + result.attentionSignals.length * 17
    doc.roundedRect(18, y, 174, height, 4, 4, 'F')
    addLabel(doc, 'Sinais de atenção', 27, y + 11, colors.coral)
    let signalY = y + 21
    result.attentionSignals.forEach((signal) => {
      signalY = addWrappedText(doc, signal, 27, signalY, 154, 8.8, 4.3) + 5
    })
  } else {
    addLabel(doc, 'Sinais de atenção', 18, y + 8, colors.coral)
    addWrappedText(doc, 'Nenhuma dimensão ficou abaixo de 40 neste resultado.', 18, y + 17, 174, 9.5, 4.8)
  }
  addPageFooter(doc)
}

function addPlanPage(doc: PdfDocument, result: ScoreResult, narrative: ResultNarrative) {
  const plan = narrative.developmentPlan
  addA4Page(doc)
  let y = addPageHeader(doc, 'Próximo experimento', 'Seu plano de desenvolvimento')
  doc.setFillColor(...colors.graphite)
  doc.roundedRect(18, y, 174, 37, 5, 5, 'F')
  addLabel(doc, 'Dimensão priorizada', 26, y + 11, colors.lime)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(17)
  doc.setTextColor(...colors.white)
  doc.text(dimensionName(result, plan.dimensionId), 26, y + 26)
  y += 49

  const sections = [
    ['Por que foi priorizada', plan.whyPrioritized],
    ['Objetivo de desenvolvimento', plan.objective],
    ['Ação para a próxima atividade', plan.nextActivityAction],
    ['Evidência observável', plan.observableEvidence],
    ['Tempo de preparação', plan.preparationTime],
  ] as const
  for (const [label, text] of sections) {
    addLabel(doc, label, 18, y)
    y = addWrappedText(doc, text, 18, y + 8, 174, 10, 5) + 9
  }
  addLabel(doc, 'Critérios para executar', 18, y)
  y += 8
  for (const criterion of plan.criteria) {
    doc.setFillColor(...colors.cyan)
    doc.circle(21, y - 1.2, 1.3, 'F')
    y = addWrappedText(doc, criterion, 26, y, 164, 9.5, 4.8) + 3
  }
  doc.setFillColor(...colors.indigo)
  doc.roundedRect(18, y + 3, 174, 30, 4, 4, 'F')
  addLabel(doc, 'Depois da experiência, pergunte-se', 25, y + 13, colors.lime)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...colors.white)
  doc.text(doc.splitTextToSize(plan.reflection, 160), 25, y + 22)
  addPageFooter(doc)
}

function addClosingPage(doc: PdfDocument, result: ScoreResult, narrative: ResultNarrative) {
  addA4Page(doc)
  let y = addPageHeader(doc, 'Para continuar', 'Recursos e referência metodológica')
  doc.setFillColor(...colors.lavender)
  doc.roundedRect(18, y, 84, 58, 4, 4, 'F')
  addLabel(doc, 'Próximo caminho', 26, y + 12)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(...colors.graphite)
  doc.text('IA na Prática Docente', 26, y + 27)
  addWrappedText(doc, 'Um guia para transformar próximos passos em atividades, critérios e decisões aplicáveis.', 26, y + 38, 67, 8.8, 4.3)
  doc.setFillColor(...colors.pale)
  doc.roundedRect(108, y, 84, 58, 4, 4, 'F')
  addLabel(doc, 'Próximo caminho', 116, y + 12)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(...colors.graphite)
  doc.text('Mentoria PraxIA', 116, y + 27)
  addWrappedText(doc, 'Acompanhamento individual para interpretar o resultado e construir um plano contextualizado.', 116, y + 38, 67, 8.8, 4.3)
  y += 78

  addLabel(doc, 'Síntese do próximo passo', 18, y)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...colors.graphite)
  doc.text(dimensionName(result, result.recommendationDimension), 18, y + 12)
  y = addWrappedText(doc, result.recommendation, 18, y + 23, 174, 10, 5) + 13

  addLabel(doc, 'Pergunta para levar com você', 18, y)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(14)
  doc.setTextColor(...colors.indigo)
  doc.text(doc.splitTextToSize(`"${narrative.reflectionQuestion}"`, 174), 18, y + 13)
  y += 45

  doc.setDrawColor(...colors.line)
  doc.line(18, y, 192, y)
  y += 14
  addLabel(doc, 'Aviso metodológico', 18, y)
  addWrappedText(
    doc,
    'Este instrumento de autorreflexão é fundamentado em referenciais internacionais e está em processo de validação. O resultado é orientativo, baseado em autorrelato e não constitui prova, ranking, diagnóstico, certificação ou avaliação institucional.',
    18,
    y + 10,
    174,
    9.5,
    4.8,
  )
  addPageFooter(doc)
}

export async function createResultPdf(result: ScoreResult, narrative: ResultNarrative) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  doc.setProperties({
    title: `Relatório completo PraxIA - ${result.displayedOverallScore}/100`,
    subject: 'Radar de Fluência Digital e IA',
    author: 'PraxIA',
    creator: 'PraxIA',
  })
  addCoverPage(doc, result, narrative)
  addOverviewPage(doc, result, narrative)
  addImplicationsPage(doc, narrative)
  addDimensionPages(doc, narrative)
  addInsightsPage(doc, result, narrative)
  addPlanPage(doc, result, narrative)
  addClosingPage(doc, result, narrative)
  return doc
}

export async function exportResultPdf(result: ScoreResult, narrative: ResultNarrative) {
  const doc = await createResultPdf(result, narrative)
  doc.save(`relatorio-completo-praxia-${result.displayedOverallScore}.pdf`)
}
