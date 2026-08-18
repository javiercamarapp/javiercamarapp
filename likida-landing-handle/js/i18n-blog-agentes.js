/* ═══════════════════════════════════════════════════════════════════════════
   LIKIDA — inglés de blog/agentes-de-ia-para-transporte-de-carga.html
   Se carga solo en esa página, antes de js/i18n.js. Solo declara el inglés:
   el español de cada nodo es el que trae escrito el HTML.

   Términos fiscales mexicanos que NO se traducen: CFDI, SAT, IEPS, DOF,
   Carta Porte. Cada uno lleva una glosa corta la primera vez que aparece.
   Los nombres de normas se quedan en español (Código Fiscal de la Federación,
   artículo 28, fracción I, apartado A, Ley de Ingresos). Ninguna cifra, fecha
   ni monto cambia entre idiomas.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  (window.LIKIDA_I18N = window.LIKIDA_I18N || []).push({
    en: {
      /* ── head ── */
      "blog.agentes.title": "AI agents for freight trucking: what they actually do | Likida",
      "blog.agentes.desc": "AI agents for freight trucking read, sort and validate the back-office paperwork. Where they help, where they must not decide, and how to evaluate them.",
      "blog.agentes.og.desc": "AI agents for freight trucking read, sort and validate the back-office paperwork. Where they help, where they must not decide, and how to evaluate them.",

      /* ── JSON-LD. El headline es el mismo inglés que el h1 y que la tarjeta
         del índice del blog, para que el sitio no se contradiga. ── */
      "blog.agentes.ld.headline": "What an AI agent can and cannot do in a fleet's back office",
      "blog.agentes.ld.desc": "AI agents for freight trucking read, sort and validate the back-office paperwork. Where they help, where they must not decide, and how to evaluate them.",
      "blog.agentes.ld.keywords": "AI agents for freight trucking",

      /* ── cabecera ── */
      "blog.agentes.h1": "What an AI agent can and cannot do in a fleet's back office",
      "blog.agentes.entradilla": "Almost everything sold today as AI agents for freight trucking is telemetry with a new name. This is the line a controller cares about: which part of the cycle a model can touch, which part has to stay inside a deterministic engine, and the five questions that size up any vendor — Likida included.",
      "blog.agentes.portada.alt": "Line diagram on graph paper: a square core in the center joined by six spokes to a diesel nozzle, a toll booth, a stack of blank documents, a two-pan scale, a stamp and a tractor-trailer; one of the six spokes is drawn as a dashed line",

      /* ── cuerpo ── */
      "blog.agentes.p1": 'An email with "AI" in the subject line tells you nothing. In Mexican trucking that term covers three different businesses today: predictive maintenance on telemetry data, in-cab video analytics, and systems that read documents and run the steps of an administrative process. Only the third one touches the back office, and it is the only one this piece is about.',
      "blog.agentes.p2": 'The useful question is not whether the tool "uses AI." It is where exactly the model comes in, how much of the result depends on it, and what the system does the day it gets something wrong. An operations director can answer that without knowing a thing about neural networks. It takes five questions, and they are further down.',

      "blog.agentes.h2.1": "What an AI agent is, and how it differs from a chatbot",
      "blog.agentes.p3": "<strong>A chatbot answers; an agent acts.</strong> The chatbot takes a question and returns text. The agent takes a goal, decides which steps to take, calls tools — query a service, open a file, write to a database — and stops when it meets a termination condition somebody defined. The practical difference is that an agent leaves a trail of actions, not just of conversation.",
      "blog.agentes.p4": "That distinction separates the assistant that summarizes your per diem policy from the system that opens a CFDI (Mexico's digital tax receipt), checks its status against the SAT (Mexico's tax authority) and flags a settlement as one that cannot be closed. The first one cannot make an expensive mistake. The second one can.",

      "blog.agentes.h2.2": "What it can do today in a fleet's back office",
      "blog.agentes.p5": "The tasks where AI agents for freight trucking pay off today all have the same shape: messy input, a clear rule, a verifiable output. That is exactly the profile of settlement paperwork.",

      "blog.agentes.h3.1": "Work you can already hand off",
      "blog.agentes.li.1.1": "Read the crumpled photo of a toll or diesel receipt and pull the amount, date, folio number and station out of it.",
      "blog.agentes.li.1.2": "Take a driver's receipts over WhatsApp while he is still on the road and file them against the trip they belong to, with nobody keying them in.",
      "blog.agentes.li.1.3": "Cross-check a CFDI's XML against its printed representation — the two do not always say the same thing.",
      "blog.agentes.li.1.4": "Notice what is missing: a trip with two tolls recorded on a route that has five.",
      "blog.agentes.li.1.5": '<a href="cancelacion-cfdi-plazo-2026-flotas.html">Watch the status of the receipts already in hand</a> and raise a flag when a supplier cancels one that already went into a closed settlement.',
      "blog.agentes.li.1.6": 'Draft the correction request that goes to the supplier when <a href="ieps-diesel-acreditable-cfdi-desglosado.html">a diesel receipt does not break out what it should</a>.',

      "blog.agentes.p6": 'None of those tasks is glamorous and every one of them eats the time of expensive people. Our census puts the cost of closing a trip by hand at around $105, spread across five different roles; <a href="cuanto-cuesta-liquidar-un-viaje.html">the breakdown is in the piece on what settling a trip costs</a>. Almost all of that cost is moving paper around, not judgment.',
      "blog.agentes.nota": "Likida's own census, August 2026: ~$105 MXN per trip settled by hand, in a range of $94 to $115; five roles touch the cycle.",

      "blog.agentes.h2.3": "What it cannot do — and what it should not try",
      "blog.agentes.p7": 'A language model predicts the most plausible continuation of a text. That is its virtue reading a blurry receipt and its flaw doing arithmetic. <strong>An AI agent must not calculate the settlement.</strong> The amounts — cash advances, commissions, withholdings, the creditable diesel IEPS (Mexico\'s excise tax on fuel), <a href="estimulo-50-peaje-conciliacion-casetas-tag.html">the 50% toll credit</a> — have to come out of a deterministic engine: same input, same result today and three years from now, reproducible line by line.',

      "blog.agentes.h3.2": "The short list of what the model has no business doing",
      "blog.agentes.li.2.1": "Calculating amounts. Code adds them up, not a model.",
      "blog.agentes.li.2.2": "Deciding whether an expense is deductible. That is tax judgment, and a person signs it.",
      "blog.agentes.li.2.3": "Issuing or canceling a CFDI on its own.",
      "blog.agentes.li.2.4": "Closing a settlement that does not reconcile. When evidence is missing, the right system stops and says so.",
      "blog.agentes.li.2.5": "Filling in the value it could not find. An empty field is an answer; a field filled with the most likely value is a liability.",

      "blog.agentes.cita": "The model reads and sorts. The engine calculates. If the final figure came out of the model, it cannot be defended.",

      "blog.agentes.h2.4": "Why the line is a tax line, not a technical one",
      "blog.agentes.p8": "This line is not drawn out of architectural taste. It is drawn because everything the system produces along the way — the digitized receipt, the CFDI validation, the log of why a line was rejected — falls inside the taxpayer's accounting records.",
      "blog.agentes.fundamento.cite": "Código Fiscal de la Federación, artículo 28, fracción I, apartado A — last amendment published in the DOF (Mexico's official gazette) on April 9, 2026.",
      "blog.agentes.p9": 'Read that again slowly: "any other processable medium of data storage" and "electronic tax-recording equipment or systems and their respective records" are accounting records. What the agent writes sits inside the perimeter the authority can ask for, and the same Code requires that accounting be kept for five years (artículo 30). A system that cannot show how it got to a number is not a back-office system: it is a quick opinion with a nice interface.',

      "blog.agentes.h2.5": "Five questions for sizing up any vendor",
      "blog.agentes.p10": "This is the part you take into the meeting. You do not need to understand the model to use it: you ask, you write down the answer, you compare. It applies the same to an ERP with a new module, to a three-person startup and to us.",

      "blog.agentes.tabla.th.1": "The question",
      "blog.agentes.tabla.th.2": "An answer that holds up",
      "blog.agentes.tabla.th.3": "Red flag",
      "blog.agentes.tabla.1.1": "What does it do when it is not sure?",
      "blog.agentes.tabla.1.2": "It stops, flags the line and asks for the document that is missing.",
      "blog.agentes.tabla.1.3": '"It always returns a result."',
      "blog.agentes.tabla.2.1": "Does it cite the rule it applied?",
      "blog.agentes.tabla.2.2": "It gives back the article and the rate in force on the date of the expense, not today's.",
      "blog.agentes.tabla.2.3": "It gives you the amount and nothing else.",
      "blog.agentes.tabla.3.1": "Can you see the trail?",
      "blog.agentes.tabla.3.2": "Every figure opens all the way down to the photo of the receipt behind it.",
      "blog.agentes.tabla.3.3": "A final PDF nobody can take apart.",
      "blog.agentes.tabla.4.1": "Where does the data live and who trains on it?",
      "blog.agentes.tabla.4.2": "Isolated per company, encrypted, and with a written promise not to train models on it.",
      "blog.agentes.tabla.4.3": '"It is in the cloud."',
      "blog.agentes.tabla.5.1": "What happens when a rate changes?",
      "blog.agentes.tabla.5.2": "The rules are versioned with an effective date and the recalculation uses the date the expense happened.",
      "blog.agentes.tabla.5.3": "You have to wait for the next software release.",

      "blog.agentes.p11": "The third one is the question almost nobody asks and the only one that turns urgent the day the SAT asks for the records. The fifth separates a tax product from a demo: the diesel IEPS rates and the tax credits in the Ley de Ingresos are published in the DOF and they change, and a March expense still has to be calculated with the March rule even if today is August. A system that only knows the current rule recalculates the past wrong.",

      "blog.agentes.h2.6": "What still needs human hands",
      "blog.agentes.p12": "It is worth saying so in the same piece that explains what the technology does do. There are parts of this problem software does not solve, not now and not soon:",
      "blog.agentes.li.3.1": "The deductibility call in the borderline cases. Someone with a professional license decides it and signs it.",
      "blog.agentes.li.3.2": "The negotiation with the supplier who refuses to break out the receipt the way he should.",
      "blog.agentes.li.3.3": "What gets docked from a driver's pay. That is a labor and trust matter, not a data one.",
      "blog.agentes.li.3.4": '<a href="carta-porte-3-1-revision-en-la-liquidacion.html">Errors in a Carta Porte (Mexico\'s shipping complement to the CFDI) that already went out</a>: the system finds them, but fixing them is people from different departments talking to each other.',
      "blog.agentes.li.3.5": "The ramp-up. The first trips of any fleet get reconciled by hand against the system until both numbers match; there is no shortcut.",

      "blog.agentes.p13": "And a note on honesty, because the list of five questions applies to us too: Likida does not have fleets running yet. There is no success story to show and no savings percentage to brag about. What there is, is a position on where the line goes, and that position can be judged today, before anyone signs anything.",

      "blog.agentes.h2.7": "Next time that email lands",
      "blog.agentes.p14": 'Do not ask whether the system uses artificial intelligence. Ask what it does when it is not sure. The answer to that one question sorts the whole market: the ones who say "it stops and tells you" are building for a controller, and the ones who say "it always gives you a number" are building for a demo.',

      /* ── fuentes ── */
      "blog.agentes.fuente.1": 'Código Fiscal de la Federación, artículo 28, fracción I, apartado A — last amendment published in the DOF on April 9, 2026 — <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/CFF.pdf" rel="noreferrer">text in force</a>.',
      "blog.agentes.fuente.2": "Código Fiscal de la Federación, artículo 30, tercer párrafo (the five-year retention period) — same publication.",
      "blog.agentes.fuente.3": "Likida's own census, August 2026: the cost of settling a trip by hand and the roles that touch the cycle.",

      /* ── cierre ── */
      "blog.agentes.cierre": "Which of the five questions could you not answer about the system you settle trips with today?"
    }
  });
})();
