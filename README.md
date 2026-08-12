# Jenny Delgado Centro Estética Láser

Sitio estético independiente para Jenny Delgado. Mantiene su propia marca, catálogo, precios y agenda en Cloudflare Workers + D1.

## Flujo productivo

- `index.html`: landing usable con tratamientos, tecnología Fotona, videos y precios.
- `agenda.html`: solicitud de cita conectada a `/api/availability` y `/api/appointments`.
- `login.html`, `admin.html`, `citas.html`: handoffs seguros sin usuarios locales ni agenda en navegador.
- `worker.js`: API de tratamientos, disponibilidad, solicitudes y consulta administrativa protegida.
- `migrations/0001_create_appointments.sql`: tablas D1 para solicitudes y bloqueos.

## D1

Base creada:

- Database name: `jenny-centro-estetica-laser`
- Binding: `DB`

La configuración vive en `wrangler.toml`.

Aplicar migraciones:

```bash
npx.cmd wrangler d1 migrations apply jenny-centro-estetica-laser --remote
```

## Secretos

Opcional para consultar solicitudes por API administrativa:

```bash
npx.cmd wrangler secret put ADMIN_TOKEN
```

Endpoint protegido:

```text
/api/admin/appointments?token=TOKEN
```

## Desarrollo y validación

```bash
npx.cmd wrangler dev
node --check app.js
node --check worker.js
npx.cmd wrangler deploy --dry-run
```

## Deploy

```bash
npx.cmd wrangler deploy --keep-vars
```
