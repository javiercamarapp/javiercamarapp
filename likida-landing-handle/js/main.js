/* ═══════════════════════════════════════════════════════════════════════════
   LIKIDA landing — interacciones.
   1) Header píldora → ancho completo al scrollear.
   2) Revelado de secciones (IntersectionObserver).
   3) Banner de fotos: cada celda se revela por fracciones (velo que sube),
      escalonado por columna, al entrar al viewport.
   4) Demo en 3 pasos → calendario de Google en tiempo real (paso 3).
   ═══════════════════════════════════════════════════════════════════════════ */

// ── CONFIG: Cal.com bajo ventas@likida.ai. Las citas caen en su Google Calendar y
//    el personal de Javier se consulta solo para evitar empalmes. El embed se tematiza
//    con nuestras variables (Cal.com cobra por marca en su página, no en el embed).
const CAL_LINK = "likida/demo"; // cal.com/likida/demo — 30 min, Google Meet

// ── 1) Header expandible ────────────────────────────────────────────────────
const header = document.querySelector(".header");
if (header) {
  const alScroll = () => header.classList.toggle("expandido", window.scrollY > 40);
  window.addEventListener("scroll", alScroll, { passive: true });
  alScroll();
}

// ── 2) Revelado genérico ────────────────────────────────────────────────────
const io = new IntersectionObserver((entradas) => {
  for (const e of entradas) {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  }
}, { threshold: 0.16 });
document.querySelectorAll(".revela").forEach((el) => io.observe(el));

// ── 3) Banner por fracciones ────────────────────────────────────────────────
const ioBanner = new IntersectionObserver((entradas) => {
  for (const e of entradas) {
    if (!e.isIntersecting) continue;
    const celdas = e.target.querySelectorAll(".banner-celda");
    celdas.forEach((c, i) => {
      const columna = i % 4;
      const fila = Math.floor(i / 4);
      setTimeout(() => c.classList.add("visible"), columna * 130 + fila * 260);
    });
    ioBanner.unobserve(e.target);
  }
}, { threshold: 0.25 });
document.querySelectorAll(".banner-grid").forEach((g) => ioBanner.observe(g));

// ── 4) Demo de 3 pasos + calendario en vivo ────────────────────────────────
const form = document.getElementById("form-demo");
if (form) {
  const vistas = [...form.querySelectorAll(".demo-vista")];
  const pasos = [...form.querySelectorAll(".demo-paso")];
  let actual = 0;
  const datos = {};

  function pintar() {
    vistas.forEach((v, i) => v.classList.toggle("activa", i === actual));
    pasos.forEach((p, i) => p.classList.toggle("activo", i <= actual));
    if (actual === 2) montarCalendario();
  }

  function montarCalendario() {
    const marco = document.getElementById("cal-marco");
    if (!marco || marco.dataset.montado) return;
    marco.dataset.montado = "1";

    // Cargador oficial de Cal.com (una sola vez).
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal, ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); }
          else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    Cal("init", "demo", { origin: "https://app.cal.com" });
    Cal.ns.demo("inline", {
      elementOrSelector: "#cal-marco",
      calLink: CAL_LINK,
      layout: "month_view",
      config: {
        // El nombre y correo capturados pre-llenan el formulario de la cita.
        name: [datos.nombre, datos.apellido].filter(Boolean).join(" "),
        email: datos.correo || "",
        theme: "light",
      },
    });
    // Nuestra paleta dentro del embed: tinta de marca, tipografía y esquinas del sitio.
    Cal.ns.demo("ui", {
      theme: "light",
      cssVarsPerTheme: {
        light: {
          "cal-brand": "#17100d",
          "cal-text": "#17100d",
          "cal-text-emphasis": "#17100d",
          "cal-bg": "#ffffff",
          "cal-bg-emphasis": "#f2f1ee",
          "cal-border": "#ececef",
          "cal-border-emphasis": "#d9d9dd",
          "cal-text-subtle": "#6b7280",
        },
      },
      hideEventTypeDetails: false,
    });
  }

  form.addEventListener("submit", (ev) => ev.preventDefault());
  form.querySelectorAll("[data-avanza]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const vista = vistas[actual];
      let valido = true;
      vista.querySelectorAll(".campo[required]").forEach((c) => {
        if (!c.value.trim() || (c.type === "email" && !/.+@.+\..+/.test(c.value))) {
          c.style.borderColor = "#c0392b"; valido = false;
        } else {
          c.style.borderColor = "";
          datos[c.name] = c.value.trim();
        }
      });
      if (!valido) return;
      actual = Math.min(actual + 1, vistas.length - 1);
      pintar();
    });
  });
  form.querySelectorAll("[data-regresa]").forEach((btn) => {
    btn.addEventListener("click", () => { actual = Math.max(actual - 1, 0); pintar(); });
  });
  pintar();
}

// ── Año del footer ──────────────────────────────────────────────────────────
const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();

// ── HERO mosaico (clon del efecto HappyRobot): varias imágenes TENUES que
// respiran asíncronamente en los huecos de la retícula. Cada tesela vive su
// propio ciclo: aparece en un hueco libre con un RECORTE de una foto (zoom +
// posición aleatoria = "fracción"), sube a una opacidad tenue distinta cada
// vez, deriva lentamente dentro del cuadro, y se desvanece. 1-4 visibles a la
// vez, nunca dos en el mismo hueco.
(function () {
  const mosaico = document.getElementById("mosaico");
  if (!mosaico) return;
  // Huecos = los <rect> del SVG (viewBox 760×720), en porcentajes.
  const VB_W = 760, VB_H = 720;
  const RECTS = [
    [86, 70, 96], [300, 150, 70], [470, 94, 120], [646, 118, 86],
    [150, 300, 118], [420, 330, 82], [620, 404, 104], [60, 500, 88],
    [286, 560, 112], [520, 580, 76],
  ];
  const SLOTS = RECTS.map(([x, y, s]) => ({
    x: (x / VB_W) * 100, y: (y / VB_H) * 100,
    w: (s / VB_W) * 100, h: (s / VB_H) * 100,
  }));
  const FOTOS = [
    "assets/foto-carretera.png", "assets/foto-operador.png", "assets/foto-caseta.png",
    "assets/foto-diesel.png", "assets/foto-patio.png", "assets/foto-bascula.png",
    "assets/foto-frontera.png", "assets/foto-oficina.png",
  ];
  const teselas = [...mosaico.querySelectorAll(".tesela")];
  const ocupados = new Set();
  const azar = (a, b) => a + Math.random() * (b - a);

  function vivir(tesela, retrasoInicial) {
    setTimeout(function ciclo() {
      const libres = SLOTS.map((_, i) => i).filter((i) => !ocupados.has(i));
      if (!libres.length) { setTimeout(ciclo, 900); return; }
      const i = libres[Math.floor(Math.random() * libres.length)];
      ocupados.add(i);
      const s = SLOTS[i];
      const foto = FOTOS[Math.floor(Math.random() * FOTOS.length)];
      const zoom = azar(170, 260); // recorte: solo se ve una fracción de la foto
      const px0 = azar(0, 100), py0 = azar(0, 100);
      tesela.style.left = s.x + "%";
      tesela.style.top = s.y + "%";
      tesela.style.width = s.w + "%";
      tesela.style.height = s.h + "%";
      tesela.style.backgroundImage = `url("${foto}")`;
      tesela.style.backgroundSize = zoom + "% auto";
      tesela.style.backgroundPosition = `${px0}% ${py0}%`;
      // fuerza reflow para que la transición de posición arranque desde px0
      void tesela.offsetWidth;
      // opacidad tenue distinta cada vez; de vez en cuando una casi sólida
      const tenue = Math.random() < 0.28 ? azar(0.75, 0.95) : azar(0.2, 0.5);
      tesela.style.opacity = tenue;
      // deriva lenta dentro del cuadro (la transición CSS de 4.5s la suaviza)
      tesela.style.backgroundPosition = `${px0 + azar(-14, 14)}% ${py0 + azar(-14, 14)}%`;
      const visiblePor = azar(2400, 4600);
      setTimeout(() => {
        tesela.style.opacity = 0;
        setTimeout(() => {
          ocupados.delete(i);
          setTimeout(ciclo, azar(300, 1800));
        }, 1450); // espera el fade-out completo antes de soltar el hueco
      }, visiblePor);
    }, retrasoInicial);
  }

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // sin animación: una sola tesela fija, tenue
    const t = teselas[0], s = SLOTS[2];
    t.style.cssText = `left:${s.x}%;top:${s.y}%;width:${s.w}%;height:${s.h}%;opacity:.4;background-image:url('${FOTOS[0]}');background-size:cover;`;
    return;
  }
  teselas.forEach((t, n) => vivir(t, n * 1100 + 300));
})();

// ── Scrollytelling: los pasos activan las burbujas del teléfono ──
(function () {
  const pasos = [...document.querySelectorAll(".scrolly-paso")];
  const burbujas = [...document.querySelectorAll(".burbuja")];
  const video = document.getElementById("video-whatsapp");
  if (!pasos.length) return;
  const obs = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      const n = Number(e.target.dataset.paso);
      pasos.forEach((p) => p.classList.toggle("activo", Number(p.dataset.paso) === n));
      burbujas.forEach((b) => b.classList.toggle("visible", Number(b.dataset.paso) <= n));
      if (video && n === 0 && video.readyState >= 2) { video.play().catch(() => {}); }
    }
  }, { threshold: 0.55 });
  pasos.forEach((p) => obs.observe(p));
  // Si el video no existe (aún generándose), se esconde y queda el póster.
  if (video) {
    video.addEventListener("error", () => { video.style.display = "none"; }, { once: true });
  }
})();

/* ── Ciclo automático del agente: los pasos se encienden en secuencia y en bucle (estilo Handle) ── */
(() => {
  const pasos = document.querySelectorAll(".stepper .paso-flujo");
  if (!pasos.length) return;
  let i = 2; // arranca donde estaba el estado estático
  const pinta = () => {
    pasos.forEach((p, j) => {
      const punto = p.querySelector(".punto");
      const estado = p.querySelector(".estado");
      p.classList.toggle("activo", j === i);
      p.classList.toggle("apagado", j > i);
      if (punto) punto.className = "punto " + (j < i ? "" : j === i ? "progreso" : "pendiente");
      if (estado) {
        estado.className = "estado " + (j < i ? "hecho" : j === i ? "progreso" : "");
        estado.textContent = j < i ? "Hecho" : j === i ? "En curso" : "Pendiente";
      }
    });
  };
  pinta();
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(() => { i = (i + 1) % pasos.length; pinta(); }, 2400);
  }
})();
