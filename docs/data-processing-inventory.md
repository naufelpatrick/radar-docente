# Inventário técnico de tratamento de dados — PráxIA

Auditoria realizada em 28 de julho de 2026. Este documento descreve o código e as configurações observáveis no projeto; não substitui avaliação jurídica.

## Resumo

| Fluxo | Dados | Destino | Persistência |
|---|---|---|---|
| Radar Docente | perfil docente, 30 respostas, opções da introdução, horário de início, scores e dimensões calculadas | navegador da pessoa | `localStorage`, chave `praxia:radar-session:beta-0.1`, sem expiração automática |
| Contato | nome, e-mail, assunto, mensagem, origem, data/hora e status | Supabase, `lead_contato` | prazo formal pendente |
| Mentoria | nome, e-mail, WhatsApp, contexto de atuação, desafio, origem, data/hora e status | Supabase, `lead_mentoria` | prazo formal pendente |
| Proposta institucional | nome, instituição, função, e-mail, WhatsApp, cidade, estado, modalidade, solução, participantes, período, necessidade, origem, data/hora e status | Supabase, `institutional_leads` | prazo formal pendente |
| Preferência de cookies | `accepted` ou `essential_only` | navegador da pessoa | `localStorage`, chave `praxia:cookie-preference:v1`, sem expiração automática |
| Analytics opcional | eventos comerciais e parâmetros enumerados não identificadores | Google Analytics 4 | conforme configuração e política do Google; prazo não confirmado no repositório |

## Radar e página de resultado

- O cálculo é determinístico e executado no frontend por `scoringService`.
- Perfil, respostas e consentimentos da introdução são gravados no `localStorage` durante o fluxo.
- Scores e dimensões são derivados localmente das respostas. O objeto persistido contém as respostas, não um campo de score pronto.
- O resultado real usa a rota fixa `/radar/resultado`; respostas, scores e dimensões não entram em query string ou fragmento.
- A opção `?demo=1` existe apenas em desenvolvimento e não contém respostas.
- Não foi encontrado envio de respostas, perfil, scores ou dimensões para Supabase, GA4, APIs de IA, e-mail ou qualquer outro backend.
- O PDF é montado e baixado localmente com jsPDF.
- O Radar não coleta nome, e-mail ou telefone e não associa o resultado aos leads dos formulários.
- O texto “dados agregados e anônimos” na introdução descreve uso futuro opcional; nesta versão nenhuma resposta é transmitida.

## Analytics

O GA4 usa o identificador `G-9JR9Q9KSV6`. Após esta implementação:

- o script não existe estaticamente no HTML;
- somente é injetado depois da preferência `accepted`;
- a recusa mantém o script bloqueado;
- a escolha pode ser reaberta pelo rodapé ou pela política;
- eventos passam por `commercialAnalytics.ts`;
- os parâmetros permitidos são `product_id`, `audience`, `source_page`, `solution_type` e `form_status`;
- não foram encontrados nome, e-mail, telefone, instituição, mensagem, cidade, respostas, scores ou dimensões nos eventos.

Eventos atualmente previstos: visualização e seleção de ofertas, visualização da página institucional, início e situação do envio do formulário institucional. Os formulários de contato e mentoria não enviam conteúdo ao Analytics.

## Cookies e armazenamento

- Código próprio: não chama `document.cookie`.
- `localStorage`: sessão do Radar e preferência de Analytics.
- `sessionStorage`: não encontrado.
- Cookies de GA4 podem ser definidos depois da autorização; nomes e retenção dependem da biblioteca/configuração do Google.
- Não foram encontrados cookies de publicidade, pixels, mapas, vídeos incorporados ou ferramentas de gravação de sessão.

## Fornecedores confirmados

- **Vercel**: hospedagem e entrega da aplicação. Pode manter logs técnicos de acesso; configuração de retenção não está no repositório.
- **Supabase**: banco PostgreSQL e API REST dos formulários. Projeto observado na região AWS `us-east-2`. RLS ativa, leitura pública revogada e inserção pública limitada por políticas.
- **Google Analytics**: medição opcional após escolha. Pode realizar processamento internacional.
- **GitHub**: repositório e fluxo de publicação; não recebe dados enviados pelos usuários do site.
- **Aplicativo de e-mail escolhido pela pessoa**: acionado apenas por links `mailto:`; o site não controla o provedor usado.

Não encontrados: Google Ads, Meta Pixel, WhatsApp, pagamentos, CRM, formulário externo, CAPTCHA/antispam, Sentry ou monitoramento de sessão.

## Segurança observada

- HTTPS no domínio de produção.
- Chave anônima do Supabase usada no frontend; nenhuma `service_role` encontrada.
- Validação no frontend e restrições equivalentes no PostgreSQL.
- RLS e apenas `INSERT` para `anon`/`authenticated`.
- Formulários bloqueiam novo envio depois do sucesso.
- Não há rate limiting ou mecanismo antispam específico identificado.
- Logs administrativos, backups e política de acesso dos responsáveis não podem ser confirmados pelo código.

## Retenção e procedimento administrativo

Não há job de expiração nem prazos formalmente configurados para leads ou logs. Decisão pendente: aprovar prazos para contato, mentoria, proposta institucional e segurança.

Procedimento disponível no Supabase:

1. localizar registros pelo e-mail informado nas três tabelas;
2. confirmar a identidade por meio proporcional ao pedido;
3. exportar, corrigir ou eliminar o registro quando aplicável;
4. documentar a ação e preservar somente dados sujeitos a obrigação legal;
5. o projeto não possui newsletter ou comunicações promocionais nesta versão.

## Pendências que impedem considerar a política definitiva

- identificação formal do controlador, documento e endereço;
- aprovação dos prazos de retenção;
- revisão das bases legais e do texto por responsáveis e, se necessário, profissional jurídico;
- confirmação administrativa da retenção de logs e backups na Vercel e no Supabase;
- definição de rotina e responsáveis internos para solicitações de titulares.

Canal de privacidade configurado: `praxia@radarpraxia.com`.
