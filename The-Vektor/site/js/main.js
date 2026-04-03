/* ===================================================
   THE VEKTOR — main.js
   Interactions, scroll reveal, nav behavior
   GPMD Standard | 4PE-compliant
   =================================================== */

(function () {
  'use strict';

  /* ── SCROLL REVEAL ── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el, i) => {
      el.style.transitionDelay = `${i * 60}ms`;
      io.observe(el);
    });
  }

  /* ── STICKY NAV SHADOW ── */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 10
        ? '0 2px 24px rgba(0,0,0,0.4)'
        : 'none';
    }, { passive: true });
  }

  /* ── MOBILE NAV ── */
  function initMobileNav() {
    const btn    = document.querySelector('.nav__hamburger');
    const mobile = document.querySelector('.nav__mobile');
    const close  = document.querySelector('.nav__mobile-close');
    if (!btn || !mobile) return;

    function open()  { mobile.classList.add('open');    document.body.style.overflow = 'hidden'; }
    function shut()  { mobile.classList.remove('open'); document.body.style.overflow = ''; }

    btn.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', shut));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') shut();
    });
  }

  /* ── ACTIVE NAV LINK ── */
  function initActiveLink() {
    const links = document.querySelectorAll('.nav__links a');
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    links.forEach((a) => {
      const href = a.getAttribute('href').replace(/\/$/, '') || '/';
      if (path === href || (href !== '/' && path.startsWith(href))) {
        a.classList.add('active');
      }
    });
  }

  /* ── SMOOTH ANCHOR SCROLL ── */
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── CONTACT FORM (placeholder submit) ── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';
      setTimeout(() => {
        btn.textContent = '✓ Sent — We'll be in touch';
        btn.style.background = '#10b981';
      }, 1400);
    });
  }

  /* ── STAGGER ANIMATION FOR CARDS ── */
  function initCardStagger() {
    const groups = document.querySelectorAll('.method-grid, .kkr-grid');
    groups.forEach((group) => {
      const cards = group.querySelectorAll('.method-card, .kkr-slot');
      cards.forEach((card, i) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${i * 80}ms`;
      });
    });
  }

  /* ── COUNTER ANIMATION ── */
  function animateCounter(el, target, suffix) {
    let current = 0;
    const step  = target / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current) + (suffix || '');
    }, 30);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el     = e.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  }

  /* ── CURRENT YEAR ── */
  function setYear() {
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initNav();
    initMobileNav();
    initActiveLink();
    initAnchorScroll();
    initContactForm();
    initCardStagger();
    initCounters();
    setYear();
  });
})();
