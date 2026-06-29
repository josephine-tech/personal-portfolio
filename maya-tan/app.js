/* Maya Tan · premium interactions — fully self-contained.
   No external dependencies: scroll reveals, counters, custom cursor,
   3D tilt, magnetic buttons, testimonial carousel, FAQ accordion, forms.
   Degrades gracefully: if motion is unavailable, all content stays
   fully visible and usable. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer:fine)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---- footer year ---- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- nav scrolled state + mobile menu ---- */
  var nav = document.getElementById('nav');
  function navState() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 20); }
  navState();
  window.addEventListener('scroll', navState, { passive: true });

  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- scroll progress bar ---- */
  var bar = document.querySelector('.progress-bar');
  function progress() {
    if (!bar) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }
  progress();
  window.addEventListener('scroll', progress, { passive: true });

  /* ---- scroll reveals (IntersectionObserver + CSS) ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !hasIO) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { rio.observe(el); });
  }

  /* ---- animated counters ---- */
  function animCount(el) {
    var target = parseFloat(el.dataset.target || '0');
    var dec = parseInt(el.dataset.decimals || '0', 10);
    var pre = el.dataset.prefix || '';
    var suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = pre + target.toFixed(dec) + suf; return; }
    var dur = 1600, t0 = performance.now();
    function tick(t) {
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (target * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-target]');
  if (hasIO) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(animCount);
  }

  /* ---- in-page anchor scrolling (offset for fixed nav) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var y = t.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---- hero mouse-responsive depth + parallax ---- */
  if (fine && !reduce) {
    var stage = document.querySelector('.hero-stage');
    if (stage) {
      var layers = stage.querySelectorAll('[data-depth]');
      var srect = null, sx = 0, sy = 0, sTick = false;
      stage.addEventListener('mouseenter', function () { srect = stage.getBoundingClientRect(); });
      stage.addEventListener('mousemove', function (e) {
        if (!srect) srect = stage.getBoundingClientRect();
        sx = e.clientX; sy = e.clientY;
        if (sTick) return; sTick = true;
        requestAnimationFrame(function () {
          var cx = (sx - srect.left) / srect.width - 0.5;
          var cy = (sy - srect.top) / srect.height - 0.5;
          layers.forEach(function (l) {
            var d = parseFloat(l.dataset.depth) * 100;
            l.style.transform = 'translate3d(' + (-cx * d) + 'px,' + (-cy * d) + 'px,0)';
          });
          stage.style.transform = 'rotateY(' + (cx * 6) + 'deg) rotateX(' + (-cy * 6) + 'deg)';
          sTick = false;
        });
      });
      stage.addEventListener('mouseleave', function () {
        layers.forEach(function (l) { l.style.transform = ''; });
        stage.style.transform = ''; srect = null;
      });
    }
  }

  /* ---- card 3D tilt ---- */
  if (fine && !reduce) {
    document.querySelectorAll('.tilt, .tilt-soft').forEach(function (el) {
      var max = el.classList.contains('tilt-soft') ? 4 : 8;
      var r = null, mx = 0, my = 0, tick = false;
      el.addEventListener('mouseenter', function () { r = el.getBoundingClientRect(); });
      el.addEventListener('mousemove', function (e) {
        if (!r) r = el.getBoundingClientRect();
        mx = e.clientX; my = e.clientY;
        if (tick) return; tick = true;
        requestAnimationFrame(function () {
          var cx = (mx - r.left) / r.width - 0.5;
          var cy = (my - r.top) / r.height - 0.5;
          el.style.transform = 'perspective(900px) rotateY(' + (cx * max) + 'deg) rotateX(' + (-cy * max) + 'deg) translateY(-4px)';
          tick = false;
        });
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; r = null; });
    });
  }

  /* ---- magnetic buttons ---- */
  if (fine && !reduce) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      var r = null, mx = 0, my = 0, tick = false;
      el.addEventListener('mouseenter', function () { r = el.getBoundingClientRect(); });
      el.addEventListener('mousemove', function (e) {
        if (!r) r = el.getBoundingClientRect();
        mx = e.clientX; my = e.clientY;
        if (tick) return; tick = true;
        requestAnimationFrame(function () {
          var x = mx - r.left - r.width / 2;
          var y = my - r.top - r.height / 2;
          el.style.transform = 'translate(' + (x * 0.22) + 'px,' + (y * 0.3) + 'px)';
          tick = false;
        });
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; r = null; });
    });
  }

  /* ---- dynamic cursor ---- */
  if (fine && !reduce) {
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      document.body.classList.add('cursor-on');
      var rx = 0, ry = 0, dx = 0, dy = 0;
      window.addEventListener('mousemove', function (e) {
        dx = e.clientX; dy = e.clientY;
        dot.style.opacity = 1; ring.style.opacity = 1;
        dot.style.left = dx + 'px'; dot.style.top = dy + 'px';
      });
      (function ringRaf() {
        rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(ringRaf);
      })();
      document.querySelectorAll('a,button,.tilt,.tilt-soft,.pb-tile,.contact-item').forEach(function (el) {
        el.addEventListener('mouseenter', function () { ring.classList.add('hover'); });
        el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); });
      });
    }
  }

  /* ---- testimonial carousel ---- */
  var track = document.querySelector('.tcarousel-track');
  if (track) {
    var step = function () {
      var card = track.querySelector('.tcard');
      return card ? card.offsetWidth + 20 : 440;
    };
    var next = document.querySelector('.tnext');
    var prev = document.querySelector('.tprev');
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', String(open));
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
    });
  });

  /* ---- forms (front-end only; wire to a backend / form service) ---- */
  var bookForm = document.getElementById('bookForm');
  if (bookForm) {
    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!bookForm.checkValidity()) { bookForm.reportValidity(); return; }
      var ok = document.getElementById('formSuccess');
      if (ok) { ok.classList.add('show'); ok.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }
      bookForm.reset();
    });
  }
  var newsForm = document.getElementById('newsForm');
  if (newsForm) {
    newsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!newsForm.checkValidity()) { newsForm.reportValidity(); return; }
      var ok = document.getElementById('newsOk');
      if (ok) ok.classList.add('show');
      newsForm.reset();
    });
  }
})();
