import { Download } from 'lucide-react'
import { useState } from 'react'
import { exportResultPdf } from '../services/pdfExportService'
import type { ResultNarrative, ScoreResult } from '../types/result'

export function PdfExportButton({ result, narrative }: { result: ScoreResult; narrative: ResultNarrative }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportResultPdf(result, narrative)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button type="button" className="pdf-export-button" onClick={handleExport} disabled={isExporting}>
      <Download aria-hidden="true" />
      {isExporting ? 'Gerando relatório…' : 'Exportar PDF'}
    </button>
  )
}
