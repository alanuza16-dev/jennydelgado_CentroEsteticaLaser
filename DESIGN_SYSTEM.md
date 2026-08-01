# Design System - Jenny Delgado Centro Estetica Laser

## Principios

- Editorial, femenino, sofisticado y seguro.
- La marca debe sentirse como una clinica estetica internacional, no como una plantilla.
- La agenda es parte de la experiencia de marca.
- Los precios se presentan como informacion editorial, no como menu economico.

## Paleta

- Crema: `#fffaf4`
- Papel calido: `#f7f3ee`
- Tinta suave: `#23191d`
- Rosa principal: `#bd5677`
- Rosa suave: `#f4d7e1`
- Mulberry: `#693349`
- Verde grisaceo: `#6c725d`
- Dorado: `#b88a42`
- Negro editorial: `#181214`

Uso correcto: fondos claros calidos, rosa como acento de accion, negro editorial para tecnologia.  
Uso incorrecto: pantalla completamente rosa, gradientes saturados o apariencia infantil.

## Tipografia

- Display: Georgia/Iowan style para titulares editoriales.
- UI/body: Inter/system sans para formularios, navegacion y lectura.
- H1 desktop: `clamp(58px, 8vw, 108px)`.
- H2 desktop: `clamp(34px, 5vw, 72px)`.

## Grid y Espaciado

- Grid conceptual de 12 columnas en desktop.
- Hero con imagen vertical y ficha editorial superpuesta.
- Secciones alternan entre escenas claras, tecnologia oscura y listas compactas.
- Movil redisenado en secuencia vertical con CTAs claros.

## Botones

- Primario: rosa/mulberry, alto contraste y flecha direccional.
- Secundario: fondo transparente claro con borde refinado.
- Texto: linea animada.
- No usar pildoras para todos los botones; reservarlas para filtros/chips.

## Agenda

- Flujo por pasos: tratamiento, fecha, hora, datos.
- Resumen sticky en desktop.
- Precio y duracion siempre visibles.
- Estados: carga, sin disponibilidad, error y exito con copy humano.
- Confirmacion final por equipo, sin lenguaje tecnico.

## Tratamientos y Precios

- Un tratamiento destacado con imagen grande y metadata.
- Tratamientos secundarios en rail editorial.
- Precios exactos en CRC.
- No prometer resultados.

## Imagenes

- Hero: retrato vertical o cabina, luz difusa, espacio negativo para tipografia.
- Tecnologia: fondo oscuro, detalle laser, piel/cabina sin saturar.
- Antes/despues: mostrar solo con consentimiento; no usar placeholders falsos.

## Movimiento

- Reveal suave por scroll.
- Hover de 2 a 4 px.
- Header compacto al hacer scroll.
- Respetar `prefers-reduced-motion`.

## Accesibilidad

- Formularios con labels persistentes.
- Navegacion movil con `aria-expanded`.
- Contraste suficiente en tecnologia y hero.
- Botones reales para videos y acciones.
