import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { Route, Routes, StaticRouter } from 'react-router'
import type { ReactElement } from 'react'
import { AboutPage } from '../src/pages/AboutPage'
import { AuthorPage } from '../src/pages/AuthorPage'
import { BlogCategoryPage } from '../src/pages/BlogCategoryPage'
import { BlogPage } from '../src/pages/BlogPage'
import { CompetenciesPage } from '../src/pages/CompetenciesPage'
import { ContactPage } from '../src/pages/ContactPage'
import { DemoResultPage } from '../src/pages/DemoResultPage'
import { DigitalFluencyPage } from '../src/pages/DigitalFluencyPage'
import { GuidesPage } from '../src/pages/GuidesPage'
import { InstitutionsPage } from '../src/pages/InstitutionsPage'
import { LandingPage } from '../src/pages/LandingPage'
import { MethodologyPage } from '../src/pages/MethodologyPage'
import { PrivacyPage } from '../src/pages/PrivacyPage'
import { RadarDocentePage } from '../src/pages/RadarDocentePage'
import { TeacherProductPage } from '../src/pages/TeacherProductPage'
import { ToolsPage } from '../src/pages/ToolsPage'
import { AiBeforeToolArticlePage } from '../src/pages/articles/AiBeforeToolArticlePage'
import { AssessingAiSupportedWorkArticlePage } from '../src/pages/articles/AssessingAiSupportedWorkArticlePage'
import { CreatingAiAssessmentCriteriaArticlePage } from '../src/pages/articles/CreatingAiAssessmentCriteriaArticlePage'
import { AuthorshipWithAiArticlePage } from '../src/pages/articles/AuthorshipWithAiArticlePage'
import { ChoosingAiToolArticlePage } from '../src/pages/articles/ChoosingAiToolArticlePage'
import { PlanningAiActivityArticlePage } from '../src/pages/articles/PlanningAiActivityArticlePage'
import { PrivacyAndEducationalDataArticlePage } from '../src/pages/articles/PrivacyAndEducationalDataArticlePage'
import { TeacherAiCompetenciesArticlePage } from '../src/pages/articles/TeacherAiCompetenciesArticlePage'
import { TechnologyToLearningArticlePage } from '../src/pages/articles/TechnologyToLearningArticlePage'
import { WhatIsDigitalFluencyArticlePage } from '../src/pages/articles/WhatIsDigitalFluencyArticlePage'
import { RadarFlow } from '../src/pages/radar/RadarFlow'
import { getPublishedBlogArticles } from '../src/data/blogArticles'

const distDirectory = path.resolve('dist')

const pages = new Map<string, ReactElement>([
  ['/', <LandingPage />],
  ['/sobre', <AboutPage />],
  ['/autores/patrick-naufel', <AuthorPage memberId="patrick-naufel" />],
  ['/autores/giovani-letti', <AuthorPage memberId="giovani-letti" />],
  ['/blog', <BlogPage />],
  ['/contato', <ContactPage />],
  ['/privacidade', <PrivacyPage />],
  ['/resultado', <DemoResultPage />],
  ['/guias', <GuidesPage />],
  ['/competencias', <CompetenciesPage />],
  ['/ferramentas', <ToolsPage />],
  ['/metodologia', <MethodologyPage />],
  ['/fluencia-digital-para-professores', <DigitalFluencyPage />],
  ['/radar-docente', <RadarDocentePage />],
  ['/ebook', <TeacherProductPage productId="ebook" />],
  ['/mentoria', <TeacherProductPage productId="mentoring" />],
  ['/para-instituicoes', <InstitutionsPage />],
  ['/radar', <Routes><Route path="/radar/*" element={<RadarFlow />} /></Routes>],
  ['/blog/ia-para-professores/usar-ia-com-estudantes-comeca-antes-da-ferramenta', <AiBeforeToolArticlePage />],
  ['/blog/planejamento/da-possibilidade-tecnologica-ao-objetivo-de-aprendizagem', <TechnologyToLearningArticlePage />],
  ['/blog/planejamento/como-planejar-uma-atividade-pedagogica-com-inteligencia-artificial', <PlanningAiActivityArticlePage />],
  ['/blog/etica/como-conversar-sobre-autoria-em-atividades-com-ia', <AuthorshipWithAiArticlePage />],
  ['/blog/competencias-docentes/o-que-sao-competencias-docentes-para-uso-de-ia', <TeacherAiCompetenciesArticlePage />],
  ['/blog/avaliacao/como-avaliar-atividades-produzidas-com-apoio-de-ia', <AssessingAiSupportedWorkArticlePage />],
  ['/blog/avaliacao/como-criar-criterios-de-avaliacao-para-atividades-com-ia', <CreatingAiAssessmentCriteriaArticlePage />],
  ['/blog/ferramentas/como-escolher-uma-ferramenta-de-ia-para-uma-atividade-pedagogica', <ChoosingAiToolArticlePage />],
  ['/blog/etica/privacidade-e-dados-no-uso-educacional-de-ferramentas-generativas', <PrivacyAndEducationalDataArticlePage />],
  ['/blog/fluencia-digital/o-que-e-fluencia-digital-para-professores', <WhatIsDigitalFluencyArticlePage />],
])

for (const categorySlug of new Set(getPublishedBlogArticles().map((article) => article.categorySlug))) {
  const pathname = `/blog/categoria/${categorySlug}`
  pages.set(pathname, <Routes><Route path="/blog/categoria/:slug" element={<BlogCategoryPage />} /></Routes>)
}

function outputPath(pathname: string) {
  return pathname === '/' ? path.join(distDirectory, 'index.html') : path.join(distDirectory, `${pathname}.html`)
}

function renderPage(pathname: string, page: ReactElement) {
  return renderToStaticMarkup(<StaticRouter location={pathname}>{page}</StaticRouter>)
}

for (const [pathname, page] of pages) {
  const file = outputPath(pathname)
  const html = await readFile(file, 'utf8')
  const content = renderPage(pathname, page)
  const nextHtml = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${content}</div>`)
  if (nextHtml === html) throw new Error(`Root pré-renderizado não encontrado: ${pathname}`)
  await writeFile(file, nextHtml)
}

console.log(`Conteúdo React pré-renderizado para ${pages.size} páginas.`)
