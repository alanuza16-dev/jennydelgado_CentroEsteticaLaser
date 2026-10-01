# Jenny Delgado Centro Estética Laser

Sitio estético independiente para Jenny Delgado. Mantiene su propia marca y catálogo en Cloudflare Workers. Las citas se coordinan por WhatsApp.

## Flujo productivo

- `index.html`: landing usable con tratamientos, tecnología Fotona, videos y precios.
- `agenda.html`: formulario de contacto que prepara un mensaje al WhatsApp `+506 8884 0452`; no asigna fecha ni hora.
- `login.html`, `admin.html`, `citas.html`: handoffs seguros sin usuarios locales ni agenda en navegador.
- `worker.js`: catálogo y consulta administrativa histórica protegida. Las rutas públicas antiguas de disponibilidad y creación de citas devuelven 410.
- `migrations/0001_create_appointments.sql`: tablas D1 de solicitudes históricas y bloqueos, conservadas sin nuevos registros desde el formulario.

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
