# API Portfolio (Supabase)

## Configuración

1. Copia variables de entorno:

```bash
cp .env.example .env
```

2. Exporta las variables (o usa tu gestor de entorno preferido):

```bash
export $(cat .env | xargs)
```

3. Inicia el API:

```bash
npm start
```

## Endpoints

- `GET /api/health`
- `POST /api/messages`

Payload esperado para `POST /api/messages`:

```json
{
  "nombre": "Tu nombre",
  "email": "tu@email.com",
  "empresa": "Opcional",
  "mensaje": "Tu mensaje"
}
```

## Notas de Supabase

- La URL y publishable key del proyecto ya están preparadas en `.env.example`.
- Si tu tabla no se llama `messages`, cambia `SUPABASE_TABLE`.
- Debes tener política RLS/permiso de `insert` habilitada para la key usada por el API.
