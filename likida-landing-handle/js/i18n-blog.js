/* ═══════════════════════════════════════════════════════════════════════════
   LIKIDA — diccionario del blog (piezas compartidas + índice).

   Se carga en las SIETE páginas del blog, ANTES de js/i18n.js, y se anuncia en
   window.LIKIDA_I18N. Solo declara el inglés: el español de cada nodo es lo
   que trae escrito el HTML, y el motor lo guarda como valor por defecto en la
   primera pasada.

   Términos fiscales mexicanos que NO se traducen: CFDI, SAT, IEPS, ISR, RFC,
   LIF, RMF, RFA, CFF, CANACAR, CAPUFE, DOF, PAC, Carta Porte, TAG. Las citas
   de normas se quedan en español porque son el texto legal. Ninguna cifra,
   fecha, porcentaje ni monto cambia entre idiomas.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  (window.LIKIDA_I18N = window.LIKIDA_I18N || []).push({
    en: {
      /* ── piezas que se repiten en los artículos ── */
      "blog.migajon": "← Likida Blog",
      "blog.tag.industria": "Industry",
      "blog.tag.fiscal": "Tax",
      "blog.tag.cumplimiento": "Compliance",
      "blog.tag.perspectiva": "Perspective",
      "blog.fecha.ago2026": "August 2026",
      "blog.lectura.7": "7 min read",
      "blog.lectura.8": "8 min read",
      "blog.lectura.9": "9 min read",
      /* El bloque de fundamento cita el texto legal literal, que se queda en
         español a propósito. La etiqueta lo dice para que el lector en inglés
         sepa por qué. */
      "blog.fundamento": "Legal basis — official Spanish text",
      "blog.fuentes": "Sources",
      "blog.leer": 'Read article <span aria-hidden="true">→</span>',
      "blog.ld.lang": "en-US",
      "blog.ld.inicio": "Home",

      /* ── índice del blog ── */
      "blog.idx.title": "Likida Blog — trip settlement, CFDI and trucking taxes",
      "blog.idx.desc": "Notes from one fleet operator to another on the trucking back-office: trip settlement, CFDI, diesel IEPS, tolls and Carta Porte.",
      "blog.idx.og.title": "Likida Blog — the trucking back-office, line by line",
      "blog.idx.og.desc": "Trip settlement, CFDI validated against the SAT, diesel IEPS, the 50% toll tax credit and Carta Porte. Every figure with its source.",
      "blog.idx.ld.name": "Likida Blog",
      "blog.idx.ld.desc": "Notes on the back-office of Mexican freight trucking: trip settlement, CFDI validated against the SAT, diesel IEPS, tolls and Carta Porte.",

      "blog.idx.etiqueta": "Likida Blog",
      "blog.idx.h1": "The trucking back-office, explained line by line.",
      "blog.idx.bajada": "Trip settlement, CFDI (Mexico's digital tax receipt), diesel IEPS, tolls and Carta Porte — from one fleet operator to another. Every figure comes with its source; when there is no source, there is no figure.",
      "blog.idx.aparte": "Would you rather see it with your own receipts? Bring 10 photos from a closed trip and we will reconcile it with you in 30 minutes.",

      "blog.idx.c1.alt": "Line drawing of a stack of trip receipts with a dimension line measuring how tall it is",
      "blog.idx.c1.h": "Nobody measures what it costs to settle a trip by hand. We measured it.",
      "blog.idx.c1.p": "The cost of trip settlement does not live in any accounting line: it is spread across dispatch, settlements, invoicing and accounting. Our own census puts it at around $105 per trip, in a range of $94 to $115.",

      "blog.idx.c2.alt": "Diesel nozzle pouring a thin stream of fuel into a graduated cylinder",
      "blog.idx.c2.h": "The IEPS tax credit is not lost in the math. It is lost on the fuel station's CFDI.",
      "blog.idx.c2.p": "The creditable amount is not written on any line of the receipt: it is liters times the rate in force the day of the fill-up. Which CFDI fields hold up the LIF art. 20-A tax credit, and which ones sink it right at the pump.",

      "blog.idx.c3.alt": "Toll booth with a TAG reader and a toll transponder sending a signal toward a trip log with three empty columns",
      "blog.idx.c3.h": "Half your toll spend credits against ISR. First you have to prove the crossing was yours.",
      "blog.idx.c3.p": "The 50% is one multiplication. The expensive part is everything else: the TAG statement arrives consolidated by month and never says which trip each crossing belongs to. Regla 9.1.8 requires the trip log and that statement to match.",

      "blog.idx.c4.alt": "Shipping document drawn in fine line work, with a magnifying glass over its lines and a clock beside it",
      "blog.idx.c4.h": "Nobody checks the Carta Porte when it is issued. They check it when it can no longer be fixed.",
      "blog.idx.c4.p": "Almost every error in the complemento clears stamping without a sound: the PAC validates arithmetic and catalogs, not whether the trip happened the way the paperwork says. What to cross-check at settlement, while fixing it is still cheap.",

      "blog.idx.c5.alt": "Receipt crossed out by a diagonal line, a calendar with one box filled in black and a diesel nozzle, in black line work on a cream background",
      "blog.idx.c5.h": "Your supplier can cancel the diesel invoice after you have already deducted it.",
      "blog.idx.c5.p": "Two clocks run on every receipt you already consider closed: the CFDI cancellation window in force in 2026 and the thirty days of artículo 69-B. Neither one knocks first.",

      "blog.idx.c6.alt": "Line diagram: a square core joined by six spokes to a diesel nozzle, a toll booth, documents, a scale, a stamp and a tractor-trailer; one of the spokes is drawn as a dashed line",
      "blog.idx.c6.h": "What an AI agent can and cannot do in a fleet's back office",
      "blog.idx.c6.p": "The model reads and sorts; the engine calculates. Where each one belongs, which parts of the cycle still need human hands, and the five questions to put to any vendor — Likida included."
    }
  });
})();
