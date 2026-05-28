# Supernova — SPEC SDD Base

Supernova es un juego web responsive de merge con estética premium. La persona inicia sesión, conecta principios culturales con sus definiciones y compara su tiempo en un ranking global.

## Visión del producto

Crear una experiencia breve, elegante y mobile-first donde la persona complete 5 merges culturales y vea su resultado en ranking.

**Claim principal:**

- Supernova
- Conectá sin límite

## Alcance actual

Incluye:

- Home / Splash
- Login con Google mediante Firebase Auth
- Game
- Result
- Ranking
- Backend propio para sesiones y resultados
- Firestore como base de datos
- Providers reemplazables
- Mocks para demo local sin Firebase/backend

No incluye:

- Antifraude avanzado
- Cloud Functions
- Dependencia obligatoria de Firebase Blaze

## Flujo de pantallas

| Pantalla | Propósito | Regla principal |
|---|---|---|
| Home | Presentar marca y entrada | Si no hay sesión muestra login Google; si hay sesión muestra Jugar |
| Game | Resolver merges | Al entrar ya existe una sesión iniciada por backend |
| Result | Mostrar resultado | Muestra duración devuelta por backend |
| Ranking | Mostrar competencia | Lee ranking por API o mock según provider |

## Reglas del juego

### Objetos iniciales

1. TODO TERRENO
2. Porque siempre encontramos la manera de resolver
3. FAN CLIENTE
4. Porque escuchamos, entendemos y nos ponemos en su lugar
5. VALENTÍA QUE TRANSFORMA
6. Porque nos animamos a cambiar para crecer
7. INSPIRAMOS Y DEJAMOS HUELLA
8. Porque construimos un camino que inspira y hace la diferencia
9. EQUIPAZO
10. Porque sabemos trabajar juntos para alcanzar nuestros logros

### Pares finales válidos

| Principio | Definición |
|---|---|
| TODO TERRENO | Porque siempre encontramos la manera de resolver |
| FAN CLIENTE | Porque escuchamos, entendemos y nos ponemos en su lugar |
| VALENTÍA QUE TRANSFORMA | Porque nos animamos a cambiar para crecer |
| INSPIRAMOS Y DEJAMOS HUELLA | Porque construimos un camino que inspira y hace la diferencia |
| EQUIPAZO | Porque sabemos trabajar juntos para alcanzar nuestros logros |

### Merge

- Cada principio debe unirse con su definición correcta.
- Un merge correcto suma el par completo.
- Un merge incorrecto no suma progreso.
- Al completar las 5 parejas, el juego termina.

## Regla autoritativa de tiempo

El frontend puede mostrar un cronómetro visual, pero **el tiempo válido para ranking no depende del frontend**.

Flujo autoritativo:

1. Frontend llama `GameSessionService.startGame()` antes de entrar al juego.
2. `ApiGameSessionProvider` llama `POST /api/game-sessions/start`.
3. Backend valida Firebase ID Token con Admin SDK.
4. Backend crea `gameSessions.startedAt` con hora de servidor.
5. Al completar los 5 pares, frontend llama `GameSessionService.finishGame()`.
6. Backend calcula `durationMs = finishedAt - startedAt` con hora de servidor.
7. Backend guarda `gameResults`.
8. Ranking usa ese `durationMs`.

## Reglas de autenticación

- Firebase Auth se usa solo como adapter inicial para Google login.
- La UI no conoce Firebase.
- La UI depende de `AuthService`.
- `AuthService` depende de `AuthPort`.
- El provider Firebase vive en `src/infrastructure/firebase`.
- Para llamadas API autenticadas, el provider expone `getIdToken()` detrás de `AuthPort`.

Contrato conceptual:

```ts
interface AuthPort {
  getCurrentUser(): Promise<AuthUser | null>;
  getIdToken(): Promise<string | null>;
  signIn(): Promise<AuthUser>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): Unsubscribe;
}
```

## Reglas de sesiones de juego

La UI depende de `GameSessionService`, no del backend directamente.

```ts
interface GameSessionPort {
  startGame(input: { gameVersion: string }): Promise<GameSession>;
  finishGame(sessionId: string, input: FinishGameSessionInput): Promise<GameSessionResult>;
  abandonGame?(sessionId: string): Promise<void>;
}
```

Providers actuales:

- `ApiGameSessionProvider`
- `MockGameSessionProvider`

## Reglas de ranking

- El ranking por defecto se lee desde API.
- La escritura de resultados ocurre al finalizar sesión en backend.
- `ApiRankingProvider.saveGameResult()` no debe guardar directo; la fuente de verdad es `finishGame`.
- `FirebaseRankingProvider` queda como adapter heredado, pero no es el default de esta arquitectura.
- `MockRankingProvider` debe seguir funcionando sin Firebase/backend.

## Arquitectura por puertos y adapters

Regla permanente: **Firebase NO es la arquitectura. Firebase es infraestructura.**

```txt
UI / Screens
  -> AuthService / RankingService / GameSessionService
    -> AuthPort / RankingPort / GameSessionPort
      -> infrastructure/firebase/FirebaseAuthProvider
      -> infrastructure/api/ApiRankingProvider
      -> infrastructure/api/ApiGameSessionProvider
      -> infrastructure/mock/*
```

Capas esperadas:

| Capa | Responsabilidad | Puede conocer Firebase |
|---|---|---|
| UI | Render, interacción, navegación | No |
| Game | Estado visual y reglas de merge | No |
| Services | Casos de uso | No |
| Ports | Contratos internos | No |
| Infrastructure | Providers concretos | Sí, solo adapters Firebase o API |
| Backend `server/` | Validar tokens, sesiones, ranking | Sí, vía Admin SDK |

## Firestore

Colecciones:

- `gameSessions`
- `gameResults`
- `users/{uid}`

Reglas:

- `gameResults`: lectura autenticada, escritura directa desde frontend prohibida.
- `gameSessions`: lectura propia si hace falta, escritura directa desde frontend prohibida.
- Admin SDK ignora reglas, por eso backend puede escribir.

## Sistema de diseño

Se mantiene la estética premium:

- violeta profundo
- púrpura
- magenta / rosa
- blanco
- brillos suaves
- cards redondeadas
- tipografía visual redondeada

Reglas:

- Centralizar diseño en tokens.
- Usar `--font-brand` con fallback redondeado.
- No hardcodear colores sueltos en componentes.
- Mantener responsive mobile-first.

## Criterios de aceptación

- [ ] Login Google funciona.
- [ ] Logout funciona arriba a la derecha.
- [ ] Botón Jugar solo aparece logueado.
- [ ] `startGame` lo maneja backend.
- [ ] `finishGame` lo maneja backend.
- [ ] `durationMs` lo calcula backend.
- [ ] Ranking usa `durationMs` de backend.
- [ ] Firestore no permite escritura directa de `gameResults` desde frontend.
- [ ] Mocks siguen funcionando.
- [ ] Build pasa.
