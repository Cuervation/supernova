# Supernova — SPEC SDD Base

Supernova es un juego web responsive de merge con estética premium. Esta base SDD define contratos, límites arquitectónicos, agentes, skills y criterios de aceptación antes de implementar la app.

## Visión del producto

Crear una experiencia breve, elegante y mobile-first donde la persona conecte principios culturales con sus definiciones, complete 5 merges y compare su tiempo en un ranking global.

**Claim principal:**

- Supernova
- Conectá sin límite

## Alcance MVP

Incluye:

- Home / Splash
- Login
- Game
- Result
- Ranking
- Firebase Auth como provider inicial de autenticación
- Firestore como provider inicial de ranking
- GSAP para animaciones premium

No incluye todavía:

- Implementación completa de la app
- Validación server-side del tiempo
- Antifraude avanzado
- Providers alternativos reales

## Flujo de pantallas

| Pantalla | Propósito | Regla principal |
|---|---|---|
| Home | Presentar marca y entrada | Muestra título, claim, CTA “Jugar” y animación GSAP premium |
| Login | Autenticar antes de jugar | La UI usa `AuthService`; nunca Firebase directo |
| Game | Resolver merges | Al entrar empieza el timer; al completar 5 pares se detiene |
| Result | Mostrar resultado | Muestra mensaje final, duración y dispara guardado por `RankingService` |
| Ranking | Mostrar competencia | Top 10 global por menor tiempo y mejor tiempo del usuario |

Pantallas futuras previstas: Instructions, Settings, Credits, Rewards.

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
- Un merge correcto crea una tarjeta completa.
- Un merge incorrecto no debe crear tarjeta final.
- Al completar las 5 tarjetas finales, el juego termina.

## Reglas de autenticación

- Al tocar “Jugar”, si no hay sesión activa, se muestra Login.
- Para MVP se usa Firebase Auth.
- La UI no conoce Firebase.
- La UI depende de `AuthService`.
- `AuthService` depende de `AuthPort`.
- El provider inicial vive en `infrastructure/firebase`.

Contrato conceptual:

```ts
interface AuthPort {
  getCurrentUser(): Promise<AuthUser | null>;
  signIn(): Promise<AuthUser>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): Unsubscribe;
}
```

## Reglas de ranking

- Se guardan todos los intentos completos.
- El top global muestra 10 resultados ordenados por menor tiempo.
- El mejor tiempo del usuario se calcula por menor `durationMs` del `uid` actual.
- La UI depende de `RankingService`.
- `RankingService` depende de `RankingPort`.
- Firestore es solo el adapter MVP.

Datos mínimos del resultado:

- uid
- displayName
- email
- durationMs
- durationSeconds
- completedPairs
- totalPairs
- completed
- createdAt
- gameVersion
- provider

## Limitación MVP del timer

En el MVP el tiempo se mide en frontend. Esto es aceptable para una experiencia inicial, pero puede ser manipulado por usuarios técnicos. Para producción real, el tiempo debe validarse server-side o mediante un backend autoritativo.

## Arquitectura por puertos y adapters

Regla permanente: **Firebase NO es la arquitectura. Firebase es un detalle de infraestructura.**

```text
UI / Screens
  -> AuthService / RankingService
    -> AuthPort / RankingPort
      -> infrastructure/firebase/FirebaseAuthProvider
      -> infrastructure/firebase/FirebaseRankingProvider
```

Capas esperadas:

| Capa | Responsabilidad | Puede conocer Firebase |
|---|---|---|
| UI | Render, interacción, navegación | No |
| Game | Timer, estado, reglas de merge | No |
| Services | Casos de uso de auth/ranking | No |
| Ports | Contratos internos | No |
| Infrastructure | Providers concretos | Sí, solo dentro de adapter |

## Reemplazo de AuthProvider

Un provider nuevo puede reemplazar Firebase si:

- Implementa `AuthPort` completo.
- Devuelve `AuthUser` normalizado.
- No obliga a cambiar UI, game, timer ni ranking.
- Vive fuera de componentes visuales.
- Tiene tests/validaciones equivalentes al adapter existente.

Providers futuros posibles:

- `CorporateAuthProvider`
- `ApiAuthProvider`
- `SSOAuthProvider`

## Reemplazo de RankingProvider

Un provider nuevo puede reemplazar Firestore si:

- Implementa `RankingPort` completo.
- Persiste todos los intentos.
- Devuelve top 10 ordenado por menor tiempo.
- Devuelve mejor tiempo del usuario.
- No cambia `RankingService` ni pantallas.

Providers futuros posibles:

- `ApiRankingProvider`
- `SqlRankingProvider`
- `BackendRankingProvider`

## Provider Replacement Rules

Firebase puede reemplazarse sin modificar Home, Login, Game, Result ni Ranking. El cambio debe ocurrir en adapters y en `src/providers/appProviders.ts`.

Reglas:

- Solo `src/infrastructure/firebase` puede conocer Firebase.
- UI, hooks de juego, timer y sistema de diseño no pueden importar Firebase.
- Todo AuthProvider debe implementar `AuthPort`.
- Todo RankingProvider debe implementar `RankingPort`.
- La persistencia de resultados se hace por `RankingService`, nunca desde pantallas contra un SDK.
- El timer no depende de ranking ni persistencia.

Guía operativa: `docs/REPLACE_PROVIDERS.md`.

## Sistema de diseño

La estética debe mantenerse premium, moderna y brillante:

- violeta profundo
- púrpura
- magenta / rosa
- blanco
- brillos suaves
- cards redondeadas
- tipografía visual redondeada similar a la referencia

Reglas:

- Centralizar diseño en tokens.
- Usar `--font-brand` con fallback redondeado.
- No hardcodear colores sueltos en componentes.
- Las animaciones GSAP deben reforzar la marca, no tapar la usabilidad.

## Design System Rules

La UI de Supernova se construye con tokens semánticos y componentes base. Esto evita deriva visual cuando se agregan pantallas nuevas.

| Regla | Decisión |
|---|---|
| Tipografía | Usar siempre `--font-brand` y `--font-fallback`; ningún componente define `font-family` propio. |
| Color | Usar tokens de `src/design/designTokens.css`; si falta un color, crear un token semántico antes de usarlo. |
| Layout | Todas las pantallas pasan por `AppLayout` y `BrandScreen`. |
| Superficies | Cards y paneles usan `BrandCard`; no se recrean sombras/bordes manualmente. |
| Acciones | CTAs principales usan `BrandButton`. |
| Progreso | Avances del juego o ranking usan `ProgressBar` cuando aplique. |
| Fondo | Brillos y blobs se expresan con `BackgroundBlobs` y `GlowOrb`, no con estilos sueltos por pantalla. |
| Responsive | Mobile first; en desktop la experiencia se centra con `--screen-max-width`. |

Checklist para futuras pantallas:

- [ ] No inventa colores fuera de tokens.
- [ ] No define `font-family` propio.
- [ ] Usa layout base.
- [ ] Respeta contraste y foco visible.
- [ ] Se ve completa en mobile y centrada en desktop.

## Responsive

- Mobile first.
- En mobile ocupa toda la pantalla.
- En desktop se centra con proporción elegante tipo mobile cuando corresponda.
- Las pantallas deben estar preparadas para crecer sin romper navegación.

## Criterios de aceptación

- [ ] Existen contratos JSON para pantallas, contenido, tokens, auth, ranking, resultados, providers y Firestore.
- [ ] `SPEC.md` documenta flujo, reglas, arquitectura y criterios de reemplazo de providers.
- [ ] `AGENTS.md` define responsabilidad y archivos base por agente.
- [ ] Cada skill del proyecto tiene `SKILL.md` con frontmatter válido.
- [ ] Ninguna decisión convierte Firebase en dependencia de UI o dominio.
- [ ] Los datos del resultado cumplen `contracts/game-result.schema.json`.
- [ ] El diseño se expresa con tokens y no con colores hardcodeados.
- [ ] El MVP declara explícitamente la limitación del timer frontend.
