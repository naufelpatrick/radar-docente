# Diretrizes permanentes da PráxIA

## Publicação de artigos

Todo artigo publicado no blog da PráxIA deve possuir imagem própria. Um artigo não deve ser marcado como `published` nem enviado para produção enquanto esse requisito não estiver completo.

Para cada novo artigo:

- criar uma composição visual exclusiva, coerente com o tema do conteúdo e com a identidade PráxIA;
- tratar educação, prática docente e contexto como protagonistas; a tecnologia deve aparecer como recurso, não como fim;
- utilizar prioritariamente graphite, indigo, lime e cyan; coral somente como ponto de atenção;
- incluir na peça o título do artigo e a categoria;
- não incluir logo, assinatura ou marca nominativa da PráxIA na imagem;
- garantir legibilidade em miniatura e contraste adequado;
- não utilizar fotografias genéricas, logos incorretos, marcas de ferramentas ou imagens reutilizadas de outros artigos;
- gerar a imagem em `1200 × 630 px`;
- salvar uma versão JPEG para Social Graph em `public/social/<slug-descritivo>-1200x630.jpg`;
- salvar uma versão WebP para exibição no site em `public/social/<slug-descritivo>-1200x630.webp`;
- cadastrar `coverImage.src` e `coverImage.alt` na fonte editorial `src/data/blogArticles.ts`;
- cadastrar `socialImage` como URL absoluta pública em JPEG;
- cadastrar `socialImageAlt` com descrição específica e acessível;
- usar a capa WebP no conteúdo e nos cards quando o componente oferecer esse suporte;
- configurar `og:image`, Twitter Card e `BlogPosting.image` com a imagem exclusiva;
- nunca usar o Social Graph institucional como solução definitiva para um artigo publicado.

Antes da publicação, validar:

- JPEG e WebP possuem exatamente `1200 × 630 px`;
- a URL pública do JPEG retorna HTTP 200 e `Content-Type: image/jpeg`;
- o HTML inicial da rota contém título, descrição, canonical e imagem próprios;
- a imagem possui texto correto, sem cortes ou erros ortográficos;
- desktop e mobile exibem a capa sem deformação;
- lint, testes e build foram executados com sucesso.
