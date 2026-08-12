# Design System - Jenny Delgado Centro Estética Láser

## Principios

- Editorial, femenino, sofisticado y seguro.
- La marca debe sentirse como una clínica estética internacional, no como una plantilla.
- La agenda es parte de la experiencia de marca.
- Los precios se presentan como información editorial, no como menú económico.

## Paleta

- Crema: `#fffaf4`
- Papel cálido: `#f7f3ee`
- Tinta suave: `#23191d`
- Rosa principal: `#bd5677`
- Rosa suave: `#f4d7e1`
- Mulberry: `#693349`
- Verde grisáceo: `#6c725d`
- Dorado: `#b88a42`
- Negro editorial: `#181214`

Uso correcto: fondos claros cálidos, rosa como acento de acción, negro editorial para tecnología.  
Uso incorrecto: pantalla completamente rosa, gradientes saturados o apariencia infantil.

## Tipografía

- Display: Georgia/Iowan style para titulares editoriales.
- UI/body: Inter/system sans para formularios, navegación y lectura.
- H1 desktop: `clamp(58px, 8vw, 108px)`.
- H2 desktop: `clamp(34px, 5vw, 72px)`.

## Grid y Espaciado

- Grid conceptual de 12 columnas en desktop.
- Hero con imagen vertical y ficha editorial superpuesta.
- Secciones alternan entre escenas claras, tecnología oscura y listas compactas.
- Móvil rediseñado en secuencia vertical con CTAs claros.

## Botones

- Primario: rosa/mulberry, alto contraste y flecha direccional.
- Secundario: fondo transparente claro con borde refinado.
- Texto: línea animada.
- No usar píldoras para todos los botones; reservarlas para filtros/chips.

## Agenda

- Flujo por pasos: tratamiento, fecha, hora, datos.
- Resumen sticky en desktop.
- Precio y duración siempre visibles.
- Estados: carga, sin disponibilidad, error y éxito con copy humano.
- Confirmación final por equipo, sin lenguaje técnico.

## Tratamientos y Precios

- Un tratamiento destacado con imagen grande y metadata.
- Tratamientos secundarios en rail editorial.
- Precios exactos en CRC.
- No prometer resultados.

## Imágenes

- Hero: retrato vertical o cabina, luz difusa, espacio negativo para tipografía.
- Tecnología: fondo oscuro, detalle láser, piel/cabina sin saturar.
- Antes/después: mostrar solo con consentimiento; no usar placeholders falsos.

## Movimiento

- Reveal suave por scroll.
- Hover de 2 a 4 px.
- Header compacto al hacer scroll.
- Respetar `prefers-reduced-motion`.

## Accesibilidad

- Formularios con labels persistentes.
- Navegación móvil con `aria-expanded`.
- Contraste suficiente en tecnología y hero.
- Botones reales para videos y acciones.
