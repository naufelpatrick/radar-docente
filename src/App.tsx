import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'

const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((module) => ({ default: module.LandingPage })),
)
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })),
)
const BlogPage = lazy(() =>
  import('./pages/BlogPage').then((module) => ({ default: module.BlogPage })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })),
)
const DemoResultPage = lazy(() =>
  import('./pages/DemoResultPage').then((module) => ({ default: module.DemoResultPage })),
)
const AiBeforeToolArticlePage = lazy(() =>
  import('./pages/articles/AiBeforeToolArticlePage').then((module) => ({ default: module.AiBeforeToolArticlePage })),
)
const BlogCategoryPage = lazy(() =>
  import('./pages/BlogCategoryPage').then((module) => ({ default: module.BlogCategoryPage })),
)
const GuidesPage = lazy(() =>
  import('./pages/GuidesPage').then((module) => ({ default: module.GuidesPage })),
)
const CompetenciesPage = lazy(() =>
  import('./pages/CompetenciesPage').then((module) => ({ default: module.CompetenciesPage })),
)
const ToolsPage = lazy(() =>
  import('./pages/ToolsPage').then((module) => ({ default: module.ToolsPage })),
)
const MethodologyPage = lazy(() =>
  import('./pages/MethodologyPage').then((module) => ({ default: module.MethodologyPage })),
)
const RadarDocentePage = lazy(() =>
  import('./pages/RadarDocentePage').then((module) => ({ default: module.RadarDocentePage })),
)
const RadarFlow = lazy(() =>
  import('./pages/radar/RadarFlow').then((module) => ({ default: module.RadarFlow })),
)

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="route-loading" role="status">Carregando conteúdo…</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/resultado" element={<DemoResultPage />} />
          <Route path="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta" element={<AiBeforeToolArticlePage />} />
          <Route path="/blog/categoria/:slug" element={<BlogCategoryPage />} />
          <Route path="/guias" element={<GuidesPage />} />
          <Route path="/competencias" element={<CompetenciesPage />} />
          <Route path="/ferramentas" element={<ToolsPage />} />
          <Route path="/blog/artigo" element={<Navigate to="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta" replace />} />
          <Route path="/metodologia" element={<MethodologyPage />} />
          <Route path="/radar-docente" element={<RadarDocentePage />} />
          <Route path="/radar/*" element={<RadarFlow />} />
        </Routes>
      </Suspense>
    </>
  )
}
