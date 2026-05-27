# AGENTS — Supernova

Este archivo define cómo deben trabajar agentes humanos o AI sobre Supernova. La regla central: **no romper contratos**. Si un cambio requiere modificar contratos, primero se actualiza SDD y se valida impacto.

## Reglas globales

- Leer `SPEC.md` antes de cambiar producto, arquitectura o pantallas.
- Leer contratos relevantes en `/contracts` antes de implementar.
- Firebase solo puede vivir como adapter inicial en `infrastructure/firebase`.
- UI, juego, timer y ranking dependen de `AuthService`, `RankingService`, `AuthPort` y `RankingPort`.
- Para reemplazar Firebase, seguir `docs/REPLACE_PROVIDERS.md` y cambiar providers solo desde `src/providers/appProviders.ts`.
- No hardcodear colores en componentes; usar tokens.
- No implementar la app completa sin una tarea SDD explícita.
- No romper compatibilidad de datos de ranking sin migración documentada.

## Responsabilidad por agente

| Agente | Decide | Debe leer antes de trabajar |
|---|---|---|
| Product Agent | Producto, alcance, flujo y criterios de aceptación | `SPEC.md`, `contracts/screens.schema.json`, `contracts/game-content.schema.json` |
| Design Agent | Sistema visual, tokens, responsive, animación premium | `SPEC.md`, `contracts/design-tokens.schema.json`, `skills/gsap_animation/SKILL.md`, `skills/responsive_check/SKILL.md` |
| Frontend Agent | Screens, componentes, navegación y composición UI | `SPEC.md`, `contracts/screens.schema.json`, `contracts/design-tokens.schema.json`, `skills/add_screen/SKILL.md`, `skills/create_component/SKILL.md` |
| Gameplay Agent | Reglas de merge, timer y estado del juego | `SPEC.md`, `contracts/game-content.schema.json`, `contracts/game-result.schema.json` |
| Auth Agent | AuthService, AuthPort y providers de login | `SPEC.md`, `contracts/auth.schema.json`, `contracts/provider-contract.schema.json`, `skills/firebase_setup/SKILL.md`, `skills/replace_auth_provider/SKILL.md` |
| Ranking Agent | RankingService, RankingPort, resultado y ranking | `SPEC.md`, `contracts/ranking.schema.json`, `contracts/game-result.schema.json`, `contracts/firestore.schema.json`, `skills/replace_ranking_provider/SKILL.md`, `skills/add_ranking_screen/SKILL.md` |
| QA Agent | Validación funcional, contratos, responsive y regresiones | `SPEC.md`, todos los archivos en `contracts/`, `skills/responsive_check/SKILL.md` |

## Archivos de agente

- `agents/product_agent.md`
- `agents/design_agent.md`
- `agents/frontend_agent.md`
- `agents/gameplay_agent.md`
- `agents/auth_agent.md`
- `agents/ranking_agent.md`
- `agents/qa_agent.md`

## Regla de contratos

Antes de cambiar un contrato:

1. Explicar qué caso real lo exige.
2. Actualizar `SPEC.md` si cambia comportamiento observable.
3. Actualizar el schema correspondiente.
4. Revisar agentes y skills afectados.
5. Documentar la decisión en `state/project_decisions.json`.

## Regla de reemplazo de providers

Antes de reemplazar auth o ranking:

1. Leer `docs/REPLACE_PROVIDERS.md`.
2. Implementar un adapter que respete `AuthPort` o `RankingPort`.
3. Cambiar el provider activo solo en `src/providers/appProviders.ts`.
4. Verificar que ninguna pantalla importe Firebase o providers concretos.
5. Correr `npm run typecheck` y probar Home → Login → Game → Result → Ranking.

## Skills del proyecto

- `skills/add_screen/SKILL.md` — agregar pantallas sin romper navegación ni contratos.
- `skills/create_component/SKILL.md` — crear componentes UI con tokens.
- `skills/gsap_animation/SKILL.md` — agregar animaciones GSAP premium.
- `skills/responsive_check/SKILL.md` — validar mobile-first y desktop centrado.
- `skills/firebase_setup/SKILL.md` — configurar Firebase como adapter temporal.
- `skills/replace_auth_provider/SKILL.md` — reemplazar provider de auth.
- `skills/replace_ranking_provider/SKILL.md` — reemplazar provider de ranking.
- `skills/add_ranking_screen/SKILL.md` — crear o extender ranking.
