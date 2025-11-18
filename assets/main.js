/* ========================================================================
   Straat Africa – Core UI: nav, preloader, smooth scroll, reveals
   ======================================================================== */

   (function () {
    'use strict';
  
    /* ---------- 1) Mobile nav toggle with smooth panel + ✕ icon ---------- */
    document.addEventListener('DOMContentLoaded', function () {
      var toggle = document.getElementById('navToggle');
      var icon   = document.getElementById('navIcon');
      var menu   = document.getElementById('navMenu');
  
      if (!toggle || !menu || !icon) return;
  
      var open = false;
  
      function setNavState(nextOpen) {
        open = nextOpen;
  
        if (open) {
          // slide down
          menu.classList.add('is-open');
          menu.style.maxHeight = menu.scrollHeight + 'px';
          icon.textContent = '✕';
          toggle.setAttribute('aria-expanded', 'true');
        } else {
          // slide up
          menu.style.maxHeight = '0px';
          menu.classList.remove('is-open');
          icon.textContent = '☰';
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
  
      toggle.addEventListener('click', function () {
        setNavState(!open);
      });
  
      // If user resizes to desktop, reset menu so it doesn’t get stuck
      window.addEventListener('resize', function () {
        if (window.innerWidth >= 768) {
          menu.style.maxHeight = '';
          menu.classList.remove('is-open');
          icon.textContent = '☰';
          toggle.setAttribute('aria-expanded', 'false');
          open = false;
        }
      });
    });
  
    /* ---------- 2) Preloader & page enter ---------- */
    (function () {
      document.documentElement.classList.add('js');
  
      var safetyTimer = setTimeout(function () {
        hidePreloader();
      }, 1200);
  
      window.addEventListener('load', function () {
        clearTimeout(safetyTimer);
        setTimeout(function () {
          hidePreloader();
          revealObserve();
          smoothScrollToHashOnLoad();
        }, 150);
      });
  
      function hidePreloader() {
        document.body.classList.add('is-loaded');
        var pre = document.getElementById('preloader');
        if (pre) pre.classList.add('hidden');
      }
    })();
  
    /* ---------- 3) IntersectionObserver for [data-animate] reveals ---------- */
    window.revealObserve = function () {
      var els = document.querySelectorAll('[data-animate]');
      if (!els.length) return;
  
      var noIO = !('IntersectionObserver' in window);
      var reduced =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
      if (noIO || reduced) {
        Array.prototype.forEach.call(els, function (el) {
          el.classList.add('in');
        });
        return;
      }
  
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
      );
  
      Array.prototype.forEach.call(els, function (el) {
        io.observe(el);
      });
    };
  
    /* ---------- 4) Smooth scroll for on-page hash links ---------- */
    (function () {
      document.addEventListener('DOMContentLoaded', function () {
        var links = document.querySelectorAll('a[href^="#"]');
  
        Array.prototype.forEach.call(links, function (a) {
          a.addEventListener('click', function (e) {
            var href = a.getAttribute('href') || '';
            if (href === '#') return;
  
            var id = href.slice(1);
            var target = document.getElementById(id);
            if (!target) return;
  
            e.preventDefault();
            try {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch (err) {
              target.scrollIntoView(true);
            }
  
            if (history && history.pushState) {
              history.pushState(null, '', '#' + id);
            }
          });
        });
      });
    })();
  
    window.smoothScrollToHashOnLoad = function () {
      var hash = window.location.hash;
      if (!hash || hash.length < 2) return;
  
      var id = hash.slice(1);
      var target = document.getElementById(id);
      if (!target) return;
  
      try {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (err) {
        target.scrollIntoView(true);
      }
    };
  })();