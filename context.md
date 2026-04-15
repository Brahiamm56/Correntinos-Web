# Contexto del Proyecto

## Cliente

- Nombre: Guido Paparella
- Organizacion: Fundacion Correntinos Contra el Cambio Climatico
- Email: correntinosclim@gmail.com
- Telefono: 3794059015
- Instagram: https://www.instagram.com/correntinosclim/
- Tipo de proyecto: Sitio corporativo institucional

## Objetivo del Sitio

Construir un sitio institucional moderno, confiable y claro para fortalecer la credibilidad de la fundacion, comunicar su propuesta socioambiental y preparar el terreno para un futuro programa de socios y donaciones.

## Stack Tecnologico Cerrado (v1)

### Base

- Framework: Next.js (ultima version estable, App Router)
- Runtime: Node.js 22 LTS
- Lenguaje: TypeScript
- Deploy y hosting: Vercel
- Estilos: Tailwind CSS
- Animaciones: GSAP
- Referencia local GSAP: `.claude/vendor/GSAP`

### Contenido

- CMS en v1: No
- Estrategia de contenido en v1: Markdown/MDX local para Blog/Noticias
- Idioma: Espanol unicamente

### Backend

- En v1: Sin backend dedicado (sin Supabase por ahora)
- Justificacion: no hay login, panel admin complejo ni formularios obligatorios
- En v2 (cuando activen socios/donaciones): evaluar Supabase (Auth + DB + Storage)

### SEO y analitica

- SEO tecnico: metadata por pagina, Open Graph, robots, sitemap
- Analitica base: Vercel Analytics

## Secciones Obligatorias

1. Inicio
2. Quienes somos
3. Blog / Noticias
4. Contacto (sin formulario, con datos de contacto y redes)
5. Trabaja con nosotros

## Requerimientos de Producto

- Sitio responsive (mobile-first).
- Diseno institucional con alto nivel de confianza.
- Performance y accesibilidad como prioridad.
- Sin formulario en esta etapa.
- Arquitectura preparada para escalar a socios/donaciones en una fase futura.

## Referencia Visual

- Sitio de referencia: https://www.greenpeace.org/argentina/
- Identidad actual: parcial (logo y lineamientos basicos)
- Disponibilidad de contenido: parcial (se debe estructurar y completar durante el desarrollo)

## Estado de IA en `.claude`

### Skills activas para este proyecto

- `.claude/skills/frontend-design`
- `.claude/skills/react-best-practices`
- `.claude/skills/code-reviewer`
- `.claude/skills/senior-qa`
- `.claude/skills/gsap-web-animation`

### Skills removidas por redundancia/no prioridad de v1

- `.claude/skills/database` (no necesaria en v1)
- `.claude/skills/senior-fullstack` (sobredimensionada para v1 institucional)
- `.claude/skills/ui-design-system` (redundante con frontend-design)
- `.claude/skills/ui-ux-pro-max` (redundante para el alcance actual)

## Plan de Implementacion para Claude

### Fase 1 - Setup base

1. Inicializar proyecto Next.js + TypeScript + Tailwind.
2. Configurar estructura App Router y layout base.
3. Definir tokens basicos de diseno (colores, tipografia, espaciado).

### Fase 2 - Desarrollo de paginas

1. Construir `Inicio` con narrativa institucional y CTAs claros.
2. Construir `Quienes somos` (mision, vision, valores, equipo).
3. Construir `Blog/Noticias` usando MDX local (listado + detalle).
4. Construir `Contacto` con datos directos y redes (sin formulario).
5. Construir `Trabaja con nosotros` con propuesta y canal de contacto.

### Fase 3 - Animaciones y calidad

1. Integrar GSAP en hero, entradas de seccion y transiciones de scroll.
2. Aplicar `prefers-reduced-motion` para accesibilidad.
3. Optimizar Core Web Vitals y assets.
4. Revisar SEO y metadatos por pagina.

### Fase 4 - Publicacion

1. Deploy en Vercel.
2. Verificacion final de responsive, SEO y rendimiento.
3. Entrega de checklist para evolucion a fase socios/donaciones (v2 con Supabase).

## Notas Importantes

- Prioridad del cliente: media, objetivo dentro del trimestre.
- No hay fecha cerrada, pero el sitio debe quedar listo para reforzar confianza institucional antes del lanzamiento formal del programa de socios.
