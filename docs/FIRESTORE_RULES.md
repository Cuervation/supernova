# Firestore Rules — Supernova MVP

Estas reglas protegen el MVP sin esconder la limitación importante: el timer todavía se mide en frontend, así que NO es antifraude fuerte.

## Quick path

1. Deployar `firestore.rules`.
2. Deployar `firestore.indexes.json`.
3. Probar login y guardado de resultado con un usuario autenticado.

## Colecciones

| Colección | Acceso | Decisión |
|---|---|---|
| `users/{uid}` | Usuario autenticado dueño del `uid` | Puede leer, crear y actualizar su documento. No puede borrar desde cliente. |
| `gameResults/{resultId}` | Usuarios autenticados | Pueden leer para ranking y crear resultados propios válidos. No pueden modificar ni borrar resultados existentes. |

## Validación de `gameResults`

Para crear un resultado:

- `request.auth.uid` debe coincidir con `uid`.
- `durationMs` y `durationSeconds` deben ser números positivos.
- `completed` debe ser `true`.
- `completedPairs` debe ser igual a `totalPairs`.
- `totalPairs` debe ser `5`.
- `createdAt` debe ser `request.time`.
- `gameVersion` y `provider` deben existir y no estar vacíos.
- Solo se aceptan los campos documentados por el contrato.

## Índices

`firestore.indexes.json` agrega índices para:

- Top global: `completed == true` ordenado por `durationMs asc`.
- Mejor usuario: `uid == currentUser`, `completed == true`, ordenado por `durationMs asc`.

## Limitación de seguridad MVP

El MVP mide el tiempo en frontend. Un usuario técnico podría manipular `durationMs` antes de guardar. Las reglas validan forma, propiedad y valores positivos, pero NO pueden probar que el tiempo sea honesto.

Para producción real hay que validar server-side con una de estas opciones:

- Cloud Functions.
- API propia.
- Backend autoritativo que emita y cierre intentos de juego.

No se implementan Cloud Functions todavía.

## Probar con Firebase Emulator

Si usás Firebase CLI:

```bash
firebase emulators:start --only firestore,auth
```

Casos mínimos:

1. Usuario autenticado crea `users/{uid}` propio → permitido.
2. Usuario autenticado escribe `users/{otroUid}` → denegado.
3. Usuario autenticado crea `gameResults` con `uid == request.auth.uid` y datos válidos → permitido.
4. `gameResults` con `durationMs <= 0` → denegado.
5. `gameResults` con `completedPairs != totalPairs` → denegado.
6. Update/delete de `gameResults` → denegado.
