/* Josephine portfolio · premium interactions
   Built on GSAP + ScrollTrigger + Lenis (loaded via CDN).
   Degrades gracefully: if a library or motion is unavailable,
   all content stays fully visible and usable. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer:fine)').matches;

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

  /* ---- animated counters (independent of GSAP) ---- */
  function animCount(el) {
    var target = parseFloat(el.dataset.target || '0');
    var dec = parseInt(el.dataset.decimals || '0', 10);
    var pre = el.dataset.prefix || '';
    var suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = pre + target.toFixed(dec) + suf; return; }
    var dur = 1500, t0 = performance.now();
    function tick(t) {
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (target * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-target]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animCount(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(animCount);
  }

  function init() {
    var G = window.gsap;
    var ST = window.ScrollTrigger;

    /* ---- Lenis smooth scrolling ---- */
    var lenis = null;
    if (window.Lenis && !reduce) {
      lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }

    /* ---- in-page anchor scrolling ---- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id.length < 2) return;
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(t, { offset: -70 });
        else t.scrollIntoView({ behavior: 'smooth' });
      });
    });

    /* ---- scroll reveals + bar charts ---- */
    if (G && ST && !reduce) {
      G.registerPlugin(ST);
      if (lenis) lenis.on('scroll', ST.update);

      G.set('.reveal', { opacity: 0, y: 34 });
      ST.batch('.reveal', {
        start: 'top 88%',
        onEnter: function (els) {
          G.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true });
        }
      });

      document.querySelectorAll('.bars').forEach(function (group) {
        ST.create({
          trigger: group, start: 'top 90%', once: true,
          onEnter: function () {
            G.to(group.querySelectorAll('.bar'), { scaleY: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 });
          }
        });
      });

      window.addEventListener('load', function () { ST.refresh(); });
    } else {
      document.querySelectorAll('.reveal').forEach(function (e) { e.style.opacity = 1; });
      document.querySelectorAll('.bars .bar').forEach(function (b) { b.style.transform = 'scaleY(1)'; });
    }

    /* ---- hero mouse-responsive depth + parallax ---- */
    if (fine && !reduce) {
      var stage = document.querySelector('.hero-stage');
      if (stage) {
        var layers = stage.querySelectorAll('[data-depth]');
        stage.addEventListener('mousemove', function (e) {
          var r = stage.getBoundingClientRect();
          var cx = (e.clientX - r.left) / r.width - 0.5;
          var cy = (e.clientY - r.top) / r.height - 0.5;
          layers.forEach(function (l) {
            var d = parseFloat(l.dataset.depth) * 100;
            l.style.transform = 'translate3d(' + (-cx * d) + 'px,' + (-cy * d) + 'px,0)';
          });
          stage.style.transform = 'rotateY(' + (cx * 6) + 'deg) rotateX(' + (-cy * 6) + 'deg)';
        });
        stage.addEventListener('mouseleave', function () {
          layers.forEach(function (l) { l.style.transform = ''; });
          stage.style.transform = '';
        });
      }
    }

    /* ---- card 3D tilt ---- */
    if (fine && !reduce) {
      document.querySelectorAll('.tilt, .tilt-soft').forEach(function (el) {
        var max = el.classList.contains('tilt-soft') ? 4 : 8;
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          var cx = (e.clientX - r.left) / r.width - 0.5;
          var cy = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = 'perspective(900px) rotateY(' + (cx * max) + 'deg) rotateX(' + (-cy * max) + 'deg) translateY(-4px)';
        });
        el.addEventListener('mouseleave', function () { el.style.transform = ''; });
      });
    }

    /* ---- magnetic buttons ---- */
    if (fine && !reduce) {
      document.querySelectorAll('.magnetic').forEach(function (el) {
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          var x = e.clientX - r.left - r.width / 2;
          var y = e.clientY - r.top - r.height / 2;
          el.style.transform = 'translate(' + (x * 0.25) + 'px,' + (y * 0.35) + 'px)';
        });
        el.addEventListener('mouseleave', function () { el.style.transform = ''; });
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
        document.querySelectorAll('a,button,.tilt,.industry-card,.case').forEach(function (el) {
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
        return card ? card.offsetWidth + 18 : 400;
      };
      var next = document.querySelector('.tnext');
      var prev = document.querySelector('.tprev');
      if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
      if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
