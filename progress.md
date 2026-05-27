Original prompt: Definir e implementar la arquitectura base del proyecto Supernova con pantallas extensibles, diseño consistente, auth/ranking reemplazables, juego desacoplado, Firebase como adapter temporal y responsive mobile first.

## Progreso

- Se eligió React + TypeScript + Vite porque el repo no tenía framework y es la opción más simple para este juego.
- Se agregó `appProviders.ts` como composition root para cambiar auth/ranking sin tocar pantallas.
- Se verificó que no haya imports del SDK ni menciones de Firebase fuera de infraestructura y composition root.
- Se instalaron dependencias y `npm run typecheck` pasó correctamente. No se ejecutó build por regla del proyecto.
- Se consolidó el sistema de diseño con tokens obligatorios, `BrandSubtitle`, `GlowOrb` y `BackgroundBlobs`.
- Se validó visualmente Home con Playwright sobre Vite dev y no se capturaron errores de consola.
- Se alinearon `AuthPort` y `RankingPort` a los contratos pedidos y se agregaron `MockAuthProvider` / `MockRankingProvider`.
- `appProviders.ts` permite seleccionar `firebase` o `mock` con `VITE_AUTH_PROVIDER` y `VITE_RANKING_PROVIDER`.
- Firebase quedó como provider inicial real: Google Auth + Firestore `gameResults`, con variables en `.env.example`.
- Se verificó que no haya imports del SDK Firebase fuera de `src/infrastructure/firebase`.
- Home/Splash quedó animada con GSAP: entrada de fondo, título, subtítulo, CTA y movimiento sutil de blobs/partículas.
- El flujo Jugar → LoginScreen → mock login → Game fue verificado con Playwright sin errores de consola.
- GameScreen ahora tiene merge con Pointer Events, tablero responsive, timer visible, progreso 0/5→5/5 y zona de completadas.
- Se agregó lógica testeable en `src/core/game/mergeRules.ts`; `useMergeGame` y `useGameTimer` siguen sin Firebase.
- Se verificó con Playwright: match incorrecto no suma, los 5 matches correctos completan el juego y navegan a Result.
- Resultado final ahora se muestra como panel dentro de Game y se guarda una sola vez vía `useSaveGameResult` → `RankingService`.
- Se verificó con Playwright: completar partida muestra panel, guarda en mock ranking, Ver ranking navega y Jugar de nuevo reinicia 0/5 con 10 piezas.
- RankingScreen ahora muestra Ranking Supernova, top 10, fecha, tiempo, resaltado del usuario actual, estados loading/empty/error y acciones de navegación.
- Se verificó con Playwright: partida completa → Ver ranking → ranking muestra resultado mock resaltado y datos seed ordenados.
- Se agregaron reglas Firestore MVP para `users/{uid}` y `gameResults/{resultId}`, índices de ranking y documentación en `docs/FIRESTORE_RULES.md`.
- Se validó JSON y typecheck; Firebase CLI no está instalado localmente, así que no se corrió emulator.
- Se documentó el reemplazo de Firebase en `docs/REPLACE_PROVIDERS.md` y se actualizaron SPEC, AGENTS y skills de reemplazo.
- Se verificó que no haya imports Firebase fuera de infrastructure y `npm run typecheck` pasó.
- QA Agent validó arquitectura, seguridad básica, contratos JSON, typecheck y flujo completo con Playwright usando providers mock.
- Se corrigió `formatDate` para soportar `Date`, string, number y timestamps tipo Firestore (`toDate()` / `seconds`), evitando `Fecha no disponible` en ranking real con Firestore.
- Se creó `docs/QA_CHECKLIST.md` porque el proyecto no tiene framework de tests configurado; no se ejecutó build por regla del proyecto.
- QA triage final cerró deudas: `GameScreen` ya no reprograma feedback en cada frame del timer, `ResultScreen` usa `useSaveGameResult` con guard de una sola escritura, `appProviders` valida valores inválidos de provider y `resolveMerge` ignora IDs inexistentes.
- `docs/QA_CHECKLIST.md` ahora incluye comandos concretos de auditoría para desacople Firebase y tokens visuales.
- Se corrió `npm run typecheck`, validación JSON, greps de arquitectura/diseño y flujo Playwright mock Home → Login → Game → Resultado → Ranking; no se corrió build por regla del proyecto.
- Preparación de demo interna: se creó `README.md`, `docs/DEMO_SCRIPT.md` y se completó `.env.example` con comentarios de providers/Firebase público.
- Se ejecutó `npm run lint --if-present` y `npm test --if-present`; no hay scripts configurados, ambos finalizaron sin errores.
- Se ejecutó `npm run build` correctamente; Vite emitió warning de chunk grande por bundle inicial (pendiente de producción, no bloquea demo).
- Se verificó responsive básico con Playwright en 360x640, 390x844, 768x1024 y 1280x720 usando providers mock.
- Se verificó ausencia de credenciales reales, Firebase aislado en `src/infrastructure/firebase`, sin referencias Firebase en UI/hooks y sin colores/fuentes hardcodeados fuera del sistema visual.
