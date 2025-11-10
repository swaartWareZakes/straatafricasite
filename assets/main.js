/* ========================================================================
   Straat Africa – Core UI: nav, preloader, smooth scroll, reveals
   ======================================================================== */

/* ---------- 1) Mobile nav toggle ---------- */
(function () {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('hidden'));
  }
})();

/* ---------- 2) Preloader & page enter ---------- */
/* We hide the loader on window.load, plus a DOM fallback so we never get stuck */
(function () {
  // Avoid flash of unstyled content if this loads very fast
  document.documentElement.classList.add('js');

  // Safety fallback: if load is delayed (slow image/font), clear after 1.2s
  const safetyTimer = setTimeout(() => {
    hidePreloader();
  }, 1200);

  window.addEventListener('load', () => {
    clearTimeout(safetyTimer);
    // A tiny delay feels smoother and lets late fonts settle
    setTimeout(() => {
      hidePreloader();
      // Kick off first-frame reveals for items already in view
      revealObserve();
      // If we arrived with a hash, smooth jump once content is visible
      smoothScrollToHashOnLoad();
    }, 150);
  });

  function hidePreloader() {
    document.body.classList.add('is-loaded');
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hidden');
  }
})();

/* ---------- 3) IntersectionObserver for [data-animate] reveals ---------- */
function revealObserve() {
  const els = document.querySelectorAll('[data-animate]');

  // If no elements, or IO unsupported, or user prefers reduced motion → just show
  const noIO = !('IntersectionObserver' in window);
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!els.length || noIO || reduced) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
  );

  els.forEach((el) => io.observe(el));
}

/* ---------- 4) Smooth scroll for on-page hash links ---------- */
(function () {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      if (href === '#') return; // ignore dummy links

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return; // not on this page

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update URL (no jump)
      if (history.pushState) history.pushState(null, '', `#${id}`);
    });
  });
})();

/* Smoothly scroll to initial hash after load (so the preloader doesn't block it) */
function smoothScrollToHashOnLoad() {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return;
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}