// Hair and More — interacciones
(function () {
  const cabecera = document.getElementById('cabecera');
  const menu = document.getElementById('menu');
  const botonMenu = document.getElementById('menu-boton');

  const fondo = () => cabecera.classList.toggle('con-fondo', window.scrollY > 30);
  fondo();
  window.addEventListener('scroll', fondo, { passive: true });

  // Menú móvil
  const cerrar = () => { menu.classList.remove('abierto'); cabecera.classList.remove('menu-abierto'); botonMenu.setAttribute('aria-expanded', 'false'); botonMenu.setAttribute('aria-label', 'Abrir menú'); };
  botonMenu.addEventListener('click', () => {
    const abrir = !menu.classList.contains('abierto');
    menu.classList.toggle('abierto', abrir);
    cabecera.classList.toggle('menu-abierto', abrir);
    botonMenu.setAttribute('aria-expanded', String(abrir));
    botonMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', cerrar));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });

  // Servicios por categoría
  const panel = document.getElementById('panel-servicios');
  const pestanas = [...document.querySelectorAll('.pestanas [role="tab"]')];
  const precio = (n) => '$' + n.toLocaleString('es-CL');
  const duracion = (m) => (m >= 60 ? Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : '') : m + ' min');
  const escapar = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mostrar = (cat) => {
    const lista = (window.SERVICIOS && window.SERVICIOS[cat]) || [];
    panel.innerHTML = lista.map((s, i) => `
      <article class="servicio" style="animation-delay:${Math.min(i, 12) * 30}ms">
        <h3>${escapar(s.nombre)}</h3>
        <span class="servicio__precio">${precio(s.precio)}</span>
        <p class="servicio__info"><span class="servicio__duracion">${duracion(s.minutos)}</span>${s.detalle ? escapar(s.detalle) : ''}</p>
      </article>`).join('');
  };
  const activar = (tab) => {
    pestanas.forEach((t) => { const sel = t === tab; t.setAttribute('aria-selected', String(sel)); t.tabIndex = sel ? 0 : -1; });
    panel.setAttribute('aria-labelledby', tab.id);
    mostrar(tab.dataset.cat);
  };
  pestanas.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', (e) => {
      const paso = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!paso) return;
      const sig = pestanas[(i + paso + pestanas.length) % pestanas.length];
      activar(sig); sig.focus();
    });
  });
  mostrar('barberia');

  // Aparición al hacer scroll
  const els = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('visible'); obs.unobserve(x.target); } }), { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
  } else els.forEach((el) => el.classList.add('visible'));

  // Sección activa en el menú
  const enlaces = [...menu.querySelectorAll('a[href^="#"]')];
  if ('IntersectionObserver' in window) {
    const obsMenu = new IntersectionObserver((en) => en.forEach((x) => {
      if (x.isIntersecting) enlaces.forEach((a) => a.classList.toggle('activo', a.getAttribute('href') === '#' + x.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    enlaces.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean).forEach((s) => obsMenu.observe(s));
  }

  document.getElementById('anio').textContent = new Date().getFullYear();
})();
