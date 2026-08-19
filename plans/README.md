# Planes de implementación

Generados por la skill `improve` el 2026-08-19 a partir del commit `6c24379` y del árbol de trabajo actual, que contiene una migración grande sin confirmar. Ejecutar en el orden indicado. Antes de tocar un archivo, cada ejecutor debe leer su plan completo, conservar los cambios existentes y actualizar el estado de su fila.

## Orden y estado

| Plan | Título | Prioridad | Esfuerzo | Depende de | Estado |
|------|--------|-----------|----------|------------|--------|
| 001 | Consolidar identidad visual y reparar el logo | P1 | M | — | DONE |
| 002 | Reconstruir el home como una narrativa de impacto | P1 | L | 001 | DONE |
| 003 | Rediseñar donaciones y unificar las páginas públicas | P1 | L | 001, 002 | DONE |
| 004 | Convertir el admin en una herramienta operativa clara | P1 | L | 001 | DONE |
| 005 | Establecer la barrera de calidad visual y accesible | P2 | M | 002, 003, 004 | DONE |

Estados válidos: `TODO`, `IN PROGRESS`, `DONE`, `BLOCKED: <motivo>` o `REJECTED: <motivo>`.

## Dependencias

- 001 fija tokens, tipografía, acciones, navegación y el logo; las demás pantallas deben construirse sobre esa base.
- 002 define la narrativa y las composiciones editoriales que 003 reutiliza en el resto del sitio.
- 004 comparte tokens con el sitio público, pero mantiene componentes administrativos propios.
- 005 se ejecuta al final para fijar los estados aprobados y evitar regresiones.

## Situación del repositorio

- El árbol de trabajo contiene 57 archivos versionados modificados, además de archivos nuevos de la migración Supabase → Drizzle/Neon y Better Auth. No limpiar, resetear ni reemplazar esos cambios.
- `pnpm exec tsc --noEmit` pasa en el estado auditado.
- `pnpm lint` falla con 30 errores y 1 advertencia, principalmente por JSX dentro de `try/catch`, tipos `any` y código administrativo. Cada plan debe usar lint enfocado en sus archivos; el plan 005 deja el lint global en cero.
- No hay suite de pruebas ni script `typecheck` en `package.json`.

## Hallazgos considerados y descartados

- Añadir más degradados, brillos, partículas o tarjetas: descartado porque amplifica la monotonía y contradice el pedido de una interfaz menos encerrada.
- Generar testimonios, porcentajes financieros o cifras nuevas: descartado porque no hay evidencia verificable en el repositorio.
- Reemplazar la identidad por una estética genérica de “ONG internacional”: descartado; la dirección debe seguir siendo Corrientes, Iberá, humedales y acción territorial.
- Integrar un proveedor de pagos dentro del rediseño visual: diferido. El endpoint de Mercado Pago actual está diseñado para órdenes de tienda, no para donaciones. Hasta contar con alcance financiero y legal, la interfaz debe describir honestamente que el aporte se coordina.
