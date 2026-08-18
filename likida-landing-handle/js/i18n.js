/* ═══════════════════════════════════════════════════════════════════════════
   LIKIDA — bilingüe ES/EN sin framework.

   Cómo funciona:
   · El HTML se queda en español (default legible sin JS y SEO en español).
   · Cada nodo traducible lleva data-i18n="clave" (texto o HTML) y/o
     data-i18n-attr="atributo:clave;otro:clave" (placeholder, aria-label, alt,
     content del meta).
   · El español de un nodo no hace falta declararlo: la primera pasada guarda
     el innerHTML original como valor por defecto de su clave. Por eso los
     diccionarios del blog solo traen el inglés. Lo que sí esté escrito en
     DICT.es manda sobre lo capturado.
   · El JSON-LD se traduce con data-i18n-json="ruta.al.campo:clave".
   · Las páginas del blog cargan diccionarios aparte (js/i18n-blog*.js) que se
     anuncian en window.LIKIDA_I18N antes de que corra este archivo.
   · La elección se guarda en localStorage y se aplica ANTES de pintar: si el
     idioma guardado no es el default, se pone un velo sobre el body que se
     quita en cuanto termina la primera pasada (nunca se ve el español).
   · document.documentElement.lang se actualiza — el CSS del switcher se pinta
     solo con html[lang="…"], así que el activo nunca parpadea.

   Términos que NO se traducen por ser fiscales mexicanos: CFDI, SAT, IEPS,
   CANACAR, Carta Porte, RFC, TAG, CAPUFE, DOF, LIF. Las cifras y los montos
   en MXN se quedan idénticos en los dos idiomas.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var DICT = {
    es: {
      /* ── head ── */
      "idx.title": "Likida — Liquidación de viajes con IA para flotas en México",
      "idx.desc": "Agentes de IA que liquidan los viajes de tu flota de autotransporte por WhatsApp: validan cada CFDI contra el SAT y cuadran diésel, casetas y viáticos.",
      "mis.title": "Misión de Likida — automatizar el back-office del autotransporte",
      "mis.desc": "Por qué existe Likida: en el transporte mexicano el comprobante viaja más lento que el camión. La tesis para automatizar el back-office, agente por agente.",

      /* Identidad social. Los rastreadores de OG/Twitter no ejecutan JS y
         siempre leen el español del HTML; estas claves solo cambian lo que ve
         el visitante en su navegador. */
      "og.idx.title": "Likida — El back-office del autotransporte, automatizado con agentes de IA",
      "og.idx.desc": "Liquida los viajes de tu flota por WhatsApp: valida cada CFDI contra el SAT y cuadra diésel, casetas y viáticos contra tu política de gastos.",
      "og.mis.title": "Misión de Likida — el último kilómetro del dinero en el autotransporte",
      "og.mis.desc": "El transporte es un negocio de documentos con un camión encima. Por qué automatizamos el back-office del autotransporte de carga mexicano, agente por agente.",
      "og.img.alt": "Likida — el back-office del transporte, automatizado con agentes de IA: liquidación por viaje, CFDI validado contra el SAT y conciliación de peajes.",

      /* ── aviso + header ── */
      "aviso": "Likida está armando su <strong>grupo cerrado de flotas piloto</strong> este trimestre — cada piloto se adapta a mano y el cupo es limitado.",
      "logo.aria": "Likida — inicio",
      "nav.producto": "Producto",
      "nav.ciclo": "El ciclo",
      "nav.seguridad": "Seguridad",
      "nav.mision": "Misión",
      "nav.blog": "Blog",
      "nav.faq": "Preguntas",
      "cta.contacto": "Contáctanos",
      "gd.volver": "Volver",
      "gd.volver.aria": "Volver a la portada",
      "idioma.aria": "Idioma",
      "idioma.en": "Cambiar a inglés",
      "idioma.es": "Cambiar a español",

      /* ── hero ── */
      "hero.h1": 'Tu back-office del transporte,<br><span class="subrayado">automatizado<svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true"><path class="trazo-mano" pathLength="1" d="M6 18 C70 8 150 6 294 12"/></svg></span> con agentes de IA.',
      "hero.sub": "Valida comprobantes contra el SAT, aplica tu política de gastos y cuadra la liquidación por viaje — desde el WhatsApp que tu operador ya usa. Sin apps nuevas, sin cambiar de ERP.",
      "hero.nota": "En la demo lo ves corriendo con un caso tuyo: trae 10 fotos de un viaje cerrado.",

      /* ── el problema ── */
      "prob.kicker": "EL PROBLEMA",
      "prob.h2": "El back-office del transporte todavía corre en papel, portales y Excel.",
      "prob.1.h": "Captura manual de tickets",
      "prob.1.p": "El operador junta los comprobantes en la guantera y los entrega el viernes — o el otro viernes. Teclear cada uno cuesta minutos por comprobante, en el renglón más pesado de todo el ciclo.",
      "prob.2.h": "Peajes conciliados cada 10 días",
      "prob.2.p": "Cruzar el estado de cuenta del TAG contra los viajes reales se hace a mano, cuando da tiempo. Sin esa bitácora, el estímulo del 50% de peaje queda indefendible en una revisión.",
      "prob.3.h": "CFDIs que se vencen sin facturar",
      "prob.3.p": "Cada gasolinera pone su propio corte para timbrar — algunas exigen 72 horas. El ticket que se vence no es una molestia: es un gasto que pierde su deducibilidad completa.",
      "prob.4.h": "Vigencias que vencen sin aviso",
      "prob.4.p": "Permisos, verificaciones, pólizas, licencias de operador: no existe una consulta que las vigile todas juntas. Cuando alguien se entera, ya truncó la operación.",

      /* ── banda de cifras ── */
      "stat.1.que": "cuesta hoy liquidar cada viaje a mano",
      "stat.1.fuente": "Banda $94–$115 según tamaño de flota. Censo propio: 1,318 vacantes verificadas de 829 empresas de transporte.",
      "stat.2.unidad": "PUESTOS",
      "stat.2.que": "tocan hoy el ciclo de cada liquidación",
      "stat.2.fuente": "Tráfico, liquidaciones, facturación, contable y la capa de mando que los supervisa.",
      "stat.3.unidad": "MIN",
      "stat.3.que": "por comprobante tecleado a mano, ×3 por viaje",
      "stat.3.fuente": "Supuesto declarado del renglón más pesado del ciclo — siempre ajustable con tus números.",
      "stat.4.que": "varió la cuota de IEPS del diésel en 2026",
      "stat.4.fuente": "De $7.36 a $2.09 por litro (DOF, LIF art. 20-A) — se publica cada semana y casi nadie la persigue.",

      /* ── arquitectura de 3 capas ── */
      "arq.kicker": "CÓMO FUNCIONA",
      "arq.h2": "Tres capas que trabajan solas",
      "arq.p": "Likida se conecta a lo que ya usas — no reemplaza nada. El dato entra por donde ya vive, los agentes lo trabajan, y tú lo ves cuadrado en tiempo real.",
      "arq.1.h": "De dónde entra el dato",
      "arq.1.p": "El WhatsApp del operador, los CFDI del SAT, los portales de casetas y TAG, el GPS de tu flota y tu ERP.",
      "arq.2.h": "Los agentes que ejecutan",
      "arq.2.p": "Conductores, cobranza de comprobantes, liquidación, facturas y conciliación de peajes — de punta a punta.",
      "arq.3.h": "Lo que ves en tiempo real",
      "arq.3.p": "Cola de viajes por cerrar, IVA acreditable, litros elegibles, discrepancias de peaje marcadas y alertas de vigencias.",
      "arq.alt": "Diagrama isométrico de las tres capas de Likida: las fuentes de datos (WhatsApp, SAT, portales de casetas, GPS y ERP), los agentes de IA que las trabajan y el panel de visibilidad en tiempo real",

      /* ── stepper ── */
      "step.titulo": "AGENTE DE LIQUIDACIÓN — CICLO AUTOMÁTICO",
      "step.hecho": "Hecho",
      "step.curso": "En curso",
      "step.pendiente": "Pendiente",
      "step.1.h": "Recibe los comprobantes",
      "step.1.p": "El operador manda las fotos por WhatsApp al terminar el viaje.",
      "step.2.h": "Lee y decodifica",
      "step.2.p": "Extrae monto, RFC y folio fiscal de cada ticket y su CFDI.",
      "step.3.h": "Valida contra el SAT",
      "step.3.p": "Vigente, receptor correcto, emisor fuera de la lista 69-B.",
      "step.4.h": "Cuadra contra tu política",
      "step.4.p": "Compara lo comprobado contra el anticipo y las reglas de gasto.",
      "step.5.h": "Genera la liquidación",
      "step.5.p": "PDF con desglose y fundamento fiscal, listo para revisión.",
      "step.6.h": "Exporta a tu ERP",
      "step.6.p": "El archivo que SAP Business One o CONTPAQi ya sabe importar.",

      /* ── scrollytelling ── */
      "scr.kicker": "EN LA PRÁCTICA",
      "scr.h2": "Un viaje se cierra así.",
      "scr.chat.1": "Ticket de diésel · 14:22",
      "scr.chat.2": "Caseta Marín–Los Ramones · 14:23",
      "scr.chat.3": 'Recibidos. Diésel $2,840 — CFDI <span class="ok">vigente ✓</span> validado con el SAT. Caseta $312 — <span class="ok">dentro de política ✓</span>',
      "scr.chat.4": "listo",
      "scr.chat.5": 'Viaje MTY→NLD cuadrado contra tu anticipo. <strong>Liquidación lista para revisión</strong> — PDF con fundamento fiscal en el panel.<span class="mini">Nadie capturó nada.</span>',
      "scr.1.k": "PASO 1",
      "scr.1.h": "El operador manda sus fotos",
      "scr.1.p": 'Al terminar el viaje, fotografía sus tickets desde el WhatsApp que ya tiene. Su entrenamiento completo: "manda las fotos y escribe listo".',
      "scr.2.k": "PASO 2",
      "scr.2.h": "Se lee y se valida solo",
      "scr.2.p": "Cada comprobante se lee, se decodifica y su CFDI se valida directo contra el SAT: vigente, receptor correcto, emisor fuera del 69-B.",
      "scr.3.k": "PASO 3",
      "scr.3.h": 'Un "listo" y el motor cuadra',
      "scr.3.p": "Lo comprobado se compara contra el anticipo y tu política de gastos. Los totales los calcula un motor determinístico — la IA nunca inventa una cifra.",
      "scr.4.k": "PASO 4",
      "scr.4.h": "Sale la liquidación",
      "scr.4.p": "PDF con el desglose y el fundamento fiscal, listo para el operador y para el contador — y el archivo que tu ERP ya sabe importar.",

      /* ── el ciclo completo ── */
      "cic.kicker": "EL CICLO COMPLETO",
      "cic.h2": "Del ticket en la cabina al PDF firmado, sin captura.",
      "cic.1.h": "Despacha el viaje",
      "cic.1.p": "El jefe de tráfico asigna el viaje por WhatsApp; el sistema avisa al operador y persigue su aceptación.",
      "cic.2.h": "Acompaña en ruta",
      "cic.2.p": 'Sella los hitos "ya llegué / descargando / de regreso" conforme suceden, sin que nadie llame a preguntar.',
      "cic.3.h": "Escala cuando hace falta",
      "cic.3.p": "Si el operador no acepta su viaje a tiempo, el jefe recibe la alerta — no antes, y nunca por encima de su criterio.",
      "cic.4.h": "Cobra los comprobantes",
      "cic.4.p": "Persigue el ticket que falta para cerrar el viaje, con una cola honesta: dice a quién le va a escribir y por qué.",
      "cic.5.h": "Lee y cuadra la liquidación",
      "cic.5.p": 'El operador manda las fotos y escribe "listo"; el motor cuadra contra el anticipo y tu política de gastos.',
      "cic.6.h": "Recupera el CFDI",
      "cic.6.p": "Lleva el calendario de facturación de cada ticket y avisa cuál vence, en qué portal, con la liga directa.",
      "cic.7.h": "Concilia los peajes",
      "cic.7.p": "Cruza el estado de cuenta del TAG contra los cruces reales y arma la bitácora que exige el estímulo del 50%.",
      "cic.8.h": "Sale a tu ERP",
      "cic.8.p": "El archivo que tu SAP Business One o CONTPAQi ya sabe importar, sin retecleo — tu ERP no se toca.",
      "cic.9.h": "Informa a cada rol",
      "cic.9.p": "El contralor recibe lo fiscal, tráfico las escalaciones, el contador su bandeja — nadie recibe ruido ajeno.",
      "cic.10.h": "Vigila lo fiscal y las vigencias",
      "cic.10.p": "IVA acreditable, 50% de peaje e IEPS de diésel en litros — cada uno con su artículo citado en pantalla.",

      /* ── banner fotográfico ── */
      "ban.1.alt": "Tractocamión en carretera",
      "ban.1.sub": "EN RUTA",
      "ban.1.et": "Carretera",
      "ban.1.d": "El viaje genera gastos desde el kilómetro cero — y cada uno deja comprobante.",
      "ban.2.alt": "Caseta de peaje",
      "ban.2.sub": "TAG · CAPUFE",
      "ban.2.et": "Casetas",
      "ban.2.d": "Cada cruce del TAG se concilia contra su viaje, sin bitácora a mano.",
      "ban.3.alt": "Carga de diésel",
      "ban.3.sub": "IEPS EN LITROS",
      "ban.3.et": "Diésel",
      "ban.3.d": "Litros y IEPS acreditable, leídos del ticket en segundos.",
      "ban.4.alt": "Operador fotografiando su ticket",
      "ban.4.sub": "WHATSAPP",
      "ban.4.et": "El operador",
      "ban.4.d": "Foto al ticket por WhatsApp y listo — sin apps nuevas que aprender.",
      "ban.5.alt": "Patio de maniobras",
      "ban.5.sub": "DESPACHO",
      "ban.5.et": "El patio",
      "ban.5.d": "El viaje nace con su presupuesto y su anticipo ya registrados.",
      "ban.6.alt": "Báscula de camiones",
      "ban.6.sub": "HITOS · POD",
      "ban.6.et": "La báscula",
      "ban.6.d": "Cada hito del viaje queda asentado con su evidencia.",
      "ban.7.alt": "Cruce fronterizo",
      "ban.7.sub": "CRUCES",
      "ban.7.et": "La frontera",
      "ban.7.d": "Los gastos del cruce, documentados en el momento, no al regreso.",
      "ban.8.alt": "Escritorio del contador",
      "ban.8.sub": "CIERRE FISCAL",
      "ban.8.et": "El contador",
      "ban.8.d": "CFDIs validados contra el SAT, listos para deducir sin sorpresas.",

      /* ── seguridad ── */
      "seg.svgAria": "El anillo de seguridad de Likida: los CFDI válidos se verifican y cruzan los anillos hacia el núcleo aislado de tu flota; un documento inválido se rechaza en el anillo exterior.",
      "seg.svg.1": "AISLADO POR FLOTA",
      "seg.svg.2": "CIFRADO EXTREMO A EXTREMO · CFDI VALIDADO CONTRA EL SAT",
      "seg.kicker": "SEGURIDAD",
      "seg.h2": 'Tu información, <span class="gris-suave">protegida por diseño.</span>',
      "seg.p": "Describimos controles reales en vez de colgar siglas.",
      "seg.1.h": "Cada flota vive aislada",
      "seg.1.p": "La base niega el acceso por default y cada consulta re-verifica sesión, rol y flota en el servidor — nunca en la pantalla.",
      "seg.2.h": "Credenciales cifradas y de ida",
      "seg.2.p": "ERP, GPS o monederos: se guardan cifradas con la llave fuera de la base. Nunca se muestran de vuelta.",
      "seg.3.h": "Validación directa contra el SAT",
      "seg.3.p": "Cada CFDI se valida vigente, receptor correcto y emisor fuera del 69-B. El que no pasa, no llega callado a tu contabilidad.",
      "seg.4.h": "La IA nunca inventa una cifra",
      "seg.4.p": "Los totales los calcula un motor determinístico. Si la IA y el motor no coinciden, gana el motor — o no se manda nada.",

      /* ── demo ── */
      "demo.kicker": "AGENDA UNA DEMO",
      "demo.h2": 'Ve tu propio viaje, <span class="gris-suave">ya cuadrado.</span>',
      "demo.p": "Trae 10 fotos de un viaje cerrado y en la demo lo ves correr con tus números — no con los nuestros. 30 minutos por Google Meet, con disponibilidad en tiempo real.",
      "demo.1.h": "Cuéntanos de tu flota",
      "demo.1.p": "Nombre, tamaño y contacto — nada más.",
      "demo.2.h": "Elige tu horario",
      "demo.2.p": "El calendario de abajo es el real: lo que ves disponible, está disponible.",
      "demo.3.h": "Llega con tus tickets",
      "demo.3.p": "La demo corre con un viaje tuyo, cuadrado en vivo.",
      "demo.p1.et": "PASO 1 DE 3",
      "demo.p1.t": "Agenda una demo personalizada",
      "demo.p1.hint": "Cuéntanos un poco sobre tu flota",
      "demo.ph.empresa": "Nombre de tu empresa",
      "demo.ph.nombre": "Tu nombre",
      "demo.ph.apellido": "Tu apellido",
      "demo.continuar": "Continuar",
      "demo.regresar": "Regresar",
      "demo.p2.et": "PASO 2 DE 3",
      "demo.p2.t": "¿Dónde te contactamos?",
      "demo.p2.hint": "Usamos estos datos solo para coordinar tu demo",
      "demo.ph.correo": "Correo empresarial",
      "demo.ph.tel": "Teléfono / WhatsApp",
      "demo.u.0": "¿Cuántas unidades opera tu flota?",
      "demo.u.1": "5 a 30 unidades",
      "demo.u.2": "31 a 100 unidades",
      "demo.u.3": "101 a 250 unidades",
      "demo.u.4": "Más de 250 unidades",
      "demo.p3.et": "PASO 3 DE 3",
      "demo.p3.t": "Elige tu horario",
      "demo.p3.hint": "Disponibilidad en tiempo real — la cita cae directo en nuestro calendario",
      "demo.cal.nota": "Al agendar recibes la invitación con la liga de Google Meet en tu correo.",

      /* ── página de contacto (getdemo.html) ── */
      "con.title": "Contacto — agenda una demo de Likida con un viaje tuyo",
      "con.desc": "Agenda 30 minutos con Likida y ve un viaje tuyo cuadrado en vivo: trae 10 fotos de un viaje cerrado y te llevas la liquidación, aunque no compres nada.",
      "og.con.title": "Agenda una demo de Likida — con tu propio viaje, no con el nuestro",
      "og.con.desc": "30 minutos por Google Meet. Trae 10 fotos de un viaje cerrado y lo ves cuadrado en vivo: CFDI validados contra el SAT, diésel, casetas y viáticos.",
      "con.kicker": "AGENDA UNA DEMO",
      "con.h1": 'Trae un viaje cerrado. <span class="gris-suave">Sal con él cuadrado.</span>',
      "con.sub": "30 minutos por Google Meet. Corremos la liquidación con tus tickets, tu política de gastos y tus números — no con una cuenta de demostración.",
      "con.img.alt": "Ilustración de línea: dos manos acomodando en fila los comprobantes de un viaje sobre un escritorio, junto a una laptop con la liquidación en pantalla y un teléfono con un mensaje.",
      "con.b1.k": "LOS 30 MINUTOS",
      "con.b1.1": "Nos cuentas cómo liquidas hoy: quién teclea, quién revisa y en qué día de la semana se atora.",
      "con.b1.2": "Subimos tus fotos en vivo. El agente las lee, valida cada CFDI contra el SAT y cuadra diésel, casetas y viáticos contra tu política. Lo ves en pantalla compartida, no en un video grabado.",
      "con.b1.3": "Te decimos qué falló, qué todavía no sabemos hacer y qué haría falta para correrlo con tu flota completa.",
      "con.b2.k": "QUÉ TRAER",
      "con.b2.1": "<strong>10 fotos de un viaje ya cerrado</strong> — tickets de diésel, casetas y viáticos, como te los entregó el operador. Torcidas y con el dedo encima está bien: así llegan en la realidad.",
      "con.b2.2": "<strong>Si lo tienes a la mano,</strong> el estado de cuenta del TAG de esa semana. Con él te enseñamos la conciliación de peajes.",
      "con.b2.3": "<strong>Nada de accesos.</strong> No pedimos tu ERP, ni tu GPS, ni tu monedero para la demo. Eso se habla después, si hay piloto.",
      "con.b3.k": "CON QUÉ TE VAS",
      "con.b3.1": "<strong>La liquidación de ese viaje</strong> en PDF, más el archivo que tu SAP Business One o CONTPAQi ya sabe importar.",
      "con.b3.2": "<strong>El veredicto de cada comprobante:</strong> cuáles pasaron la validación del SAT, cuáles no y por qué.",
      "con.b3.3": "<strong>Es tuyo aunque no compres nada.</strong> Si la demo sale mal, te lo decimos en la llamada y no hay seguimiento.",
      "con.honesto": "No vas a encontrar logos de clientes ni testimonios en esta página: Likida está armando su primer grupo de flotas piloto y todavía no tiene clientes que presumir. Lo que sí puedes ver es el producto corriendo con un viaje tuyo — que es la única prueba que importa.",
      "con.privacidad": "Tus datos se usan solo para coordinar la demo. No se comparten, no se venden y no entran a ninguna lista — si no agendas, se quedan ahí y ya.",

      /* ── FAQ ── */
      "faq.kicker": "PREGUNTAS FRECUENTES",
      "faq.h2": "Lo que toda flota nos pregunta.",
      "faq.1.q": "¿Likida reemplaza a mi equipo?",
      "faq.1.a": "No. La IA no decide sobre tu dinero: el modelo lee fotos y conversa, nunca calcula un monto. El motor determinístico cuadra la liquidación y tu gente decide sobre lo que el sistema ya preparó — en segundos, no en días.",
      "faq.2.q": "¿Y si el SAT no responde cuando validan mis facturas?",
      "faq.2.a": 'La liquidación no se cae. Si el servicio del SAT no contesta, el CFDI queda marcado "pendiente de validar" y el flujo sigue — el sistema reintenta y avisa si algo quedó sin veredicto. Es comportamiento diseñado, no una falla.',
      "faq.3.q": "¿Qué pasa con mis datos? ¿Quién más los ve?",
      "faq.3.a": "Cada flota vive aislada a nivel de base de datos. La IA no decide con qué datos trabaja — los identificadores siempre salen del servidor. Tus credenciales de ERP, GPS o monedero se cifran y nunca se muestran de vuelta.",
      "faq.4.q": "Ya tengo TMS o ERP. ¿Esto lo sustituye?",
      "faq.4.a": "No, por diseño. Hoy te damos el archivo que tu SAP Business One o CONTPAQi ya sabe importar, sin retecleo. Tu ERP no se toca — la escritura directa existe como siguiente paso y se activa solo con los accesos que tú controles.",
      "faq.5.q": "¿Mis choferes van a poder usarlo?",
      "faq.5.a": 'El operador no aprende ningún sistema: usa el WhatsApp que ya tiene. Su entrenamiento completo es "manda las fotos de tus tickets y cuando termines escribe <em>listo</em>". Si manda algo tarde, no se pierde — queda para su siguiente viaje.',

      /* ── CTA final ── */
      "cta2.h2": 'El comprobante ya no viaja <em style="font-style:italic">más lento que el camión.</em>',
      "cta2.p": "Agenda 30 minutos y ve un viaje tuyo cuadrado en vivo — con tus números, no con los nuestros.",

      /* ── footer ── */
      "foot.k1": "PRODUCTO",
      "foot.k2": "COMPAÑÍA",
      "foot.k3": "CONECTA",
      "foot.como": "Cómo funciona",
      "foot.ciclo": "El ciclo completo",
      "foot.seguridad": "Seguridad",
      "foot.faq": "Preguntas",
      "foot.mision": "Misión",
      "foot.contacto": "Contacto",
      "foot.tag1": "El sistema operativo del back-office del autotransporte de carga mexicano.",
      "foot.tag2": "Empezando por la liquidación de viajes, agente por agente.",
      "foot.legal": "Likida. Ninguna cifra de esta página se inventó — cada una tiene su fuente.",

      /* ── misión ── */
      "mis.kicker": "MISIÓN",
      "mis.h1": 'El último kilómetro no es el de la carga. <span class="gris-suave">Es el del dinero.</span>',
      "mis.h2.1": "El transportista mexicano no tiene un problema de gastos. Tiene un problema de que el comprobante viaja más lento que el camión.",
      "mis.p.1": "Cada flota de carga en México termina su día con el mismo ritual: se despacha el viaje por teléfono, se persigue al operador, se teclean sus tickets de diésel, casetas y viáticos, se cuadran contra el anticipo, y alguien entra a los portales a bajar los CFDI que faltan. No lo hace una persona: lo tocan <strong>cinco</strong> — tráfico, liquidaciones, facturación, contable y la capa de mando que los supervisa.",
      "mis.p.2": 'Y el país donde eso pasa es enorme: <strong>55,506 empresas</strong> de autotransporte con más de 5 unidades operan en México <span class="gris-suave">(Estadística Básica del Autotransporte Federal, DGAF-SICT)</span>. El combustible representa entre <strong>30% y 50%</strong> de su costo operativo <span class="gris-suave">(CANACAR vía Expansión; Total Protect vía T21 — no hay cifra oficial única, por eso citamos el rango)</span>. Y les faltan entre <strong>80,000 y 99,000 operadores</strong>, con decenas de miles de camiones parados por falta de chofer <span class="gris-suave">(CANACAR/IRU)</span>.',
      "mis.h2.2": "El transporte es un negocio de documentos con un camión encima.",
      "mis.p.3": 'Cada viaje genera su rastro de papel: la carta porte, los tickets de diésel, los cruces de caseta, los viáticos, el POD. Liquidar ese rastro a mano cuesta hoy alrededor de <strong>$105 pesos por viaje</strong> <span class="gris-suave">(banda $94–$115 según el tamaño de la flota; censo propio sobre 1,318 vacantes verificadas de 829 empresas de transporte)</span> — y el renglón más pesado es teclear comprobantes: minutos por ticket, tickets por viaje, viajes por día.',
      "mis.p.4": 'Lo fiscal lo vuelve peor a propósito: la cuota de IEPS acreditable del diésel <strong>varió 3.5 veces en 2026</strong> <span class="gris-suave">(de $7.36 a $2.09 por litro — DOF, LIF art. 20-A)</span> y se publica cada semana. El estímulo del 50% de peaje exige una bitácora conciliada que casi nadie lleva. El comprobante que no se factura a tiempo pierde su deducibilidad completa. Cada uno de esos huecos es dinero que la flota ya se ganó y no cobra.',
      "mis.h2.3": "Por qué nadie lo ha resuelto",
      "mis.p.5": "Porque el software le pidió al transportista que cambiara: que sus choferes bajaran una app, que su contador migrara de sistema, que la operación se detuviera a implementar. El chofer no baja apps. El contador no suelta su ERP. Y la operación no se detiene nunca.",
      "mis.p.6": "Likida partió de la regla contraria: <strong>conectarse a lo que ya existe</strong>. El operador usa el WhatsApp que ya tiene. El contador recibe el archivo que su SAP Business One o CONTPAQi ya sabe importar. Nadie aprende nada nuevo — el sistema aprende la operación.",
      "mis.h2.4": "Del registro a los agentes",
      "mis.e.1.h": "Uno. El registro.",
      "mis.e.1.p": "Cada comprobante, viaje y cruce de caseta vive en un solo lugar, validado contra el SAT — vigente, receptor correcto, emisor fuera del 69-B.",
      "mis.e.2.h": "Dos. El cuadre.",
      "mis.e.2.p": "Un motor determinístico — no un modelo de lenguaje — cuadra cada viaje contra el anticipo y tu política de gastos. La IA lee y conversa; el motor calcula. Nunca al revés.",
      "mis.e.3.h": "Tres. Los agentes.",
      "mis.e.3.p": "Despacho, cobranza de comprobantes, recuperación de CFDI, conciliación de peajes: cada tarea del ciclo la ejecuta un agente que dice qué entrega y cuándo.",
      "mis.e.4.h": "Cuatro. El ciclo completo.",
      "mis.e.4.p": "Del ticket en la cabina al PDF firmado y al asiento en tu ERP — sin que nadie capture, persiga ni retecle en el camino.",
      "mis.h2.5": "A lo que le estamos tirando",
      "mis.cita": "Ser el sistema operativo del back-office del autotransporte de carga mexicano — empezando por la liquidación de viajes y expandiendo agente por agente.",
      "mis.p.7": "Los siguientes agentes no se inventaron en una sala de juntas: los pidió en voz alta una flota real, en una llamada real. Así se decide qué construir — escuchando a quien opera, no adivinando desde el escritorio.",
      "mis.h2.6": "Quién lo construye",
      "mis.p.8": "Javier Cámara — Contador Público que construye orquestando flotas de agentes de IA. Likida existe porque su fundador puede leer la RMF, la LIF y el CFF en fuente primaria y convertirlas en software determinístico que un contralor puede defender en una revisión.",
      "mis.p.9": "Una nota de honestidad: Likida está construyendo sus primeras flotas piloto, y esta página lo dice cada vez que importa. No vas a encontrar aquí logos de clientes que no existen ni proyecciones a cinco años — vas a encontrar un producto que puedes ver corriendo con tus propios tickets, hoy."
    },

    en: {
      /* ── head ── */
      "idx.title": "Likida — AI trip settlement for freight fleets in Mexico",
      "idx.desc": "AI agents that settle your trucking fleet's trips over WhatsApp: they validate every CFDI against Mexico's SAT and reconcile diesel, tolls and per diems.",
      "mis.title": "Likida's mission — automating the freight trucking back-office",
      "mis.desc": "Why Likida exists: in Mexican trucking the receipt travels slower than the truck. The thesis for automating the back-office, one agent at a time.",

      /* Social identity. OG/Twitter crawlers do not run JS and always read the
         Spanish in the HTML; these keys only change what the visitor sees. */
      "og.idx.title": "Likida — The freight back-office, automated with AI agents",
      "og.idx.desc": "Settle your fleet's trips over WhatsApp: every CFDI validated against Mexico's SAT, with diesel, tolls and per diems reconciled against your expense policy.",
      "og.mis.title": "Likida's mission — the money's last mile in freight",
      "og.mis.desc": "Trucking is a documents business with a truck on top. Why we automate the Mexican freight back-office, one AI agent at a time.",
      "og.img.alt": "Likida — the freight back-office, automated with AI agents: trip settlement, CFDI validated against the SAT and toll reconciliation.",

      /* ── notice bar + header ── */
      "aviso": "Likida is forming its <strong>closed group of pilot fleets</strong> this quarter — every pilot is set up by hand and spots are limited.",
      "logo.aria": "Likida — home",
      "nav.producto": "Product",
      "nav.ciclo": "The cycle",
      "nav.seguridad": "Security",
      "nav.mision": "Mission",
      "nav.blog": "Blog",
      "nav.faq": "FAQ",
      "cta.contacto": "Contact us",
      "gd.volver": "Back",
      "gd.volver.aria": "Back to home",
      "idioma.aria": "Language",
      "idioma.en": "Switch to English",
      "idioma.es": "Switch to Spanish",

      /* ── hero ── */
      "hero.h1": 'Your trucking back-office,<br><span class="subrayado">automated<svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true"><path class="trazo-mano" pathLength="1" d="M6 18 C70 8 150 6 294 12"/></svg></span> with AI agents.',
      "hero.sub": "It validates receipts against the SAT, applies your expense policy and settles each trip — from the WhatsApp your driver already uses. No new apps, no ERP migration.",
      "hero.nota": "In the demo you watch it run on a trip of yours: bring 10 photos from a closed trip.",

      /* ── the problem ── */
      "prob.kicker": "THE PROBLEM",
      "prob.h2": "The trucking back-office still runs on paper, web portals and Excel.",
      "prob.1.h": "Receipts keyed in by hand",
      "prob.1.p": "The driver piles his receipts in the glovebox and hands them over on Friday — or the Friday after. Typing each one in costs minutes per receipt, the heaviest line item in the whole cycle.",
      "prob.2.h": "Tolls reconciled every 10 days",
      "prob.2.p": "Matching the TAG (toll transponder) statement against the trips that actually ran is done by hand, whenever there is time. Without that log, the 50% toll tax credit is indefensible in an audit.",
      "prob.3.h": "CFDIs that expire before they are issued",
      "prob.3.p": "Every fuel station sets its own cutoff to issue the CFDI — some give you 72 hours. A receipt that expires is not an annoyance: it is an expense that loses its deduction entirely.",
      "prob.4.h": "Renewal dates that lapse without warning",
      "prob.4.p": "Permits, emissions checks, insurance policies, driver licenses: there is no single view watching all of them together. By the time someone finds out, the operation is already stopped.",

      /* ── numbers band ── */
      "stat.1.que": "is what settling one trip by hand costs today",
      "stat.1.fuente": "Range of $94–$115 depending on fleet size. Our own census: 1,318 verified job postings across 829 trucking companies.",
      "stat.2.unidad": "ROLES",
      "stat.2.que": "touch the settlement cycle of every trip today",
      "stat.2.fuente": "Dispatch, settlements, invoicing, accounting and the management layer that supervises them.",
      "stat.3.unidad": "MIN",
      "stat.3.que": "per receipt keyed in by hand, ×3 per trip",
      "stat.3.fuente": "A stated assumption for the heaviest line item in the cycle — always adjustable with your own numbers.",
      "stat.4.que": "is how much the diesel IEPS credit swung in 2026",
      "stat.4.fuente": "From $7.36 to $2.09 per liter (DOF, LIF art. 20-A) — published every week, and almost nobody tracks it.",

      /* ── three-layer architecture ── */
      "arq.kicker": "HOW IT WORKS",
      "arq.h2": "Three layers that run on their own",
      "arq.p": "Likida plugs into what you already use — it replaces nothing. Data comes in where it already lives, the agents work it, and you see it reconciled in real time.",
      "arq.1.h": "Where the data comes in",
      "arq.1.p": "Your driver's WhatsApp, CFDIs from the SAT, the toll and TAG portals, your fleet GPS and your ERP.",
      "arq.2.h": "The agents that do the work",
      "arq.2.p": "Drivers, receipt collection, trip settlement, invoices and toll reconciliation — end to end.",
      "arq.3.h": "What you see in real time",
      "arq.3.p": "The queue of trips left to close, creditable VAT, eligible liters, flagged toll discrepancies and renewal alerts.",
      "arq.alt": "Isometric diagram of Likida's three layers: the data sources (WhatsApp, the SAT, toll and TAG portals, GPS and the ERP), the AI agents that work them, and the real-time dashboard",

      /* ── stepper ── */
      "step.titulo": "SETTLEMENT AGENT — AUTOMATIC CYCLE",
      "step.hecho": "Done",
      "step.curso": "Running",
      "step.pendiente": "Pending",
      "step.1.h": "Receives the receipts",
      "step.1.p": "The driver sends the photos over WhatsApp when the trip ends.",
      "step.2.h": "Reads and decodes",
      "step.2.p": "Pulls the amount, RFC and fiscal folio from every receipt and its CFDI.",
      "step.3.h": "Validates against the SAT",
      "step.3.p": "Active, correct recipient, issuer not on the 69-B blacklist.",
      "step.4.h": "Checks it against your policy",
      "step.4.p": "Compares what was documented against the cash advance and your expense rules.",
      "step.5.h": "Generates the settlement",
      "step.5.p": "A PDF with the breakdown and the tax citations, ready for review.",
      "step.6.h": "Exports to your ERP",
      "step.6.p": "The file SAP Business One or CONTPAQi already knows how to import.",

      /* ── scrollytelling ── */
      "scr.kicker": "IN PRACTICE",
      "scr.h2": "This is how a trip gets closed.",
      "scr.chat.1": "Diesel receipt · 14:22",
      "scr.chat.2": "Marín–Los Ramones toll · 14:23",
      "scr.chat.3": 'Got them. Diesel $2,840 — CFDI <span class="ok">active ✓</span> validated with the SAT. Toll $312 — <span class="ok">within policy ✓</span>',
      "scr.chat.4": "done",
      "scr.chat.5": 'Trip MTY→NLD reconciled against your cash advance. <strong>Settlement ready for review</strong> — PDF with the tax citations in the dashboard.<span class="mini">Nobody keyed in a thing.</span>',
      "scr.1.k": "STEP 1",
      "scr.1.h": "The driver sends his photos",
      "scr.1.p": 'When the trip ends, he photographs his receipts from the WhatsApp he already has. His entire training: "send the photos and type done".',
      "scr.2.k": "STEP 2",
      "scr.2.h": "It reads and validates itself",
      "scr.2.p": "Every receipt is read and decoded, and its CFDI is validated straight against the SAT: active, correct recipient, issuer off the 69-B list.",
      "scr.3.k": "STEP 3",
      "scr.3.h": 'One "done" and the engine reconciles',
      "scr.3.p": "What was documented is compared against the cash advance and your expense policy. The totals come from a deterministic engine — the AI never makes up a number.",
      "scr.4.k": "STEP 4",
      "scr.4.h": "The settlement comes out",
      "scr.4.p": "A PDF with the breakdown and the tax citations, ready for the driver and for the accountant — plus the file your ERP already knows how to import.",

      /* ── the full cycle ── */
      "cic.kicker": "THE FULL CYCLE",
      "cic.h2": "From the receipt in the cab to the signed PDF, with no data entry.",
      "cic.1.h": "Dispatches the trip",
      "cic.1.p": "The dispatch manager assigns the trip over WhatsApp; the system notifies the driver and chases his acceptance.",
      "cic.2.h": "Follows it on the road",
      "cic.2.p": 'Stamps the milestones "arrived / unloading / heading back" as they happen, without anyone calling to ask.',
      "cic.3.h": "Escalates only when it has to",
      "cic.3.p": "If the driver does not accept his trip in time, the manager gets the alert — not before, and never over his judgment.",
      "cic.4.h": "Collects the receipts",
      "cic.4.p": "Chases the missing receipt that is holding the trip open, with an honest queue: it says who it is about to message and why.",
      "cic.5.h": "Reads and reconciles the settlement",
      "cic.5.p": 'The driver sends the photos and types "done"; the engine reconciles against the cash advance and your expense policy.',
      "cic.6.h": "Recovers the CFDI",
      "cic.6.p": "Keeps the invoicing calendar for every receipt and flags which one is about to expire, on which portal, with the direct link.",
      "cic.7.h": "Reconciles the tolls",
      "cic.7.p": "Matches the TAG statement against the crossings that actually happened and builds the log the 50% toll credit requires.",
      "cic.8.h": "Exports to your ERP",
      "cic.8.p": "The file your SAP Business One or CONTPAQi already knows how to import, with no re-keying — your ERP is never touched.",
      "cic.9.h": "Reports to each role",
      "cic.9.p": "The controller gets the tax side, dispatch gets the escalations, the accountant gets his queue — nobody gets somebody else's noise.",
      "cic.10.h": "Watches the tax side and the renewals",
      "cic.10.p": "Creditable VAT, the 50% toll credit and diesel IEPS by the liter — each one with its statute cited on screen.",

      /* ── photo banner ── */
      "ban.1.alt": "Tractor-trailer on the highway",
      "ban.1.sub": "ON THE ROAD",
      "ban.1.et": "The highway",
      "ban.1.d": "The trip runs up expenses from kilometer zero — and every one leaves a receipt.",
      "ban.2.alt": "Toll booth",
      "ban.2.sub": "TAG · CAPUFE",
      "ban.2.et": "Tolls",
      "ban.2.d": "Every TAG crossing is reconciled against its trip, with no log kept by hand.",
      "ban.3.alt": "Diesel fill-up",
      "ban.3.sub": "IEPS BY THE LITER",
      "ban.3.et": "Diesel",
      "ban.3.d": "Liters and creditable IEPS, read off the receipt in seconds.",
      "ban.4.alt": "Driver photographing his receipt",
      "ban.4.sub": "WHATSAPP",
      "ban.4.et": "The driver",
      "ban.4.d": "A photo of the receipt over WhatsApp and that is it — no new apps to learn.",
      "ban.5.alt": "Truck yard",
      "ban.5.sub": "DISPATCH",
      "ban.5.et": "The yard",
      "ban.5.d": "The trip starts out with its budget and its cash advance already on record.",
      "ban.6.alt": "Truck scale",
      "ban.6.sub": "MILESTONES · POD",
      "ban.6.et": "The scale",
      "ban.6.d": "Every milestone of the trip is recorded with its evidence.",
      "ban.7.alt": "Border crossing",
      "ban.7.sub": "CROSSINGS",
      "ban.7.et": "The border",
      "ban.7.d": "Border expenses documented on the spot, not on the way back.",
      "ban.8.alt": "The accountant's desk",
      "ban.8.sub": "TAX CLOSE",
      "ban.8.et": "The accountant",
      "ban.8.d": "CFDIs validated against the SAT, ready to deduct with no surprises.",

      /* ── security ── */
      "seg.svgAria": "Likida's security ring: valid CFDIs are verified and cross the rings toward the core isolated for your fleet; an invalid document is rejected at the outer ring.",
      "seg.svg.1": "ISOLATED PER FLEET",
      "seg.svg.2": "END-TO-END ENCRYPTION · CFDI VALIDATED AGAINST THE SAT",
      "seg.kicker": "SECURITY",
      "seg.h2": 'Your data, <span class="gris-suave">protected by design.</span>',
      "seg.p": "We describe real controls instead of hanging up acronyms.",
      "seg.1.h": "Every fleet lives isolated",
      "seg.1.p": "The database denies access by default and every query re-checks session, role and fleet on the server — never in the browser.",
      "seg.2.h": "Credentials encrypted one way",
      "seg.2.p": "ERP, GPS or fuel cards: stored encrypted with the key held outside the database. They are never shown back.",
      "seg.3.h": "Validated straight against the SAT",
      "seg.3.p": "Every CFDI is checked as active, with the right recipient and an issuer off the 69-B list. The one that fails does not slip quietly into your books.",
      "seg.4.h": "The AI never makes up a number",
      "seg.4.p": "The totals come from a deterministic engine. If the AI and the engine disagree, the engine wins — or nothing goes out.",

      /* ── demo ── */
      "demo.kicker": "BOOK A DEMO",
      "demo.h2": 'See your own trip, <span class="gris-suave">already reconciled.</span>',
      "demo.p": "Bring 10 photos from a closed trip and watch it run on your numbers — not on ours. 30 minutes over Google Meet, with live availability.",
      "demo.1.h": "Tell us about your fleet",
      "demo.1.p": "Name, size and a contact — nothing else.",
      "demo.2.h": "Pick your time",
      "demo.2.p": "The calendar below is the real one: what shows up as open, is open.",
      "demo.3.h": "Come with your receipts",
      "demo.3.p": "The demo runs on a trip of yours, reconciled live.",
      "demo.p1.et": "STEP 1 OF 3",
      "demo.p1.t": "Book a personalized demo",
      "demo.p1.hint": "Tell us a bit about your fleet",
      "demo.ph.empresa": "Your company name",
      "demo.ph.nombre": "First name",
      "demo.ph.apellido": "Last name",
      "demo.continuar": "Continue",
      "demo.regresar": "Back",
      "demo.p2.et": "STEP 2 OF 3",
      "demo.p2.t": "Where do we reach you?",
      "demo.p2.hint": "We use this only to set up your demo",
      "demo.ph.correo": "Work email",
      "demo.ph.tel": "Phone / WhatsApp",
      "demo.u.0": "How many trucks does your fleet run?",
      "demo.u.1": "5 to 30 trucks",
      "demo.u.2": "31 to 100 trucks",
      "demo.u.3": "101 to 250 trucks",
      "demo.u.4": "More than 250 trucks",
      "demo.p3.et": "STEP 3 OF 3",
      "demo.p3.t": "Pick your time",
      "demo.p3.hint": "Live availability — the meeting lands straight on our calendar",
      "demo.cal.nota": "Once you book, the invite with the Google Meet link lands in your inbox.",

      /* ── contact page (getdemo.html) ── */
      "con.title": "Contact — book a Likida demo with a trip of your own",
      "con.desc": "Book 30 minutes with Likida and watch one of your own trips reconciled live: bring 10 photos from a closed trip and keep the settlement.",
      "og.con.title": "Book a Likida demo — on your own trip, not on ours",
      "og.con.desc": "30 minutes over Google Meet. Bring 10 photos from a closed trip and watch it reconciled live: CFDIs validated against the SAT, diesel, tolls and per diems.",
      "con.kicker": "BOOK A DEMO",
      "con.h1": 'Bring one closed trip. <span class="gris-suave">Leave with it reconciled.</span>',
      "con.sub": "30 minutes over Google Meet. We run the settlement on your receipts, your expense policy and your numbers — not on a demo account.",
      "con.img.alt": "Line illustration: two hands laying out the receipts of a trip in a row on a desk, next to a laptop showing the settlement and a phone with a message.",
      "con.b1.k": "THE 30 MINUTES",
      "con.b1.1": "You tell us how you settle trips today: who types, who reviews, and which day of the week it jams.",
      "con.b1.2": "We upload your photos live. The agent reads them, validates every CFDI against the SAT and reconciles diesel, tolls and per diems against your policy. You watch it on shared screen, not in a recorded video.",
      "con.b1.3": "We tell you what broke, what we still cannot do, and what it would take to run it across your whole fleet.",
      "con.b2.k": "WHAT TO BRING",
      "con.b2.1": "<strong>10 photos from a trip you already closed</strong> — diesel, toll and per diem receipts, exactly as the driver handed them over. Crooked and with a thumb in the frame is fine: that is how they arrive in real life.",
      "con.b2.2": "<strong>If you have it handy,</strong> that week's toll tag statement. With it we show you the toll reconciliation.",
      "con.b2.3": "<strong>No access needed.</strong> We do not ask for your ERP, your GPS or your fuel card for the demo. That conversation comes later, if there is a pilot.",
      "con.b3.k": "WHAT YOU LEAVE WITH",
      "con.b3.1": "<strong>The settlement for that trip</strong> as a PDF, plus the file your SAP Business One or CONTPAQi already knows how to import.",
      "con.b3.2": "<strong>The verdict on every receipt:</strong> which ones passed SAT validation, which ones did not, and why.",
      "con.b3.3": "<strong>It is yours even if you never buy.</strong> If the demo goes badly we tell you on the call and there is no follow-up.",
      "con.honesto": "You will not find client logos or testimonials on this page: Likida is putting together its first group of pilot fleets and has no customers to show off yet. What you can see is the product running on a trip of yours — which is the only proof that counts.",
      "con.privacidad": "Your details are used only to set up the demo. They are not shared, not sold and not added to any list — if you do not book, they just sit there.",

      /* ── FAQ ── */
      "faq.kicker": "FREQUENTLY ASKED QUESTIONS",
      "faq.h2": "What every fleet asks us.",
      "faq.1.q": "Does Likida replace my team?",
      "faq.1.a": "No. The AI does not decide anything about your money: the model reads photos and holds a conversation, it never calculates an amount. The deterministic engine reconciles the settlement and your people decide on what the system already prepared — in seconds, not days.",
      "faq.2.q": "What if the SAT is down when you validate my invoices?",
      "faq.2.a": 'The settlement does not fall over. If the SAT service does not answer, the CFDI is marked "pending validation" and the flow keeps going — the system retries and tells you if anything was left without a verdict. That is designed behavior, not a failure.',
      "faq.3.q": "What happens to my data? Who else sees it?",
      "faq.3.a": "Every fleet lives isolated at the database level. The AI does not decide which data it works with — the identifiers always come from the server. Your ERP, GPS or fuel card credentials are encrypted and never shown back.",
      "faq.4.q": "I already have a TMS or an ERP. Does this replace it?",
      "faq.4.a": "No, by design. Today we hand you the file your SAP Business One or CONTPAQi already knows how to import, with no re-keying. Your ERP is never touched — writing to it directly exists as the next step and turns on only with the access you control.",
      "faq.5.q": "Will my drivers actually use it?",
      "faq.5.a": 'The driver does not learn any system: he uses the WhatsApp he already has. His entire training is "send the photos of your receipts and when you are finished type <em>done</em>". If something comes in late, it is not lost — it carries over to his next trip.',

      /* ── closing CTA ── */
      "cta2.h2": 'The receipt no longer travels <em style="font-style:italic">slower than the truck.</em>',
      "cta2.p": "Book 30 minutes and watch a trip of yours reconciled live — with your numbers, not with ours.",

      /* ── footer ── */
      "foot.k1": "PRODUCT",
      "foot.k2": "COMPANY",
      "foot.k3": "CONNECT",
      "foot.como": "How it works",
      "foot.ciclo": "The full cycle",
      "foot.seguridad": "Security",
      "foot.faq": "FAQ",
      "foot.mision": "Mission",
      "foot.contacto": "Contact",
      "foot.tag1": "The operating system for the back-office of Mexican freight trucking.",
      "foot.tag2": "Starting with trip settlement, one agent at a time.",
      "foot.legal": "Likida. Not one figure on this page was made up — every one has its source.",

      /* ── mission ── */
      "mis.kicker": "MISSION",
      "mis.h1": 'The last mile isn\'t the freight\'s. <span class="gris-suave">It\'s the money\'s.</span>',
      "mis.h2.1": "The Mexican carrier does not have an expense problem. It has a problem with the receipt traveling slower than the truck.",
      "mis.p.1": "Every freight fleet in Mexico ends its day with the same ritual: the trip is dispatched by phone, the driver is chased down, his diesel, toll and per-diem receipts are keyed in, they are reconciled against the cash advance, and somebody logs into the portals to pull the missing CFDIs. It is not one person's job: <strong>five</strong> of them touch it — dispatch, settlements, invoicing, accounting and the management layer that supervises them.",
      "mis.p.2": 'And the country where that happens is enormous: <strong>55,506 trucking companies</strong> with more than 5 units operate in Mexico <span class="gris-suave">(Estadística Básica del Autotransporte Federal, DGAF-SICT)</span>. Fuel accounts for between <strong>30% and 50%</strong> of their operating cost <span class="gris-suave">(CANACAR via Expansión; Total Protect via T21 — there is no single official figure, which is why we cite the range)</span>. And they are short between <strong>80,000 and 99,000 drivers</strong>, with tens of thousands of trucks parked for lack of one <span class="gris-suave">(CANACAR/IRU)</span>.',
      "mis.h2.2": "Trucking is a document business with a truck on top.",
      "mis.p.3": 'Every trip leaves its paper trail: the Carta Porte, the diesel receipts, the toll crossings, the per diems, the POD. Settling that trail by hand costs around <strong>$105 pesos per trip</strong> today <span class="gris-suave">(range $94–$115 depending on fleet size; our own census over 1,318 verified job postings across 829 trucking companies)</span> — and the heaviest line item is keying in receipts: minutes per receipt, receipts per trip, trips per day.',
      "mis.p.4": 'The tax side makes it worse on purpose: the creditable diesel IEPS rate <strong>swung 3.5 times in 2026</strong> <span class="gris-suave">(from $7.36 to $2.09 per liter — DOF, LIF art. 20-A)</span> and is published every week. The 50% toll credit requires a reconciled log that almost nobody keeps. A receipt that is not invoiced in time loses its deduction entirely. Every one of those gaps is money the fleet already earned and never collects.',
      "mis.h2.3": "Why nobody has solved it",
      "mis.p.5": "Because software asked the carrier to change: for its drivers to download an app, for its accountant to migrate systems, for the operation to stop for an implementation. The driver does not download apps. The accountant does not let go of his ERP. And the operation never stops.",
      "mis.p.6": "Likida started from the opposite rule: <strong>connect to what already exists</strong>. The driver uses the WhatsApp he already has. The accountant gets the file his SAP Business One or CONTPAQi already knows how to import. Nobody learns anything new — the system learns the operation.",
      "mis.h2.4": "From the record to the agents",
      "mis.e.1.h": "One. The record.",
      "mis.e.1.p": "Every receipt, trip and toll crossing lives in one place, validated against the SAT — active, correct recipient, issuer off the 69-B list.",
      "mis.e.2.h": "Two. The reconciliation.",
      "mis.e.2.p": "A deterministic engine — not a language model — reconciles every trip against the cash advance and your expense policy. The AI reads and converses; the engine calculates. Never the other way around.",
      "mis.e.3.h": "Three. The agents.",
      "mis.e.3.p": "Dispatch, receipt collection, CFDI recovery, toll reconciliation: every task in the cycle is run by an agent that states what it delivers and when.",
      "mis.e.4.h": "Four. The full cycle.",
      "mis.e.4.p": "From the receipt in the cab to the signed PDF and the entry in your ERP — with nobody keying in, chasing or re-typing along the way.",
      "mis.h2.5": "What we are going after",
      "mis.cita": "To be the operating system for the back-office of Mexican freight trucking — starting with trip settlement and expanding one agent at a time.",
      "mis.p.7": "The next agents were not invented in a boardroom: a real fleet asked for them out loud, on a real call. That is how we decide what to build — listening to whoever runs the operation, not guessing from a desk.",
      "mis.h2.6": "Who builds it",
      "mis.p.8": "Javier Cámara — a Mexican CPA who builds by orchestrating fleets of AI agents. Likida exists because its founder can read the RMF, the LIF and the CFF in the primary source and turn them into deterministic software a controller can defend in an audit.",
      "mis.p.9": "A note on honesty: Likida is building its first pilot fleets, and this page says so everywhere it matters. You will not find logos of customers who do not exist or five-year projections here — you will find a product you can watch running on your own receipts, today."
    }
  };

  var CLAVE = "likida.idioma";
  var DEFAULT = "es";
  var IDIOMAS = ["es", "en"];
  var idioma = DEFAULT;

  /* ── Diccionarios externos ──────────────────────────────────────────────────
     El blog son siete páginas largas: meterlas aquí obligaría a quien entra a
     la portada a bajarse el texto de seis artículos que no va a leer. Cada
     página del blog carga su propio diccionario ANTES que este archivo
     (js/i18n-blog.js en las siete, js/i18n-blog-<artículo>.js solo en la suya)
     y lo anuncia con window.LIKIDA_I18N.push({ en: {…} }). Aquí se funden en
     DICT antes de la primera pasada, así que el velo antiparpadeo los cubre
     igual que a lo demás. window.I18N.registra() hace lo mismo si algo llega
     tarde. */
  function funde(extra) {
    if (!extra) return;
    for (var f = 0; f < IDIOMAS.length; f++) {
      var lng = IDIOMAS[f];
      var tabla = extra[lng];
      if (!tabla) continue;
      if (!DICT[lng]) DICT[lng] = {};
      for (var k in tabla) {
        if (Object.prototype.hasOwnProperty.call(tabla, k)) DICT[lng][k] = tabla[k];
      }
    }
  }

  (function () {
    var cola = window.LIKIDA_I18N;
    if (!cola || !cola.length) return;
    for (var i = 0; i < cola.length; i++) funde(cola[i]);
  })();

  try {
    var guardado = window.localStorage.getItem(CLAVE);
    if (IDIOMAS.indexOf(guardado) !== -1) idioma = guardado;
  } catch (e) { /* localStorage bloqueado: seguimos en español */ }

  var raiz = document.documentElement;
  raiz.lang = idioma;

  // Velo anti-parpadeo: solo cuando el idioma guardado NO es el del HTML.
  // El temporizador se arma de inmediato para que un error posterior jamás
  // deje la página en blanco.
  if (idioma !== DEFAULT) {
    raiz.setAttribute("data-i18n-velo", "");
    window.setTimeout(quitaVelo, 1500);
  }
  function quitaVelo() { raiz.removeAttribute("data-i18n-velo"); }

  /* El HTML es el diccionario español. Lo que un nodo trae escrito se guarda
     como su valor por defecto la primera vez que se le pasa encima, así que el
     diccionario del blog solo declara el inglés y volver a español restituye el
     original exacto — sin transcribir dos veces dos mil palabras por artículo.
     Las claves que ya viven en DICT.es siguen mandando: esto es solo el
     respaldo para las que no están. */
  var ORIG = {};       // clave → innerHTML original del nodo
  var ORIG_ATTR = {};  // clave → valor original del atributo (o del campo JSON)

  function valor(clave) {
    var tabla = DICT[idioma] || DICT[DEFAULT];
    var v = tabla[clave];
    if (v == null) v = DICT[DEFAULT][clave];
    return v == null ? null : v;
  }

  function t(clave) {
    var v = valor(clave);
    if (v == null) v = ORIG[clave];
    if (v == null) v = ORIG_ATTR[clave];
    return v == null ? "" : v;
  }

  /* JSON-LD: data-i18n-json="ruta.al.campo:clave;otra.ruta:clave". La ruta se
     recorre por índices y nombres dentro del JSON del propio <script>. Los
     rastreadores no ejecutan JS y siempre leen el español; esto solo mantiene
     el bloque coherente con lo que el visitante está leyendo. */
  function aplicaJson(el) {
    var spec = el.getAttribute("data-i18n-json");
    if (!spec) return;
    var datos;
    try { datos = JSON.parse(el.textContent); } catch (e) { return; }
    var pares = spec.split(";");
    var cambio = false;
    for (var i = 0; i < pares.length; i++) {
      var par = pares[i].trim();
      if (!par) continue;
      var corte = par.indexOf(":");
      if (corte < 0) continue;
      var ruta = par.slice(0, corte).trim().split(".");
      var k = par.slice(corte + 1).trim();
      var nodo = datos;
      for (var j = 0; j < ruta.length - 1 && nodo != null; j++) nodo = nodo[ruta[j]];
      if (nodo == null) continue;
      var campo = ruta[ruta.length - 1];
      if (typeof nodo[campo] !== "string") continue;
      if (!(k in ORIG_ATTR)) ORIG_ATTR[k] = nodo[campo];
      var v = valor(k);
      if (v == null) v = ORIG_ATTR[k];
      if (v != null && nodo[campo] !== v) { nodo[campo] = v; cambio = true; }
    }
    if (cambio) el.textContent = JSON.stringify(datos, null, 2);
  }

  function aplicaNodo(el) {
    var clave = el.getAttribute("data-i18n");
    if (clave) {
      if (!(clave in ORIG)) ORIG[clave] = el.innerHTML;
      var v = valor(clave);
      if (v == null) {
        var o = ORIG[clave];
        if (o != null && el.innerHTML !== o) el.innerHTML = o;
      } else if (v) {
        if (v.indexOf("<") !== -1) { if (el.innerHTML !== v) el.innerHTML = v; }
        else if (el.textContent !== v) { el.textContent = v; }
      }
    }
    var attrs = el.getAttribute("data-i18n-attr");
    if (attrs) {
      var pares = attrs.split(";");
      for (var i = 0; i < pares.length; i++) {
        var par = pares[i].trim();
        if (!par) continue;
        var corte = par.indexOf(":");
        if (corte < 0) continue;
        var attr = par.slice(0, corte).trim();
        var k = par.slice(corte + 1).trim();
        if (!(k in ORIG_ATTR)) ORIG_ATTR[k] = el.getAttribute(attr);
        var val = valor(k);
        if (val == null) val = ORIG_ATTR[k];
        if (val) el.setAttribute(attr, val);
      }
    }
    if (el.hasAttribute("data-i18n-json")) aplicaJson(el);
  }

  function aplica(ambito) {
    var base = ambito || document;
    if (base.nodeType === 1) aplicaNodo(base);
    var nodos = base.querySelectorAll("[data-i18n],[data-i18n-attr],[data-i18n-json]");
    for (var i = 0; i < nodos.length; i++) aplicaNodo(nodos[i]);
  }

  function cambia(nuevo) {
    if (IDIOMAS.indexOf(nuevo) === -1 || nuevo === idioma) return;
    idioma = nuevo;
    try { window.localStorage.setItem(CLAVE, nuevo); } catch (e) {}
    raiz.lang = nuevo;
    aplica(document);
    document.dispatchEvent(new CustomEvent("i18n:cambio", { detail: { idioma: idioma } }));
  }

  document.addEventListener("click", function (ev) {
    var t0 = ev.target;
    var btn = t0 && t0.closest ? t0.closest("[data-idioma]") : null;
    if (!btn) return;
    ev.preventDefault();
    cambia(btn.getAttribute("data-idioma"));
  });

  function arranca() {
    aplica(document);
    quitaVelo();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arranca);
  } else {
    arranca();
  }

  window.I18N = {
    t: t,
    aplica: aplica,
    cambia: cambia,
    registra: function (tabla) { funde(tabla); aplica(document); },
    get idioma() { return idioma; }
  };
})();
