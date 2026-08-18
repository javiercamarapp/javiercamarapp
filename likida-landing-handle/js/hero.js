/* ═══════════════════════════════════════════════════════════════════════════
   Hero de Likida — mosaicos que rotan sobre la captura del producto.
   Misma técnica que usa Handle en su hero: la imagen se parte en cuadritos de
   14 px y cada uno gira por su cuenta. Dos fuentes de movimiento:
     1) una banda diagonal que barre el cuadro cada 6.5 s, en bucle;
     2) el cursor, que empuja los cuadritos que toca y los suelta en un resorte
        amortiguado — ese rebote es lo que se siente como agua.
   El texto del panel se despedaza al pasar la banda y vuelve a cuajar.
   ═══════════════════════════════════════════════════════════════════════════ */
function mosaicosQueGiran(canvas, { src, lado = 14, radio = 22, ambiente = true }) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const menosMovimiento = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let cols = 0, filas = 0;
  let u = lado * dpr;              // lado del cuadrito en px de dispositivo
  let pos = new Float32Array(0);   // rotación acumulada por cuadrito (rad)
  let vel = new Float32Array(0);   // velocidad angular por cuadrito
  let raf = 0, corriendo = false;
  let W = 0, H = 0;
  const t0 = performance.now();

  const buf = document.createElement("canvas");
  const bctx = buf.getContext("2d");
  const img = new Image();
  let lista = false;

  function medir() {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.round(r.width * dpr);
    H = Math.round(r.height * dpr);
    canvas.width = W; canvas.height = H;
    buf.width = W; buf.height = H;
    u = lado * dpr;
    cols = Math.ceil(W / u);
    filas = Math.ceil(H / u);
    pos = new Float32Array(cols * filas);
    vel = new Float32Array(cols * filas);
    if (bctx) bctx.imageSmoothingEnabled = false;
    pintarBuffer();
    pintarQuieto();
  }

  function pintarBuffer() {        // equivalente a object-fit: cover, a mano
    if (!bctx || !lista) return;
    const s = Math.max(W / img.width, H / img.height);
    const dw = img.width * s, dh = img.height * s;
    bctx.clearRect(0, 0, W, H);
    bctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  }

  function pintarQuieto() {
    ctx.clearRect(0, 0, W, H);
    if (lista) { ctx.imageSmoothingEnabled = false; ctx.drawImage(buf, 0, 0); }
  }

  function cuadro() {
    if (!lista) { raf = requestAnimationFrame(cuadro); return; }
    const t = (performance.now() - t0) / 1000;

    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(buf, 0, 0);                       // la base, nítida
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const amp = (ambiente && !menosMovimiento) ? 1.15 : 0;  // rad
    const banda = 0.2 * H * 1.8;                            // semialtura
    const cy = -banda + ((t % 6.5) / 6.5) * (H + 2 * banda);
    const pasada = Math.floor(t / 6.5);
    const inclina = ((((pasada % 4) + 4) % 4 === 0) ? -0.5 : (pasada % 3) - 1) * 0.35;

    for (let fila = 0; fila < filas; fila++) {
      const ty = fila * u + u / 2;
      for (let col = 0; col < cols; col++) {
        const i = fila * cols + col;
        let v = vel[i], p = pos[i];

        if (v !== 0 || p !== 0) {                   // el resorte del cursor
          v += -(0.055 * p);
          v *= 0.88;
          p += v;
          if (Math.abs(v) < 4e-4 && Math.abs(p) < 4e-4) { v = 0; p = 0; }
          vel[i] = v; pos[i] = p;
        }

        let amb = 0;
        if (amp > 0) {
          const d = ty + (col * u + u / 2 - W / 2) * inclina - cy;
          if (d > -banda && d < banda) {
            amb = 0.5 * (1 + Math.cos(Math.PI * d / banda)) * amp
                * Math.sin(0.8 * col + 0.45 * fila + 3.4 * t);
          }
        }

        const rot = p + amb;
        if (rot > -0.0025 && rot < 0.0025) continue;

        const sx = col * u, sy = fila * u;
        const sc = 1 + Math.min(0.3, (Math.abs(v) + 0.6 * Math.abs(amb)) * 0.55);
        ctx.save();
        ctx.translate(sx + u / 2, ty);
        ctx.rotate(rot);
        ctx.scale(sc, sc);
        ctx.drawImage(buf, sx, sy, u, u, -u / 2, -u / 2, u, u);
        ctx.restore();
      }
    }
    raf = requestAnimationFrame(cuadro);
  }

  const arranca = () => { if (!corriendo && !menosMovimiento) { corriendo = true; raf = requestAnimationFrame(cuadro); } };
  const para = () => { corriendo = false; cancelAnimationFrame(raf); };

  function alMover(ev) {
    if (menosMovimiento || !lista) return;
    const r = canvas.getBoundingClientRect();
    const px = (ev.clientX - r.left) * dpr;
    const py = (ev.clientY - r.top) * dpr;
    const R = radio * dpr, R2 = R * R;
    const c0 = Math.max(0, Math.floor((px - R) / u));
    const c1 = Math.min(cols - 1, Math.floor((px + R) / u));
    const f0 = Math.max(0, Math.floor((py - R) / u));
    const f1 = Math.min(filas - 1, Math.floor((py + R) / u));
    for (let fila = f0; fila <= f1; fila++) {
      for (let col = c0; col <= c1; col++) {
        const dx = col * u + u / 2 - px, dy = fila * u + u / 2 - py;
        const d2 = dx * dx + dy * dy;
        if (d2 > R2) continue;
        const i = fila * cols + col;
        // tablero de ajedrez: unos para un lado, otros para el otro
        const signo = ((col + fila) % 2) ? -1 : 1;
        vel[i] += signo * (1 - Math.sqrt(d2) / R) * 0.55;
      }
    }
    arranca();
  }

  img.onload = () => { lista = true; pintarBuffer(); pintarQuieto(); };
  img.src = src;
  medir();

  const ro = new ResizeObserver(medir); ro.observe(canvas);
  canvas.addEventListener("pointermove", alMover, { passive: true });
  const io = new IntersectionObserver(([e]) => {
    (e.isIntersecting && !document.hidden) ? arranca() : para();
  }, { threshold: 0 });
  io.observe(canvas);
  document.addEventListener("visibilitychange", () => document.hidden ? para() : arranca());
  arranca();
}

document.addEventListener("DOMContentLoaded", () => {
  const lienzo = document.getElementById("hero-lienzo");
  if (lienzo) {
    mosaicosQueGiran(lienzo, { src: lienzo.dataset.src, lado: 14, radio: 22, ambiente: true });
  }
});
