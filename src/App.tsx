import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { CookiePreferences } from './components/CookiePreferences'
import { WhatsAppFloat } from './components/WhatsAppFloat'

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
const TeacherAiCompetenciesArticlePage = lazy(() =>
  import('./pages/articles/TeacherAiCompetenciesArticlePage').then((module) => ({ default: module.TeacherAiCompetenciesArticlePage })),
)
const AssessingAiSupportedWorkArticlePage = lazy(() =>
  import('./pages/articles/AssessingAiSupportedWorkArticlePage').then((module) => ({ default: module.AssessingAiSupportedWorkArticlePage })),
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
const DigitalFluencyPage = lazy(() =>
  import('./pages/DigitalFluencyPage').then((module) => ({ default: module.DigitalFluencyPage })),
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
const DistributionAdminPage = lazy(() =>
  import('./pages/DistributionAdminPage').then((module) => ({ default: module.DistributionAdminPage })),
)
const LinksPage = lazy(() =>
  import('./pages/LinksPage').then((module) => ({ default: module.LinksPage })),
)
const ChoosingAiToolArticlePage = lazy(() =>
  import('./pages/articles/ChoosingAiToolArticlePage').then((module) => ({ default: module.ChoosingAiToolArticlePage })),
)
const PrivacyAndEducationalDataArticlePage = lazy(() =>
  import('./pages/articles/PrivacyAndEducationalDataArticlePage').then((module) => ({ default: module.PrivacyAndEducationalDataArticlePage })),
)
const CmsLoginPage = lazy(() => import('./pages/cms/CmsLoginPage').then((module) => ({ default: module.CmsLoginPage })))
const CmsDashboardPage = lazy(() => import('./pages/cms/CmsDashboardPage').then((module) => ({ default: module.CmsDashboardPage })))
const CmsArticleEditorPage = lazy(() => import('./pages/cms/CmsArticleEditorPage').then((module) => ({ default: module.CmsArticleEditorPage })))
const CmsSettingsPage = lazy(() => import('./pages/cms/CmsSettingsPage').then((module) => ({ default: module.CmsSettingsPage })))
const CmsPublicArticlePage = lazy(() => import('./pages/cms/CmsPublicArticlePage').then((module) => ({ default: module.CmsPublicArticlePage })))
const WorkshopWaitlistPage = lazy(() => import('./pages/WorkshopWaitlistPage').then((module) => ({ default: module.WorkshopWaitlistPage })))
const WorkshopRegistrationPage = lazy(() => import('./pages/WorkshopRegistrationPage').then((module) => ({ default: module.WorkshopRegistrationPage })))
const WorkshopConfirmationPage = lazy(() => import('./pages/WorkshopConfirmationPage').then((module) => ({ default: module.WorkshopConfirmationPage })))
const CertificatePage = lazy(() => import('./pages/CertificatePage').then((module) => ({ default: module.CertificatePage })))
const CertificatesAdminPage = lazy(() => import('./pages/cms/CertificatesAdminPage').then((module) => ({ default: module.CertificatesAdminPage })))
const PlanningAiActivityArticlePage = lazy(() =>
  import('./pages/articles/PlanningAiActivityArticlePage').then((module) => ({ default: module.PlanningAiActivityArticlePage })),
)
const WhatIsDigitalFluencyArticlePage = lazy(() =>
  import('./pages/articles/WhatIsDigitalFluencyArticlePage').then((module) => ({ default: module.WhatIsDigitalFluencyArticlePage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)
const AuthorPage = lazy(() =>
  import('./pages/AuthorPage').then((module) => ({ default: module.AuthorPage })),
)

function PrerenderReady() {
  useEffect(() => {
    let frame = 0
    let cancelled = false

    const signalWhenReady = () => {
      if (cancelled) return
      const routeIsLoading = document.querySelector('.route-loading')
      const pageContent = document.querySelector('main h1, article h1')

      if (!routeIsLoading && pageContent) {
        frame = window.requestAnimationFrame(() => {
          document.dispatchEvent(new Event('render-event'))
        })
        return
      }

      frame = window.requestAnimationFrame(signalWhenReady)
    }

    frame = window.requestAnimationFrame(signalWhenReady)
    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <CookiePreferences />
      <WhatsAppFloat />
      <Suspense fallback={<div className="route-loading" role="status">Carregando conteúdo…</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/autores/patrick-naufel" element={<AuthorPage memberId="patrick-naufel" />} />
          <Route path="/autores/giovani-letti" element={<AuthorPage memberId="giovani-letti" />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="/resultado" element={<DemoResultPage />} />
          <Route path="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta" element={<AiBeforeToolArticlePage />} />
          <Route path="/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem" element={<TechnologyToLearningArticlePage />} />
          <Route path="/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia" element={<AuthorshipWithAiArticlePage />} />
          <Route path="/blog/competencias-docentes/o-que-sao-competencias-docentes-para-uso-de-ia" element={<TeacherAiCompetenciesArticlePage />} />
          <Route path="/blog/avaliacao/como-avaliar-atividades-produzidas-com-apoio-de-ia" element={<AssessingAiSupportedWorkArticlePage />} />
          <Route path="/blog/ferramentas/como-escolher-uma-ferramenta-de-ia-para-uma-atividade-pedagogica" element={<ChoosingAiToolArticlePage />} />
          <Route path="/blog/etica/privacidade-e-dados-no-uso-educacional-de-ferramentas-generativas" element={<PrivacyAndEducationalDataArticlePage />} />
          <Route path="/blog/planejamento/como-planejar-uma-atividade-pedagogica-com-inteligencia-artificial" element={<PlanningAiActivityArticlePage />} />
          <Route path="/blog/fluencia-digital/o-que-e-fluencia-digital-para-professores" element={<WhatIsDigitalFluencyArticlePage />} />
          <Route path="/blog/categoria/:slug" element={<BlogCategoryPage />} />
          <Route path="/guias" element={<GuidesPage />} />
          <Route path="/competencias" element={<CompetenciesPage />} />
          <Route path="/ferramentas" element={<ToolsPage />} />
          <Route path="/blog/artigo" element={<Navigate to="/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta" replace />} />
          <Route path="/metodologia" element={<MethodologyPage />} />
          <Route path="/fluencia-digital-para-professores" element={<DigitalFluencyPage />} />
          <Route path="/radar-docente" element={<RadarDocentePage />} />
          <Route path="/ebook" element={<TeacherProductPage productId="ebook" />} />
          <Route path="/ebook/obrigado" element={<EbookOrderPage />} />
          <Route path="/admin/distribuicao" element={<DistributionAdminPage />} />
          <Route path="/admin/login" element={<CmsLoginPage />} />
          <Route path="/admin" element={<CmsDashboardPage />} />
          <Route path="/admin/artigos" element={<CmsDashboardPage />} />
          <Route path="/admin/artigos/novo" element={<CmsArticleEditorPage />} />
          <Route path="/admin/artigos/:id" element={<CmsArticleEditorPage />} />
          <Route path="/admin/artigos/:id/preview" element={<CmsPublicArticlePage preview />} />
          <Route path="/admin/configuracoes" element={<CmsSettingsPage />} />
          <Route path="/admin/certificados" element={<CertificatesAdminPage />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="/lp/workshop-ia-2026" element={<WorkshopWaitlistPage />} />
          <Route path="/lp/workshop-ia-2026/inscrito" element={<WorkshopWaitlistPage registered />} />
          <Route path="/lp/workshop-ia-2026/inscricoes" element={<WorkshopRegistrationPage />} />
          <Route path="/lp/workshop-ia-2026/inscricoes/confirmacao" element={<WorkshopConfirmationPage />} />
          <Route path="/mentoria" element={<TeacherProductPage productId="mentoring" />} />
          <Route path="/para-instituicoes" element={<InstitutionsPage />} />
          <Route path="/radar/*" element={<RadarFlow />} />
          <Route path="/certificados" element={<CertificatePage />} />
          <Route path="/certificados/:codigo" element={<CertificatePage />} />
          <Route path="/blog/:category/:slug" element={<CmsPublicArticlePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <PrerenderReady />
      </Suspense>
    </>
  )
}
