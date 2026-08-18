/* ═══════════════════════════════════════════════════════════════════════════
   LIKIDA — inglés de estimulo-50-peaje-conciliacion-casetas-tag.html
   Se carga solo en esa página, antes de js/i18n.js. Solo declara el inglés:
   el español de cada nodo es el que trae escrito el HTML.

   Términos fiscales mexicanos que NO se traducen: CFDI, SAT, IEPS, ISR, IVA,
   LIF, LISR, CAPUFE, DOF, TAG, Carta Porte. Cada uno lleva una glosa corta en
   inglés la primera vez que aparece. Las citas de normas (LIF art. 20,
   apartado A, fracción V; regla 9.1.8; artículo 179) se quedan en español
   porque son el nombre de la norma; solo se traduce lo que las rodea. Ninguna
   cifra, porcentaje, monto ni fecha cambia entre idiomas.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  (window.LIKIDA_I18N = window.LIKIDA_I18N || []).push({
    en: {
      /* ── head ── */
      "blog.peaje.title": "50% highway toll tax credit: what you have to prove | Likida",
      "blog.peaje.desc": "The 50% highway toll tax credit requires a trip log that matches your TAG statement. How that reconciliation gets built.",

      /* ── JSON-LD ── */
      "blog.peaje.ld.headline": "Half your toll spend credits against ISR. First you have to prove the crossing was yours.",
      "blog.peaje.ld.desc": "The 50% highway toll tax credit requires a trip log that matches your TAG statement. How that reconciliation gets built.",
      "blog.peaje.ld.keywords": "50% highway toll tax credit",

      /* ── cabecera ── */
      "blog.peaje.h1": "Half your toll spend credits against ISR. First you have to prove the crossing was yours.",
      "blog.peaje.entradilla": "The 50% highway toll tax credit is a one-line multiplication. The expensive part is everything else: the TAG (Mexico's toll transponder) statement arrives consolidated by month and never says which trip each crossing belongs to.",
      "blog.peaje.portada.alt": "Toll booth with a TAG reader and a toll transponder sending a signal toward a trip log with three empty columns",

      /* ── cuerpo ── */
      "blog.peaje.p1": "The math fits on one line: what you paid at the toll booths of the Red Nacional de Autopistas de Cuota (Mexico's federal toll highway network), net of IVA (Mexico's VAT), times 0.5. That credits against ISR (Mexico's corporate income tax) for the same tax year. No fleet controller gets stuck there.",
      "blog.peaje.p2": "He gets stuck earlier. The <strong>50% highway toll tax credit</strong> is not granted against a monthly total: it is granted against a trip log that matches the statement of the card that paid for the crossing. And that statement arrives as a consolidation of the whole month — convenient for accounting, useless for pinning the expense on a trip.",

      "blog.peaje.h2.1": "What the tax credit actually says",
      "blog.peaje.p3": "It is a credit of <strong>up to 50%</strong> of what you paid to use the Red Nacional de Autopistas de Cuota, applied against ISR for the tax year in which you used the highway. It is not an extra deduction and it is not a refund: it is a credit. And it is not automatic: the law ties it to the taxpayer's line of business, to its size, and to meeting the requirements the SAT (Mexico's tax authority) sets through general rules.",
      "blog.peaje.cita.1": "Ley de Ingresos de la Federación para el Ejercicio Fiscal de 2026, artículo 20, apartado A, fracción V — DOF (Mexico's official gazette), November 7, 2025.",

      "blog.peaje.h3.1": "The law's four filters, in the order they rule you out",
      "blog.peaje.li.1.1": '<strong>Exclusivity.</strong> The word "exclusively" describes the taxpayer, not the vehicle: what is asked is that you be in the ground transport business, not that you own trucks.',
      "blog.peaje.li.1.2": "<strong>Red Nacional de Autopistas de Cuota.</strong> A state or municipal toll booth outside that network still gets paid, but it earns no credit.",
      "blog.peaje.li.1.3": "<strong>Annual income under 300 million pesos</strong> in the tax year the infrastructure was used.",
      "blog.peaje.li.1.4": "<strong>Not being a related party</strong> under artículo 179 of the LISR (Mexico's income tax law).",
      "blog.peaje.p4": "That last filter closes the door many groups try to open: spinning the fleet off into a subsidiary to pass the exclusivity test lands the taxpayer exactly where fracción V shuts him out. Settle eligibility before you spend a minute on the reconciliation.",

      "blog.peaje.h2.2": "The toll CFDI almost never comes from CAPUFE, the federal highway operator",
      "blog.peaje.p5": "This is where the part nobody writes down begins. When the fleet pays with a TAG — and fracción III of the rule requires electronic payment if you want the credit — the tax receipt does not come from the booth or from the highway operator: it comes from the card issuer. IAVE, PASE, TeleVía and the other issuers invoice their own service, monthly, in a single consolidated CFDI (Mexico's digital tax receipt). Interoperability means the same tag crosses toll plazas run by different concessionaires, so one receipt can cover crossings from half the country.",

      "blog.peaje.h3.2": "What the TAG statement does carry",
      "blog.peaje.li.2.1": "Date and time of the crossing, down to the minute.",
      "blog.peaje.li.2.2": "Toll plaza and, depending on the issuer, the lane.",
      "blog.peaje.li.2.3": "Tag number and the vehicle class it was charged as.",
      "blog.peaje.li.2.4": "Amount charged per crossing and the balance or charge for the period.",

      "blog.peaje.h3.3": "What it does not carry — which is exactly what the rule asks for",
      "blog.peaje.li.3.1": "The trip the crossing belongs to.",
      "blog.peaje.li.3.2": "The origin, the destination and the route.",
      "blog.peaje.li.3.3": "The truck and the driver, beyond the tag number.",
      "blog.peaje.li.3.4": "Whether that crossing was billed to the customer in the freight rate or absorbed by the fleet.",
      "blog.peaje.p6": "That gap is the whole problem. The issuer sells you connectivity and a CFDI; tying each crossing to a trip is on you, and that is exactly what the SAT wants to see.",

      "blog.peaje.h2.3": "The rule that turns the credit into a reconciliation problem",
      "blog.peaje.p7": "The general requirements the LIF (Mexico's annual revenue law) points to live in the Resolución Miscelánea Fiscal. That is where the credit stops being arithmetic and becomes a file you have to keep.",
      "blog.peaje.cita.2": "Resolución Miscelánea Fiscal para 2026, regla 9.1.8, fracción II — DOF, December 28, 2025.",
      "blog.peaje.p8": 'The word that rules is <em>coincida</em>, "match". It does not say "keep the statement on file": it says the trip log and the statement have to line up. That is a trip-by-trip reconciliation, not a total at month close.',

      /* ── tabla de la regla 9.1.8 ── */
      "blog.peaje.tabla.th.1": "Fracción (subsection)",
      "blog.peaje.tabla.th.2": "What the rule requires",
      "blog.peaje.tabla.th.3": "What it leaves in the file",
      "blog.peaje.tabla.1.1": "I",
      "blog.peaje.tabla.1.2": "A notice filed in March through the buzón tributario (the SAT's electronic mailbox), with the inventory of vehicles used on the network.",
      "blog.peaje.tabla.1.3": "A register of trucks with model, VIN, plate and the dates each one was added or removed.",
      "blog.peaje.tabla.2.1": "II",
      "blog.peaje.tabla.2.2": "A trip log with origin, destination and route that matches the statement.",
      "blog.peaje.tabla.2.3": "Each crossing tied to a trip, a truck and a route.",
      "blog.peaje.tabla.3.1": "III",
      "blog.peaje.tabla.3.2": "Paying with a TAG or another electronic system, and keeping the statements.",
      "blog.peaje.tabla.3.3": "The statements for the full period, issuer by issuer.",
      "blog.peaje.tabla.4.1": "IV",
      "blog.peaje.tabla.4.2": "Applying the 0.5 factor to the amount paid, excluding IVA.",
      "blog.peaje.tabla.4.3": "The base net of IVA, kept apart from the IVA you credit through its own channel.",

      "blog.peaje.p9": 'Two consequences for day-to-day operations. First: fracción III kills cash. A toll paid in cash at the window earns no credit, even if somebody gets an invoice for it later. Second: fracción IV settles an ambiguity in the law, because the LIF text speaks of the "gasto total erogado" — what was actually paid out — while the rule orders the 0.5 to be applied to the amount <em>excluding</em> IVA. The rule\'s base is the one you use.',
      "blog.peaje.destacado": "The credit is not lost by miscalculating the 50%. It is lost by not being able to say which trip each crossing belonged to.",

      "blog.peaje.h2.4": "The three-column method",
      "blog.peaje.p10": "The trip log fracción II asks for is built from three sources that almost never live in the same system. The work is putting them side by side and closing every line.",

      "blog.peaje.h3.4": "Column 1 — the statement",
      "blog.peaje.li.4.1": "You download it from the tag issuer's portal, not from the toll booth's portal.",
      "blog.peaje.li.4.2": "Every line is one crossing: date, time, plaza, tag and amount.",
      "blog.peaje.li.4.3": "It is the one column nobody argues with: it is what was paid and it is what the SAT will see.",

      "blog.peaje.h3.5": "Column 2 — the trip",
      "blog.peaje.li.5.1": "Every trip has a time window, an origin and a destination.",
      "blog.peaje.li.5.2": "A crossing belongs to a trip if its date and time fall inside that window and the plaza sits on that route.",
      "blog.peaje.li.5.3": "Both tests are applied together; with only one of them you close lines that do not actually close.",

      "blog.peaje.h3.6": "Column 3 — the truck",
      "blog.peaje.li.6.1": "The tag is assigned to a truck, and the truck to a trip.",
      "blog.peaje.li.6.2": 'That link is what turns "a crossing at plaza X" into "a crossing by my tractor on my route".',
      "blog.peaje.li.6.3": "Without it, the trip log describes an expense with no owner.",
      "blog.peaje.p11": "Once a crossing closes across the three columns, the trip log writes itself and the 0.5 goes on at the end, over the subtotal you already reconciled. Order matters: first you prove the crossing was yours, then you multiply.",

      "blog.peaje.h2.5": "The two failure modes no issuer documents",
      "blog.peaje.p12": "Done by hand, the reconciliation does not fail on the total — that always ties out against the issuer's CFDI — but on attribution. There are two ways to get it wrong, and both survive a quick review.",

      "blog.peaje.h3.7": "The orphan crossing",
      "blog.peaje.p13": "It is a real crossing, charged, that belongs to a trip that was never settled: it was canceled, it was left open, or nobody entered it. On the statement it looks identical to the rest; in the trip log it has no line. Crediting it means crediting an expense the file ties to no origin and no destination; throwing it out without checking means giving away credit you had legitimately earned. Neither outcome shows up when you look at the total.",

      "blog.peaje.h3.8": "The crossing on the wrong truck",
      "blog.peaje.p14": "This is the expensive one. A tag gets moved to another truck, lent out for a deadhead move, or left assigned to a truck that ran a different route that day. The crossing is attributed to whatever trip was open and the log stays internally consistent, but it claims a truck was at a plaza it never went through. That is the line that does not hold up when you check it against the Carta Porte (Mexico's mandatory shipping document) for the same trip — and that check is exactly the one an audit runs.",

      "blog.peaje.p15": "Both failure modes have the same root: the statement gets reconciled against somebody's memory instead of against the trip. That is why the work gets expensive without ever looking expensive.",
      "blog.peaje.nota": "Settling one trip by hand costs around $105 MXN, in a range of $94 to $115, and five different roles touch the cycle. Likida's own census, August 2026.",

      "blog.peaje.h2.6": "What has to be ready before March",
      "blog.peaje.p16": "The fracción I notice is filed through the buzón tributario during March of the following year, with the inventory of the vehicles that used the network. It is the only date on the calendar, and it comes too late to fix what was never recorded: the trip log gets built through the year, crossing by crossing, or it does not get built.",
      "blog.peaje.li.7.1": "The register of trucks with the tag assigned to each one, and the date every assignment changed.",
      "blog.peaje.li.7.2": "Complete statements from every issuer, month by month, with no gaps.",
      "blog.peaje.li.7.3": "Every trip with its origin, destination, route and time window.",
      "blog.peaje.li.7.4": "The list of crossings with no trip assigned, reviewed and with a reason attached — not deleted.",
      "blog.peaje.p17": "That last point is what separates a file you can defend from one that merely looks tidy. A crossing with no trip is not a data-entry mistake to hide: it is an exception you have to be able to explain.",

      /* ── fuentes ── */
      "blog.peaje.fuente.1": 'Ley de Ingresos de la Federación para el Ejercicio Fiscal de 2026, artículo 20, apartado A, fracción V — DOF, November 7, 2025. <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LIF_2026.pdf" rel="noreferrer">Text in force at diputados.gob.mx</a>.',
      "blog.peaje.fuente.2": 'Resolución Miscelánea Fiscal para 2026, regla 9.1.8, fracciones I a IV — DOF, December 28, 2025. <a href="https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/rmf/RMF_2026-DOF-28122025.pdf" rel="noreferrer">Official publication on the SAT minisite</a>.',
      "blog.peaje.fuente.3": 'Ley del Impuesto sobre la Renta, artículo 179 — the definition of related parties. <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf" rel="noreferrer">Text in force at diputados.gob.mx</a>.',
      "blog.peaje.fuente.4": "Likida's own census, August 2026 — the cost of settling a trip by hand and the roles that touch the cycle.",

      /* ── cierre ── */
      "blog.peaje.cierre": "Can you say today, without opening Excel, which trip every crossing on your latest TAG statement belongs to?"
    }
  });
})();
