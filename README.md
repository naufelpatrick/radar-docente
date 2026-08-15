# PraxIA — Radar de Fluência Digital e IA

A PraxIA ajuda professores a reconhecer como sua fluência digital e em inteligência artificial aparece na prática docente, identificar forças e pontos de atenção e escolher um próximo passo possível.

> Transforme fluência em prática docente.

## Público

Professores do Ensino Fundamental, Ensino Médio e Ensino Superior.

## Proposta

O Radar oferece uma leitura orientativa baseada em autorrelato. O score não é prova, ranking, diagnóstico clínico ou certificação.

## Núcleo funcional do MVP

- consentimento informado e perfil docente;
- 30 itens oficiais, apresentados um por tela;
- progresso salvo localmente e revisão antes do envio;
- cálculo determinístico do score geral e das seis dimensões;
- Score PraxIA, radar hexagonal, forças, zonas de desenvolvimento, sinais de atenção e próximo passo;
- exportação do relatório completo e personalizado em PDF;
- ofertas futuras de conteúdo e mentoria claramente marcadas como indisponíveis.

## Stack

- React 19;
- TypeScript;
- Vite;
- Tailwind CSS;
- React Router;
- Recharts;
- Vitest;
- ESLint.

## Desenvolvimento

Requer Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

Validação:

```bash
npm run lint
npm test
npm run test:coverage
npm run build
npm run preview
```

## Agente de distribuição PraxIA

O painel privado em `/admin/distribuicao` sincroniza os artigos de
`https://www.radarpraxia.com/rss.xml`, gera rascunhos para Instagram,
Facebook e LinkedIn e permite aprovar, agendar ou publicar. A fila usa a tabela
`content_distribution`, criada pelas migrations do Supabase.

Variáveis server-side:

- `DISTRIBUTION_ADMIN_KEY`: chave usada para entrar no painel;
- `CRON_SECRET`: segredo verificado pela rotina diária da Vercel;
- `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`: persistência privada;
- `PRAXIA_RSS_URL`: opcional; por padrão usa o RSS oficial;
- `MAKE_WEBHOOK_URL`: URL privada do webhook personalizado no Make;
- `MAKE_WEBHOOK_API_KEY`: chave enviada no cabeçalho `x-make-apikey`.

O webhook recebe os dados do artigo, as imagens independentes de Instagram
(`1080 × 1350`) e Facebook (`1200 × 630`) e as legendas específicas dos três
canais. O LinkedIn reutiliza explicitamente `instagram_image_url`, sem gerar
uma terceira arte. `article_image_url` permanece reservado ao Social Graph e nunca é usado
silenciosamente como imagem do Instagram. Nenhuma credencial é enviada ao navegador. Enquanto
as variáveis `MAKE_*` não estiverem configuradas, detecção, edição, aprovação e
agendamento funcionam normalmente; a ação de publicar informa a configuração
ausente sem perder o rascunho.

Ao sincronizar o RSS, o servidor gera automaticamente todas as imagens por
canal que estiverem ausentes. Isso inclui o preenchimento das artes verticais
dos registros antigos após a primeira sincronização posterior à migration.
Os botões “Gerar imagem” e “Gerar novamente” permanecem disponíveis para
substituições manuais.

Novos rascunhos recebem hashtags relacionadas à categoria do artigo, sem
duplicação: de 5 a 10 no Instagram e de 3 a 5 no Facebook e LinkedIn.
Publicações existentes não são reescritas retroativamente.

### Migração do LinkedIn

Antes do deploy, execute no SQL Editor do Supabase:

`supabase/migrations/20260730210000_add_linkedin_distribution.sql`

A migration cria a legenda, seleção, status, erro e identificador de publicação
do LinkedIn, além das seleções persistentes de Instagram e Facebook. Ela é
idempotente e não altera legendas já publicadas. A Vercel não executa migrations
automaticamente.

### Migração das imagens por canal

Execute a migration
`supabase/migrations/20260730190000_separate_distribution_channel_images.sql`
antes do deploy. Ela:

- cria `instagram_image_url` e `facebook_image_url`;
- copia a imagem horizontal antiga apenas para `facebook_image_url`;
- mantém `instagram_image_url` vazio até que uma arte vertical seja gerada;
- adiciona estados e erros independentes por canal;
- cria o bucket público `distribution-images` para as artes geradas no servidor.

Depois do deploy, remapeie o cenário do Make:

- Instagram → **Photo URL**: `instagram_image_url`;
- Facebook → **Photos**: `facebook_image_url`;
- filtro da rota Instagram: `publish_instagram = true`;
- filtro da rota Facebook: `publish_facebook = true`.
- LinkedIn → imagem: `linkedin_image_url`;
- LinkedIn → texto: `linkedin_caption`;
- filtro da rota LinkedIn: `publish_linkedin = true`.

O payload também contém `publish_instagram`, `publish_facebook` e
`publish_linkedin`. Esses
indicadores permitem repetir somente a rota que falhou, sem duplicar a
publicação já concluída na outra rede. O Make pode responder opcionalmente
`instagram_status`, `facebook_status` e `linkedin_status` com `published` ou
`error`, além dos respectivos campos de erro; sem essa resposta, uma aceitação HTTP 2xx
marca como publicados apenas os canais solicitados.

## CMS editorial

A área protegida em `/admin` permite criar, revisar, visualizar e publicar
artigos sem novo deploy. Os artigos históricos continuam no código e os novos
artigos são armazenados no Supabase; blog, RSS e sitemap leem as duas fontes.

Configuração, criação dos usuários iniciais, testes e operação estão descritos
em [docs/editorial-cms.md](docs/editorial-cms.md).

Na Vercel, confirme as variáveis server-side `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `DISTRIBUTION_ADMIN_KEY`, `CRON_SECRET`,
`MAKE_WEBHOOK_URL` e `MAKE_WEBHOOK_API_KEY`. Não use o prefixo `VITE_` para
segredos.

## Privacidade e persistência

As respostas e o andamento ficam somente no `localStorage` do navegador. O MVP não possui autenticação, banco de dados, analytics de respostas ou rastreamento individual. Uma interface de repositório isola a persistência para permitir uma integração futura com Supabase sem acoplar o domínio ao fornecedor.

O consentimento opcional para melhoria anônima apenas registra a preferência local nesta versão; nenhum dado é enviado.

## Certificados de workshops

A rota pública `/certificados/[codigo]` valida credenciais pelo código aleatório e exibe apenas os dados públicos do certificado. Administradores do CMS podem acessar `/admin/certificados` para emitir, listar, baixar o PDF com QR Code e revogar certificados. O PDF aponta para `https://radarpraxia.com/certificados/[codigo]` e a página validada oferece o fluxo de credencial do LinkedIn e a cópia dos dados.

Antes do deploy, aplique `supabase/migrations/20260808190000_create_certificates.sql`. A tabela usa RLS forçada, não possui policy pública de leitura e a função `validar_certificado(text)` é a única consulta disponível para visitantes.

Variáveis de ambiente server-side:

- `SUPABASE_URL`: URL do projeto Supabase;
- `SUPABASE_SERVICE_ROLE_KEY`: usada apenas pelas funções serverless; nunca adicione o prefixo `VITE_`;
- `PUBLIC_SITE_URL`: URL canônica opcional, recomendada como `https://radarpraxia.com`.

Fluxo de emissão: entre no CMS com um perfil `admin`, abra **Certificados**, informe o nome completo e a data do workshop e selecione **Emitir e baixar PDF**. A emissão é auditada. Para invalidar uma credencial, use **Revogar certificado** na mesma tela; a revogação também fica no log de auditoria.

## Referência visual

[Arquivo oficial no Figma](https://www.figma.com/design/kSS5s6udWuKY4HciHnKA5f/Untitled?node-id=0-1)

Consulte também [docs/identidade-visual.md](docs/identidade-visual.md), [docs/produto.md](docs/produto.md), [docs/instrumento.md](docs/instrumento.md) e [docs/scoring.md](docs/scoring.md).
