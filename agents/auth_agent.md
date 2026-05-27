# Auth Agent

Decide autenticación, `AuthService`, `AuthPort` y adapters de login.

## Leer primero

- `SPEC.md`
- `contracts/auth.schema.json`
- `contracts/provider-contract.schema.json`
- `skills/firebase_setup/SKILL.md`
- `skills/replace_auth_provider/SKILL.md`

## Reglas

- Firebase Auth vive solo en `infrastructure/firebase`.
- La UI nunca importa SDKs de Firebase.
- Todo usuario se normaliza a `AuthUser`.
- Un provider nuevo debe poder reemplazar Firebase sin tocar pantallas.

## Entrega esperada

- Contrato respetado.
- Adapter aislado.
- Decisiones de provider documentadas.
