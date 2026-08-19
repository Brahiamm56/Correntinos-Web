# Plan 004: Convertir el panel admin en una herramienta operativa clara y confiable

> **Instrucciones para el ejecutor**: preservar la migración Drizzle/Better Auth existente. Antes de diseñar, confirmar qué rutas administrativas se usan realmente y no eliminar pantallas accesibles sin reemplazo.
>
> **Control de deriva inicial**: `git diff --stat 6c24379..HEAD -- src/app/admin src/components/admin src/app/page.tsx src/components/Footer.tsx src/components/Header.tsx`

## Estado

- **Prioridad**: P1
- **Esfuerzo**: L
- **Riesgo**: ALTO
- **Depende de**: 001
- **Categoría**: correctness / UX / architecture
- **Planificado en**: commit `6c24379`, 2026-08-19, con árbol de trabajo sucio

## Por qué importa

El admin actual es una colección de tarjetas blancas y tablas de escritorio, con feedback mediante `alert/confirm`. Algunas métricas son incorrectas y Configuración guarda valores que el sitio público no consume. El rediseño debe priorizar tareas pendientes, edición rápida, estados claros, móvil usable y prevención de errores.

## Estado actual

- `src/app/admin/page.tsx:14-25` consulta cinco órdenes recientes y cinco noticias recientes; `:23-24` calcula “Pendientes” filtrando solo esas cinco y muestra “Noticias” como longitud del último lote. Ambos valores pueden ser falsos.
- `src/app/admin/page.tsx:41,58,94` usa el mismo patrón `bg-white rounded-xl ... shadow-sm` para toda la información.
- `src/app/admin/layout.tsx:60` rotula la herramienta “Admin Panel” y el menú móvil no tiene `aria-label` ni gestión de foco.
- `src/app/admin/noticias/NoticiasAdminList.tsx:15,33,36` y `ProductosAdminList.tsx:27,34,37` usan `alert()` y `confirm()`.
- `src/components/admin/Drawer.tsx:60-61` declara diálogo modal, pero no enfoca el título/primer control, no atrapa foco ni lo devuelve al disparador.
- `src/components/admin/RichEditor.tsx:77` usa `document.execCommand`, API obsoleta, y su toolbar no expone estados activos.
- `src/app/admin/configuracion/page.tsx` edita email, teléfono y texto home, pero la búsqueda global muestra que esos campos no se consumen en ninguna página pública.
- `ProductosAdminList.tsx` y `NoticiasAdminList.tsx` no tienen importadores; las páginas actuales implementan su propia UI, señal de duplicación residual.
- `pnpm lint` falla en el admin por JSX dentro de `try/catch`, tipos `any` y otros problemas.

## Comandos

| Propósito | Comando | Resultado esperado |
|-----------|---------|--------------------|
| Tipos | `pnpm exec tsc --noEmit` | exit 0 |
| Lint admin | `pnpm exec eslint src/app/admin src/components/admin` | exit 0 |
| Build | `pnpm build` | exit 0 |
| Código muerto | `rg -n 'ProductosAdminList|NoticiasAdminList' src --glob '*.tsx'` | solo definiciones antes de borrarlas; cero resultados después |
| Configuración | `rg -n 'texto_home|email_fundacion|telefono_fundacion' src` | cada campo tiene escritura y al menos una lectura pública, o fue retirado de la UI |

## Alcance

**Dentro del alcance**:

- Todo `src/app/admin/`.
- Todo `src/components/admin/`.
- Lecturas públicas mínimas necesarias para que Configuración sea real.
- Componentes administrativos compartidos nuevos.

**Fuera del alcance**:

- Cambios de proveedor de base de datos/autenticación.
- Nuevas funciones de negocio como cupones, envíos o CRM.
- Métricas financieras nuevas que requieran definiciones no acordadas.
- Borrar datos, migrar tablas o tocar secretos.

## Flujo de Git

- Rama sugerida: `codex/004-admin-operativo` tras proteger el árbol sucio.
- Commits lógicos: base de layout; dashboard; listados; formularios/feedback; configuración.
- No publicar ni ejecutar migraciones de datos sin instrucción explícita.

## Pasos

### 1. Crear una base administrativa sobria

Definir tokens admin derivados de 001, con tipografía de interfaz para cuerpos y serif solo en títulos de página pequeños. Sidebar más estrecha, marca real, texto “Gestión Correntinos” y navegación por tarea. En móvil, usar una barra superior con título de la sección y botón etiquetado. Implementar foco, Escape y scroll lock correctamente.

Evitar encerrar cada bloque: agrupar con espacio, subtítulos y divisores. Reservar superficies delimitadas para tablas, formularios, diálogos y métricas que realmente necesitan comparación.

**Verificar**: navegación completa a 390 px y 1440 px; foco no sale del menú móvil abierto.

### 2. Corregir y rediseñar el dashboard

Separar consultas de datos del JSX para resolver el lint de React. Consultar conteos reales de órdenes, pendientes y noticias; no inferirlos de los últimos cinco. Etiquetar ingresos como “Ventas registradas” y aclarar el período (“histórico” si es todo). Mostrar primero “Requiere atención” con pedidos pendientes y luego actividad reciente. Añadir accesos rápidos de texto: nueva noticia, nuevo producto, ver pedidos.

No usar cuatro tarjetas idénticas con iconos de colores. Usar números sobre una línea base y una lista operativa.

**Verificar**: con más de cinco pendientes, la métrica coincide con la consulta total; con cero datos hay estado vacío útil.

### 3. Unificar listados y hacerlos responsive

Crear patrones compartidos para encabezado, buscador/filtros, tabla/lista, estado, acciones y paginación futura. En móvil, transformar cada fila en una lista de pares etiqueta/valor sin scroll horizontal; en escritorio conservar tablas semánticas. Acciones destructivas deben tener texto accesible y no depender de iconos.

Eliminar `ProductosAdminList.tsx` y `NoticiasAdminList.tsx` solo tras confirmar que no tienen importadores y que sus capacidades están en las páginas vivas.

**Verificar**: productos, noticias y pedidos se gestionan a 390 px; los encabezados de tabla se asocian a celdas.

### 4. Reemplazar alerts y reforzar edición

Implementar feedback inline/toast con región `aria-live`; errores junto al contexto y éxito no intrusivo. Reemplazar `confirm()` con diálogo accesible que nombre el elemento, explique la consecuencia y enfoque “Cancelar” por defecto. Drawer debe atrapar foco, cerrarse con Escape, devolver foco al disparador y exponer título mediante `aria-labelledby`.

En formularios, agrupar “Información”, “Inventario/variantes”, “Publicación” y “Imagen” con encabezados y divisores, no tarjetas anidadas. Mantener guardado siempre visible en drawer largo.

**Verificar**: no quedan `alert(` o `confirm(` en admin; recorrido teclado completo.

### 5. Hacer real Configuración

Elegir explícitamente para cada campo:

- Email y teléfono: consumirlos en Footer/Contacto y canales de donación, con fallback seguro.
- Texto home: consumirlo en el hero/manifiesto solo si el producto realmente quiere edición dinámica; de lo contrario quitarlo de Configuración para no vender una capacidad falsa.

Mostrar una nota “Dónde aparece” y enlace “Ver en sitio”. No añadir opciones sin consumidor.

**Verificar**: cada campo visible en admin produce un cambio observable en una ruta pública o deja de existir en el formulario.

### 6. Dejar el admin sin deuda bloqueante de lint

Eliminar casts `any` con tipos derivados del esquema, mover JSX fuera de `try/catch` y usar funciones de carga que devuelvan datos/estado. Revisar el editor: si se mantiene `execCommand`, documentar la deuda y mejorar estados/foco; preferir un editor mantenido solo si la dependencia y el tamaño están justificados. No migrar editor a mitad de este plan sin prueba de contenido HTML existente.

**Verificar**: `pnpm exec eslint src/app/admin src/components/admin` y `pnpm exec tsc --noEmit` → exit 0.

## Plan de pruebas

- Roles: anónimo redirige a login; admin accede; usuario no admin no accede.
- Datos: 0/1/20 noticias, productos y pedidos; texto largo; imagen ausente; stock 0; pedido pendiente/procesado.
- Acciones: crear, editar, publicar/ocultar, eliminar/cancelar, exportar CSV.
- Viewports 390, 768 y 1440 px; zoom 200%.
- Teclado: sidebar, tablas, drawer, confirmación, editor, upload.
- Confirmar que no se ejecutan migraciones ni operaciones destructivas durante pruebas visuales.

## Criterios de finalización

- [ ] Métricas del dashboard se calculan sobre el conjunto correcto.
- [ ] El admin no es una cuadrícula de tarjetas repetidas.
- [ ] Listados son utilizables sin scroll horizontal a 390 px.
- [ ] No quedan `alert()` ni `confirm()`.
- [ ] Drawer y menú gestionan foco y Escape.
- [ ] Cada opción de Configuración tiene un efecto público real.
- [ ] No quedan listas administrativas duplicadas sin uso.
- [ ] TypeScript, lint admin y build pasan.

## Condiciones STOP

- No se puede determinar qué ruta administrativa es la canónica.
- Hacer consumible Configuración exige cambiar el esquema o migrar datos.
- Las métricas necesitan reglas de negocio no documentadas (por ejemplo, qué estados cuentan como venta).
- El editor existente contiene HTML que el reemplazo propuesto no preserva.
- La autenticación local requiere credenciales no disponibles; continuar con código y pruebas públicas, pero marcar QA autenticado como bloqueado.

## Mantenimiento

El admin debe optimizar frecuencia y riesgo, no verse como el sitio público. Antes de añadir una tarjeta o métrica, definir qué decisión permite tomar y cuál es su fuente.

