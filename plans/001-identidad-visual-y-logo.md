# Plan 001: Consolidar la identidad visual y hacer visible el logo oficial

> **Instrucciones para el ejecutor**: trabajar paso a paso, ejecutar cada verificación y detenerse ante cualquiera de las condiciones STOP. Este repositorio tiene cambios del usuario sin confirmar; no usar reset, checkout destructivo ni reescrituras masivas.
>
> **Control de deriva inicial**: `git diff --stat 6c24379..HEAD -- src/app/globals.css src/components/Header.tsx src/components/Footer.tsx src/app/auth/login/page.tsx src/app/auth/register/page.tsx public/correntinos-logo.svg public/correntinos-logo.png`
> Después ejecutar `git status --short` y leer los diffs no confirmados de esos archivos. Si no coinciden con el estado descripto abajo, detenerse.

## Estado

- **Prioridad**: P1
- **Esfuerzo**: M
- **Riesgo**: MEDIO
- **Depende de**: ninguno
- **Categoría**: bug / UX / tech-debt
- **Planificado en**: commit `6c24379`, 2026-08-19, con árbol de trabajo sucio

## Por qué importa

La marca no aparece en cabecera, pie ni autenticación. Además, el sistema visual mezcla tipografía editorial, botones redondeados, tarjetas con sombra, cuadrículas y numerosos degradados sin una regla clara. La base nueva debe ser reconocible como Correntinos: institucional, territorial, cálida y precisa, con superficies abiertas y acciones discretas.

## Estado actual

- `public/correntinos-logo.png` es un PNG 1024×1024 válido con transparencia real.
- `public/correntinos-logo.svg:4` no contiene el logo: referencia externamente `href="/correntinos-logo.png"`. Los recursos externos de un SVG cargado como `<img>` no se pintan de forma fiable; la auditoría visual mostró la cabecera vacía.
- `src/components/Header.tsx:87`, `src/components/Footer.tsx:31`, `src/app/auth/login/page.tsx:71` y `src/app/auth/register/page.tsx:67` usan el SVG intermediario.
- `src/app/globals.css:94` oculta todas las etiquetas de sección con `display: none !important`.
- `src/app/globals.css:107-122` convierte `.glass-card` en una caja con borde, sombra y elevación, patrón que se repite en varias páginas.
- `src/app/globals.css:124-165` define todas las acciones como botones redondeados, aunque muchas son navegación secundaria.
- La guía local de Next 16 en `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` admite imágenes locales desde `/public` con `<Image src="/archivo.png">` y dimensiones explícitas.

## Comandos

| Propósito | Comando | Resultado esperado |
|-----------|---------|--------------------|
| Tipos | `pnpm exec tsc --noEmit` | exit 0 |
| Lint enfocado | `pnpm exec eslint src/app/globals.css src/components/Header.tsx src/components/Footer.tsx src/app/auth/login/page.tsx src/app/auth/register/page.tsx` | exit 0 |
| Build | `pnpm build` | exit 0 |
| Buscar referencias rotas | `rg -n 'correntinos-logo\.svg' src` | sin resultados |

## Alcance

**Dentro del alcance**:

- `src/app/globals.css`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/app/auth/login/page.tsx`
- `src/app/auth/register/page.tsx`
- `public/correntinos-logo.svg` (eliminar solo después de quitar todas sus referencias)
- `public/correntinos-logo.png` (no volver a editar el bitmap)
- Componentes visuales compartidos nuevos bajo `src/components/ui/`, solo si reducen repetición real.

**Fuera del alcance**:

- Cambiar la fotografía del hero.
- Rediseñar el contenido de cada página; corresponde a 002 y 003.
- Modificar autenticación o lógica de sesión.
- Regenerar el logo con IA o alterar su identidad.

## Flujo de Git

- Rama sugerida si el operador primero guarda la migración actual: `codex/001-identidad-logo`.
- Con el árbol sucio actual, no cambiar de rama automáticamente. Modificar únicamente los archivos en alcance.
- Mensaje sugerido: `fix: restore brand mark and visual foundations`.
- No publicar ni abrir PR sin instrucción explícita.

## Pasos

### 1. Reparar la marca en todas las superficies

Cambiar las cuatro referencias del SVG por `/correntinos-logo.png`. Mantener relaciones de aspecto cuadradas y `object-contain`; usar tamaños visuales de 44–56 px, pero permitir que la silueta se lea. En fondos oscuros, no crear un contenedor blanco ni una pastilla: usar el PNG transparente y ajustar el texto adyacente. El `alt` debe nombrar la fundación; si el texto contiguo ya contiene el nombre completo, usar `alt=""` para evitar duplicación en lectores de pantalla.

**Verificar**: `rg -n 'correntinos-logo\.svg' src` → sin resultados. En navegador, el PNG debe ser visible en home a 390 px y 1440 px.

### 2. Definir un sistema de superficies sin transiciones de color artificiales

En `globals.css`, conservar la paleta verde/dorado pero reducirla a roles claros: tinta, bosque, hoja, acento, papel, papel cálido, línea y texto secundario. Añadir tokens de ancho de lectura, ritmos verticales y radios pequeños. Prohibir degradados como transición entre secciones; las secciones usarán cortes directos entre `papel`, `papel cálido`, blanco y un único fondo bosque para momentos de énfasis.

La textura de ruido debe ser casi imperceptible y no crear una capa fija por encima de controles. Moverla a un pseudo-elemento no interactivo debajo del contenido o eliminarla si afecta legibilidad.

**Verificar**: `pnpm exec tsc --noEmit` → exit 0; inspección a 200% de zoom sin contenido tapado.

### 3. Separar acciones de navegación de botones de formulario

Definir tres patrones:

1. `action-link`: enlace de texto con subrayado/traZo y flecha, para navegación secundaria.
2. `action-primary`: fondo dorado o bosque, reservado para donar, confirmar o guardar.
3. `action-quiet`: texto sin caja para cancelar, volver o ver más.

No usar píldoras, chips ni tarjetas para contenido editorial. Los botones reales conservan un área táctil mínima de 44×44 px; los enlaces inline quedan exceptuados. El foco debe tener un contorno sólido de al menos 2 px y contraste suficiente sobre fondos claros y oscuros, siguiendo WCAG 2.2.

**Verificar**: navegar con Tab por cabecera, autenticación y pie; todo foco es visible y ninguna acción principal depende solo del color.

### 4. Simplificar cabecera y pie

La cabecera debe mostrar marca, navegación y una sola acción prioritaria (“Donar” o “Sumarme”), sin envolver cada enlace. En móvil, implementar cierre por Escape, devolver foco al disparador y evitar que el foco salga del menú abierto. En el pie, eliminar la repetición del gran CTA si la página ya termina con otro CTA y usar una composición editorial con marca, contacto y navegación en columnas separadas por espacio o líneas, no por cajas.

**Verificar**: a 390 px no hay scroll horizontal; a 1024/1440 px no hay saltos de la navegación; `pnpm exec eslint ...` → exit 0.

### 5. Ajustar las pantallas de acceso a la nueva base

Mostrar el PNG real, reducir la caja central a la mínima superficie necesaria para el formulario, dejar enlaces secundarios como texto y conservar los estados de error junto al campo o resumen, no como etiquetas decorativas.

**Verificar**: login y registro tienen un solo `h1`, etiquetas asociadas y foco visible; no cambia el comportamiento de Better Auth.

## Plan de pruebas

- Viewports manuales: 390×844, 768×1024, 1440×900.
- Rutas: `/`, `/auth/login`, `/auth/register`.
- Casos: transparente sobre hero, cabecera blanca después de scroll, menú móvil abierto/cerrado, usuario anónimo, carrito vacío.
- Confirmar `img[src$="correntinos-logo.png"]` visible y sin fondo opaco.
- Confirmar `prefers-reduced-motion: reduce` sin transiciones largas.

## Criterios de finalización

- [ ] No quedan referencias a `correntinos-logo.svg` bajo `src/`.
- [ ] La marca aparece en cabecera, pie, login y registro.
- [ ] No hay degradados de transición definidos en los componentes base.
- [ ] Las acciones secundarias ya no se presentan como botones llenos.
- [ ] Objetivos táctiles principales miden al menos 44×44 px.
- [ ] TypeScript, lint enfocado y build pasan.
- [ ] Solo se modificaron archivos dentro del alcance, además de actualizar este plan/índice.

## Condiciones STOP

- El PNG deja de tener transparencia o su contenido difiere del logo auditado.
- El cambio exige tocar lógica de autenticación, carrito o base de datos.
- Aparece una identidad oficial más reciente en el repositorio.
- Los diffs existentes de Header/Footer no coinciden con los extractos del plan.

## Mantenimiento

No volver a envolver el PNG dentro de un SVG externo. Si en el futuro se consigue el vector original, debe ser autocontenido (paths embebidos) y reemplazar al PNG tras una revisión visual, no mediante `<image href>`.

