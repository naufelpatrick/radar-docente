# PráxIA — Radar de Fluência Digital e IA

A PráxIA ajuda professores a reconhecer como sua fluência digital e em inteligência artificial aparece na prática docente, identificar forças e pontos de atenção e escolher um próximo passo possível.

> Transforme fluência em prática docente.

## Público

Professores do Ensino Fundamental, Ensino Médio e Ensino Superior.

## Proposta

O Radar oferece uma leitura orientativa baseada em autorrelato. O score não é prova, ranking, diagnóstico clínico ou certificação.

## Escopo do MVP

- Radar gratuito;
- resultado personalizado;
- recomendação futura de conteúdo pago;
- possibilidade futura de agendamento de mentoria individual em IA.

Nesta etapa, o repositório inclui a landing page pública e uma tela de preparação em `/radar`. O questionário definitivo ainda não faz parte do escopo.

## Stack

- React 19;
- TypeScript;
- Vite;
- Tailwind CSS;
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
npm run build
npm run preview
```

## Analytics

A estrutura aceita `VITE_GA_MEASUREMENT_ID` no futuro. Copie `.env.example` para `.env.local` e informe um ID real somente quando o GA4 for configurado. Nenhum ID é inventado ou versionado.

## Referência visual

[Arquivo oficial no Figma](https://www.figma.com/design/kSS5s6udWuKY4HciHnKA5f/Untitled?node-id=0-1)

Consulte também [docs/identidade-visual.md](docs/identidade-visual.md) e [docs/produto.md](docs/produto.md).

## Independência

A PráxIA é um projeto particular e independente de Patrick Naufel. Não possui vínculo institucional, comercial ou tecnológico com a Fóton.
