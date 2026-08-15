# CMS editorial da PráxIA

## Arquitetura

O CMS preserva o site React/Vite e usa as Vercel Functions existentes como
camada de servidor. O Supabase armazena perfis, credenciais, sessões, artigos,
categorias, configurações, redirecionamentos e auditoria. Nenhum segredo é
enviado ao navegador.

Os seis artigos anteriores continuam em `src/data/blogArticles.ts` e em suas
páginas TSX. Artigos criados no CMS são consultados dinamicamente. A listagem do
blog e as categorias combinam as duas fontes sem alterar URLs históricas.

O editor é TipTap 3 open source sobre ProseMirror. O JSON do editor é a fonte
principal; HTML sanitizado é derivado no servidor para renderização e RSS.
Nenhum serviço TipTap Cloud ou recurso comercial é utilizado.

## Banco e RLS

Execute no SQL Editor do Supabase:

`supabase/migrations/20260802150000_create_editorial_cms.sql`

A migration cria:

- `cms_profiles`, `cms_credentials`, `cms_sessions` e `cms_login_attempts`;
- `cms_categories`, `cms_articles` e `cms_article_redirects`;
- `cms_editorial_settings` e `cms_audit_logs`;
- bucket público `article-covers`;
- índices, restrições e políticas RLS.

O público pode ler apenas artigos publicados, categorias ativas, autores de
artigos publicados e imagens do bucket. Credenciais, sessões, rascunhos,
configurações e auditoria permanecem fechados. As funções usam service role e
revalidam sessão, CSRF, usuário ativo e papel antes de cada mutação.

## Variáveis do servidor

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PUBLIC_SITE_URL=https://www.radarpraxia.com`
- `CMS_SETUP_SECRET`: segredo temporário para definir ou redefinir senhas
- `CMS_AUDIT_PEPPER`: segredo usado para anonimizar IPs nos registros
- `OPENAI_API_KEY`: necessária somente para gerar capas
- `OPENAI_IMAGE_MODEL`: opcional; padrão `gpt-image-1`

Mantenha todas sem o prefixo `VITE_`. A chave anônima pública já utilizada por
outros formulários não concede acesso administrativo ao CMS.

## Criar Patrick e Giovanni

Depois da migration e do deploy, escolha senhas fortes diferentes, com no
mínimo 12 caracteres. Não coloque as senhas no terminal compartilhado, no Git
ou em arquivos do projeto. Faça uma requisição HTTPS por usuário ao endpoint
`/api/cms/setup`, enviando `Authorization: Bearer <CMS_SETUP_SECRET>` e JSON:

```json
{
  "username": "patrick.naufel",
  "password": "senha forte definida fora do repositório"
}
```

Repita com `giovani.letti`. O endpoint aceita somente esses dois usernames e
atribui, respectivamente, `Patrick Naufel`/admin e `Giovanni Letti`/editor. A
senha recebe salt aleatório e hash `scrypt`; o texto original nunca é salvo.
Depois da configuração, remova `CMS_SETUP_SECRET` da Vercel ou troque-o por um
valor aleatório não disponível à equipe de uso cotidiano.

## Fluxo editorial

1. Entre em `/admin/login`.
2. Crie um artigo com título, texto e instrução de imagem.
3. Use **Preparar artigo** e revise categoria, slug, resumo e SEO.
4. Adicione protocolo, checklist, FAQ, CTA ou aviso quando fizerem sentido.
5. Gere ou envie a capa, revise-a e aprove-a.
6. Abra a prévia privada.
7. Publique.

O autosave ocorre após oito segundos em artigos já criados. Sair com mudanças
pendentes gera aviso. Falhas de imagem não alteram o texto.

## RSS, sitemap e Make

`/feed.xml` conserva o feed estático dos artigos históricos. `/rss.xml` combina
esses itens com artigos publicados do CMS no mesmo formato consumido pela fila
de distribuição. GUID continua sendo a URL canônica; a restrição única
`content_distribution.article_guid` impede duplicação.

Rascunhos, prévias e arquivados não entram no RSS. Editar um artigo publicado
mantém o mesmo GUID e não cria uma nova publicação social. O código de geração
das imagens de Instagram/Facebook e o webhook do Make não foram alterados.

`/sitemap.xml` é gerado dinamicamente com páginas institucionais, artigos
históricos, categorias e apenas artigos CMS publicados. Rotas administrativas
e prévias ficam fora e recebem `noindex`.

## Testar localmente

```bash
npm install
npm run lint
npx tsc -b
npm test
npm run build
npm run dev
```

As funções serverless e cookies devem ser testados com `vercel dev` quando as
variáveis do servidor estiverem disponíveis.

## Deploy

1. Aplicar a migration no Supabase.
2. Configurar as variáveis na Vercel para Production e Preview.
3. Executar build e testes.
4. Publicar a aplicação.
5. Criar os dois usuários pelo endpoint de setup.
6. Validar `/admin/login`, `/rss.xml`, `/sitemap.xml` e um artigo de teste.

## Limitações conhecidas

- A preparação automática usa heurísticas locais para manter custo zero e
  previsibilidade; todas as sugestões exigem revisão humana.
- A geração de capa depende de cota e disponibilidade da API de imagem. Upload
  manual permanece disponível.
- Os artigos históricos ainda são editados no código durante a camada de
  compatibilidade. Novos artigos são totalmente gerenciados no CMS.
