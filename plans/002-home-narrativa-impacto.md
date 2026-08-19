# Plan 002: Reconstruir el home como una narrativa de impacto territorial

> **Instrucciones para el ejecutor**: ejecutar después del plan 001. Preservar la fotografía actual del hero y todos los cambios no confirmados del usuario.
>
> **Control de deriva inicial**: `git diff --stat 6c24379..HEAD -- src/app/page.tsx src/components/HeroScene.tsx src/components/ImpactSection.tsx src/components/DonationBanner.tsx src/components/ProductsCarousel.tsx`
> Luego leer `git diff --` para esos archivos. Detenerse si cambió la estructura descripta.

## Estado

- **Prioridad**: P1
- **Esfuerzo**: L
- **Riesgo**: MEDIO
- **Depende de**: `plans/001-identidad-visual-y-logo.md`
- **Categoría**: UX / direction / performance
- **Planificado en**: commit `6c24379`, 2026-08-19, con árbol de trabajo sucio

## Por qué importa

El hero es el tramo más fuerte del sitio, pero la tienda aparece inmediatamente después y corta la explicación de la causa. Luego se repiten encabezados enormes, cuadrículas y fondos conectados con degradados. El nuevo home debe llevar al visitante desde identidad → problema local → método → evidencia → historias → forma de participar, y recién después presentar la tienda como una vía secundaria.

## Estado actual

- `src/app/page.tsx:43-44` renderiza `<HeroScene />` y a continuación `<ProductsCarousel />`.
- `src/app/page.tsx:46`, `54` y `58`, `src/components/DonationBanner.tsx:14` y `src/components/ProductsCarousel.tsx:24` usan degradados verticales para disimular el cambio de fondo.
- `src/app/page.tsx:50` encierra cinco estadísticas en una cuadrícula uniforme.
- `src/components/ImpactSection.tsx` alterna tres imágenes y textos, pero el encabezado ocupa casi una pantalla en móvil.
- La inspección a 1440×900 mostró productos de prueba ajenos a la identidad de la fundación justo debajo del hero; a 390×844 compiten con la misión antes de construir confianza.
- La página usa ocho secciones y un solo `h1`; la estructura semántica base es válida.

## Dirección visual

- Editorial, territorial y serena; evitar la estética de dashboard o catálogo.
- Fondos sólidos con cortes limpios. Un solo tramo oscuro fuerte además del hero: donación o manifiesto, no ambos.
- Fotografías grandes y recortes horizontales; líneas finas inspiradas en cauces del Iberá como recurso vectorial/CSS, nunca como tarjetas.
- Jerarquía tipográfica con titulares de 2–4 líneas máximo y ancho controlado; no permitir palabras cortadas o titulares que ocupen más de 70% de una pantalla móvil.
- Acciones secundarias como enlaces subrayados; una sola acción primaria por bloque.

## Comandos

| Propósito | Comando | Resultado esperado |
|-----------|---------|--------------------|
| Tipos | `pnpm exec tsc --noEmit` | exit 0 |
| Lint enfocado | `pnpm exec eslint src/app/page.tsx src/components/HeroScene.tsx src/components/ImpactSection.tsx src/components/DonationBanner.tsx src/components/ProductsCarousel.tsx` | exit 0 |
| Build | `pnpm build` | exit 0 |
| Degradados viejos | `rg -n 'linear-gradient' src/app/page.tsx src/components/{HeroScene,ImpactSection,DonationBanner,ProductsCarousel}.tsx` | solo overlays de legibilidad del hero; cero transiciones entre secciones |

## Alcance

**Dentro del alcance**:

- `src/app/page.tsx`
- `src/components/HeroScene.tsx`
- `src/components/ImpactSection.tsx`
- `src/components/DonationBanner.tsx`
- `src/components/ProductsCarousel.tsx`
- Hasta dos componentes nuevos de home bajo `src/components/home/`.

**Fuera del alcance**:

- Cambiar datos, esquema o consultas de noticias/productos.
- Inventar cifras, aliados, testimonios o proyectos.
- Reemplazar `ibera-wetlands-hero.png`.
- Integrar pagos.

## Flujo de Git

- Rama sugerida: `codex/002-home-impacto` solo después de proteger el árbol sucio.
- Mensaje sugerido: `feat: rebuild home around territorial impact`.
- No publicar sin instrucción explícita.

## Pasos

### 1. Mantener el hero y mejorar su función

Conservar la foto, el titular y el tono, pero acortar el párrafo a una lectura inicial de 2–4 líneas y mover el detalle a la siguiente sección. La acción principal debe ser “Conocé nuestro trabajo” y la secundaria “Sumate” o “Doná”; no mandar primero a Noticias. El overlay puede usar un degradado horizontal únicamente para contraste de texto sobre foto; quitar el degradado blanco/menta inferior y terminar el hero con un corte limpio.

En móvil, mostrar la marca visible, una altura mínima razonable (no más de ~92svh), texto sin quedar bajo la cabecera y CTAs completamente visibles.

**Verificar**: capturas 390×844 y 1440×900; primer CTA visible sin scroll en escritorio y con no más de un scroll corto en móvil.

### 2. Insertar una franja abierta de credibilidad

Debajo del hero, presentar sin cajas tres hechos ya existentes: “Nacimos en Corrientes”, “90+ voluntarios en el NEA” y “Acción desde 2020”. Usar una línea continua y columnas tipográficas; no iconos dentro de cuadrados ni etiquetas. Si la cifra/año no coincide con los datos vivos del archivo, usar el dato existente del repo y no improvisar.

**Verificar**: sin clases `rounded-*`, `shadow-*` o fondos individuales dentro de la franja.

### 3. Reordenar la historia del home

Orden objetivo:

1. Hero.
2. Franja de credibilidad.
3. Manifiesto local: problema de Corrientes + respuesta de la fundación.
4. Tres áreas de impacto en una composición editorial más compacta.
5. Evidencia numérica.
6. Noticias/historias del territorio.
7. Invitación a donar o sumarse.
8. Tienda como vía secundaria de apoyo, solo si hay productos.

El manifiesto puede usar un fondo bosque sólido, sin “fade” desde el bloque anterior. Combinar titular y texto en una retícula asimétrica, con una línea vertical solo como recurso de lectura.

**Verificar**: `ProductsCarousel` aparece después de `DonationBanner` o del bloque de participación en el JSX.

### 4. Compactar las áreas de impacto

Mantener las tres áreas y sus imágenes, pero evitar tres filas idénticas. Usar una imagen dominante y dos historias secundarias, o una secuencia 40/60 con variación real. Los números 01–03 deben integrarse como tipografía editorial, no como etiquetas blancas. Limitar animaciones a revelado y parallax sutil; desactivar movimiento en móvil si afecta lectura.

**Verificar**: a 390 px ningún titular se recorta; las imágenes tienen `sizes` correctos y alt significativo.

### 5. Convertir métricas y donación en prueba y acción

Las métricas deben presentarse como una línea de rendición de cuentas, no cinco cajas. Evitar que el quinto ítem “Organizadores…” parezca un valor cero: mostrarlo como hito textual separado o reestructurar el tipo para que no renderice contador.

El bloque de donación debe decir qué se sostiene, por qué importa y qué ocurre al continuar. No mostrar montos como mini tarjetas en el home; dejar solo dos o tres ejemplos inline y un enlace claro a Donaciones.

**Verificar**: no aparece visualmente “0 Organizadores”; solo un CTA primario en el bloque.

### 6. Resolver estados de contenido sin duplicar peso visual

Si no hay noticias, mostrar una línea editorial breve con enlace a Instagram o a conocer proyectos, no una gran caja vacía. Si no hay productos, ocultar por completo la tienda destacada (comportamiento actual válido). No presentar contenido de prueba como prueba de impacto.

**Verificar**: con arrays vacíos el home conserva ritmo y no renderiza contenedores vacíos con borde punteado.

## Plan de pruebas

- Datos con 0 y con 3 noticias; 0, 2 y 4 productos.
- Viewports: 390, 768, 1024, 1440 px.
- Reduced motion habilitado y deshabilitado.
- Recorrido teclado por todos los enlaces.
- Revisar LCP: hero sigue con `priority`; imágenes inferiores son lazy.
- Confirmar no hay scroll horizontal ni saltos bruscos al cargar fuentes/imágenes.

## Criterios de finalización

- [ ] La tienda ya no aparece inmediatamente después del hero.
- [ ] No hay degradados de transición entre secciones.
- [ ] El home sigue una narrativa causa → método → evidencia → acción.
- [ ] No hay contenido editorial metido en tarjetas decorativas.
- [ ] “0 organizadores” no puede aparecer.
- [ ] Los estados vacíos no dominan una pantalla completa.
- [ ] TypeScript, lint enfocado y build pasan.

## Condiciones STOP

- Para mejorar la narrativa hay que inventar datos o testimonios.
- Las consultas nuevas exigirían cambios de esquema/base de datos.
- La fotografía del hero ya no coincide con `ibera-wetlands-hero.png`.
- El plan 001 no está ejecutado y todavía no existen los tokens/acciones base.

## Mantenimiento

La secuencia es una decisión de producto. Nuevos bloques solo deben entrar si aportan evidencia o una acción distinta; no agregar secciones por simetría. La tienda permanece subordinada a la misión.

