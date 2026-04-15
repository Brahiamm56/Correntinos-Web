# TODO Tecnico - Fundacion Correntinos

Este archivo define el orden de ejecucion para que Claude construya el sitio de punta a punta sin ambiguedades.

## 0) Preparacion inicial

- [ ] Confirmar que existe `context.md` en raiz.
- [ ] Confirmar skills activas en `.claude/skills`.
- [ ] Confirmar referencia GSAP en `.claude/vendor/GSAP`.
- [ ] Definir branch de trabajo para desarrollo inicial.

## 1) Setup del proyecto (base tecnica)

### Objetivo
Tener un proyecto Next.js listo para desarrollar paginas institucionales.

### Prompt sugerido para Claude

```text
Lee context.md y crea la base del proyecto con Next.js (ultima estable), TypeScript y Tailwind.
Configura App Router, layout principal, tipografia base, paleta inicial y estructura de carpetas escalable.
No implementes aun contenido final, solo la base tecnica y UI shell.
```

### Entregables esperados

- [ ] Proyecto Next.js inicializado.
- [ ] Estructura de carpetas clara (`app`, `components`, `content`, `lib`).
- [ ] Layout global responsive.
- [ ] Header y footer base.
- [ ] Tokens basicos de estilo.

## 2) Arquitectura de contenido (MDX/Blog)

### Objetivo
Dejar Blog/Noticias funcional con contenido local.

### Prompt sugerido para Claude

```text
Implementa Blog/Noticias usando contenido MDX local.
Crea listado de posts y pagina de detalle por slug.
Agrega campos de metadata (titulo, fecha, resumen, cover opcional).
```

### Entregables esperados

- [ ] Sistema MDX operativo.
- [ ] Ruta de listado de noticias.
- [ ] Ruta de detalle por noticia.
- [ ] Datos de ejemplo para poder visualizar flujo completo.

## 3) Construccion de secciones del sitio

### Objetivo
Implementar las 5 secciones requeridas por cliente.

### Prompt sugerido para Claude

```text
Construye las paginas finales del sitio:
Inicio, Quienes somos, Blog/Noticias, Contacto, Trabaja con nosotros.
El tono debe ser institucional, confiable y claro.
No agregar formulario en Contacto; solo datos directos y redes.
```

### Entregables esperados

- [ ] `Inicio` con propuesta de valor y CTA institucional.
- [ ] `Quienes somos` con mision, vision, valores y bloque de equipo.
- [ ] `Blog/Noticias` conectado al contenido MDX.
- [ ] `Contacto` sin formulario.
- [ ] `Trabaja con nosotros` con llamado claro a postulacion.

## 4) Animaciones con GSAP

### Objetivo
Sumar motion de calidad sin perder performance ni accesibilidad.

### Prompt sugerido para Claude

```text
Usa la skill gsap-web-animation y agrega animaciones con GSAP en:
hero principal, entrada de secciones y transiciones por scroll.
Incluye fallback para prefers-reduced-motion.
Evita animaciones costosas y limpia correctamente listeners/triggers.
```

### Entregables esperados

- [ ] Animaciones fluidas en secciones clave.
- [ ] Uso correcto de timelines/triggers.
- [ ] Compatibilidad con reduced motion.
- [ ] Sin fugas por falta de cleanup.

## 5) SEO, calidad y performance

### Objetivo
Dejar el sitio listo para deploy productivo.

### Prompt sugerido para Claude

```text
Optimiza SEO tecnico y performance del sitio.
Configura metadata por pagina, Open Graph, robots, sitemap y buenas practicas de accesibilidad.
Verifica Core Web Vitals y corrige problemas criticos.
```

### Entregables esperados

- [ ] Metadata completa por pagina.
- [ ] Open Graph y social previews.
- [ ] `robots.txt` y `sitemap`.
- [ ] Buen baseline de Lighthouse / Web Vitals.
- [ ] Accesibilidad AA en componentes clave.

## 6) Deploy en Vercel

### Objetivo
Publicar una primera version estable.

### Prompt sugerido para Claude

```text
Prepara el proyecto para deploy en Vercel.
Valida build de produccion, variables necesarias y rutas.
Deja checklist de verificacion post-deploy.
```

### Entregables esperados

- [ ] Build de produccion sin errores.
- [ ] Deploy funcional en Vercel.
- [ ] Checklist post deploy completado.

## 7) Backlog v2 (cuando activen socios/donaciones)

- [ ] Evaluar migracion a Supabase (Auth + DB + Storage).
- [ ] Diseñar flujo de socios y aportes.
- [ ] Definir panel admin para contenidos y gestion.
- [ ] Integracion de pasarela de pago segun requerimiento legal/fiscal.

## Checklist final de cierre

- [ ] Requisitos del cliente cubiertos.
- [ ] Sitio en espanol completo.
- [ ] Sin formularios (segun pedido actual).
- [ ] Arquitectura preparada para escalar.
- [ ] Documentacion minima lista (`context.md` + `todo.md`).
