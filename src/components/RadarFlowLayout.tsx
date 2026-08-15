import { RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandMark } from './BrandMark'
import { useRadarSession } from '../context/radarSessionContextValue'

export function RadarFlowLayout({ children }: { children: ReactNode }) {
  const { reset } = useRadarSession()
  const navigate = useNavigate()

  const handleReset = () => {
    if (!window.confirm('Reiniciar o Radar? Suas respostas salvas neste navegador serão apagadas.')) return
    reset()
    navigate('/radar')
  }

  return (
    <div className="radar-flow">
      <header className="radar-flow__header">
        <Link to="/" aria-label="PraxIA, voltar à página inicial"><BrandMark /></Link>
        <button type="button" className="radar-flow__reset" onClick={handleReset}>
          <RotateCcw aria-hidden="true" /> Reiniciar
        </button>
      </header>
      {children}
    </div>
  )
}
