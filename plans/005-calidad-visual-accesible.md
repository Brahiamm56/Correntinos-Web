# Plan 005: Establecer una barrera de calidad visual, responsive y accesible

> **Instrucciones para el ejecutor**: ejecutar una vez aprobadas visualmente las implementaciones 001–004. Este plan puede añadir dependencias de desarrollo, pero no debe tocar lógica de negocio.
>
> **Control de deriva inicial**: `git diff --stat 6c24379..HEAD -- package.json pnpm-lock.yaml eslint.config.mjs src`

## Estado

- **Prioridad**: P2
- **Esfuerzo**: M
- **Riesgo**: BAJO
- **Depende de**: 002, 003, 004
- **Categoría**: tests / DX / accessibility
- **Planificado en**: commit `6c24379`, 2026-08-19, con árbol de trabajo sucio

## Por qué importa

Hoy no existe un comando de pruebas y el lint global falla. Un rediseño amplio sin cobertura visual/responsive tiende a degradarse con cada cambio de contenido. La barrera mínima debe comprobar navegación, logo, jerarquía, overflow, estados de donación y panel, además de WCAG 2.2 básico.

## Estado actual

- `package.json` solo define `dev`, `build`, `start`, `lint`, `db:push` y `seed`.
- `pnpm exec tsc --noEmit` pasa.
- `pnpm lint` falla con 30 errores y 1 warning en el estado auditado.
- No hay archivos de test ni configuración Playwright/Vitest.
- Next 16 incluye guía local en `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`.
- WCAG 2.2 agrega foco no oculto, tamaño mínimo de objetivo y autenticación accesible; estos flujos son relevantes para cabecera, donación y admin.

## Comandos

| Propósito | Comando | Resultado esperado |
|-----------|---------|--------------------|
| Tipos | `pnpm typecheck` | exit 0 |
| Lint | `pnpm lint` | exit 0, sin warnings |
| E2E público | `pnpm test:e2e --project=public` | todas pasan |
| E2E admin | `pnpm test:e2e --project=admin` | todas pasan o proyecto documentadamente omitido sin fixture segura |
| Build | `pnpm build` | exit 0 |

## Alcance

**Dentro del alcance**:

- `package.json`, `pnpm-lock.yaml`, configuración de pruebas.
- Tests E2E y helpers bajo `tests/`.
- Correcciones pequeñas descubiertas por las pruebas en archivos de UI.
- Limpieza de errores de lint restantes.

**Fuera del alcance**:

- Cambios visuales nuevos no aprobados.
- Seeds con credenciales o datos reales.
- Tests que realicen pagos, envíen mensajes o borren datos reales.

## Flujo de Git

- Rama sugerida: `codex/005-ui-quality-gate`.
- Mensaje sugerido: `test: add responsive and accessibility quality gate`.
- No actualizar snapshots de forma automática ante fallas; revisar el cambio visual primero.

## Pasos

### 1. Crear comandos reproducibles

Añadir `typecheck`, `test:e2e` y variantes por proyecto. Instalar Playwright como dependencia de desarrollo siguiendo la guía local de Next 16. Añadir una herramienta de accesibilidad automatizada solo si no duplica dependencias y puede ejecutarse establemente.

**Verificar**: los cuatro comandos de la tabla existen y muestran ayuda/ejecutan sin configuración faltante.

### 2. Cubrir rutas públicas críticas

Tests mínimos para `/`, `/quienes-somos`, `/noticias`, `/tienda`, `/donaciones`, `/contacto`, `/trabaja-con-nosotros`, login y registro:

- exactamente un `h1` y título de documento descriptivo;
- logo PNG visible y referencia directa, no SVG intermediario;
- navegación usable por teclado;
- sin overflow horizontal en 390, 768 y 1440 px;
- objetivos primarios con tamaño mínimo;
- donación anuncia modalidad de coordinación y selección;
- estados vacíos y con contenido no rompen layout.

**Verificar**: `pnpm test:e2e --project=public` → todas pasan.

### 3. Añadir aserciones accesibles

Ejecutar checks automáticos WCAG AA en cada plantilla principal, más pruebas manuales codificadas donde la automatización no alcanza: foco visible sobre hero/fondo claro, menú modal con foco contenido, reduced motion, etiquetas de formulario, mensajes `aria-live` y selección no dependiente del color.

**Verificar**: cero violaciones críticas/serias; excepciones documentadas con motivo y issue.

### 4. Cubrir admin sin usar datos reales

Preferir fixtures locales o una capa de test aislada. Cubrir redirección de anónimo y, solo si existe un mecanismo seguro, dashboard, tabla responsive, drawer y confirmación. Nunca incluir credenciales en el repositorio. Si no hay fixture segura, mantener el proyecto admin con pruebas de componentes/estructura y documentar el bloqueo.

**Verificar**: ninguna prueba toca producción ni requiere secretos comprometidos.

### 5. Cerrar lint global y fijar la revisión visual

Corregir todos los errores restantes sin ampliar alcance funcional. Generar snapshots solo para plantillas estables y secciones críticas, con animaciones desactivadas y datos deterministas. No capturar páginas completas con ScrollTrigger activo; usar tramos de viewport para evitar artefactos de composición.

**Verificar**: `pnpm lint`, `pnpm typecheck`, `pnpm test:e2e` y `pnpm build` → exit 0.

## Plan de pruebas

- Navegadores: Chromium como mínimo; WebKit si el presupuesto lo permite.
- Viewports: 390×844, 768×1024, 1440×900.
- Preferencias: reduced motion y contraste normal.
- Datos: vacíos, largos, imágenes ausentes y montos personalizados.
- Revisión manual final en navegador para home, donaciones y admin autenticado.

## Criterios de finalización

- [ ] Existen scripts de typecheck y E2E documentados.
- [ ] Lint global queda en cero.
- [ ] Build y pruebas pasan en una ejecución limpia.
- [ ] Las rutas públicas críticas tienen smoke responsive.
- [ ] Logo, donación, foco, overflow y reduced motion están cubiertos.
- [ ] No hay secretos ni acceso a datos reales en tests.

## Condiciones STOP

- Las pruebas necesitan credenciales reales o una base productiva.
- Los snapshots no son deterministas por animaciones o datos vivos; desactivar/mokear de forma segura o reducir el alcance, no aceptar ruido.
- Corregir lint exige cambios de negocio no relacionados.
- Una dependencia de testing no soporta Next 16/React 19 documentadamente.

## Mantenimiento

Toda regresión visual debe reproducirse primero en una prueba pequeña. Actualizar snapshots solo cuando el cambio fue aprobado, nunca para “poner verde” la suite.

