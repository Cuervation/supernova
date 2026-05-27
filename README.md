# Supernova

Supernova es un juego web responsive de merge con estética premium. La persona conecta 5 principios culturales con sus definiciones, completa la partida, guarda su tiempo y puede ver el ranking global.

## Quick start para demo interna

```powershell
npm install
Copy-Item .env.example .env
$env:VITE_AUTH_PROVIDER="mock"
$env:VITE_RANKING_PROVIDER="mock"
npm run dev -- --host 127.0.0.1
```

Abrí `http://127.0.0.1:5173`.

> Para una demo sin depender de Firebase real, usá providers `mock`. Para validar Firebase MVP, completá `.env` y usá providers `firebase`.

## Requisitos

- Node.js 20+ recomendado.
- npm.
- Un proyecto Firebase solo si se quiere probar login/ranking real.

## Instalación

```powershell
npm install
```

## Configuración `.env`

Crear `.env` desde el ejemplo:

```powershell
Copy-Item .env.example .env
```

Variables disponibles:

```env
VITE_AUTH_PROVIDER=firebase
VITE_RANKING_PROVIDER=firebase

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Providers válidos:

| Variable | Valores | Uso |
|---|---|---|
| `VITE_AUTH_PROVIDER` | `firebase`, `mock` | Define el provider de autenticación. |
| `VITE_RANKING_PROVIDER` | `firebase`, `mock` | Define el provider de ranking. |

Las variables `VITE_FIREBASE_*` son configuración pública de frontend. No guardes secretos reales del servidor en variables `VITE_*`.

## Correr local

Con Firebase:

```powershell
npm run dev -- --host 127.0.0.1
```

Con mocks para demo rápida:

```powershell
$env:VITE_AUTH_PROVIDER="mock"
$env:VITE_RANKING_PROVIDER="mock"
npm run dev -- --host 127.0.0.1
```

## Build

```powershell
npm run build
```

## Firebase MVP

Firebase es solo el adapter inicial. La UI no importa Firebase directamente.

### Crear proyecto Firebase

1. Crear un proyecto en Firebase Console.
2. Registrar una Web App.
3. Copiar los valores de configuración web en `.env`.
4. Activar Authentication → Sign-in method → Google.
5. Crear Firestore Database.
6. Publicar `firestore.rules`.
7. Publicar índices desde `firestore.indexes.json` si Firebase lo solicita.

### Colección usada

```txt
gameResults
```

Cada documento guarda:

- `uid`
- `displayName`
- `email`
- `durationMs`
- `durationSeconds`
- `completedPairs`
- `totalPairs`
- `completed`
- `createdAt`
- `gameVersion`
- `provider`

## Cómo probar login

### Con mocks

1. Levantar local con `VITE_AUTH_PROVIDER=mock`.
2. Tocar `Jugar`.
3. Ver pantalla `Ingresá para jugar`.
4. Tocar `Continuar con Google`.
5. Debe entrar al juego como `Jugador Supernova`.

### Con Firebase

1. Completar `.env` con Firebase.
2. Activar Google Auth en Firebase Console.
3. Levantar `npm run dev -- --host 127.0.0.1`.
4. Tocar `Jugar`.
5. Tocar `Continuar con Google`.
6. Completar popup de Google.
7. Debe entrar al juego.

## Cómo probar el juego

1. Entrar a Game.
2. Ver timer y progreso `0 / 5`.
3. Unir cada principio con su definición.
4. Un match incorrecto no debe sumar progreso.
5. Al completar `5 / 5`, debe aparecer `¡Vivamos nuestra Cultura!`.
6. El timer debe detenerse.
7. `Jugar de nuevo` debe reiniciar piezas, progreso y timer.

Pares correctos:

- TODO TERRENO + Porque siempre encontramos la manera de resolver.
- FAN CLIENTE + Porque escuchamos, entendemos y nos ponemos en su lugar.
- VALENTÍA QUE TRANSFORMA + Porque nos animamos a cambiar para crecer.
- INSPIRAMOS Y DEJAMOS HUELLA + Porque construimos un camino que inspira y hace la diferencia.
- EQUIPAZO + Porque sabemos trabajar juntos para alcanzar nuestros logros.

## Cómo probar ranking

1. Completar una partida.
2. En el panel final, tocar `Ver ranking`.
3. Validar que aparezca `Ranking Supernova`.
4. Verificar top 10 ordenado por menor tiempo.
5. Verificar que el usuario actual se resalte si corresponde.

Con mocks, el ranking incluye datos semilla y el resultado de la partida local.

## Cambiar providers en el futuro

El punto central es:

```txt
src/providers/appProviders.ts
```

Regla arquitectónica:

- Firebase vive solo en `src/infrastructure/firebase`.
- La UI usa `AuthService` y `RankingService`.
- Los providers deben implementar `AuthPort` o `RankingPort`.

Guía completa:

```txt
docs/REPLACE_PROVIDERS.md
```

## Checks de QA

```powershell
npm run typecheck
npm run build
```

No hay framework formal de tests configurado todavía. Usar:

```txt
docs/QA_CHECKLIST.md
```

## Limitación MVP

El timer se mide en frontend. Para producción real, el resultado debe validarse server-side con backend, Cloud Functions o API propia.
