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


      /* ---------- 5) Network map (Google Maps) ---------- */
  window.initStraatMap = function () {
    var mapEl = document.getElementById('straatMap');
    if (!mapEl || typeof google === 'undefined' || !google.maps) return;

    // Default centre (Joburg) – gets adjusted once markers load
    var defaultCenter = { lat: -26.2041, lng: 28.0473 };

    var map = new google.maps.Map(mapEl, {
      zoom: 10,
      center: defaultCenter,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#121212" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#121212" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#f5f5f5" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#ffffff" }]
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d0d0d0" }]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#1b1b1b" }]
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#a0a0a0" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#292929" }]
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#101010" }]
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#e0e0e0" }]
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#3a3a3a" }]
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#ffffff" }]
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#181818" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#0b0b0b" }]
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#555555" }]
        }
      ]
    });

    // Adjust path based on where you store the JSON relative to the HTML page
    fetch('assets/data/straatafrica-network.json')
      .then(function (res) {
        return res.json();
      })
      .then(function (points) {
        if (!Array.isArray(points) || !points.length) return;

        var bounds = new google.maps.LatLngBounds();

        var totalTaxis = 0;
        var ranks = new Set();
        var cities = new Set();

        points.forEach(function (p) {
          if (typeof p.lat !== 'number' || typeof p.lng !== 'number') return;

          totalTaxis += 1;
          if (p.rank) ranks.add(p.rank);
          if (p.city) cities.add(p.city);

                    // You can still use `screens` later if you want different icons per size
            var screens = p.screens || 1;

                    // Custom Straat Africa taxi icon
              var taxiIcon = {
                url: "assets/img/straat-taxi-icon.png", // path to your PNG
                      // Adjust these to how big you want it on the map
                scaledSize: new google.maps.Size(32, 32), // 32x32 px on screen
                origin: new google.maps.Point(0, 0),
                      // Anchor = point that sits ON the map (bottom middle of the icon)
                anchor: new google.maps.Point(16, 28),
              };
          
              var marker = new google.maps.Marker({
                position: { lat: p.lat, lng: p.lng },
                map: map,
                title: p.name || p.rank || "Straat Africa Taxi",
                icon: taxiIcon,
          });
          

          var infoHtml =
          '<div style="min-width:220px;padding:10px 12px;'
          + 'background:#0b0b0b;color:#ffffff;'
          + 'font-family:Montserrat,system-ui,sans-serif;'
          + 'border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,.5);">'
          +
          '<div style="font-size:10px;letter-spacing:.16em;'
          + 'text-transform:uppercase;font-weight:800;color:#F9CD46;'
          + 'margin-bottom:4px;">Straat Africa Taxi Screen</div>'
          +
          '<h3 style="margin:0 0 4px;font-weight:800;font-size:14px;'
          + 'color:#ffffff;">'
          + (p.name || p.rank || 'Straat Africa Taxi')
          + '</h3>'
          +
          (p.rank
            ? '<div style="font-size:12px;opacity:.85;margin-bottom:2px;">'
              + '<strong>Rank:</strong> ' + p.rank + '</div>'
            : '')
          +
          (p.city
            ? '<div style="font-size:12px;opacity:.85;margin-bottom:2px;">'
              + '<strong>Province:</strong> ' + p.city + '</div>'
            : '')
          +
          (p.route
            ? '<div style="font-size:12px;opacity:.85;margin-bottom:2px;">'
              + '<strong>Route:</strong> ' + p.route + '</div>'
            : '')
          +
          (typeof p.screens === 'number'
            ? '<div style="font-size:12px;opacity:.85;margin-bottom:2px;">'
              + '<strong>Screens:</strong> ' + p.screens + '</div>'
            : '')
          +
          '</div>';

          var infoWindow = new google.maps.InfoWindow({ content: infoHtml });
          marker.addListener('click', function () {
            infoWindow.open(map, marker);
          });

          bounds.extend(marker.getPosition());
        });

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds);
        }

        // Update stats on the page
        var totalTaxisEl = document.getElementById('statTotalTaxis');
        var totalRanksEl = document.getElementById('statTotalRanks');
        var totalCitiesEl = document.getElementById('statTotalCities');

        if (totalTaxisEl) totalTaxisEl.textContent = totalTaxis.toString();
        if (totalRanksEl) totalRanksEl.textContent = ranks.size.toString();
        if (totalCitiesEl) totalCitiesEl.textContent = cities.size.toString();
      })
      .catch(function (err) {
        console.error('Failed to load Straat Africa network JSON', err);
      });
  };
  })();