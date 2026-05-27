# Demo interna de Supernova

Este guion muestra la demo limpia del MVP: Home, login, juego, resultado y ranking. Para una demo sin depender de Firebase real, usar providers mock.

## Preparación

1. Instalar dependencias:
   ```powershell
   npm install
   ```
2. Configurar providers mock para demo:
   ```powershell
   $env:VITE_AUTH_PROVIDER="mock"
   $env:VITE_RANKING_PROVIDER="mock"
   ```
3. Levantar la app:
   ```powershell
   npm run dev -- --host 127.0.0.1
   ```
4. Abrir:
   ```txt
   http://127.0.0.1:5173
   ```

## Guion de presentación

### 1. Home / Splash

Mostrar:

- Fondo violeta/púrpura con brillos.
- Título `Supernova`.
- Claim `Conectá sin límite`.
- Botón `Jugar`.
- Animación GSAP suave.

Mensaje sugerido:

> Supernova es una experiencia breve para conectar principios culturales con sus definiciones y guardar el mejor tiempo en ranking.

### 2. Login

Acción:

1. Tocar `Jugar`.
2. Mostrar pantalla `Ingresá para jugar`.
3. Explicar que el login se requiere para guardar el tiempo.
4. Tocar `Continuar con Google`.

Con mocks entra como `Jugador Supernova`. Con Firebase real abre Google Auth.

Punto arquitectónico:

> La UI no conoce Firebase. Login usa `AuthService`, y Firebase es solo un adapter reemplazable.

### 3. Juego

Mostrar:

- Header `Principios culturales`.
- Timer visible.
- Progreso `0 / 5`.
- 10 piezas iniciales.

Acción:

1. Hacer un match incorrecto para mostrar que no suma progreso.
2. Hacer los 5 matches correctos:
   - TODO TERRENO + Porque siempre encontramos la manera de resolver.
   - FAN CLIENTE + Porque escuchamos, entendemos y nos ponemos en su lugar.
   - VALENTÍA QUE TRANSFORMA + Porque nos animamos a cambiar para crecer.
   - INSPIRAMOS Y DEJAMOS HUELLA + Porque construimos un camino que inspira y hace la diferencia.
   - EQUIPAZO + Porque sabemos trabajar juntos para alcanzar nuestros logros.

Mensaje sugerido:

> El juego está desacoplado de auth y ranking. La lógica de merge vive en core/game y el contenido vive en content/gameContent.

### 4. Resultado

Al completar `5 / 5`, mostrar:

- `¡Vivamos nuestra Cultura!`
- Tiempo final.
- Estado de guardado.
- Botones `Ver ranking`, `Jugar de nuevo`, `Volver al inicio`.

Mensaje sugerido:

> El resultado se guarda usando `RankingService`; ninguna pantalla escribe directo en Firestore.

### 5. Ranking

Acción:

1. Tocar `Ver ranking`.
2. Mostrar `Ranking Supernova`.
3. Validar top global ordenado por menor tiempo.
4. Mostrar usuario actual resaltado.

Mensaje sugerido:

> Firestore es el ranking MVP, pero cualquier backend futuro puede reemplazarlo implementando `RankingPort`.

### 6. Responsive rápido

Si la demo permite DevTools:

1. Activar vista mobile.
2. Probar 390x844.
3. Probar tablet.
4. Probar desktop.

Mensaje sugerido:

> El diseño es mobile-first y se centra en desktop con proporción elegante tipo mobile.

## Plan B si Firebase no está listo

Usar mocks:

```powershell
$env:VITE_AUTH_PROVIDER="mock"
$env:VITE_RANKING_PROVIDER="mock"
npm run dev -- --host 127.0.0.1
```

Esto permite mostrar todo el flujo sin credenciales ni configuración externa.

## Checklist antes de mostrar

- [ ] `npm run build` pasa.
- [ ] Home carga sin errores.
- [ ] Login mock entra al juego.
- [ ] Se puede completar 5/5.
- [ ] Resultado se guarda una sola vez.
- [ ] Ranking muestra usuario actual.
- [ ] No hay credenciales reales en `.env.example`.
- [ ] Firebase sigue aislado en `src/infrastructure/firebase`.

## Aclaración MVP

El tiempo se mide en frontend. Para producción real se necesita validación server-side con backend, Cloud Functions o API propia.
