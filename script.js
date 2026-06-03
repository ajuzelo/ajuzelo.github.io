'use strict';

/* ============================================================
   LEAIS CENTRO TÉCNICO AUTOMOTIVO — SCRIPT v2
   ============================================================ */

/* ===== SCROLL PROGRESS BAR ===== */
(function () {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }, { passive: true });
})();

/* ===== NAVBAR: scroll state + active link ===== */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const allLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightActive();
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  function highlightActive() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 110) current = s.id;
    });
    allLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  highlightActive();
})();

/* ===== HERO SLIDESHOW ===== */
(function initSlideshow() {
  const slides   = document.querySelectorAll('.slide');
  const dots     = document.querySelectorAll('.dot');
  if (!slides.length) return;

  let current  = 0;
  let timer    = null;
  const DELAY  = 5000;

  function goTo(index) {
    slides[current].classList.remove('slide--active');
    dots[current].classList.remove('dot--active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('slide--active');
    dots[current].classList.add('dot--active');
  }

  function next() { goTo(current + 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, DELAY);
  }

  // Dot click navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // Swipe / drag support for mobile
  let touchStartX = 0;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    }, { passive: true });
  }

  startAuto();
})();

/* ===== SCROLL REVEAL ===== */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseFloat(entry.target.style.animationDelay || '0') * 1000;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ===== ANIMATED COUNTERS ===== */
(function initCounters() {
  const section = document.querySelector('.stats-bar');
  if (!section) return;

  let done = false;
  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || done) return;
    done = true;

    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1800;
      const step   = 16;
      const inc    = target / (dur / step);
      let val      = 0;

      const t = setInterval(() => {
        val += inc;
        if (val >= target) { el.textContent = target.toLocaleString('pt-BR'); clearInterval(t); }
        else               { el.textContent = Math.floor(val).toLocaleString('pt-BR'); }
      }, step);
    });
  }, { threshold: 0.4 });

  io.observe(section);
})();

/* ===== SMOOTH SCROLL for anchor links ===== */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    });
  });
})();

/* ===== SERVICE CARDS: dim siblings on hover ===== */
(function () {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(c => {
    c.addEventListener('mouseenter', () => cards.forEach(x => { if (x !== c) x.style.opacity = '0.55'; }));
    c.addEventListener('mouseleave', () => cards.forEach(x => { x.style.opacity = '1'; }));
  });
})();

/* ===== WHATSAPP FLOAT MENU toggle ===== */
(function initWaMenu() {
  const btn  = document.getElementById('waFloatBtn');
  const menu = document.getElementById('waMenu');
  const wrap = document.getElementById('waFloatWrap');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) menu.classList.remove('open');
  });

  // Hide float when footer visible
  const footer = document.querySelector('.footer');
  if (footer) {
    window.addEventListener('scroll', () => {
      const footerTop = footer.getBoundingClientRect().top;
      const hide = footerTop < window.innerHeight - 40;
      wrap.style.opacity        = hide ? '0' : '1';
      wrap.style.pointerEvents  = hide ? 'none' : 'auto';
    }, { passive: true });
  }
})();

/* ===== HERO PARALLAX (subtle) ===== */
(function () {
  const slideshow = document.querySelector('.hero-slideshow');
  if (!slideshow) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY <= window.innerHeight) {
      slideshow.style.transform = `translateY(${window.scrollY * 0.22}px)`;
    }
  }, { passive: true });
})();

console.log('%c🔧 Leais Centro Técnico Automotivo', 'color:#F5C800;font-size:1.1rem;font-weight:900;');
console.log('%cDuas unidades em Ribeirão Preto. Mecânica Premium.', 'color:#9A9A9A;font-size:0.85rem;');
