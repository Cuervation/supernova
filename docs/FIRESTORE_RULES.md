# Firestore Rules — Supernova

Las reglas actuales asumen backend propio: el frontend no escribe sesiones ni resultados de ranking.

## Quick path

1. Deployar `firestore.rules`.
2. Deployar `firestore.indexes.json`.
3. Probar login Google.
4. Probar que el backend pueda iniciar/finalizar partidas con Admin SDK.

## Colecciones

| Colección | Cliente web | Backend Admin SDK |
|---|---|---|
| `users/{uid}` | El dueño puede leer/crear/actualizar | Puede administrar si se necesita |
| `gameSessions/{sessionId}` | Usuario autenticado puede leer su propia sesión | Crea, finaliza o abandona sesiones |
| `gameResults/{resultId}` | Usuarios autenticados pueden leer ranking | Crea resultados al finalizar sesión |

## Decisión de seguridad

- `gameResults`: `allow create, update, delete: if false`.
- `gameSessions`: `allow create, update, delete: if false`.
- El Admin SDK ignora reglas, por eso el backend puede escribir.

Esto evita que el frontend mande un `durationMs` inventado al ranking.

## Índices

`firestore.indexes.json` mantiene:

- Top global: `completed asc`, `durationMs asc`.
- Mejor usuario: `uid asc`, `completed asc`, `durationMs asc`.

## Pruebas mínimas

1. Usuario autenticado lee ranking → permitido.
2. Usuario autenticado crea `gameResults` directo desde cliente → denegado.
3. Usuario autenticado crea `gameSessions` directo desde cliente → denegado.
4. Backend con Admin SDK crea `gameSessions` y `gameResults` → permitido.
