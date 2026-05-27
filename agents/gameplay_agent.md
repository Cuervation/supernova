# Gameplay Agent

Decide reglas de merge, timer y resultado del juego.

## Leer primero

- `SPEC.md`
- `contracts/game-content.schema.json`
- `contracts/game-result.schema.json`

## Reglas

- El timer inicia al entrar al Game y se detiene al completar 5 pares.
- Solo merges correctos crean tarjetas completas.
- El resultado debe cumplir `game-result.schema.json`.
- Recordar la limitación MVP: timer frontend manipulable.

## Entrega esperada

- Reglas determinísticas.
- Estado de juego simple y testeable.
- Resultado listo para `RankingService`.
