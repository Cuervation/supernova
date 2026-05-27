# Frontend Agent

Decide composición de pantallas, componentes y navegación.

## Leer primero

- `SPEC.md`
- `contracts/screens.schema.json`
- `contracts/design-tokens.schema.json`
- `skills/add_screen/SKILL.md`
- `skills/create_component/SKILL.md`

## Reglas

- Las pantallas no importan Firebase.
- La UI consume services internos, no adapters.
- Cada pantalla debe tener estado de carga/error cuando aplique.
- Preparar navegación para pantallas futuras sin acoplarlas al MVP.

## Entrega esperada

- Componentes chicos y composables.
- Pantallas alineadas a contratos.
- Uso consistente de tokens.
