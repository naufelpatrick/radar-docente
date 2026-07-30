# PráxIA — Radar de Fluência Digital e IA

A PráxIA ajuda professores a reconhecer como sua fluência digital e em inteligência artificial aparece na prática docente, identificar forças e pontos de atenção e escolher um próximo passo possível.

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
- Score PráxIA, radar hexagonal, forças, zonas de desenvolvimento, sinais de atenção e próximo passo;
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

## Agente de distribuição PráxIA

O painel privado em `/admin/distribuicao` sincroniza os artigos de
`https://www.radarpraxia.com/rss.xml`, gera rascunhos para Instagram e
Facebook e permite aprovar, agendar ou publicar. A fila usa a tabela
`content_distribution`, criada pelas migrations do Supabase.

Variáveis server-side:

- `DISTRIBUTION_ADMIN_KEY`: chave usada para entrar no painel;
- `CRON_SECRET`: segredo verificado pela rotina diária da Vercel;
- `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`: persistência privada;
- `PRAXIA_RSS_URL`: opcional; por padrão usa o RSS oficial;
- `MAKE_WEBHOOK_URL`: URL privada do webhook personalizado no Make;
- `MAKE_WEBHOOK_API_KEY`: chave enviada no cabeçalho `x-make-apikey`.

O webhook recebe os dados do artigo, as imagens independentes de Instagram
(`1080 × 1350`) e Facebook (`1200 × 630`) e as legendas específicas de cada
rede. `article_image_url` permanece reservado ao Social Graph e nunca é usado
silenciosamente como imagem do Instagram. Nenhuma credencial é enviada ao navegador. Enquanto
as variáveis `MAKE_*` não estiverem configuradas, detecção, edição, aprovação e
agendamento funcionam normalmente; a ação de publicar informa a configuração
ausente sem perder o rascunho.

Ao sincronizar o RSS, o servidor gera automaticamente todas as imagens por
canal que estiverem ausentes. Isso inclui o preenchimento das artes verticais
dos registros antigos após a primeira sincronização posterior à migration.
Os botões “Gerar imagem” e “Gerar novamente” permanecem disponíveis para
substituições manuais.

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

O payload também contém `publish_instagram` e `publish_facebook`. Esses
indicadores permitem repetir somente a rota que falhou, sem duplicar a
publicação já concluída na outra rede. O Make pode responder opcionalmente
`instagram_status` e `facebook_status` com `published` ou `error`, além de
`instagram_error` e `facebook_error`; sem essa resposta, uma aceitação HTTP 2xx
marca como publicados apenas os canais solicitados.

Na Vercel, confirme as variáveis server-side `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `DISTRIBUTION_ADMIN_KEY`, `CRON_SECRET`,
`MAKE_WEBHOOK_URL` e `MAKE_WEBHOOK_API_KEY`. Não use o prefixo `VITE_` para
segredos.

## Privacidade e persistência

As respostas e o andamento ficam somente no `localStorage` do navegador. O MVP não possui autenticação, banco de dados, analytics de respostas ou rastreamento individual. Uma interface de repositório isola a persistência para permitir uma integração futura com Supabase sem acoplar o domínio ao fornecedor.

O consentimento opcional para melhoria anônima apenas registra a preferência local nesta versão; nenhum dado é enviado.

## Referência visual

[Arquivo oficial no Figma](https://www.figma.com/design/kSS5s6udWuKY4HciHnKA5f/Untitled?node-id=0-1)

Consulte também [docs/identidade-visual.md](docs/identidade-visual.md), [docs/produto.md](docs/produto.md), [docs/instrumento.md](docs/instrumento.md) e [docs/scoring.md](docs/scoring.md).
