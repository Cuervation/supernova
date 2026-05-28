# Supernova

Supernova es un juego web responsive de merge. La persona inicia sesión, conecta 5 principios culturales con sus definiciones y compara su tiempo en un ranking global.

## Arquitectura actual

Firebase queda limitado a:

- **Firebase Hosting**: host del frontend.
- **Firebase Auth**: login con Google.
- **Firestore**: persistencia de usuarios, sesiones y ranking.

El tiempo válido para ranking lo calcula un **backend propio Node/Express** con hora del servidor. El cronómetro del frontend es solo visual.

```txt
React/Vite UI
  -> AuthService / RankingService / GameSessionService
    -> AuthPort / RankingPort / GameSessionPort
      -> FirebaseAuthProvider
      -> ApiGameSessionProvider / ApiRankingProvider
      -> Mock providers

Firebase Auth frontend -> ID Token -> Backend API -> Firebase Admin SDK -> Firestore
```

No se usan Cloud Functions.

## Quick start con mocks

```powershell
npm install
Copy-Item .env.example .env
$env:VITE_AUTH_PROVIDER="mock"
$env:VITE_RANKING_PROVIDER="mock"
$env:VITE_GAME_SESSION_PROVIDER="mock"
npm run dev -- --host 127.0.0.1
```

Abrí `http://127.0.0.1:5173`.

## Frontend local con Firebase Auth + API

`.env` del frontend:

```env
VITE_AUTH_PROVIDER=firebase
VITE_RANKING_PROVIDER=api
VITE_GAME_SESSION_PROVIDER=api

VITE_API_BASE_URL=http://localhost:3001

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> No commitees `.env`. `.env.example` mantiene placeholders.

Correr frontend:

```powershell
npm run dev:web -- --host 127.0.0.1
```

## Backend local

El backend vive en `server/`.

```powershell
cd server
npm install
Copy-Item .env.example .env
npm run dev
```

`server/.env`:

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
FIREBASE_PROJECT_ID=supernova-dev-107ec
GOOGLE_APPLICATION_CREDENTIALS=C:\ruta\fuera\del\repo\service-account.json
```

### Firebase Admin local

1. En Firebase Console, crear una service account key.
2. Guardar el JSON **fuera del repo**.
3. Apuntar `GOOGLE_APPLICATION_CREDENTIALS` a ese archivo.
4. No subir JSON ni claves privadas a Git.

Health check:

```powershell
Invoke-RestMethod http://localhost:3001/health
```

Respuesta esperada:

```json
{ "ok": true }
```

## Flujo de juego seguro

1. Usuario inicia sesión con Google en frontend.
2. Frontend obtiene Firebase ID Token desde el provider de auth.
3. Botón **Jugar** llama `POST /api/game-sessions/start`.
4. Backend valida token con Firebase Admin y crea `gameSessions` con `startedAt` de servidor.
5. Frontend muestra cronómetro visual.
6. Al completar los 5 pares, frontend llama `POST /api/game-sessions/:id/finish`.
7. Backend valida sesión, calcula `durationMs`, guarda `gameResults` y devuelve el resultado final.
8. Ranking lee desde `GET /api/ranking/global` y `GET /api/ranking/me`.

## Endpoints API

| Método | Ruta | Auth | Uso |
|---|---|---|---|
| GET | `/health` | No | Health check |
| POST | `/api/game-sessions/start` | Sí | Inicia partida |
| POST | `/api/game-sessions/:sessionId/finish` | Sí | Finaliza partida y guarda resultado |
| GET | `/api/ranking/global` | No | Top ranking global |
| GET | `/api/ranking/me` | Sí | Mejores tiempos del usuario |

## Firestore

Colecciones:

- `gameSessions`
- `gameResults`
- `users/{uid}` si se usa perfil propio

El frontend **no puede escribir** `gameResults` ni `gameSessions`; esas escrituras las hace el backend con Admin SDK.

Publicar reglas e índices:

```powershell
firebase deploy --only firestore:rules,firestore:indexes
```

## Scripts

Frontend:

```powershell
npm run dev:web
npm run typecheck
npm run build:web
```

Backend:

```powershell
cd server
npm run dev
npm run build
```

Atajos desde raíz:

```powershell
npm run dev:api
npm run build:api
```

## Mocks

Modo mock completo:

```env
VITE_AUTH_PROVIDER=mock
VITE_RANKING_PROVIDER=mock
VITE_GAME_SESSION_PROVIDER=mock
```

No requiere Firebase ni backend. El resultado mock se guarda en memoria para que el ranking local siga funcionando.
