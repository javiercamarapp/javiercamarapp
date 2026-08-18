/* ═══════════════════════════════════════════════════════════════════════════
   LIKIDA — inglés de cancelacion-cfdi-plazo-2026-flotas.html
   Se carga solo en esa página, antes de js/i18n.js. Solo declara el inglés:
   el español de cada nodo es el que trae escrito el HTML.

   Los términos fiscales mexicanos (CFDI, SAT, ISR, IEPS, RFC, CFF, RMF, DOF,
   Carta Porte) no se traducen: llevan glosa corta en inglés la primera vez que
   aparecen y de ahí en adelante van solos. Los nombres de las normas y sus
   citas (Código Fiscal de la Federación, artículo 29-A cuarto párrafo, regla
   2.7.1.34., Transitorio Décimo Tercero) se quedan en español. Las citas
   literales del <aside class="blog-fundamento"> no llevan clave: se quedan en
   español en los dos idiomas porque son el texto de la norma. Ninguna cifra,
   fecha ni monto cambia entre idiomas.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  (window.LIKIDA_I18N = window.LIKIDA_I18N || []).push({
    en: {
      /* ── head, social y JSON-LD ── */
      "blog.cancelacion.title": "CFDI cancellation: the 2026 deadline for fleets | Likida",
      "blog.cancelacion.desc": "The CFDI cancellation window in 2026 runs through the month the annual ISR return is due. What to do when a supplier cancels a receipt you already deducted.",
      "blog.cancelacion.og.desc": "The CFDI cancellation window in 2026 runs through the month the annual ISR return is due. What to do when a supplier cancels a receipt you already deducted.",
      /* Mismo inglés que blog.idx.c5.h en js/i18n-blog.js: el índice y el
         artículo no pueden titular distinto. */
      "blog.cancelacion.ld.headline": "Your supplier can cancel the diesel invoice after you have already deducted it.",
      "blog.cancelacion.ld.desc": "The CFDI cancellation window in 2026 runs through the month the annual ISR return is due. What to do when a supplier cancels a receipt you already deducted.",
      "blog.cancelacion.ld.keywords": "CFDI cancellation deadline 2026",

      /* ── cabecera del artículo ── */
      "blog.cancelacion.h1": "Your supplier can cancel the diesel invoice after you have already deducted it.",
      "blog.cancelacion.entradilla": "Two clocks run on every receipt your fleet already considers closed: the CFDI (Mexico's digital tax receipt) cancellation window in force in 2026 and the thirty days of artículo 69-B. Neither one knocks first.",
      "blog.cancelacion.portada.alt": "Receipt crossed out by a diagonal line, a calendar with one box filled in black and a diesel nozzle, in black line work on a cream background",

      /* ── cuerpo ── */
      "blog.cancelacion.p1": 'A CFDI is not a piece of paper: it is a status held on the servers of the SAT (Mexico\'s tax authority). It can be "Active" on the Tuesday the settlements desk staples it into the trip file and show up "Canceled" seven months later, without anyone in your fleet finding out. By then the deduction has been taken, the diesel IEPS (Mexico\'s excise tax on fuel) has been credited and the trip has been billed to the customer. The supporting documentation collapsed on its own.',

      "blog.cancelacion.h2.1": "How late a CFDI can still be canceled",
      "blog.cancelacion.p2": 'Short answer: <strong>through the month the annual ISR (Mexico\'s income tax) return is due for the year the receipt was issued</strong>. If the supplier is a company, that month is March — the Ley del ISR gives it three months after year-end. If it is an individual, April. In practice: a diesel invoice issued in March 2026 by a fuel station that files as a company can be canceled all the way through March 2027.',
      "blog.cancelacion.p3": 'That is the CFDI cancellation window in force in 2026, and what is new is not the window itself — the Resolución Miscelánea (RMF, Mexico\'s annual miscellaneous tax rules) already granted it as administrative relief — but where it lives now: it moved up into the Código Fiscal de la Federación with the amendment published in the <a href="https://www.dof.gob.mx/">DOF</a> (Mexico\'s official gazette) on November 7, 2025. What used to sit in a rule renewed every year is now in the statute.',
      "blog.cancelacion.cite.1": "Código Fiscal de la Federación, artículo 29-A, cuarto párrafo — amended by decree published in the DOF on November 7, 2025. Text in force, last amended DOF 09-04-2026.",
      "blog.cancelacion.p4": "The last line is the one to read twice: <em>and provided that the person in whose favor they are issued accepts the cancellation</em>. Canceling is not something the supplier does on its own. It is a request that lands in your tax mailbox and waits for your answer. That is where the real problem starts.",

      "blog.cancelacion.h2.2": "If nobody answers, it cancels",
      "blog.cancelacion.p5": "Silence counts as acceptance, and the window to break it is short.",
      "blog.cancelacion.cite.2": "Resolución Miscelánea Fiscal para 2026, regla 2.7.1.34., segundo y tercer párrafos — published in the DOF on December 28, 2025.",
      "blog.cancelacion.p6": "Three days. In a fleet, that tax mailbox notice lands in an inbox the outside accounting firm checks twice a week, or the controller when he gets to it, or nobody at all during the close. Not answering is not leaving the decision open: it is making it.",

      "blog.cancelacion.h3.1": "The two exceptions that do protect the buyer",
      "blog.cancelacion.li.1.1": 'Income and credit-note CFDIs carrying the "Complemento Concepto para la facturación de Hidrocarburos y Petrolíferos", which anyone who sells gasoline or diesel has to include.',
      "blog.cancelacion.li.1.2": 'Income CFDIs with the Carta Porte complemento (Mexico\'s electronic waybill) where the "BienesTransp" field carries one of these three codes: <strong>15101505</strong> Diesel fuel, <strong>15101514</strong> Regular gasoline below 91 octane, or <strong>15101515</strong> Premium gasoline at or above 91 octane.',
      "blog.cancelacion.p7": "In those two cases silence does not cancel: acceptance has to be express. And it is already in force. Transitorio Décimo Tercero of the RMF 2026 left the exception conditional on the SAT publishing the complemento on its portal and on the thirty calendar days of regla 2.7.1.8. running out. Both have already happened: the complemento schema has been live on the SAT portal since March 2026, so the obligation took effect on <strong>April 24, 2026</strong>. From that date on, silence from the recipient stopped counting as acceptance on those CFDIs. And it pays to look at the other side of it before celebrating: it protects your diesel liters and nothing else. Parts, tires, shop work, the driver's lodging, the toll billed by the highway concessionaire — there, silence still cancels.",

      "blog.cancelacion.h2.3": "The second clock: the 69-B list",
      "blog.cancelacion.p8": 'Your supplier starts the first clock. The SAT starts the second one, and it does not tell you. When the authority concludes that a taxpayer issued receipts without assets, staff, infrastructure or the actual capacity to deliver, it publishes that taxpayer on a list in the DOF and on its own portal. From that publication on, the transactions backed by its receipts "produce and have produced no tax effect whatsoever" — past tense, reaching backwards, over everything you already deducted.',
      "blog.cancelacion.cite.3": "Código Fiscal de la Federación, artículo 69-B, octavo párrafo. Text in force, last amended DOF 09-04-2026.",
      "blog.cancelacion.p9": "Thirty days, and they are business days: artículo 12 of the CFF (Mexico's federal tax code) leaves Saturdays, Sundays and the holidays it lists out of any deadline counted in days. Whoever took the deduction lands on the EDOS side — the companies that deducted the simulated transactions — and the burden of proof is theirs: showing that the diesel went into the tank, that the tire went onto a truck, that the service was performed. The CFDI is no help as proof, because the CFDI is exactly what is being questioned.",

      "blog.cancelacion.destacado": "Nobody looks at a CFDI again once the trip is settled. That is exactly where both clocks run.",

      "blog.cancelacion.tabla.th.1": "Clock",
      "blog.cancelacion.tabla.th.2": "Who starts it",
      "blog.cancelacion.tabla.th.3": "Where you find out",
      "blog.cancelacion.tabla.th.4": "Window",
      "blog.cancelacion.tabla.1.1": "CFDI cancellation",
      "blog.cancelacion.tabla.1.2": "The supplier that issued it.",
      "blog.cancelacion.tabla.1.3": "A request in your tax mailbox.",
      "blog.cancelacion.tabla.1.4": "3 d",
      "blog.cancelacion.tabla.2.1": "The artículo 69-B list",
      "blog.cancelacion.tabla.2.2": "The SAT, when it publishes the final list.",
      "blog.cancelacion.tabla.2.3": "The DOF and the SAT portal. Nobody notifies you.",
      "blog.cancelacion.tabla.2.4": "30 d",

      "blog.cancelacion.h2.4": "Why this hits a fleet harder",
      "blog.cancelacion.p10": "A fleet buys at dozens of different stations a month, plus repair shops, plus parts suppliers, plus tolls, on routes that almost never repeat the same way twice. There is no one big supplier to keep an eye on: there is a long tail of small ones, many with an RFC (Mexico's taxpayer ID) nobody looked at again after the first fill-up. And that receipt does not sit in a folder filed by supplier: it sits inside the settlement of a trip that closed months ago.",
      "blog.cancelacion.p11": 'That is the knot. Five different roles touch the settlement cycle, and doing it by hand costs around $105 per trip. Not one of those five has "reopen a closed trip to check whether a CFDI changed status" anywhere in the job description.',
      "blog.cancelacion.p12": "Likida's own census, August 2026: settling one trip by hand costs ~$105 MXN, in a range of $94 to $115, with five roles involved in the cycle.",

      "blog.cancelacion.h2.5": "A revalidation cadence anchored to the settlement record",
      "blog.cancelacion.p13": "Revalidating loose receipts gets you very little. A batch of thousands of XML files, with no way to tell which trip each one belongs to, will not tell you who to go back to, which truck it touched or which line of the deduction moved. The only place where the CFDI, the trip, the truck, the driver and the date are tied to each other is the settlement record. That is where the monitoring should hang from.",

      "blog.cancelacion.h3.2": "Every day",
      "blog.cancelacion.li.2.1": "Read the tax mailbox looking for cancellation requests and resolve them inside the three days.",
      "blog.cancelacion.li.2.2": "Reject as a matter of policy anything that arrives without a documented reason from the supplier: a cancellation accepted through silence does not undo itself.",

      "blog.cancelacion.h3.3": "Every week",
      "blog.cancelacion.li.3.1": "Re-query the status of the CFDIs that went into the most recently closed settlements.",
      "blog.cancelacion.li.3.2": "Cross-check your supplier RFC master list against the artículo 69-B list the SAT publishes.",

      "blog.cancelacion.h3.4": "At the monthly close",
      "blog.cancelacion.li.4.1": "Revalidate the whole current year, not just the month: the issuer can cancel all the way into the following year.",
      "blog.cancelacion.li.4.2": "Note in the file which receipts changed status and which line of the deduction they hit.",

      "blog.cancelacion.h3.5": "Before the annual return",
      "blog.cancelacion.li.5.1": "Sweep the entire prior year during the month the issuer can still cancel: it is the riskiest window of the year.",
      "blog.cancelacion.li.5.2": "Put the result of that sweep in writing — date, population reviewed and findings.",

      "blog.cancelacion.h2.6": "I already deducted a CFDI that got canceled. Now what?",
      "blog.cancelacion.p14": "Short answer: first you work out whether the cancellation was valid, and only then do you decide between disputing it and correcting. In that order, not the other way around.",
      "blog.cancelacion.li.6.1": "Check the status and the cancellation date in the SAT's lookup service, not in the PDF they sent you.",
      "blog.cancelacion.li.6.2": "Look for the request in your mailbox and whether somebody accepted it, rejected it or let it lapse.",
      "blog.cancelacion.li.6.3": "If the transaction did happen and the supplier canceled it by mistake, ask it to issue a new CFDI related to the canceled one: regla 2.7.1.34. provides for that route when the transaction still stands.",
      "blog.cancelacion.li.6.4": "If the cancellation stands, correct it with an amended return for the affected period before the authority finds it.",
      "blog.cancelacion.li.6.5": "Leave the evidence that the transaction actually happened in the trip file — trip log, liters, truck, driver, route and proof of payment.",
      "blog.cancelacion.p15": "That last point decides everything else. If the evidence is still tied to the trip, answering an information request is an afternoon's work. If it is spread across an email, a folder of photos and the memory of a settlement clerk who no longer works there, it is a problem that takes weeks — and the window is thirty days.",

      /* ── fuentes ── */
      "blog.cancelacion.fuente.1": 'Código Fiscal de la Federación, artículos 12, 29-A cuarto párrafo and 69-B — text in force, last amended DOF 09-04-2026; the cuarto párrafo of 29-A was amended by decree published in the DOF on November 7, 2025 — <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/CFF.pdf" rel="noreferrer">text in force at diputados.gob.mx</a>.',
      "blog.cancelacion.fuente.2": 'Resolución Miscelánea Fiscal para 2026, reglas 2.7.1.34., 2.7.1.35. and 2.7.1.48., and Transitorio Décimo Tercero — DOF December 28, 2025. Regla 2.7.1.48. was amended by the Primera Resolución de Modificaciones — DOF July 9, 2026 — <a href="https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/rmf/RMF_2026-DOF-28122025.pdf" rel="noreferrer">SAT publication</a>.',
      "blog.cancelacion.fuente.3": 'Ley del Impuesto sobre la Renta, artículos 76, fracción V (companies: the three months following year-end) and 150 (individuals: the month of April) — <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf" rel="noreferrer">text in force at diputados.gob.mx</a>.',
      "blog.cancelacion.fuente.4": 'SAT, "Complemento Concepto para la facturación de Hidrocarburos y Petrolíferos" — <a href="https://www.sat.gob.mx/portal/public/tramites/complementos-de-factura" rel="noreferrer">electronic invoice complementos</a>.',
      "blog.cancelacion.fuente.5": "Likida's own census, August 2026 — the cost of settling one trip by hand and the roles that touch the cycle.",

      /* ── cierre ── */
      "blog.cancelacion.cierre": "Would you know today, without opening the SAT portal receipt by receipt, which of the CFDIs you already settled are still active?"
    }
  });
})();
