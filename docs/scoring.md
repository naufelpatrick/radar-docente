# Regras de pontuação

O cálculo está isolado em `src/services/scoringService.ts` e não depende da interface.

## Dimensões

Cada dimensão possui cinco respostas inteiras entre 1 e 5.

```text
soma bruta = soma das cinco respostas
score da dimensão = ((soma bruta - 5) / 20) × 100
```

Assim, cada dimensão varia de 0 a 100. O score geral exato é a média aritmética dos seis scores dimensionais. Apenas o score geral exibido é arredondado.

## Faixas

| Score | Faixa |
|---|---|
| 0–39 | Iniciação |
| 40–59 | Exploração |
| 60–79 | Integração |
| 80–100 | Transformação |

## Leitura personalizada

- Forças: até duas dimensões com o maior score.
- Zonas de desenvolvimento: até duas dimensões com o menor score.
- Desempenho semelhante: amplitude inferior a 5 pontos.
- Perfil equilibrado: amplitude inferior a 15 pontos.
- Competências em estágios diferentes: amplitude igual ou superior a 30 pontos.
- Sinais de atenção: dimensões abaixo de 40; ética, segurança e autoria sempre aparece primeiro quando estiver abaixo desse limite.
- Próximo passo: recomendação associada à zona prioritária, com desempate por uma ordem explícita e testada.

O resultado inclui identificador local anônimo, versão do instrumento e tempo de conclusão para futura compatibilidade de dados. Nesta versão, nada é transmitido: a sessão permanece no navegador.
