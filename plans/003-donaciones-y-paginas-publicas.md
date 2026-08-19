# Plan 003: Rediseñar donaciones y unificar las páginas públicas sin promesas engañosas

> **Instrucciones para el ejecutor**: ejecutar después de 001 y 002. No integrar cobros ni transmitir datos. Preservar el contenido institucional existente salvo correcciones de claridad justificadas.
>
> **Control de deriva inicial**: `git diff --stat 6c24379..HEAD -- src/app/donaciones src/app/quienes-somos/page.tsx src/app/contacto/page.tsx src/app/trabaja-con-nosotros/page.tsx src/app/noticias src/app/tienda`

## Estado

- **Prioridad**: P1
- **Esfuerzo**: L
- **Riesgo**: MEDIO
- **Depende de**: 001, 002
- **Categoría**: UX / correctness / direction
- **Planificado en**: commit `6c24379`, 2026-08-19, con árbol de trabajo sucio

## Por qué importa

La página de donaciones crea la expectativa de un pago inmediato, pero el CTA navega a Contacto. También afirma una distribución 65/25/10 y que 100% vuelve al territorio sin enlazar una fuente. En una organización que pide apoyo económico, la claridad operativa y la rendición de cuentas pesan más que cualquier efecto visual.

## Estado actual

- `src/app/donaciones/DonacionesClient.tsx:71-73` presenta un enlace rotulado “Donar $…” cuyo `href` es `/contacto`.
- `src/app/donaciones/DonacionesClient.tsx:14-18` codifica porcentajes 65/25/10.
- `src/app/donaciones/DonacionesClient.tsx:87` afirma “100% del aporte vuelve al territorio”.
- `src/app/api/mercadopago/route.ts` crea preferencias para `items`, `orden_id` y retorno de tienda; no existe flujo específico de donación.
- Las páginas Quiénes somos, Contacto y Trabajá usan varios degradados de entrada/salida y `.glass-card` (`quienes-somos:44,65,76,91,103,117,171`; `contacto:46,73,94`; `trabaja:50,92,139,163`).
- `src/app/noticias/NoticiasClient.tsx:27` usa otro degradado vertical para unir hero con contenido.
- Investigación externa: Greenpeace Argentina explica modalidad, seguridad, independencia y reportes antes de pedir el aporte; Rainforest Trust coloca transparencia y reportes auditables junto a la propuesta; la literatura de UX de donación recomienda montos ligados a impacto, recurrencia visible, pocos campos y señales de confianza.

## Comandos

| Propósito | Comando | Resultado esperado |
|-----------|---------|--------------------|
| Tipos | `pnpm exec tsc --noEmit` | exit 0 |
| Lint enfocado | `pnpm exec eslint src/app/donaciones src/app/quienes-somos/page.tsx src/app/contacto/page.tsx src/app/trabaja-con-nosotros/page.tsx src/app/noticias src/app/tienda` | exit 0 para los archivos tocados |
| Build | `pnpm build` | exit 0 |
| Promesas no respaldadas | `rg -n '100% del aporte|pct: 65|pct: 25|pct: 10' src/app/donaciones` | sin resultados, salvo que exista una fuente real enlazada y aprobada |

## Alcance

**Dentro del alcance**:

- `src/app/donaciones/page.tsx`
- `src/app/donaciones/DonacionesClient.tsx`
- `src/app/quienes-somos/page.tsx`
- `src/app/contacto/page.tsx`
- `src/app/trabaja-con-nosotros/page.tsx`
- Listado/detalle de Noticias y Tienda solo para unificar cabeceras, acciones, estados vacíos y superficies.

**Fuera del alcance**:

- Crear un checkout de donaciones.
- Modificar el endpoint Mercado Pago de tienda.
- Inventar reportes, CUIT, certificaciones, aliados, porcentajes o testimonios.
- Cambiar lógica de pedidos, carrito o autenticación.

## Flujo de Git

- Rama sugerida: `codex/003-donaciones-publico` tras proteger el árbol sucio.
- Mensaje sugerido: `feat: clarify giving flow and unify public pages`.
- No publicar sin instrucción explícita.

## Pasos

### 1. Hacer honesto el flujo de aporte

Hasta que exista un procesador real, cambiar el lenguaje de “Donar ahora” por “Coordinar mi aporte”. Al seleccionar un monto, la siguiente pantalla/acción debe explicar que la fundación confirma el medio de pago por contacto. Se puede enlazar a Contacto o abrir email/WhatsApp con texto prellenado que incluya solo el monto elegido; no solicitar datos personales dentro del sitio.

Mantener el selector como grupo de radio accesible. Visualmente, usar una lista horizontal/vertical con números grandes y una línea de selección, no cuatro cajas. La selección debe indicarse con texto/ícono además de color. “Otro monto” debe usar `type="number"`, límites coherentes y ayuda sobre moneda ARS.

**Verificar**: ningún enlace dice “Donar” si solo navega a Contacto; el grupo funciona con teclado y anuncia la selección.

### 2. Reemplazar afirmaciones financieras por transparencia verificable

Quitar porcentajes y la promesa “100%” si no existe un reporte público real. Sustituir por una sección “Qué hace posible tu aporte” con los programas ya mencionados y otra “Cómo cuidamos tu confianza” que explique el proceso sin cifras. Añadir un espacio de enlace a reporte anual únicamente si hay URL real en configuración/contenido.

No mostrar sellos de seguridad o logos de pago mientras no haya pago integrado.

**Verificar**: búsqueda de las promesas antiguas sin resultados; no existen badges de seguridad falsos.

### 3. Convertir Quiénes somos en evidencia institucional

Usar una cabecera sólida y breve. Presentar misión y visión en dos columnas abiertas, separadas por tipografía/línea, no tarjetas. Valores como lista editorial numerada. El equipo debe tener jerarquía y rol sin avatares inventados. La línea de tiempo debe usar años como anclas tipográficas y una línea continua, sin medallones ni degradados.

**Verificar**: no hay `.glass-card`, sombras o `rounded-2xl` en contenido institucional; todos los hitos siguen presentes.

### 4. Simplificar Contacto y Trabajá con nosotros

Contacto: una sola pregunta principal, datos directos, horarios si existen y dos canales prioritarios. No hacer que teléfono, email, Instagram y WhatsApp parezcan cuatro productos. Trabajá: oportunidades en filas abiertas; proceso en pasos conectados por una línea; CTA final con un canal principal y otro secundario como enlace.

Mantener áreas táctiles de 44 px y textos de enlace descriptivos.

**Verificar**: a 390 px no hay dos CTAs llenos compitiendo; cada ruta tiene un solo `h1`.

### 5. Unificar cabeceras y estados de Noticias/Tienda

Reutilizar el patrón editorial del home: fondo sólido, titular, breve contexto y herramienta (buscar/filtrar) claramente separada. No usar degradado de oscuro a crema. Estados vacíos deben ser compactos y accionables, sin grandes cajas punteadas.

En Tienda, conservar las tarjetas de producto porque son unidades comerciales reales, pero reducir bordes, sombras y etiquetas. Las categorías pueden ser controles segmentados simples; no píldoras decorativas. Aclarar que la compra apoya a la fundación solo si esa relación está confirmada por el negocio.

**Verificar**: búsquedas/filtros conservan su lógica; no hay regresiones de carrito.

## Plan de pruebas

- Donaciones: cuatro montos, monto personalizado vacío/válido/inválido, teclado, lector de pantalla y CTA resultante.
- Público: 390, 768 y 1440 px; zoom 200%; contraste AA.
- Noticias: 0, 1 y 7 elementos; búsqueda sin resultados; cargar más.
- Tienda: 0 productos, producto sin imagen, sin stock, categorías largas.
- Confirmar que ningún enlace promete una transacción que no ocurre.

## Criterios de finalización

- [ ] El CTA de aporte describe correctamente que se coordina el pago.
- [ ] No quedan porcentajes/promesas financieras sin fuente.
- [ ] Donaciones es usable con teclado y no depende solo del color.
- [ ] Quiénes somos, Contacto y Trabajá ya no se componen como conjuntos de tarjetas.
- [ ] No hay degradados verticales entre cabecera y cuerpo.
- [ ] Noticias y Tienda conservan búsquedas, filtros y estados funcionales.
- [ ] TypeScript, lint enfocado y build pasan.

## Condiciones STOP

- El cliente confirma que ya existe un checkout de donaciones externo no documentado.
- Aparece un reporte real que justifica las cifras actuales; detenerse para decidir cómo citarlo.
- Un cambio visual requiere modificar pedidos, pagos o esquema de datos.
- Se necesita borrar contenido institucional aprobado.

## Mantenimiento

Cuando exista pago real, crear un plan separado que cubra monto, periodicidad, consentimiento, recibo, seguridad, estados de retorno y administración de donaciones. No reutilizar a ciegas el checkout de tienda.

