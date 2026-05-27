# QA Checklist Supernova

Esta guía valida que Supernova cumple el MVP sin acoplar UI a Firebase. Usala antes de cerrar cambios o migrar providers.

## Quick path

1. Correr `npm run typecheck`.
2. Levantar con mocks:
   ```powershell
   $env:VITE_AUTH_PROVIDER="mock"
   $env:VITE_RANKING_PROVIDER="mock"
   npm run dev -- --host 127.0.0.1
   ```
3. Recorrer Home → Login → Game → Resultado → Ranking.
4. Repetir responsive en 360x640, 390x844, 768x1024 y desktop.
5. Verificar reglas Firestore con Firebase Emulator cuando Firebase CLI esté disponible.

## Checks automatizados disponibles

El proyecto todavía no tiene Vitest/Jest/Playwright Test configurado. Hasta agregar un framework formal, usar estos checks:

```powershell
npm run typecheck
```

```powershell
# SDK Firebase fuera del adapter: no debe imprimir resultados.
Get-ChildItem src -Recurse -File -Include *.ts,*.tsx |
  Where-Object { $_.FullName -notmatch '\\src\\infrastructure\\firebase\\' } |
  Select-String -Pattern 'from "firebase/|from ''firebase/'
```

```powershell
# UI/hooks con referencias directas a Firebase: no debe imprimir resultados.
Get-ChildItem src\screens,src\components,src\hooks -Recurse -File -Include *.ts,*.tsx |
  Select-String -Pattern 'firebase|Firebase|Firestore|GoogleAuthProvider|signInWithPopup'
```

```powershell
# Colores o fuentes hardcodeadas fuera del sistema visual: no debe imprimir resultados.
Get-ChildItem src\screens,src\components,src\hooks -Recurse -File -Include *.ts,*.tsx,*.css |
  Select-String -Pattern '#[0-9a-fA-F]{3,8}|rgba?\(|font-family'
```

> No correr `npm run build` si estás siguiendo `AGENTS.md`: la regla del proyecto lo prohíbe.

## Arquitectura

- [ ] Ninguna pantalla importa SDKs de Firebase.
- [ ] Ningún componente visual importa SDKs de Firebase.
- [ ] `HomeScreen`, `LoginScreen`, `GameScreen`, `ResultScreen` y `RankingScreen` usan services/hooks internos.
- [ ] `useMergeGame` y `useGameTimer` no importan Firebase ni ranking.
- [ ] SDKs de Firebase solo aparecen dentro de `src/infrastructure/firebase`.
- [ ] El cambio de provider activo se hace desde `src/providers/appProviders.ts`.
- [ ] Auth depende de `AuthPort` + `AuthService`.
- [ ] Ranking depende de `RankingPort` + `RankingService`.

## Home / Splash

- [ ] Carga sin errores de consola.
- [ ] Muestra `Supernova`.
- [ ] Muestra `Conectá sin límite`.
- [ ] Muestra botón `Jugar`.
- [ ] GSAP anima entrada de fondo, título, subtítulo y CTA sin bloquear interacción.
- [ ] Si el usuario no está logueado, `Jugar` navega a Login.
- [ ] Si el usuario ya está logueado, `Jugar` entra a Game.

## Login

- [ ] Muestra `Ingresá para jugar`.
- [ ] Muestra `Guardamos tu tiempo para el ranking.`
- [ ] Botón `Continuar con Google` llama `AuthService.signIn`.
- [ ] Estado loading deshabilita acciones.
- [ ] Éxito navega a Game.
- [ ] Error se muestra controlado.
- [ ] `Volver` retorna a Home.

## Game

- [ ] Al entrar empieza el timer.
- [ ] El timer se ve en pantalla.
- [ ] El progreso inicia en `0 / 5`.
- [ ] Hay 10 piezas disponibles.
- [ ] Match correcto suma progreso y crea tarjeta completa.
- [ ] Match incorrecto no suma progreso y muestra feedback suave.
- [ ] Funciona con mouse.
- [ ] Funciona con touch/pointer.
- [ ] Completar 5/5 detiene el timer.
- [ ] `Jugar de nuevo` reinicia piezas, progreso y timer.

### Pares correctos

- [ ] TODO TERRENO + Porque siempre encontramos la manera de resolver.
- [ ] FAN CLIENTE + Porque escuchamos, entendemos y nos ponemos en su lugar.
- [ ] VALENTÍA QUE TRANSFORMA + Porque nos animamos a cambiar para crecer.
- [ ] INSPIRAMOS Y DEJAMOS HUELLA + Porque construimos un camino que inspira y hace la diferencia.
- [ ] EQUIPAZO + Porque sabemos trabajar juntos para alcanzar nuestros logros.

## Resultado

- [ ] Al completar 5/5 aparece `¡Vivamos nuestra Cultura!`.
- [ ] Muestra `Completaste el juego en: XX segundos`.
- [ ] Guarda usando `RankingService`, no Firebase directo.
- [ ] Guarda una sola vez por partida.
- [ ] Si falla el guardado, el panel muestra error y el juego no se rompe.
- [ ] `Ver ranking` navega al ranking.
- [ ] `Volver al inicio` navega a Home.

## Ranking

- [ ] Carga top 10 global.
- [ ] Ordena por menor `durationMs`.
- [ ] Muestra posición, nombre, tiempo y fecha.
- [ ] Resalta usuario actual cuando aparece en top 10.
- [ ] Si el usuario no está en top 10, muestra su mejor resultado debajo.
- [ ] Estado vacío se ve claro.
- [ ] Estado error se ve claro.
- [ ] `Jugar de nuevo` vuelve a Game.
- [ ] `Volver al inicio` vuelve a Home.

## Responsive

- [ ] Mobile chico: 360x640, sin overflow horizontal.
- [ ] Mobile grande: 390x844, contenido legible.
- [ ] Tablet: 768x1024, tablero usable.
- [ ] Desktop: centrado, elegante y con proporción tipo mobile cuando corresponde.

## Diseño

- [ ] Colores salen de `src/design/designTokens.css`.
- [ ] No hay colores hardcodeados en componentes.
- [ ] Tipografía usa `--font-brand` / `--font-fallback`.
- [ ] Cards son redondeadas y con brillos suaves.
- [ ] Se mantiene paleta violeta, púrpura, magenta, rosa y blanco.

## Seguridad MVP

- [ ] No hay credenciales hardcodeadas.
- [ ] `.env.example` no contiene valores reales.
- [ ] Variables públicas `VITE_FIREBASE_*` se tratan como configuración pública, no secretos.
- [ ] `firestore.rules` permite crear resultados solo a usuarios autenticados con `uid` propio.
- [ ] `gameResults` no permite update/delete desde cliente.
- [ ] `durationMs`, `durationSeconds`, `completed`, `completedPairs`, `totalPairs`, `provider` y `gameVersion` se validan.
- [ ] Está documentada la limitación MVP: el timer se mide en frontend y puede manipularse; producción debe validar server-side.

## Firebase Emulator

Cuando esté instalada Firebase CLI:

```powershell
firebase emulators:start --only firestore,auth
```

Validar:

- [ ] Usuario autenticado puede crear su propio `gameResults`.
- [ ] Usuario autenticado no puede crear resultados con otro `uid`.
- [ ] Usuario anónimo/no autenticado no puede crear resultados.
- [ ] No se puede actualizar ni borrar `gameResults` desde cliente.
- [ ] Queries de ranking funcionan con `firestore.indexes.json`.
