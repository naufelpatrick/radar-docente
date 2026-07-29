import { ChevronRight, Database, ExternalLink, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { InstitutionalHeader } from '../components/InstitutionalHeader'
import { Seo } from '../components/Seo'
import { privacyConfig, privacyPublicationStatus } from '../config/privacy'
import { openCookiePreferences } from '../services/cookieConsent'
import { useScrollMotion } from '../hooks/useScrollMotion'

const sections = [
  ['sobre', 'Sobre esta política'],
  ['responsavel', 'Responsável pelo tratamento'],
  ['dados', 'Dados tratados'],
  ['diagnostico', 'Diagnóstico PráxIA'],
  ['formularios', 'Formulários'],
  ['finalidades', 'Finalidades e bases legais'],
  ['fornecedores', 'Serviços envolvidos'],
  ['cookies', 'Cookies e Analytics'],
  ['retencao', 'Armazenamento e retenção'],
  ['seguranca', 'Segurança'],
  ['direitos', 'Seus direitos'],
  ['criancas', 'Crianças e adolescentes'],
  ['transferencia', 'Transferência internacional'],
  ['alteracoes', 'Alterações e contato'],
] as const

export function PrivacyPage() {
  useScrollMotion()

  return (
    <>
      <Seo
        title="Política de Privacidade | PráxIA"
        description="Entenda como a PráxIA trata dados pessoais, utiliza cookies e protege a privacidade de professores e representantes de instituições."
        path="/privacidade"
      />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <InstitutionalHeader />
      <main id="conteudo-principal" className="privacy-page">
        <header className="privacy-hero">
          <div className="shell">
            <nav className="breadcrumb" aria-label="Navegação estrutural"><Link to="/">Início</Link><ChevronRight aria-hidden="true" /><span aria-current="page">Privacidade</span></nav>
            <p className="method-kicker">PRIVACIDADE NA PRÁTICA</p>
            <h1>Política de Privacidade da PráxIA</h1>
            <p className="privacy-hero__lead">A PráxIA valoriza a privacidade de professores, representantes de instituições e demais pessoas que utilizam seus serviços. Esta política explica quais dados podem ser tratados, para quais finalidades e quais escolhas estão disponíveis.</p>
            <div className="privacy-dates"><span>VIGÊNCIA<br /><strong>{privacyConfig.effectiveDate}</strong></span><span>ÚLTIMA ATUALIZAÇÃO<br /><strong>{privacyConfig.lastUpdated}</strong></span></div>
          </div>
        </header>

        <section className="privacy-summary" aria-label="Síntese em linguagem simples">
          <div className="shell">
            <ShieldCheck aria-hidden="true" />
            <div><p className="method-kicker">EM POUCAS PALAVRAS</p><h2>As respostas ficam no navegador. O cadastro e o resumo do relatório vão para o Supabase. O Analytics é opcional.</h2></div>
            <p>As 30 respostas permanecem no armazenamento local deste navegador. Para liberar o relatório gratuito, a PráxIA registra nome, e-mail, contexto opcional e pontuações resumidas, sem enviar respostas individuais.</p>
          </div>
        </section>

        <div className="shell privacy-layout">
          <aside className="privacy-index" aria-label="Nesta política">
            <strong>NESTA POLÍTICA</strong>
            {sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </aside>

          <article className="privacy-content">
            <div className="privacy-review-notice">
              <strong>Versão informativa em revisão</strong>
              <p>Este texto descreve o funcionamento técnico verificado em {privacyConfig.lastUpdated}. Não representa garantia de conformidade jurídica integral. A identificação formal do controlador, os prazos de retenção e a revisão jurídica ainda precisam ser concluídos pelos responsáveis pelo projeto.</p>
            </div>

            <section id="sobre">
              <span>01</span><h2>Sobre esta política</h2>
              <p>Esta política abrange o site, o Radar Docente, a página de resultado e os formulários de contato, mentoria e proposta institucional da PráxIA. Ela não substitui os avisos específicos apresentados no momento de cada coleta.</p>
            </section>

            <section id="responsavel">
              <span>02</span><h2>Quem é responsável pelo tratamento</h2>
              <p>A definição jurídica formal do controlador ainda está em andamento. Patrick Naufel e Giovani Letti integram a PráxIA, mas esta política não os declara automaticamente controladores, encarregados, representantes legais ou sócios.</p>
              <p>Enquanto essa definição é concluída, dúvidas e solicitações de privacidade são recebidas pelo canal oficial: <a href={`mailto:${privacyConfig.privacyEmail}`} aria-label={`Enviar solicitação de privacidade para ${privacyConfig.privacyEmail}`}>{privacyConfig.privacyEmail}</a>.</p>
            </section>

            <section id="dados">
              <span>03</span><h2>Quais dados são tratados</h2>
              <h3>Contato geral</h3><p>Nome, e-mail, assunto, mensagem, data e horário do envio, origem da página e estado de atendimento.</p>
              <h3>Interesse em mentoria</h3><p>Nome, e-mail, WhatsApp, contexto de atuação, desafio informado, data e horário do envio, origem da página e estado de atendimento.</p>
              <h3>Proposta institucional</h3><p>Nome, instituição, cargo ou função, e-mail, WhatsApp, cidade, estado, modalidade, interesse em palestra ou workshop, quantidade aproximada de participantes, período pretendido, descrição da necessidade, data e horário, origem e estado de atendimento.</p>
              <h3>Relatório gratuito do Radar</h3><p>Nome, e-mail, cidade e instituição quando informadas, perfil docente, Score PráxIA, faixa de desenvolvimento, pontuações resumidas das seis dimensões, versão do instrumento, tempo de conclusão, opção de receber comunicações, data e horário.</p>
              <h3>Dados técnicos</h3><p>Vercel, Supabase e Google Analytics podem tratar informações técnicas de acesso conforme suas configurações e políticas. A PráxIA não adiciona nome, e-mail, telefone, instituição, cidade ou campos livres aos eventos de Analytics.</p>
            </section>

            <section id="diagnostico" className="privacy-highlight">
              <span>04</span><h2>Como funciona o diagnóstico PráxIA</h2>
              <p>Perfil docente, respostas aos 30 itens, escolhas apresentadas na introdução, horário de início, scores e dimensões são processados no navegador. O progresso é salvo em <code>localStorage</code> sob uma chave da PráxIA e permanece até ser substituído, apagado pela própria pessoa ou removido pela limpeza dos dados do navegador.</p>
              <p>As respostas individuais não são enviadas ao Supabase, ao Google Analytics ou a APIs de inteligência artificial. Antes de abrir o relatório, são enviados ao Supabase os dados de identificação informados, o perfil docente, o Score PráxIA, a faixa e as seis pontuações dimensionais resumidas. Esses dados não aparecem na URL. O PDF continua sendo gerado localmente.</p>
              <p>Como o armazenamento é local, outras pessoas com acesso ao mesmo perfil de navegador podem visualizar o progresso. Use um dispositivo confiável ou limpe os dados do site após concluir.</p>
            </section>

            <section id="formularios">
              <span>05</span><h2>Formulários e liberação do relatório</h2>
              <p>Os formulários enviam os dados diretamente para tabelas separadas no Supabase: <code>lead_contato</code>, <code>lead_mentoria</code>, <code>institutional_leads</code> e <code>lead_radar</code>. O e-mail exibido no site também pode ser usado voluntariamente por meio do aplicativo de e-mail da pessoa.</p>
              <p>Não envie nomes, avaliações, diagnósticos, condições de saúde ou outras informações pessoais de estudantes nos campos livres.</p>
            </section>

            <section id="finalidades">
              <span>06</span><h2>Finalidades e bases legais aplicáveis</h2>
              <p>Os dados são usados para entregar e mensurar o uso do relatório gratuito, responder mensagens, avaliar pedidos de mentoria e preparar ou acompanhar propostas solicitadas. Conforme o contexto, essas operações podem se apoiar em procedimentos preliminares relacionados a contrato ou em legítimo interesse compatível com a expectativa de quem iniciou o contato, sujeito à avaliação dos responsáveis.</p>
              <p>O envio de conteúdos e novidades por e-mail depende de uma autorização separada, opcional e revogável. O aviso informativo do formulário não é aceite contratual de toda esta política.</p>
            </section>

            <section id="fornecedores">
              <span>07</span><h2>Serviços e operadores envolvidos</h2>
              <div className="privacy-providers">
                {privacyConfig.serviceProviders.map((provider) => (
                  <div key={provider.name}>
                    <Database aria-hidden="true" />
                    <h3>{provider.name}</h3><p>{provider.purpose}.</p><small>{provider.data}.</small>
                    <a href={provider.privacyUrl} target="_blank" rel="noopener noreferrer">Política do fornecedor <ExternalLink aria-hidden="true" /></a>
                  </div>
                ))}
              </div>
              <p>Não foram encontrados pixels de publicidade, serviços de pagamento, ferramentas externas de formulário, antispam ou monitoramento de sessão no código auditado.</p>
            </section>

            <section id="cookies">
              <span>08</span><h2>Cookies, armazenamento local e Analytics</h2>
              <p>A aplicação usa <code>localStorage</code> para manter o progresso do Radar e registrar sua preferência de cookies. O Google Analytics é carregado apenas depois de “Aceitar todos” ou ativar Analytics em “Personalizar”. Recusar não essenciais não impede o uso do site nem do Radar.</p>
              <p>Quando autorizado, o Google Analytics pode definir identificadores e cookies próprios para medição. A escolha pode ser revista a qualquer momento.</p>
              <button type="button" className="privacy-preferences-button" onClick={openCookiePreferences}>Alterar preferências de cookies</button>
            </section>

            <section id="retencao">
              <span>09</span><h2>Armazenamento e período de retenção</h2>
              <p>Os leads ficam no Supabase com acesso público bloqueado para leitura. Os períodos formais para contatos gerais, mentoria, propostas institucionais e logs ainda não foram aprovados; essa decisão está registrada como pendência e deve considerar o ciclo do contato, solicitações do titular e eventuais obrigações legais.</p>
              <p>Até a definição, os responsáveis devem revisar periodicamente os registros e eliminar os que não tenham finalidade ativa, preservando apenas o que estiver sujeito a obrigação aplicável. Solicitações podem ser localizadas por e-mail nas três tabelas, corrigidas ou eliminadas administrativamente quando cabível.</p>
            </section>

            <section id="seguranca">
              <span>10</span><h2>Segurança da informação</h2>
              <p>A aplicação utiliza HTTPS em produção, validações no formulário e no banco, políticas de segurança em nível de linha no Supabase e uma chave pública restrita a inserções. A chave administrativa do Supabase não é usada no frontend. Eventos comerciais possuem um conjunto limitado de parâmetros.</p>
              <p>Essas medidas reduzem riscos, mas nenhum ambiente conectado à internet oferece segurança absoluta. Não divulgamos detalhes operacionais que possam facilitar ataques.</p>
            </section>

            <section id="direitos">
              <span>11</span><h2>Direitos dos titulares e como exercê-los</h2>
              <p>Conforme aplicável, você pode solicitar confirmação e acesso, correção, anonimização, bloqueio ou eliminação, portabilidade, informação sobre compartilhamento, oposição, revogação de consentimento e revisão de decisões automatizadas.</p>
              <p>Envie a solicitação para <a href={`mailto:${privacyConfig.privacyEmail}?subject=${encodeURIComponent('Solicitação de privacidade — PráxIA')}`}>{privacyConfig.privacyEmail}</a>, informando o e-mail usado no formulário e o tipo de contato. Poderemos solicitar informações adicionais para confirmar a identidade e localizar o registro. O atendimento não é automático e depende da análise do pedido.</p>
            </section>

            <section id="criancas">
              <span>12</span><h2>Crianças e adolescentes</h2>
              <p>A PráxIA é dirigida a professores e instituições. Os formulários não são destinados à coleta de dados pessoais de estudantes. Não envie, nos campos de mensagem, nomes, avaliações, diagnósticos, condições de saúde ou outras informações pessoais de estudantes.</p>
            </section>

            <section id="transferencia">
              <span>13</span><h2>Transferência internacional</h2>
              <p>Os fornecedores confirmados operam infraestrutura e serviços que podem processar dados fora do Brasil. O projeto Supabase auditado está configurado na região Leste dos Estados Unidos. Vercel e Google também podem realizar tratamento internacional conforme suas políticas.</p>
            </section>

            <section id="alteracoes">
              <span>14</span><h2>Alterações desta política e contato</h2>
              <p>Este documento pode ser atualizado quando o funcionamento do site, os fornecedores ou as decisões jurídicas mudarem. A data da última atualização será ajustada nesta página.</p>
              <p>Canal de privacidade: <a href={`mailto:${privacyConfig.privacyEmail}`}>{privacyConfig.privacyEmail}</a>.</p>
              <div className="privacy-pending"><strong>Decisões ainda pendentes</strong><ul>{privacyPublicationStatus.pending.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}
