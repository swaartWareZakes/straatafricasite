/* ========================================================================
   Straat Africa – Core UI: nav, preloader, smooth scroll, reveals
   ======================================================================== */

   (function () {
    'use strict';
  
    /* ---------- 1) Mobile nav toggle (ES5, works everywhere) ---------- */
    document.addEventListener('DOMContentLoaded', function () {
      var toggle = document.getElementById('navToggle');
      var menu = document.getElementById('navMenu');
  
      if (toggle && menu) {
        toggle.addEventListener('click', function () {
          // Tailwind: .hidden = display:none
          if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden');
          } else {
            menu.classList.add('hidden');
          }
        });
      }
    });
  
    /* ---------- 2) Preloader & page enter ---------- */
    // We hide the loader on window.load, plus a fallback so we never get stuck
    (function () {
      // Avoid flash of unstyled content if this loads very fast
      document.documentElement.classList.add('js');
  
      // Safety fallback: if load is delayed (slow image/font), clear after 1.2s
      var safetyTimer = setTimeout(function () {
        hidePreloader();
      }, 1200);
  
      window.addEventListener('load', function () {
        clearTimeout(safetyTimer);
        // Small delay feels smoother and lets late fonts settle
        setTimeout(function () {
          hidePreloader();
          // Kick off first-frame reveals for items already in view
          revealObserve();
          // If we arrived with a hash, smooth jump once content is visible
          smoothScrollToHashOnLoad();
        }, 150);
      });
  
      function hidePreloader() {
        document.body.classList.add('is-loaded');
        var pre = document.getElementById('preloader');
        if (pre) {
          pre.classList.add('hidden');
        }
      }
    })();
  
    /* ---------- 3) IntersectionObserver for [data-animate] reveals ---------- */
    window.revealObserve = function () {
      var els = document.querySelectorAll('[data-animate]');
      if (!els.length) return;
  
      // If IO unsupported, or user prefers reduced motion → just show everything
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
            if (href === '#') return; // ignore dummy links
  
            var id = href.slice(1);
            var target = document.getElementById(id);
            if (!target) return; // not on this page
  
            e.preventDefault();
            try {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch (err) {
              // Older browsers without smooth scroll
              target.scrollIntoView(true);
            }
  
            // Update URL (no jump)
            if (history && history.pushState) {
              history.pushState(null, '', '#' + id);
            }
          });
        });
      });
    })();
  
    /* Smoothly scroll to initial hash after load (so the preloader doesn't block it) */
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