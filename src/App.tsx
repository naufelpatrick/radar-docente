import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { CookiePreferences } from './components/CookiePreferences'

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
const TechnologyToLearningArticlePage = lazy(() =>
  import('./pages/articles/TechnologyToLearningArticlePage').then((module) => ({ default: module.TechnologyToLearningArticlePage })),
)
const AuthorshipWithAiArticlePage = lazy(() =>
  import('./pages/articles/AuthorshipWithAiArticlePage').then((module) => ({ default: module.AuthorshipWithAiArticlePage })),
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
const InstitutionsPage = lazy(() =>
  import('./pages/InstitutionsPage').then((module) => ({ default: module.InstitutionsPage })),
)
const TeacherProductPage = lazy(() =>
  import('./pages/TeacherProductPage').then((module) => ({ default: module.TeacherProductPage })),
)
const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((module) => ({ default: module.PrivacyPage })),
)
const EbookOrderPage = lazy(() =>
  import('./pages/EbookOrderPage').then((module) => ({ default: module.EbookOrderPage })),
)

export default function App() {
  return (
    <>
      <ScrollToTop />
      <CookiePreferences />
      <Suspense fallback={<div className="route-loading" role="status">Carregando conteúdo…</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="/resultado" element={<DemoResultPage />} />
          <Route path="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta" element={<AiBeforeToolArticlePage />} />
          <Route path="/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem" element={<TechnologyToLearningArticlePage />} />
          <Route path="/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia" element={<AuthorshipWithAiArticlePage />} />
          <Route path="/blog/categoria/:slug" element={<BlogCategoryPage />} />
          <Route path="/guias" element={<GuidesPage />} />
          <Route path="/competencias" element={<CompetenciesPage />} />
          <Route path="/ferramentas" element={<ToolsPage />} />
          <Route path="/blog/artigo" element={<Navigate to="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta" replace />} />
          <Route path="/metodologia" element={<MethodologyPage />} />
          <Route path="/radar-docente" element={<RadarDocentePage />} />
          <Route path="/ebook" element={<TeacherProductPage productId="ebook" />} />
          <Route path="/ebook/obrigado" element={<EbookOrderPage />} />
          <Route path="/mentoria" element={<TeacherProductPage productId="mentoring" />} />
          <Route path="/para-instituicoes" element={<InstitutionsPage />} />
          <Route path="/radar/*" element={<RadarFlow />} />
        </Routes>
      </Suspense>
    </>
  )
}
