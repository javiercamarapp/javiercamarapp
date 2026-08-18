/* ═══════════════════════════════════════════════════════════════════════════
   LIKIDA — inglés de carta-porte-3-1-revision-en-la-liquidacion.html
   Se carga solo en esa página, antes de js/i18n.js. Solo declara el inglés:
   el español de cada nodo es el que trae escrito el HTML.

   Carta Porte, complemento, CFDI, SAT, PAC, RFC, RMF, DOF y los números de
   versión y de catálogo se quedan en español, con una glosa corta la primera
   vez que aparecen. Las citas de normas (regla 2.7.7.1.1., artículo 29-A,
   Resolución Miscelánea Fiscal, Código Fiscal de la Federación, Instructivo
   de llenado) tampoco se traducen. Ninguna cifra ni fecha cambia de idioma.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  (window.LIKIDA_I18N = window.LIKIDA_I18N || []).push({
    en: {
      /* ── head ── */
      "blog.cartaporte.title": "Carta Porte 3.1 errors: the last review | Likida",
      "blog.cartaporte.desc": "Carta Porte 3.1 errors surface late, once the CFDI is almost impossible to fix. What to cross-check at settlement, while fixing it is still cheap.",
      "blog.cartaporte.ld.headline": "Nobody checks the Carta Porte when it is issued. They check it when it can no longer be fixed.",
      "blog.cartaporte.ld.desc": "Carta Porte 3.1 errors surface late, once the CFDI is almost impossible to fix. What to cross-check at settlement, while fixing it is still cheap.",
      "blog.cartaporte.ld.keywords": "Carta Porte 3.1 errors",

      /* ── cabecera del artículo ── */
      "blog.cartaporte.h1": "Nobody checks the Carta Porte when it is issued. They check it when it can no longer be fixed.",
      "blog.cartaporte.entradilla": "Almost every Carta Porte 3.1 error clears stamping without a sound: the PAC — the provider authorized to certify and stamp the invoice — validates arithmetic and catalogs, not whether the trip happened the way the paperwork says. The one desk where those errors can finally be seen is settlement.",
      "blog.cartaporte.portada.alt": "Shipping document drawn in fine line work, with a magnifying glass over its lines and a clock beside it",

      /* ── cuerpo ── */
      "blog.cartaporte.p1": "An error in a Carta Porte — the freight complemento that the SAT (Mexico's tax authority) requires on the CFDI (Mexico's digital tax receipt) — almost never shows up the day it is stamped. It shows up when the accountant builds the tax return, when the customer bounces the CFDI because its RFC (the taxpayer ID) came out wrong, or when an inspector stops the truck and the paperwork says one thing while the trailer says another. By then the trip has already been billed, the invoice already paid, and the window to fix it is closing on its own.",

      "blog.cartaporte.h2.1": "What got stricter in 3.1, and what did not",
      "blog.cartaporte.p2": "Start with the boring fact, because there is a lot of noise around it. Version <strong>3.1</strong> of the complemento has been mandatory since July 17, 2024, and it is still the only one in force: no 3.2 has been announced. What did move in 2026 were the catalogs. The <code>catCartaPorte.xsd</code> schema — the file PACs use to validate codes — was modified on <strong>January 13, 2026</strong>. A new catalog does not change the structure of the XML; it changes which codes clear and which ones stop clearing, and you feel that the day a stamping request is rejected with no readable explanation.",
      "blog.cartaporte.p3": 'The other thing worth being clear about: in 2026 there is <strong>no grace period</strong>. The "no penalty" windows existed in 2022 and 2023 and ended on December 31, 2023. Neither the Resolución Miscelánea Fiscal 2026 nor its Primera Resolución de Modificaciones reopened that door.',

      "blog.cartaporte.h2.2": "The PAC validates form. Nobody validates that the trip actually went that way.",
      "blog.cartaporte.p4": "Here is the misunderstanding that keeps half the complemento errors alive. A stamped CFDI is not a correct CFDI: it is a CFDI that passed a list of mechanical validations. The 3.1 Standard requires the certification provider to check arithmetic, catalogs and the presence of fields. Nothing more.",

      "blog.cartaporte.h3.1": "What the PAC does reject",
      "blog.cartaporte.li.1.1": "A total gross weight that is not exactly the sum of the kilos of each item of cargo.",
      "blog.cartaporte.li.1.2": "A total number of goods that does not match the nodes declared.",
      "blog.cartaporte.li.1.3": "A total distance traveled that is not the sum of the distances to each destination.",
      "blog.cartaporte.li.1.4": "A license number on a transport party who is not the driver, or a missing one when he is.",
      "blog.cartaporte.li.1.5": "An RFC — of the recipient, the shipper or the transport party — that is not on the SAT's list of registered, non-cancelled taxpayers.",

      "blog.cartaporte.h3.2": "What goes through without a sound",
      "blog.cartaporte.li.2.1": "A made-up permit number from the SICT (Mexico's transport ministry). The 3.1 Standard does not check it against any registry: it only requires that the code exist in the catalog and that the number follow the format.",
      "blog.cartaporte.li.2.2": "The RFC of a driver who exists and is active, but who did not drive that trip.",
      "blog.cartaporte.li.2.3": "The plates of a truck that spent that day in the shop.",
      "blog.cartaporte.li.2.4": 'A distance rounded off "so it matches" that looks nothing like the route actually run.',
      "blog.cartaporte.li.2.5": 'The code <code>TPXX00</code> with the legend "Permiso no contemplado en el catálogo" — the legitimate way out for state permits — used as a wildcard to avoid keying in the federal one.',
      "blog.cartaporte.p5": "No XML validator catches any of those five, because they are not syntax errors: they are <em>differences between the document and the trip</em>. To see them you need both in front of you, and that does not happen at the moment of stamping.",

      "blog.cartaporte.h2.3": "Why settlement is the last desk where both are visible",
      "blog.cartaporte.p6": "Settling a trip is, by definition, the moment somebody gathers everything that trip generated: the cash advance, the diesel receipts, the toll crossings, the photos the driver sent, the delivery evidence, the hours. It is the only point in the process where the tax document and the physical trip sit on the same table. In dispatch the evidence does not exist yet; in accounting all that is left is the paperwork.",
      "blog.cartaporte.cita": "Stamping declares what is going to happen. Settling is the first time anyone knows what did.",
      "blog.cartaporte.p7": "That is why the review that counts is not the issuer's — that one already happened, with the information available before the truck rolled out — but the review of whoever closes the trip. These are the cross-checks that can only be done there:",

      "blog.cartaporte.tabla.th.1": "Field in the complemento",
      "blog.cartaporte.tabla.th.2": "What it is checked against at settlement",
      "blog.cartaporte.tabla.th.3": "Who supplied it",
      "blog.cartaporte.tabla.1.1": "Driver's RFC and license",
      "blog.cartaporte.tabla.1.2": "Who sent in the trip's receipts and who signed the delivery.",
      "blog.cartaporte.tabla.1.3": "Carrier",
      "blog.cartaporte.tabla.2.1": "Origin, destination and distance",
      "blog.cartaporte.tabla.2.2": "The toll crossings and the GPS positions from that trip.",
      "blog.cartaporte.tabla.2.3": "Both",
      "blog.cartaporte.tabla.3.1": "Cargo description and weight",
      "blog.cartaporte.tabla.3.2": "The loading and delivery evidence the driver uploaded.",
      "blog.cartaporte.tabla.3.3": "Customer",
      "blog.cartaporte.tabla.4.1": "Plates, vehicle configuration and insurance policy",
      "blog.cartaporte.tabla.4.2": "The truck that actually left the yard.",
      "blog.cartaporte.tabla.4.3": "Carrier",
      "blog.cartaporte.tabla.5.1": "SICT permit and its number",
      "blog.cartaporte.tabla.5.2": "The fleet's federal permit in force.",
      "blog.cartaporte.tabla.5.3": "Carrier",

      "blog.cartaporte.h2.4": "Liability is split field by field",
      "blog.cartaporte.p8": "Regla 2.7.7.1.1. of the RMF 2026 (the SAT's annual miscellaneous tax rules) says something almost no fleet uses in its favor. When the authority finds an irregularity in the complemento, both parties answer for it — whoever hired the service and whoever provided it — but each one only for what it supplied.",
      "blog.cartaporte.cite.1": "Resolución Miscelánea Fiscal para 2026, regla 2.7.7.1.1., last paragraph — published in the DOF (Mexico's official gazette) on December 28, 2025.",
      "blog.cartaporte.p9": "Appendix 3 of the Instructivo de llenado for trucking — the SAT's official filling guide — splits the 37 minimum fields of the complemento: <strong>the customer supplies 19 and the carrier 18</strong>. That turns a legal problem into a recordkeeping problem. If the fleet can prove which field the shipper sent it, when and through what channel, the error at the source is not its own. If it cannot prove it, the argument comes down to one party's word against the other's in front of the authority — which is exactly where most fleets stand today, because those 19 fields arrive in loose emails and messages nobody files.",

      "blog.cartaporte.h2.5": "The expensive part is not the fine: it is the deduction",
      "blog.cartaporte.p10": "There is a fine for every receipt issued without the complemento, and it sits in the Código Fiscal (Mexico's federal tax code). But resting the argument there is resting it on the cheapest line. The hit you actually feel in the income statement is a different one, and it lives in the same article that sets the requirements for the receipt.",
      "blog.cartaporte.cite.2": "Código Fiscal de la Federación, artículo 29-A, third-to-last paragraph — text in force, last amendment published in the DOF on April 9, 2026.",
      "blog.cartaporte.p11": "Read it slowly: an expense backed by a receipt that is missing a requirement, or whose data is set down differently from what the rules call for, <strong>cannot be deducted or credited</strong>. One full freight charge knocked out of the deduction weighs more than any fine for a missing complemento, and unlike the fine, it does not arrive with a notice: it shows up once the tax year is already closed.",
      "blog.cartaporte.p12": 'And there is a new line that raises the stakes. Since the amendment to the Código Fiscal published on November 7, 2025, artículo 29-A requires the receipt to cover "operaciones existentes, verdaderas o actos jurídicos reales" — existing operations, genuine transactions or real legal acts — and establishes that one failing that requirement <strong>is deemed false</strong> for the purposes of the Código itself. A complemento that describes a trip other than the one that happened is no longer a data-entry error.',

      "blog.cartaporte.h2.6": "The clock: when fixing it stops being cheap",
      "blog.cartaporte.p13": "Fixing a Carta Porte is not editing the XML. The procedure in Appendix 12 of the Instructivo has an order, and that order is the only thing that keeps a truck from being left without a receipt halfway down the road.",
      "blog.cartaporte.h3.3": "The order you cannot reverse",
      "blog.cartaporte.li.3.1": "Issue a new CFDI, with the complemento already corrected.",
      "blog.cartaporte.li.3.2": 'Relate it to the original using relationship type <code>04</code>, "Sustitución de los CFDI previos" — before cancelling anything.',
      "blog.cartaporte.li.3.3": 'Cancel the incorrect receipt with reason <code>01</code>, "Comprobantes emitidos con errores con relación".',
      "blog.cartaporte.li.3.4": "Get the printed version to the driver if the trip is still on the road.",
      "blog.cartaporte.p14": 'Step 3 is the one with a clock on it. Cancelling a revenue CFDI requires the recipient to accept the cancellation, and the deadline to cancel lives in the Código Fiscal, tied to the month the annual return is filed for the year the CFDI was issued. That deadline — and the three days the recipient has to answer before his silence counts as acceptance — we take apart in the piece on <a href="cancelacion-cfdi-plazo-2026-flotas.html">the CFDI cancellation window</a>. For what matters here, the operational consequence is enough: fixing a January trip in March is paperwork; fixing it after the close means asking your customer to accept the cancellation of a receipt he has already reported.',

      "blog.cartaporte.h2.7": "What to check before you call a trip settled",
      "blog.cartaporte.p15": "You do not need to audit all 37 fields. Five cross-checks catch what turns expensive later, and all five can be done with what is already in the trip folder.",
      "blog.cartaporte.h3.4": "Five cross-checks that fit on a single screen",
      "blog.cartaporte.li.4.1": "The RFC of the transport party against the driver who reported the trip.",
      "blog.cartaporte.li.4.2": "The permit number against the fleet's permit in force, with a flag every time <code>TPXX00</code> shows up.",
      "blog.cartaporte.li.4.3": "The total distance declared against the toll crossings and the liters filled. A 180 km trip on 600 liters of diesel does not add up, and the complemento has no way of knowing that.",
      "blog.cartaporte.li.4.4": "The plates and the vehicle configuration against the truck that left the yard.",
      "blog.cartaporte.li.4.5": "The expiration date on the liability insurance policy, a mandatory XML field and one of those that gets copied from one trip to the next for months.",
      "blog.cartaporte.p16": "None of the five requires a system; they require somebody to have both sides in view and the time to look at them. That is exactly what is in short supply: our own census puts the cost of settling one trip by hand at around <strong>$105</strong>, in a range of $94 to $115, spread across the five roles that touch the cycle. That is the real attention budget per trip, and today it gets spent keying data in, not cross-checking it.",
      "blog.cartaporte.nota": "Cost per trip and number of roles: Likida's own census, August 2026. The regulatory figures in this article come from the sources listed below.",
      "blog.cartaporte.p17": "The honest thing is to say what this does not solve, too. No system — ours included — stamps reality: it stamps what the driver and the shipper report. What can be built is the trail: who supplied which field, when, and what evidence from the trip backs it up. When the audit comes, that is the difference between defending a line and conceding it.",

      /* ── fuentes ── */
      "blog.cartaporte.fuente.1": 'Resolución Miscelánea Fiscal para 2026, reglas 2.7.7.1.1. and 2.7.7.2.1., DOF Dec 28, 2025 — <a href="https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/rmf/RMF_2026-DOF-28122025.pdf" rel="noreferrer">text published by the SAT</a>.',
      "blog.cartaporte.fuente.2": 'Código Fiscal de la Federación, artículos 29-A (third-to-last paragraph and fracción IX, added by the decree published on Nov 7, 2025) and 84, fracción IV, text in force with last amendment DOF Apr 9, 2026 — <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/CFF.pdf" rel="noreferrer">Cámara de Diputados</a>.',
      "blog.cartaporte.fuente.3": 'Estándar del Complemento Carta Porte 3.1, sections 8.A and 8.B "Validaciones aplicables", SAT, last modified Jun 17, 2024 — <a href="http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/Carta_Porte_31.pdf" rel="noreferrer">official PDF</a>.',
      "blog.cartaporte.fuente.4": 'Instructivo de llenado del CFDI con complemento Carta Porte — Autotransporte 3.1, Appendices 3 and 12, SAT, published Aug 7, 2024 — <a href="http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/Instructivo_ComplementoCartaPorte_Autotransporte_31.pdf" rel="noreferrer">official PDF</a>.',
      "blog.cartaporte.fuente.5": 'Catalog schema <code>catCartaPorte.xsd</code>, SAT — modified on Jan 13, 2026 (verified through the <code>Last-Modified</code> header on the SAT\'s server) — <a href="http://www.sat.gob.mx/sitio_internet/cfd/catalogos/CartaPorte/catCartaPorte.xsd" rel="noreferrer">schema in force</a>.',
      "blog.cartaporte.fuente.6": 'The SAT\'s official Carta Porte complemento page (version 3.1 in force since Jul 17, 2024) — <a href="http://omawww.sat.gob.mx/tramitesyservicios/Paginas/complemento_carta_porte.htm" rel="noreferrer">SAT minisite</a>.',
      "blog.cartaporte.fuente.7": "Likida's own census, August 2026: a cost of $105 to settle one trip by hand (range $94–$115) and five roles that touch the cycle.",

      /* ── cierre ── */
      "blog.cartaporte.cierre": "Of the trips you settled last month, how many could you cross-check today, field by field, against what was stamped?"
    }
  });
})();
