/* ═══════════════════════════════════════════════════════════════════════════
   LIKIDA — inglés de ieps-diesel-acreditable-cfdi-desglosado.html
   Se carga solo en esa página, antes de js/i18n.js. Solo declara el inglés:
   el español de cada nodo es el que trae escrito el HTML.

   Reglas de este artículo:
   · Los términos fiscales mexicanos (CFDI, SAT, IEPS, ISR, LIF, CFF, RFA, RFC,
     DOF, SIDOF) no se traducen; la primera vez que aparecen llevan una glosa
     corta entre paréntesis y de ahí en adelante van solos.
   · Los nombres de las normas se quedan en español (LIF art. 20, apartado A,
     fracción IV; regla 9.1.6; criterio 1/LIF/PI; Anexo 3), igual que los
     nombres de instituciones y publicaciones.
   · Las citas literales de ley entre comillas se dejan en español y se glosan
     en inglés después del guion largo, para que el lector pueda casarlas con
     el texto oficial de los bloques «Fundamento fiscal» —que no llevan clave
     y por eso se quedan idénticos en los dos idiomas.
   · Ninguna cifra, cuota, porcentaje ni fecha cambia: las celdas numéricas de
     la tabla de cuotas semanales llevan clave por consistencia, con el mismo
     valor en los dos idiomas.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  (window.LIKIDA_I18N = window.LIKIDA_I18N || []).push({
    en: {
      /* ── head ── */
      "blog.ieps.title": "Creditable diesel IEPS: what the CFDI has to carry | Likida",
      "blog.ieps.desc": "Creditable diesel IEPS is not read off the receipt: it is liters times the rate in force the day of the fill-up. Which fields the fuel station's CFDI has to carry.",
      "blog.ieps.ld.headline": "The IEPS tax credit is not lost in the math. It is lost on the fuel station's CFDI.",
      "blog.ieps.ld.desc": "Creditable diesel IEPS is not read off the receipt: it is liters times the rate in force the day of the fill-up. Which fields the fuel station's CFDI has to carry.",
      "blog.ieps.ld.keywords": "creditable diesel IEPS",

      /* ── cabecera ── */
      /* El titular es el mismo que ya usa el índice del blog (blog.idx.c2.h):
         si cambia aquí, cámbialo allá. */
      "blog.ieps.h1": "The IEPS tax credit is not lost in the math. It is lost on the fuel station's CFDI.",
      "blog.ieps.entradilla": "The creditable amount is not written on any line of the receipt: it comes from multiplying liters by the rate in force the day of the fill-up. What the station's CFDI (Mexico's digital tax receipt) does have to carry is something else — and that is where the right to the credit falls apart.",
      "blog.ieps.portada.alt": "Diesel nozzle pouring a thin stream of fuel into a graduated cylinder",

      /* ── cuerpo ── */
      "blog.ieps.p1": "The accounting firm kicks back the IEPS (Mexico's excise tax on fuel) credit and the first thing everyone does is check the math again. The math is almost never the problem. The problem came in months earlier, at the pump, when somebody took a receipt that did not carry what the credit needs. By the time the annual return comes around, that receipt can no longer be redone.",

      "blog.ieps.h2.1": "Creditable diesel IEPS is not read off the CFDI: it is calculated",
      "blog.ieps.p2": "Start by clearing up the confusion that causes almost all the others. The tax credit in artículo 20, apartado A, fracción IV of the Ley de Ingresos de la Federación para 2026 is not about recovering an amount printed on the receipt. It is about crediting the result of a multiplication.",
      "blog.ieps.cite.1": "Ley de Ingresos de la Federación para el Ejercicio Fiscal de 2026, artículo 20, apartado A, fracción IV, segundo párrafo — published in the DOF (Mexico's official gazette) on November 7, 2025.",
      "blog.ieps.p3": "Short version: <strong>liters × the rate in force on the day of purchase</strong>. Two data points, and neither one is a tax amount read off the receipt.",
      "blog.ieps.p4": "A note on numbering, because it costs real time: through 2025 these tax credits lived in artículo 16 of the LIF (Mexico's annual federal revenue law). In the LIF 2026 they sit in artículo 20. Any template, internal guide or email from your accountants still citing 16 is pointing at an article that now says something else.",

      "blog.ieps.h2.2": "Why the station will not break out the IEPS for you (and asking does not help)",
      "blog.ieps.p5": "Plenty of fleets show up at the fuel station demanding that the IEPS be broken out on the CFDI. They will not get it, and not because the station is being difficult: the law forbids it.",
      "blog.ieps.cite.2": "Ley del Impuesto Especial sobre Producción y Servicios, artículo 19, fracción II, primer párrafo. In line with: Código Fiscal de la Federación, artículo 29-A, fracción VII, inciso a), segundo párrafo.",
      "blog.ieps.p6": "A fleet is not an IEPS taxpayer on diesel — it burns the fuel, it does not sell it — so it does not fall under the exception. The station's receipt will carry the IEPS inside the price, not broken out, and that is correct. The state rate in artículo 2o.-A rides along the same way, inside the price, and it does not enter the calculation anyway: the LIF points only to artículo 2o., fracción I, inciso D).",
      "blog.ieps.p7": "Put another way: the line you are looking for does not exist. What does have to exist is something else.",

      "blog.ieps.h2.3": "The CFDI fields that actually hold the credit up",
      "blog.ieps.p8": "These are the fields to open in the XML of every fill-up — in the XML, not in the printed version, where what is missing from the file usually still looks complete.",

      /* tabla 1: los campos del comprobante. Las citas de artículos se quedan
         en español; solo el CFF lleva su glosa en la primera fila. */
      "blog.ieps.t1.h1": "Field on the receipt",
      "blog.ieps.t1.h2": "Legal basis",
      "blog.ieps.t1.h3": "What falls apart without it",
      "blog.ieps.t1.r1.c1": "Quantity, unit of measure and class",
      "blog.ieps.t1.r1.c2": "CFF (Mexico's federal tax code) 29-A, fr. V",
      "blog.ieps.t1.r1.c3": "The liters. Without them there is no multiplier and the credit cannot be built.",
      "blog.ieps.t1.r2.c1": "Date of issue",
      "blog.ieps.t1.r2.c2": "CFF 29-A, fr. III",
      "blog.ieps.t1.r2.c3": "The applicable rate, which is set weekly, and the tax year the credit runs against.",
      "blog.ieps.t1.r3.c1": "Recipient's RFC (Mexico's taxpayer ID) and ZIP code",
      "blog.ieps.t1.r3.c2": "CFF 29-A, fr. IV",
      "blog.ieps.t1.r3.c3": "That the fill-up belongs to the fleet and not to the driver personally.",
      "blog.ieps.t1.r4.c1": "How the payment was made",
      "blog.ieps.t1.r4.c2": "CFF 29-A, fr. VII, inciso c)",
      "blog.ieps.t1.r4.c3": "Proof of the bank-traceable payment method the credit requires.",
      "blog.ieps.t1.r5.c1": "Valid Comisión Nacional de Energía permit",
      "blog.ieps.t1.r5.c2": "CFF 29-A, fr. V, inciso f)",
      "blog.ieps.t1.r5.c3": "The validity of the receipt itself. It is a new requirement as of 2026.",

      "blog.ieps.p9": 'And the lock that ties them all together is in that same article: amounts backed by receipts that miss any one of the requirements in 29-A or 29 <strong>"no podrán deducirse o acreditarse fiscalmente"</strong> — they cannot be deducted or credited for tax purposes. That is not a best-practice suggestion; it is the written consequence.',

      "blog.ieps.h3.1": "And the pump slip is not a CFDI",
      "blog.ieps.p10": "The paper the attendant prints is a sales receipt. It carries no UUID, no SAT (Mexico's tax authority) seal, and it cannot be verified against the tax registry. It works for squaring up with the driver; it does nothing for the credit. If the station's portal sets a deadline to issue the invoice, that deadline is a third party's commercial policy, not a tax obligation — but it is a real deadline for your file, and it expires without a sound.",

      "blog.ieps.h2.4": "The rate changes every Friday: the date of the fill-up is hard data",
      "blog.ieps.p11": 'The phrase "con los ajustes que, en su caso, correspondan" — with whatever adjustments apply — is what stops you from treating the rate as a constant. Every Friday, the Secretaría de Hacienda (SHCP, Mexico\'s finance ministry) publishes in the Diario Oficial de la Federación, evening edition, the decree that sets the percentages, the credit amounts and the reduced IEPS rates for the following week. Four consecutive weeks of this year, exactly as they were published:',

      /* tabla 2: cuotas semanales. Solo cambia la semana; los porcentajes y las
         cuotas por litro son idénticos en los dos idiomas. */
      "blog.ieps.t2.h1": "Week of the fill-up",
      "blog.ieps.t2.h2": "Credit %",
      "blog.ieps.t2.h3": "Reduced rate ($/liter)",
      "blog.ieps.t2.r1.c1": "July 25–31, 2026",
      "blog.ieps.t2.r1.c2": "71.58%",
      "blog.ieps.t2.r1.c3": "2.0925",
      "blog.ieps.t2.r2.c1": "August 1–7, 2026",
      "blog.ieps.t2.r2.c2": "75.90%",
      "blog.ieps.t2.r2.c3": "1.7747",
      "blog.ieps.t2.r3.c1": "August 8–14, 2026",
      "blog.ieps.t2.r3.c2": "64.96%",
      "blog.ieps.t2.r3.c3": "2.5801",
      "blog.ieps.t2.r4.c1": "August 15–21, 2026",
      "blog.ieps.t2.r4.c2": "69.09%",
      "blog.ieps.t2.r4.c3": "2.2760",

      "blog.ieps.nota.1": "Weekly SHCP decrees published in the DOF, evening edition, on July 24 and 31 and August 7 and 14, 2026. The full diesel rate for 2026 is $7.3634 per liter, under Acuerdo 179/2025 published in the DOF on December 22, 2025.",
      "blog.ieps.p12": "Between the lowest and the highest of those four there is more than a 45% difference per liter, and they are back-to-back weeks. Applied to the fuel a fleet burns filling up every day, that is not a rounding error.",

      "blog.ieps.h3.2": "What that means for a fleet that fuels every day",
      "blog.ieps.p13": "That you cannot apply a single rate at year-end close. Every fill-up is dated and valued against the rate in force that day, which turns an annual calculation into a sum of dated fill-ups: the kind of work that goes wrong when it is rebuilt in April out of a stack of invoices.",
      "blog.ieps.p14": "An honest warning, because this is where it is easy to get too clever: what you multiply is the <em>cuota disminuida</em> — the reduced rate in the weekly decree — not the full rate. Beyond the text of the LIF and the titles of the decrees themselves, that reading is backed by criterio no vinculativo <strong>1/LIF/PI</strong> in Anexo 3 of the Resolución Miscelánea Fiscal para 2026, which calls computing the credit on the full rate an improper tax practice, and extends that label to whoever provides the service of implementing it. That said, a criterio no vinculativo is the authority's position, not a rule that binds on its own, and the opposite reading can be argued from the same legal text — so the call is your tax counsel's to sign. What does not depend on the reading is the input data: without the date of each fill-up and its liters, neither version can be built.",

      "blog.ieps.h2.5": "Cash kills it, and the 15% relief does not save it",
      "blog.ieps.p15": "The credit carries its own payment-method requirement, and it is stricter than the one for the deduction.",
      "blog.ieps.cite.3": "Ley de Ingresos de la Federación para el Ejercicio Fiscal de 2026, artículo 20, apartado A, fracción IV, cuarto párrafo — published in the DOF on November 7, 2025.",

      "blog.ieps.h3.3": "Three ways of paying that kill the credit",
      "blog.ieps.li.1.1": "Cash handed over at the pump, even if the fill-up is invoiced later and the CFDI comes in complete.",
      "blog.ieps.li.1.2": "The driver's personal card. The law requires it to be issued in the name of whoever takes the credit, not whoever does the driving.",
      "blog.ieps.li.1.3": "A fuel card that is not on the SAT's authorized list.",
      "blog.ieps.p16": "And here is the most expensive confusion in the industry. The Resolución de Facilidades Administrativas para 2026, in regla 2.9, lets a carrier engaged exclusively in federal freight trucking pay up to 15% of its fuel by other means and still meet artículo 27, fracción III of the Ley del ISR (Mexico's corporate income tax law). That relief is about the deduction. Fracción IV of artículo 20 of the LIF has no equivalent allowance.",
      "blog.ieps.destacado": "The 15% in cash saves the ISR deduction. It does not save the IEPS credit. They are two different benefits and cash only reaches one of them.",

      "blog.ieps.h2.6": "If it is not credited within the tax year, it is gone",
      "blog.ieps.p17": 'The credit runs against the ISR due for the same tax year the diesel was bought in, and the law shuts the door with a phrase that leaves no room for interpretation: <strong>"en caso de no hacerlo, perderá el derecho a realizarlo con posterioridad"</strong> — if you do not take it then, you lose the right to take it later. There is no refund for the carrier and no carryforward to the following year. A receipt left without its liters does not turn into a credit balance: it turns into nothing.',

      "blog.ieps.h3.4": "What it can be credited against",
      "blog.ieps.p18": "For a carrier engaged exclusively in federal freight trucking, regla 2.12 of the Resolución de Facilidades Administrativas para 2026 widens the field: against its own ISR due for the year, against provisional payments, against the annual ISR and — this is the valuable part for a fleet with little ISR of its own — against the ISR withheld from third parties in the same year.",

      "blog.ieps.h3.5": "The first-time notice",
      "blog.ieps.p19": "The credit requires notifying the SAT the first time it is applied: through the buzón tributario, the SAT's electronic mailbox, within the fifteen days following the filing of the return it was applied in, under ficha de trámite 2/LIF. Regla 9.1.6 of the Resolución Miscelánea Fiscal para 2026 ties it to the annual return; regla 2.13 of the RFA 2026 (the annual administrative-relief resolution), for federal freight, also allows it from the provisional payment.",
      "blog.ieps.p20": "Two more points. The credit is taxable income at the moment it is actually taken, so it pays ISR: anyone presenting the gross figure as savings is presenting a number that never reaches the bank in full. And if some document sends you to regla 11.7.3 of the Resolución Miscelánea, read it twice — capítulo 11.7 belongs to the tax-credit decree aimed at whoever <em>sells</em> fuel; the carrier's rules live in Título 9, capítulo 9.1.",

      "blog.ieps.h3.6": "What to check during settlement, not in April",
      "blog.ieps.li.2.1": "That there is a stamped CFDI for every fill-up, and not just the pump slip.",
      "blog.ieps.li.2.2": "That the XML carries quantity and unit of measure — the liters, not only the amount.",
      "blog.ieps.li.2.3": "That the date on the receipt matches the week the driver actually fueled.",
      "blog.ieps.li.2.4": "That the payment method is one of the four the credit allows, and in the fleet's name.",
      "blog.ieps.li.2.5": "That the receipt states the supplier's valid permit.",
      "blog.ieps.p21": "None of those five points is hard on its own. They get hard multiplied by hundreds of fill-ups a month and reviewed nine months late, which is exactly when the accounting firm asks for them.",

      /* ── fuentes ── */
      "blog.ieps.fuente.1": 'Ley de Ingresos de la Federación para el Ejercicio Fiscal de 2026, artículo 20, apartado A, fracción IV — DOF, November 7, 2025 — <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LIF_2026.pdf" rel="noreferrer">text on diputados.gob.mx</a>.',
      "blog.ieps.fuente.2": "Ley del Impuesto Especial sobre Producción y Servicios, artículos 19, fracción II; 2o., fracción I, inciso D), numeral 1, subinciso c), and 2o.-A. Diesel rate of $7.3634 per liter updated by Acuerdo 179/2025 — DOF, December 22, 2025.",
      "blog.ieps.fuente.3": "Código Fiscal de la Federación, artículo 29-A, fracciones III, IV, V, VII and the paragraph following fracción X. Inciso f) of fracción V was added by the decree published in the DOF on November 7, 2025.",
      "blog.ieps.fuente.4": 'Resolución Miscelánea Fiscal para 2026, Título 9, capítulo 9.1, reglas 9.1.6 and 9.1.8 — DOF, December 28, 2025 — <a href="https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/rmf/RMF_2026-DOF-28122025.pdf" rel="noreferrer">text on sat.gob.mx</a>.',
      "blog.ieps.fuente.5": 'Resolución de Facilidades Administrativas para 2026, reglas 2.9, 2.12 and 2.13 — DOF, February 17, 2026 — <a href="https://sidof.segob.gob.mx/notas/docFuente/5780249" rel="noreferrer">text on SIDOF (Mexico\'s official gazette portal)</a>.',
      "blog.ieps.fuente.6": "Weekly SHCP decrees announcing the percentages, the tax credit amounts and the reduced IEPS rates — DOF, evening edition of July 24 and 31 and August 7 and 14, 2026.",
      "blog.ieps.fuente.7": "Criterio no vinculativo 1/LIF/PI, Anexo 3 of the Resolución Miscelánea Fiscal para 2026 — DOF, January 9, 2026.",

      /* ── cierre ── */
      "blog.ieps.cierre": "How many of the diesel receipts that went into your last trip settlement carry the liters, the date and the payment method needed to hold the credit up?"
    }
  });
})();
