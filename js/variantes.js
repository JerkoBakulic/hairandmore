/* Hair and More — barra de variantes + comportamiento compartido de las propuestas.
   Requiere js/servicios.js (window.SERVICIOS) antes de este archivo cuando la página usa [data-servicios]. */
(function () {
  const $$ = s => [...document.querySelectorAll(s)];
  const RESERVA = "https://hairandmore750.setmore.com/";

  /* ---------- Barra para cambiar de variante ---------- */
  const V = [["index.html", "", "Actual"], ["v1.html", "01", "Noir"], ["v2.html", "02", "Studio"], ["v3.html", "03", "Urbana"]];
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const css = document.createElement("style");
  css.textContent = `
  .hm-switch{position:fixed;inset:0 0 auto;height:40px;z-index:9999;display:flex;align-items:center;justify-content:center;gap:14px;background:#050505;color:#8d8a84;
    font:500 11px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.12em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,.08)}
  .hm-switch nav{display:flex;gap:3px;background:rgba(255,255,255,.07);padding:3px;border-radius:99px}
  .hm-switch a{display:flex;gap:7px;align-items:center;padding:7px 13px;border-radius:99px;color:#d6d2ca;text-decoration:none;transition:background .2s,color .2s}
  .hm-switch a b{color:#d9a94e}
  .hm-switch a:hover{color:#fff}
  .hm-switch a.on{background:#f3ead9;color:#0b0b0c}
  @media(max-width:600px){.hm-switch>span{display:none}.hm-switch a span{display:none}.hm-switch a.act span{display:inline}.hm-switch a{padding:7px 12px}}
  body{padding-top:40px}
  .cabecera{top:40px!important}
  @media(max-width:900px){.menu[aria-label="Principal"]{top:calc(var(--cabecera, 72px) + 40px)!important}}`;
  document.head.appendChild(css);
  const bar = document.createElement("div");
  bar.className = "hm-switch";
  bar.innerHTML = `<span>Propuesta de rediseño</span><nav>${V.map(([f, n, t]) =>
    `<a href="${f}" class="${f === here ? "on" : ""}${n ? "" : " act"}">${n ? `<b>${n}</b>` : ""}<span>${t}</span></a>`).join("")}</nav>`;
  document.body.prepend(bar);

  /* ---------- Carta de servicios por categoría ---------- */
  const precio = n => "$" + n.toLocaleString("es-CL");
  const dur = m => m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + (m % 60) + " min" : "") : m + " min";
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  $$("[data-servicios]").forEach(root => {
    const panel = root.querySelector("[data-panel]");
    const tabs = [...root.querySelectorAll("[data-cat]")];
    const pinta = cat => {
      const lista = (window.SERVICIOS || {})[cat] || [];
      panel.innerHTML = lista.map(s => `<article class="srv"><div class="srv-n"><h4>${esc(s.nombre)}</h4>${s.detalle ? `<p>${esc(s.detalle.trim())}</p>` : ""}</div><div class="srv-m"><span class="srv-t">${dur(s.minutos)}</span><strong class="srv-p">${precio(s.precio)}</strong></div></article>`).join("");
      tabs.forEach(t => { const on = t.dataset.cat === cat; t.classList.toggle("on", on); t.setAttribute("aria-selected", on); });
      root.querySelectorAll("[data-count]").forEach(el => el.textContent = lista.length);
    };
    tabs.forEach(t => t.addEventListener("click", () => pinta(t.dataset.cat)));
    pinta(tabs[0] ? tabs[0].dataset.cat : "barberia");
  });
  // total de servicios y precio mínimo, para textos dinámicos
  if (window.SERVICIOS) {
    const todos = Object.values(window.SERVICIOS).flat();
    const unicos = new Set(todos.map(s => s.nombre)).size;
    $$("[data-total-servicios]").forEach(el => el.textContent = unicos);
    $$("[data-desde]").forEach(el => el.textContent = precio(Math.min(...todos.map(s => s.precio))));
  }

  /* ---------- Enlaces de reserva, menú móvil, cabecera y animaciones ---------- */
  $$("[data-reservar]").forEach(a => { a.href = RESERVA; a.target = "_blank"; a.rel = "noopener"; });
  const burger = document.querySelector("#burger");
  if (burger) burger.addEventListener("click", () => document.body.classList.toggle("open"));
  $$("#movil a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("open")));
  const nav = document.querySelector("#nav");
  if (nav) { const f = () => nav.classList.toggle("solid", scrollY > 40); addEventListener("scroll", f, { passive: true }); f(); }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }), { threshold: .12 });
    $$(".rv").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(el); });
  } else $$(".rv").forEach(el => el.classList.add("visible"));
})();
