# Jenny Delgado Centro Estética Láser

Sitio demo estático en HTML, CSS y JavaScript para separar la experiencia de estética láser del sitio ginecológico de Dr. Carazo.

Incluye:

- Página pública para Centro Estética Láser.
- Tratamientos FOTONA con videos informativos.
- Agenda local para valoraciones y tratamientos estéticos.
- Perfil de cliente y resumen de citas agendadas.
- Panel administrador para bloquear espacios, revisar citas y cancelar citas demo.
- Persistencia local con `localStorage`.

## Accesos demo

- Cliente: `test` / `123456`
- Administrador estética: `admin1` / `123456`

## Ejecutar local

Abra `index.html` directamente en el navegador o sirva la carpeta con cualquier servidor estático.

```bash
npx serve .
```

## Cloudflare Pages

Configuración recomendada:

- Framework preset: `None`
- Build command: dejar vacío
- Build output directory: `/`
- Root directory: `/`

## Producción

Para convertir este demo en producto real hace falta conectar:

- Base de datos para citas, bloqueos y usuarios.
- Autenticación real.
- Notificaciones por correo, WhatsApp o SMS.
- Reglas de disponibilidad por servicio.
- Políticas de privacidad y consentimiento.
