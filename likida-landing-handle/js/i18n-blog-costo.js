/* ═══════════════════════════════════════════════════════════════════════════
   LIKIDA — inglés de blog/cuanto-cuesta-liquidar-un-viaje.html
   Se carga solo en esa página, antes de js/i18n.js. Solo declara el inglés:
   el español de cada nodo es el que trae escrito el HTML.

   Términos fiscales mexicanos que NO se traducen: CFDI, IEPS, ISR, IVA, TAG,
   Carta Porte, DOF, SIDOF. Cada uno lleva una glosa corta la primera vez que
   aparece. El texto literal de la norma dentro de <aside class="blog-fundamento">
   se queda en español y por eso no tiene clave. Ninguna cifra, monto, fecha,
   porcentaje ni número de regla cambia entre idiomas.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  (window.LIKIDA_I18N = window.LIKIDA_I18N || []).push({
    en: {
      /* ── head: <title>, meta description, OG/Twitter y JSON-LD ── */
      "blog.costo.title": "Trip settlement: what it costs to do it by hand | Likida",
      "blog.costo.desc": "Settling trips by hand costs around $105 per trip and touches five roles. We take the cycle apart role by role and say where the figure comes from.",
      "blog.costo.ld.headline": "Nobody measures what it costs to settle a trip by hand. We measured it.",
      "blog.costo.ld.desc": "Settling trips by hand costs around $105 per trip and touches five roles. We take the cycle apart role by role and say where the figure comes from.",
      "blog.costo.ld.keywords": "trip settlement",

      /* ── cabecera del artículo ── */
      "blog.costo.h1": "Nobody measures what it costs to settle a trip by hand. We measured it.",
      "blog.costo.entradilla": "The cost of trip settlement does not live in any accounting line: it is spread across dispatch, settlements, invoicing and accounting. Our own census puts it at around $105 per trip, in a range of $94 to $115.",
      "blog.costo.portada.alt": "Line drawing of a stack of trip receipts with a dimension line measuring how tall it is",

      /* ── cuerpo ── */
      "blog.costo.p1": 'Search "liquidación de viajes" in Spanish and what comes back are product pages: modules, screens, feature lists. Not one of them tells you what doing it the way you do it today already costs you. And that is not an oversight: the cost of settling trips is not hidden in one line item — it is spread across five different payrolls, and to see it you have to add up pieces of five roles.',

      "blog.costo.h2.1": "What settling a trip actually means",
      "blog.costo.p2": "Settling a trip means closing its money-and-paper file: gathering the evidence for everything spent on the road, comparing it against the cash advance handed to the driver, and working out who owes whom. In a Mexican fleet that means five things have to be proven for every trip:",
      "blog.costo.li.1.1": "What was spent and which trip it belongs to — truck, driver, route, date.",
      "blog.costo.li.1.2": "How it was paid: cash from the advance, a company card or the TAG (Mexico's toll transponder).",
      "blog.costo.li.1.3": "What receipt backs it: an active CFDI (Mexico's digital tax receipt), a slip with no tax value, or nothing.",
      "blog.costo.li.1.4": "How much was handed out up front and how much came back.",
      "blog.costo.li.1.5": "Which part of that spend is deductible, which part is creditable, and which part is neither.",
      "blog.costo.p3": "The fifth one is what turns settlement into a tax problem and not just an administrative one. A badly settled trip does not sit still: it turns into a deduction that will not hold up, a tax credit that never gets claimed, and a discrepancy with the driver that carries over into the next pay period.",

      "blog.costo.h2.2": "Five roles touch a trip before it is closed",
      "blog.costo.p4": "Trip settlement almost never lives with one person. In the operations we surveyed, the evidence passes through five sets of hands before it becomes an accounting entry — and every handoff is a place where driver expense reporting jams.",

      "blog.costo.tabla.th.1": "Who",
      "blog.costo.tabla.th.2": "What they do with the trip",
      "blog.costo.tabla.th.3": "Where it jams",
      "blog.costo.tabla.1.1": "Driver",
      "blog.costo.tabla.1.2": "Collects and hands in the evidence: diesel receipts, tolls, handling fees, bonds, meals.",
      "blog.costo.tabla.1.3": "Soaked paper, receipts with no CFDI, and expenses everyone remembers but nobody can document.",
      "blog.costo.tabla.2.1": "Dispatch",
      "blog.costo.tabla.2.2": "Ties every expense to the trip, the truck and the route.",
      "blog.costo.tabla.2.3": "Toll crossings and diesel fill-ups nobody can assign to a trip.",
      "blog.costo.tabla.3.1": "Settlements",
      "blog.costo.tabla.3.2": "Keys in the expenses, applies the deductions on the driver's settlement and reconciles against the cash advance.",
      "blog.costo.tabla.3.3": "Re-keying: the same trip comes back two and three times over one missing detail.",
      "blog.costo.tabla.4.1": "Accounting",
      "blog.costo.tabla.4.2": "Validates the CFDIs, reconciles the diesel and decides what goes into the tax return.",
      "blog.costo.tabla.4.3": "Receipts with no breakdown, suppliers on the 69-B list and cancellations that land later.",
      "blog.costo.tabla.5.1": "Approval and payment",
      "blog.costo.tabla.5.2": "Signs the settlement and releases the reimbursement or the deduction.",
      "blog.costo.tabla.5.3": "The signature waits on someone else to finish; the driver waits on his money.",

      "blog.costo.p5": "That role is not a theoretical figure. When we built the sector's census of job postings, it shows up spelled out in full — settlements clerk, expense-documentation analyst, trip-expense data-entry clerk — at companies that post it and pay for it. When a fleet hires someone for this, it has already declared that the work exists and what it is worth.",
      "blog.costo.nota.1": "Likida's own census: 1,318 verified job postings across 829 trucking companies.",

      "blog.costo.h2.3": "What it costs to settle a trip by hand",
      "blog.costo.p6": '<strong>Around $105 MXN per trip settled by hand, in a range of $94 to $115.</strong> That is what our census returns once you add up the paid time of the five roles that touch the cycle: gathering the evidence, keying it in, reconciling the diesel, approving and paying. It does not include the driver\'s time on the road, software licenses, or the cost of the tax credits left unclaimed.',
      "blog.costo.nota.2": "Likida's own census, August 2026. It is our figure, not a public statistic: nobody publishes the unit cost of this process, which is why we measured it.",
      "blog.costo.destacado": "The cost of settling trips is not hidden. It is spread out. That is why nobody sees it.",

      "blog.costo.h2.4": "Why that number never shows up on your P&L",
      "blog.costo.p7": 'For three reasons, and all three are structural. The first is accounting: the cost lives in payroll, not in an account called "settlement". The second is that re-keying never gets recorded — when a trip comes back to the settlements desk for the third time, nobody starts a counter. The third is the most expensive: a good part of the cost is not time, it is tax left on the table.',
      "blog.costo.h3.1": "What gets lost when the evidence arrives incomplete",
      "blog.costo.li.2.1": 'The <a href="ieps-diesel-acreditable-cfdi-desglosado.html">diesel IEPS tax credit</a> (IEPS is Mexico\'s excise tax on fuel), when the fuel station\'s receipt cannot back up the liters in the fill-up.',
      "blog.costo.li.2.2": 'The <a href="estimulo-50-peaje-conciliacion-casetas-tag.html">toll tax credit</a>, when the TAG statement is never tied to a specific trip.',
      "blog.costo.li.2.3": 'The cheap fix to the <a href="carta-porte-3-1-revision-en-la-liquidacion.html">Carta Porte</a> (Mexico\'s shipping document complement), which is only cheap while the trip is still open.',
      "blog.costo.li.2.4": 'The deduction on an expense whose <a href="cancelacion-cfdi-plazo-2026-flotas.html">CFDI was canceled</a> after it had already gone into a closed settlement.',

      "blog.costo.h2.5": "The escape valve almost nobody names in this context",
      "blog.costo.p8": "Federal freight trucking has a legal way out of documenting expenses, and it is worth putting on the table before somebody sells it as the solution to the problem.",
      "blog.costo.cite.1": "Resolución de Facilidades Administrativas para 2026, regla 2.2 — published in the DOF (Mexico's federal register) on February 17, 2026.",
      "blog.costo.p9": 'Read it twice, because the three conditions inside it are what define what it is actually good for. <strong>One:</strong> every peso deducted this way costs 16 centavos of definitive ISR (Mexico\'s corporate income tax), which cannot be credited or deducted later. The relief does not waive the documentation: it sells it at a fixed price. <strong>Two:</strong> it has a double ceiling — 8% of your own revenue and one million pesos for the year — so it does not scale with the fleet. <strong>Three:</strong> it leaves out fuel, which is precisely the biggest and most contested line item in any settlement.',
      "blog.costo.p10": "Put another way: the blind deduction is a decent cushion for what flatly never had a receipt, and a terrible operating strategy. It does not make the evidence appear, it does not recover the diesel IEPS or the IVA (Mexico's VAT), and it does not fix the discrepancy with the driver. It buys a piece of the problem and charges you for it.",

      "blog.costo.h2.6": "The driver's expenses have a rule of their own",
      "blog.costo.p11": "The other half of the cycle is per diems, and there the law is specific down to the peso. It is worth keeping in mind when you decide what you ask the driver to bring back.",
      "blog.costo.cite.2": "Ley del Impuesto sobre la Renta, artículo 28, fracción V — text in force as published by the Cámara de Diputados.",
      "blog.costo.p12": "In practice that means three things for whoever settles trips: a meal does not stand on its own (it has to hang off lodging or transport from the same day), there is a daily cap per driver worth having calculated before the audit, and the expenses of a local move within the 50 kilometers do not come in through this door. None of that gets solved at month end: it gets solved when the evidence comes in.",

      "blog.costo.h2.7": "What to measure before trying to bring it down",
      "blog.costo.p13": "If the cost cannot be seen, it cannot be negotiated either. These five metrics come out of what you already have — the settlements file and payroll — and they are enough to put your own number next to ours:",
      "blog.costo.li.3.1": "Days between the truck coming back and the settlement being paid.",
      "blog.costo.li.3.2": "How many times the same trip comes back to the settlements desk.",
      "blog.costo.li.3.3": "The share of expenses that arrive with no CFDI, or with a CFDI that does not validate.",
      "blog.costo.li.3.4": "Liters of diesel for the month that do come with a usable breakdown.",
      "blog.costo.li.3.5": "Toll crossings for the month that did end up tied to a trip.",
      "blog.costo.p14": "That builds the whole conversation: how much paid time goes into the cycle, and how much tax goes unclaimed because the evidence arrived late or incomplete. That second part is usually the one that wakes up the controller.",
      "blog.costo.p15": 'We built Likida to go after exactly that cycle, and we wrote about that boundary — which part an agent can handle and which part has to stay in a deterministic engine — separately, in <a href="agentes-de-ia-para-transporte-de-carga.html">what an AI agent can and cannot do in a fleet\'s back office</a>. But the first step does not require anybody\'s software: it requires measuring.',

      /* ── fuentes ── */
      "blog.costo.fuente.1": 'Resolución de Facilidades Administrativas para 2026, regla 2.2 — DOF, February 17, 2026 — <a href="https://sidof.segob.gob.mx/notas/docFuente/5780249" rel="noreferrer">text on SIDOF</a>, the DOF\'s official document site.',
      "blog.costo.fuente.2": 'Ley del Impuesto sobre la Renta, artículo 28, fracción V — <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf" rel="noreferrer">text in force, Cámara de Diputados</a>.',
      "blog.costo.fuente.3": "Likida's own census, August 2026: settlement cost per trip ($105 MXN, range $94–$115), five roles that touch the cycle, and 1,318 verified job postings across 829 trucking companies.",

      /* ── cierre ── */
      "blog.costo.cierre": "How many hands touch a trip in your operation before the settlement is paid, and how many days go by along the way?"
    }
  });
})();
