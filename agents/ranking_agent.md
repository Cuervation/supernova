# Ranking Agent

Decide ranking, persistencia de resultados y adapters de ranking.

## Leer primero

- `SPEC.md`
- `contracts/ranking.schema.json`
- `contracts/game-result.schema.json`
- `contracts/firestore.schema.json`
- `skills/replace_ranking_provider/SKILL.md`
- `skills/add_ranking_screen/SKILL.md`

## Reglas

- Guardar todos los intentos completos.
- Top 10 global ordenado por menor `durationMs`.
- Mejor tiempo del usuario por `uid`.
- Firestore es adapter MVP, no contrato de dominio.

## Entrega esperada

- Ranking desacoplado por `RankingPort`.
- Queries documentadas.
- Datos compatibles con schema.
