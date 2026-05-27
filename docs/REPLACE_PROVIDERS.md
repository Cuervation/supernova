# Reemplazar Firebase en Supernova

Firebase es el adapter inicial, no la arquitectura. Si el nuevo provider respeta `AuthPort` y `RankingPort`, NO hay que modificar Home, Login, Game, Result ni Ranking.

## Quick path

1. Crear un adapter nuevo en `src/infrastructure/<provider>/`.
2. Implementar `AuthPort` o `RankingPort`.
3. Normalizar datos hacia tipos internos (`AuthUser`, `RankingEntry`, `GameResult`).
4. Cambiar el provider activo en `src/providers/appProviders.ts`.
5. Correr typecheck y probar Home → Login → Game → Result → Ranking.

## Qué partes conocen Firebase

Solo esta carpeta puede importar SDKs de Firebase:

```txt
src/infrastructure/firebase
```

## Qué partes NO deben conocer Firebase

Estas partes nunca deben importar Firebase ni llamar Firestore/Auth directo:

- `HomeScreen`
- `LoginScreen` / `LoginModal`
- `GameScreen`
- `ResultScreen`
- `RankingScreen`
- `useMergeGame`
- `useGameTimer`
- componentes visuales
- design system

CONCEPTOS > CÓDIGO: si una pantalla importa Firebase, rompiste la arquitectura. La pantalla no necesita saber si atrás hay Firebase, SSO, una API o SQL.

## Contratos obligatorios

| Contrato | Archivo | Responsabilidad |
|---|---|---|
| `AuthPort` | `src/core/auth/auth.port.ts` | Login, logout, usuario actual y suscripción a sesión. |
| `RankingPort` | `src/core/ranking/ranking.port.ts` | Guardar resultado, top global y mejor resultado del usuario. |

Los servicios (`AuthService`, `RankingService`) dependen de esos puertos. La UI depende de servicios/hooks, no de providers concretos.

## Crear un nuevo AuthProvider

Providers esperados:

- `CorporateAuthProvider`
- `ApiAuthProvider`
- `SSOAuthProvider`
- `MockAuthProvider`

Checklist:

- [ ] Implementa `AuthPort`.
- [ ] Devuelve `AuthUser` normalizado.
- [ ] Mapea errores externos a mensajes internos controlados.
- [ ] No modifica pantallas.
- [ ] Se registra solo en `src/providers/appProviders.ts`.

Ejemplo:

```ts
class CorporateAuthProvider implements AuthPort {
  getCurrentUser() { /* ... */ }
  onAuthStateChanged(callback) { /* ... */ }
  signIn() { /* ... */ }
  signOut() { /* ... */ }
}
```

## Crear un nuevo RankingProvider

Providers esperados:

- `ApiRankingProvider`
- `SqlRankingProvider`
- `CorporateRankingProvider`
- `MockRankingProvider`

Checklist:

- [ ] Implementa `RankingPort`.
- [ ] Persiste todos los intentos completos.
- [ ] Devuelve top 10 ordenado por menor `durationMs`.
- [ ] Devuelve mejor resultado del usuario.
- [ ] Mapea datos externos a `RankingEntry`.
- [ ] No modifica `GameScreen` ni `RankingScreen`.

## Dónde cambiar el provider activo

El único punto de cambio es:

```txt
src/providers/appProviders.ts
```

Ejemplo concreto:

```ts
// Antes
import { FirebaseAuthProvider } from "../infrastructure/firebase/firebaseAuthProvider";
import { FirebaseRankingProvider } from "../infrastructure/firebase/firebaseRankingProvider";

// Después
import { CorporateAuthProvider } from "../infrastructure/corporate/corporateAuthProvider";
import { ApiRankingProvider } from "../infrastructure/api/apiRankingProvider";

const authProvider = new CorporateAuthProvider();
const rankingProvider = new ApiRankingProvider();
```

## Ejemplo de migración

| Antes | Después |
|---|---|
| `FirebaseAuthProvider` | `CorporateAuthProvider` |
| `FirebaseRankingProvider` | `ApiRankingProvider` |

Impacto esperado:

- Home: sin cambios.
- Login: sin cambios.
- Game: sin cambios.
- Result/panel final: sin cambios.
- Ranking: sin cambios.

## Tests y verificaciones después del cambio

Correr:

```bash
npm run typecheck
```

Probar manualmente:

1. Home carga.
2. Botón `Jugar` muestra login si no hay sesión.
3. Login exitoso entra a Game.
4. Completar 5/5 muestra panel final.
5. Resultado se guarda una sola vez.
6. Ranking muestra top 10.
7. Usuario actual se resalta si corresponde.

Verificar con búsqueda:

- No hay imports de Firebase fuera de `src/infrastructure/firebase`.
- `GameScreen` no llama persistencia directa.
- `useGameTimer` no conoce ranking.

## Errores prohibidos

- Importar Firebase en UI.
- Llamar Firestore desde pantallas.
- Duplicar lógica de auth.
- Duplicar lógica de ranking.
- Guardar resultados desde `GameScreen` directamente contra un provider.
- Acoplar timer a persistencia.

## Tradeoffs

| Opción | Ventaja | Costo |
|---|---|---|
| Adapter nuevo respetando puertos | Cero cambios en UI | Hay que mapear datos bien |
| Cambiar contratos | Permite nuevos casos | Requiere SDD, migración y QA completo |
| Meter SDK en pantallas | Parece rápido | Rompe arquitectura; NO se permite |
