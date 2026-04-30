from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import PageBreak

OUTPUT_PATH = r"C:\Users\brahi\Desktop\Dev\Correntinos-Web\Cotizacion-Mantenimiento-Correntinos.pdf"

VERDE = colors.HexColor("#1a5c38")
VERDE_MED = colors.HexColor("#2d7a50")
VERDE_CLARO = colors.HexColor("#e8f5e9")
VERDE_BORDE = colors.HexColor("#a5d6a7")
DORADO = colors.HexColor("#c8a84b")
GRIS = colors.HexColor("#555555")
GRIS_CLARO = colors.HexColor("#f5f5f5")
BLANCO = colors.white
NEGRO = colors.HexColor("#1a1a1a")


def make_styles():
    s = {}
    s['titulo_doc'] = ParagraphStyle(
        'titulo_doc', fontSize=22, textColor=VERDE,
        fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=4
    )
    s['subtitulo_doc'] = ParagraphStyle(
        'subtitulo_doc', fontSize=13, textColor=GRIS,
        fontName='Helvetica', alignment=TA_CENTER, spaceAfter=2
    )
    s['meta'] = ParagraphStyle(
        'meta', fontSize=9, textColor=BLANCO,
        fontName='Helvetica', alignment=TA_CENTER, spaceAfter=0
    )
    s['seccion'] = ParagraphStyle(
        'seccion', fontSize=13, textColor=VERDE,
        fontName='Helvetica-Bold', spaceBefore=14, spaceAfter=6
    )
    s['subseccion'] = ParagraphStyle(
        'subseccion', fontSize=11, textColor=VERDE_MED,
        fontName='Helvetica-Bold', spaceBefore=8, spaceAfter=4
    )
    s['cuerpo'] = ParagraphStyle(
        'cuerpo', fontSize=9.5, textColor=NEGRO,
        fontName='Helvetica', leading=14, spaceAfter=4,
        alignment=TA_JUSTIFY
    )
    s['nota'] = ParagraphStyle(
        'nota', fontSize=8.5, textColor=GRIS,
        fontName='Helvetica-Oblique', leading=12, spaceAfter=4,
        alignment=TA_JUSTIFY
    )
    s['plan_titulo'] = ParagraphStyle(
        'plan_titulo', fontSize=12, textColor=BLANCO,
        fontName='Helvetica-Bold', alignment=TA_CENTER
    )
    s['plan_precio'] = ParagraphStyle(
        'plan_precio', fontSize=18, textColor=DORADO,
        fontName='Helvetica-Bold', alignment=TA_CENTER, spaceBefore=2
    )
    s['footer'] = ParagraphStyle(
        'footer', fontSize=8, textColor=GRIS,
        fontName='Helvetica', alignment=TA_CENTER
    )
    s['stat_label'] = ParagraphStyle(
        'stat_label', fontSize=8.5, textColor=GRIS,
        fontName='Helvetica', alignment=TA_CENTER
    )
    s['stat_value'] = ParagraphStyle(
        'stat_value', fontSize=16, textColor=VERDE,
        fontName='Helvetica-Bold', alignment=TA_CENTER
    )
    s['consideracion_titulo'] = ParagraphStyle(
        'consideracion_titulo', fontSize=10, textColor=NEGRO,
        fontName='Helvetica-Bold', spaceAfter=2
    )
    s['table_header'] = ParagraphStyle(
        'table_header', fontSize=9, textColor=BLANCO,
        fontName='Helvetica-Bold', alignment=TA_CENTER
    )
    s['table_cell'] = ParagraphStyle(
        'table_cell', fontSize=9, textColor=NEGRO,
        fontName='Helvetica', alignment=TA_CENTER
    )
    s['table_cell_left'] = ParagraphStyle(
        'table_cell_left', fontSize=9, textColor=NEGRO,
        fontName='Helvetica', alignment=TA_LEFT
    )
    return s


def header_block(story, s):
    t1 = Table([[Paragraph("COTIZACION DE MANTENIMIENTO MENSUAL", s['titulo_doc'])]], colWidths=[17*cm])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), VERDE_CLARO),
        ('TOPPADDING', (0,0), (-1,-1), 18),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('LINEABOVE', (0,0), (-1,0), 4, VERDE),
    ]))
    story.append(t1)

    t2 = Table([[Paragraph('Sistema Web "Correntinos Contra el Cambio Climatico"', s['subtitulo_doc'])]], colWidths=[17*cm])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), VERDE_CLARO),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(t2)

    meta = [[
        Paragraph("Proveedor: Brahiamm56", s['meta']),
        Paragraph("Fecha: Abril 2026", s['meta']),
        Paragraph("Vigencia: 30 dias", s['meta']),
    ]]
    t3 = Table(meta, colWidths=[5.67*cm, 5.67*cm, 5.66*cm])
    t3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), VERDE),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t3)
    story.append(Spacer(1, 16))


def section_title(story, s, text):
    t = Table([[Paragraph(f"  {text}", s['seccion'])]], colWidths=[17*cm])
    t.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 2, VERDE),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t)
    story.append(Spacer(1, 6))


def stats_block(story, s):
    stats = [
        ("8", "Modulos funcionales"),
        ("27", "Paginas y secciones"),
        ("5", "Areas del sistema"),
        ("Login + Google", "Formas de acceso"),
        ("Panel admin", "completo incluido"),
        ("SEO", "optimizado"),
    ]
    cells = []
    for val, label in stats:
        cells.append([
            Paragraph(val, s['stat_value']),
            Paragraph(label, s['stat_label']),
        ])

    rows = [cells[i:i+3] for i in range(0, len(cells), 3)]
    flat_rows = []
    for row in rows:
        flat_rows.append([cell[0] for cell in row])
        flat_rows.append([cell[1] for cell in row])

    t = Table(flat_rows, colWidths=[5.67*cm]*3)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), VERDE_CLARO),
        ('BOX', (0,0), (-1,-1), 1, VERDE_BORDE),
        ('INNERGRID', (0,0), (-1,-1), 0.5, VERDE_BORDE),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    story.append(t)
    story.append(Spacer(1, 12))


def modulos_block(story, s):
    modulos = [
        ("1. Sitio publico",
         "Pagina principal con animaciones y efectos visuales, seccion de impacto de la organizacion, "
         "quienes somos, formulario de contacto y seccion de trabajo voluntario."),
        ("2. Noticias",
         "Seccion de noticias gestionable desde el panel de administracion. Las noticias se publican "
         "y se muestran al publico de forma inmediata al activarlas."),
        ("3. Blog",
         "Seccion de articulos y notas de la fundacion, con diseño de lectura comodo y barra de progreso."),
        ("4. Tienda online",
         "Catalogo de productos con categorias y filtros, detalle de cada articulo con stock disponible, "
         "carrito de compras, proceso de compra completo y pagina de confirmacion de pedido."),
        ("5. Login y registro de usuarios",
         "Sistema completo para que los visitantes puedan crear una cuenta e iniciar sesion con email "
         "y contrasena, o directamente con su cuenta de Google."),
        ("6. Panel de administracion",
         "Zona privada y segura para el equipo de la fundacion. Permite gestionar noticias, productos, "
         "pedidos recibidos y la configuracion general del sitio desde un panel sencillo e intuitivo."),
        ("7. Donaciones",
         "Pagina informativa que explica como y para que se utilizan las donaciones, con datos de "
         "contacto directo (email y WhatsApp)."),
        ("8. Posicionamiento en buscadores (SEO)",
         "El sitio esta optimizado para aparecer en los resultados de busqueda de Google, con mapa "
         "del sitio automatico y configuracion de rastreo correcta."),
    ]
    for titulo, desc in modulos:
        row = [[
            Paragraph(titulo, ParagraphStyle('mod_t', fontSize=9, fontName='Helvetica-Bold', textColor=VERDE)),
            Paragraph(desc, s['cuerpo']),
        ]]
        t = Table(row, colWidths=[4.5*cm, 12.5*cm])
        t.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
            ('LINEBELOW', (0,0), (-1,-1), 0.3, VERDE_BORDE),
        ]))
        story.append(t)
    story.append(Spacer(1, 10))


def servicios_externos(story, s):
    story.append(Paragraph(
        "El sistema depende de dos servicios externos que son la base sobre la que funciona todo. "
        "Entender que hacen y por que importa su mantenimiento es clave:",
        s['cuerpo']
    ))
    story.append(Spacer(1, 8))

    servicios = [
        {
            "icono": "VERCEL",
            "titulo": "Vercel — El servidor del sitio web",
            "desc": (
                "Es la empresa que hospeda el sitio web en internet. Funciona como el 'local' donde vive "
                "la pagina: sin este servicio, nadie puede acceder al sitio desde ninguna parte del mundo. "
                "Actualmente se usa un plan gratuito que tiene limites de visitas mensuales y capacidad de "
                "procesamiento. Si esos limites se superan, el sitio puede volverse lento o dejar de funcionar "
                "sin previo aviso."
            ),
            "alerta": "Si el sitio crece en visitas, sera necesario migrar al plan pago (~$20 USD/mes).",
        },
        {
            "icono": "SUPABASE",
            "titulo": "Supabase — La base de datos del sistema",
            "desc": (
                "Es donde se almacena toda la informacion del sistema: usuarios registrados, productos de la "
                "tienda, noticias publicadas, pedidos realizados y la configuracion del sitio. Tambien es quien "
                "gestiona el sistema de login. Sin este servicio, el sitio funciona visualmente pero pierde "
                "toda su informacion y funcionalidad. El plan gratuito actual tiene limites de almacenamiento "
                "y de usuarios activos por mes."
            ),
            "alerta": "Si los datos o usuarios crecen, sera necesario migrar al plan pago (~$25 USD/mes).",
        },
    ]

    for srv in servicios:
        header_row = [[
            Paragraph(srv['titulo'], ParagraphStyle(
                'srv_t', fontSize=10, fontName='Helvetica-Bold', textColor=BLANCO
            ))
        ]]
        ht = Table(header_row, colWidths=[17*cm])
        ht.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), VERDE),
            ('TOPPADDING', (0,0), (-1,-1), 7),
            ('BOTTOMPADDING', (0,0), (-1,-1), 7),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
            ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ]))

        body_row = [[Paragraph(srv['desc'], s['cuerpo'])]]
        bt = Table(body_row, colWidths=[17*cm])
        bt.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), BLANCO),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
            ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ]))

        alerta_row = [[Paragraph(f"Atencion: {srv['alerta']}", ParagraphStyle(
            'alerta', fontSize=8.5, fontName='Helvetica-Bold', textColor=VERDE_MED,
            alignment=TA_LEFT
        ))]]
        at = Table(alerta_row, colWidths=[17*cm])
        at.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), VERDE_CLARO),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
            ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ]))

        outer = Table([[ht], [bt], [at]], colWidths=[17*cm])
        outer.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1.5, VERDE_BORDE),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(outer)
        story.append(Spacer(1, 8))

    story.append(Spacer(1, 4))
    aviso_data = [[Paragraph(
        "Por que es indispensable el mantenimiento mensual",
        ParagraphStyle('av_t', fontSize=10, fontName='Helvetica-Bold', textColor=NEGRO, alignment=TA_LEFT)
    )], [Paragraph(
        "Ambos servicios requieren supervision constante para garantizar que el sitio este siempre "
        "funcionando correctamente. Cuando un limite del plan gratuito se alcanza, el sistema puede "
        "caerse o perder funcionalidades sin ninguna notificacion automatica. El mantenimiento mensual "
        "incluye el monitoreo de estos limites, la actualizacion oportuna de los servicios y la "
        "resolucion rapida de cualquier problema que surja, evitando interrupciones que afecten "
        "la imagen y el trabajo de la fundacion.",
        s['cuerpo']
    )]]
    aviso_t = Table(aviso_data, colWidths=[17*cm])
    aviso_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), VERDE_CLARO),
        ('BACKGROUND', (0,1), (-1,1), BLANCO),
        ('BOX', (0,0), (-1,-1), 1.5, VERDE),
        ('LINEBELOW', (0,0), (-1,0), 1, VERDE_BORDE),
        ('TOPPADDING', (0,0), (-1,0), 8),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('TOPPADDING', (0,1), (-1,1), 8),
        ('BOTTOMPADDING', (0,1), (-1,1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(aviso_t)
    story.append(Spacer(1, 10))


def pendientes_block(story, s):
    story.append(Paragraph(
        "El sistema tiene la siguiente funcionalidad preparada internamente pero que aun requiere "
        "una configuracion adicional para activarse:",
        s['cuerpo']
    ))
    story.append(Spacer(1, 8))

    num = Paragraph("1", ParagraphStyle('num', fontSize=14, textColor=VERDE, fontName='Helvetica-Bold', alignment=TA_CENTER))
    tit = Paragraph(
        "Confirmaciones automaticas por email",
        ParagraphStyle('ptit', fontSize=10, textColor=VERDE_MED, fontName='Helvetica-Bold', spaceAfter=3)
    )
    bod = Paragraph(
        "Cuando alguien realiza un pedido en la tienda o completa el formulario de contacto, el sistema "
        "esta disenado para enviar automaticamente un email de confirmacion al cliente. Esta funcionalidad "
        "esta desarrollada pero necesita configurarse con el dominio propio de la fundacion para activarse "
        "y comenzar a enviar mensajes de forma automatica.",
        s['cuerpo']
    )
    inner = Table([[tit], [bod]], colWidths=[14*cm])
    inner.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    row = [[num, inner]]
    t = Table(row, colWidths=[2*cm, 15*cm])
    t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,0), (0,-1), VERDE_CLARO),
        ('BACKGROUND', (1,0), (1,-1), BLANCO),
        ('BOX', (0,0), (-1,-1), 1, VERDE_BORDE),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))


def planes_block(story, s):
    planes = [
        {
            "nombre": "PLAN BASICO",
            "precio": "$60.000 ARS/mes",
            "ideal": "Mantener el sistema estable sin cambios frecuentes.",
            "incluye": [
                "Monitoreo semanal del sitio y servicios",
                "Actualizaciones de seguridad del sistema",
                "Correccion de errores reportados (hasta 3 por mes)",
                "Verificacion periodica de respaldos de datos",
                "Informe mensual del estado del sistema",
                "Reunion mensual de seguimiento (videollamada)",
                "Soporte por WhatsApp (respuesta en 24 hs habiles)",
            ],
            "no_incluye": "Cambios de contenido, nuevas funcionalidades ni integraciones.",
            "recomendado": False,
            "bg": VERDE_MED,
        },
        {
            "nombre": "PLAN ESTANDAR",
            "precio": "$105.000 ARS/mes",
            "ideal": "Crecimiento activo con cambios y mejoras periodicas.",
            "incluye": [
                "Todo lo del Plan Basico",
                "Correccion de errores sin limite mensual",
                "Cambios menores de contenido (textos, imagenes, configuracion)",
                "Optimizaciones de velocidad y visibilidad en buscadores",
                "Soporte prioritario (respuesta en 4 hs en dias habiles)",
                "Monitoreo activo con alertas ante cualquier problema",
                "Reunion mensual de seguimiento (videollamada)",
            ],
            "no_incluye": "Nuevos modulos completos o rediseno del sitio.",
            "recomendado": True,
            "bg": VERDE,
        },
        {
            "nombre": "PLAN PREMIUM",
            "precio": "$200.000 ARS/mes",
            "ideal": "Desarrollo continuo y crecimiento del sistema.",
            "incluye": [
                "Todo lo del Plan Estandar",
                "Incorporacion de nuevas funcionalidades al sistema",
                "Atencion maxima (respuesta en 2 horas)",
                "Videollamada mensual de revision y planificacion",
                "Asesoramiento en estrategia digital para la fundacion",
                "Documentacion del sistema siempre actualizada",
            ],
            "no_incluye": None,
            "recomendado": False,
            "bg": VERDE_MED,
        },
    ]

    plan_tables = []
    for p in planes:
        content = []

        header_data = [[Paragraph(p['nombre'], s['plan_titulo'])]]
        if p['recomendado']:
            header_data.append([Paragraph("RECOMENDADO", ParagraphStyle(
                'rec', fontSize=8, textColor=DORADO, fontName='Helvetica-Bold', alignment=TA_CENTER
            ))])
        header_data.append([Paragraph(p['precio'], s['plan_precio'])])

        header_t = Table(header_data, colWidths=[5.3*cm])
        hstyle = [
            ('BACKGROUND', (0,0), (-1,-1), p['bg']),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 4),
            ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ]
        if p['recomendado']:
            hstyle.append(('LINEABOVE', (0,0), (-1,0), 3, DORADO))
        header_t.setStyle(TableStyle(hstyle))
        content.append(header_t)

        body_rows = []
        body_rows.append([Paragraph(f"Ideal para: {p['ideal']}", ParagraphStyle(
            'ideal', fontSize=8.5, textColor=GRIS, fontName='Helvetica-Oblique', leading=12
        ))])
        body_rows.append([Paragraph("Incluye:", ParagraphStyle(
            'inc', fontSize=9, textColor=VERDE, fontName='Helvetica-Bold', spaceBefore=4
        ))])
        for item in p['incluye']:
            body_rows.append([Paragraph(f"+ {item}", ParagraphStyle(
                'inc_item', fontSize=8.5, textColor=NEGRO, fontName='Helvetica', leading=12, leftIndent=4
            ))])
        if p['no_incluye']:
            body_rows.append([Paragraph(f"No incluye: {p['no_incluye']}", ParagraphStyle(
                'no_inc', fontSize=8, textColor=colors.HexColor('#999999'), fontName='Helvetica-Oblique',
                leading=11, spaceBefore=4
            ))])

        body_t = Table(body_rows, colWidths=[5.3*cm])
        body_t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), BLANCO),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        content.append(body_t)

        outer = Table([[c] for c in content], colWidths=[5.3*cm])
        outer.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1.5, p['bg']),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        plan_tables.append(outer)

    planes_t = Table([plan_tables], colWidths=[5.5*cm, 5.5*cm, 5.5*cm], hAlign='CENTER')
    planes_t.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(planes_t)
    story.append(Spacer(1, 12))


def pendiente_precio(story, s):
    headers = [
        Paragraph("Item", s['table_header']),
        Paragraph("Descripcion", s['table_header']),
        Paragraph("Precio unico", s['table_header']),
    ]
    data = [headers, [
        Paragraph("Emails automaticos", ParagraphStyle('ec', fontSize=9, fontName='Helvetica', textColor=NEGRO)),
        Paragraph(
            "Configurar el servicio de envio de emails con el dominio de la fundacion + diseno "
            "de los mensajes automaticos de confirmacion de pedido y contacto.",
            s['table_cell_left']
        ),
        Paragraph("$30.000 ARS", ParagraphStyle('ep', fontSize=10, fontName='Helvetica-Bold',
                                                  textColor=VERDE, alignment=TA_CENTER)),
    ]]
    t = Table(data, colWidths=[3.5*cm, 10*cm, 3.5*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), VERDE),
        ('GRID', (0,0), (-1,-1), 0.5, VERDE_BORDE),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('BACKGROUND', (0,1), (-1,1), VERDE_CLARO),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))


def consideraciones_block(story, s):
    items = [
        ("Sobre el precio del desarrollo inicial",
         "El sistema fue entregado por $300.000 ARS, lo cual representa un valor muy por debajo del mercado "
         "para un sistema de esta complejidad y alcance. Un proyecto equivalente en el mercado local ronda entre "
         "$800.000 y $1.500.000 ARS, considerando las horas de trabajo invertidas, la arquitectura implementada "
         "y la cantidad de modulos desarrollados. El precio cobrado fue un gesto especial para una organizacion "
         "sin fines de lucro."),
        ("Sobre el crecimiento y la escalabilidad del sistema",
         "El sistema fue construido con una arquitectura pensada para crecer. Puede soportar un aumento "
         "significativo de visitas, usuarios y contenido sin necesidad de rehacerlo desde cero. "
         "A medida que la fundacion crezca, el sistema puede ampliarse con nuevas funcionalidades "
         "de forma ordenada y eficiente."),
    ]
    for titulo, desc in items:
        t = Table([
            [Paragraph(titulo, s['consideracion_titulo'])],
            [Paragraph(desc, s['cuerpo'])],
        ], colWidths=[17*cm])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), VERDE_CLARO),
            ('BACKGROUND', (0,1), (-1,1), BLANCO),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (0,0), 8),
            ('BOTTOMPADDING', (0,0), (0,0), 6),
            ('TOPPADDING', (0,1), (0,1), 7),
            ('BOTTOMPADDING', (0,1), (0,1), 9),
            ('BOX', (0,0), (-1,-1), 1, VERDE_BORDE),
            ('LINEBELOW', (0,0), (-1,0), 0.5, VERDE_BORDE),
        ]))
        story.append(t)
        story.append(Spacer(1, 7))


def resumen_final(story, s):
    headers = ["", "Plan Basico", "Plan Estandar", "Plan Premium"]
    rows = [
        ["Precio mensual", "$60.000 ARS", "$105.000 ARS", "$200.000 ARS"],
        ["Monitoreo del sistema", "Si", "Si", "Si"],
        ["Actualizaciones de seguridad", "Si", "Si", "Si"],
        ["Correccion de errores", "Hasta 3/mes", "Ilimitado", "Ilimitado"],
        ["Cambios de contenido", "No", "Si", "Si"],
        ["Soporte prioritario", "No", "Si", "Si"],
        ["Nuevas funcionalidades", "No", "No", "Si"],
        ["Reunion mensual", "Si", "Si", "Si"],
        ["Tiempo de respuesta", "24 hs", "4 hs", "2 hs"],
    ]

    h_style = ParagraphStyle('rh', fontSize=9, textColor=BLANCO, fontName='Helvetica-Bold', alignment=TA_CENTER)
    c_style = ParagraphStyle('rc', fontSize=9, textColor=NEGRO, fontName='Helvetica', alignment=TA_CENTER)
    l_style = ParagraphStyle('rl', fontSize=9, textColor=VERDE, fontName='Helvetica-Bold', alignment=TA_LEFT)
    p_style = ParagraphStyle('rp', fontSize=10, textColor=DORADO, fontName='Helvetica-Bold', alignment=TA_CENTER)

    header_row = [Paragraph(h, h_style) for h in headers]
    price_row = [Paragraph(rows[0][0], l_style)] + [Paragraph(r, p_style) for r in rows[0][1:]]
    data = [header_row, price_row]
    for row in rows[1:]:
        data.append([Paragraph(row[0], l_style)] + [Paragraph(c, c_style) for c in row[1:]])

    t = Table(data, colWidths=[5*cm, 4*cm, 4*cm, 4*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), VERDE),
        ('BACKGROUND', (1,1), (3,1), VERDE_CLARO),
        ('GRID', (0,0), (-1,-1), 0.5, VERDE_BORDE),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,2), (-1,-1), [BLANCO, VERDE_CLARO]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LINEABOVE', (0,1), (-1,1), 1.5, VERDE_MED),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))


def footer_block(story, s):
    story.append(HRFlowable(width="100%", thickness=2, color=VERDE))
    story.append(Spacer(1, 8))
    footer_data = [[
        Paragraph("Medios de contacto:", ParagraphStyle('fc', fontSize=9, textColor=VERDE, fontName='Helvetica-Bold')),
        Paragraph("brahiamiserre10@gmail.com", s['footer']),
        Paragraph("WhatsApp disponible al contratar", s['footer']),
    ]]
    ft = Table(footer_data, colWidths=[4.5*cm, 6.5*cm, 6*cm])
    ft.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(ft)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Esta cotizacion tiene validez de 30 dias a partir de la fecha de emision. "
        "Los precios estan expresados en pesos argentinos (ARS).",
        ParagraphStyle('val', fontSize=8, textColor=GRIS, fontName='Helvetica-Oblique', alignment=TA_CENTER)
    ))


def main():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=2*cm,
        rightMargin=2*cm,
        topMargin=1.5*cm,
        bottomMargin=1.8*cm,
        title="Cotizacion Mantenimiento - Correntinos Web",
        author="Brahiamm56",
        subject="Mantenimiento mensual sistema web fundacion",
    )

    s = make_styles()
    story = []

    header_block(story, s)

    section_title(story, s, "1. QUE INCLUYE EL SISTEMA DESARROLLADO")
    story.append(Paragraph(
        "El sistema entregado es una plataforma web completa, pensada especificamente para las "
        "necesidades de la fundacion. A continuacion se detallan todos sus modulos y funcionalidades:",
        s['cuerpo']
    ))
    story.append(Spacer(1, 8))
    stats_block(story, s)
    modulos_block(story, s)

    section_title(story, s, "2. SERVICIOS EXTERNOS DE LOS QUE DEPENDE EL SISTEMA")
    servicios_externos(story, s)

    section_title(story, s, "3. FUNCIONALIDAD PENDIENTE DE ACTIVACION")
    pendientes_block(story, s)

    story.append(PageBreak())

    section_title(story, s, "4. PLANES DE MANTENIMIENTO MENSUAL")
    story.append(Paragraph(
        "Se ofrecen tres planes adaptados a las distintas necesidades y presupuesto de la fundacion. "
        "El mantenimiento mensual garantiza que el sitio este siempre disponible, seguro y funcionando correctamente.",
        s['cuerpo']
    ))
    story.append(Spacer(1, 10))
    planes_block(story, s)

    section_title(story, s, "5. COTIZACION DE FUNCIONALIDAD PENDIENTE (precio unico)")
    pendiente_precio(story, s)

    section_title(story, s, "6. CONSIDERACIONES IMPORTANTES")
    consideraciones_block(story, s)

    section_title(story, s, "7. RESUMEN COMPARATIVO DE PLANES")
    resumen_final(story, s)

    footer_block(story, s)

    doc.build(story)
    print(f"PDF generado exitosamente: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
