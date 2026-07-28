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

## Privacidade e persistência

As respostas e o andamento ficam somente no `localStorage` do navegador. O MVP não possui autenticação, banco de dados, analytics de respostas ou rastreamento individual. Uma interface de repositório isola a persistência para permitir uma integração futura com Supabase sem acoplar o domínio ao fornecedor.

O consentimento opcional para melhoria anônima apenas registra a preferência local nesta versão; nenhum dado é enviado.

## Referência visual

[Arquivo oficial no Figma](https://www.figma.com/design/kSS5s6udWuKY4HciHnKA5f/Untitled?node-id=0-1)

Consulte também [docs/identidade-visual.md](docs/identidade-visual.md), [docs/produto.md](docs/produto.md), [docs/instrumento.md](docs/instrumento.md) e [docs/scoring.md](docs/scoring.md).
