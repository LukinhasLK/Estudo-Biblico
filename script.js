'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ── Scroll progress bar ─────────────────────────────── */
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  gsap.set(progressBar, { scaleX: 0 });
  gsap.to(progressBar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.3 },
  });
}

/* ── Header ─────────────────────────────────────────── */
const header = document.querySelector('.site-header');
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* ── Mobile menu ─────────────────────────────────────── */
const menuBtn  = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

menuBtn?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
navLinks.forEach(link => link.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  menuBtn?.setAttribute('aria-expanded', 'false');
}));

/* ── Active nav via ScrollTrigger ────────────────────── */
const sections = document.querySelectorAll('section[id], footer[id]');
const navItems  = document.querySelectorAll('.nav-links a');

function setActiveNav(id) {
  navItems.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
}

sections.forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 52%',
    end: 'bottom 52%',
    onEnter:     () => setActiveNav(section.id),
    onEnterBack: () => setActiveNav(section.id),
  });
});

/* ── Email form ──────────────────────────────────────── */
const form    = document.querySelector('.signup');
const formMsg = document.querySelector('.form-message');
form?.addEventListener('submit', e => {
  e.preventDefault();
  if (formMsg) {
    formMsg.textContent = 'Pronto! Vamos enviar a próxima trilha para você.';
    setTimeout(() => { formMsg.textContent = ''; }, 5000);
  }
  form.reset();
});

/* ── Motion ──────────────────────────────────────────── */
const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!motionOK) {
  /* Fallback: make everything visible immediately */
  document.querySelectorAll(
    '.section-copy,.intro-grid article,.path-grid article,' +
    '.figures-grid article,.instruments-grid article,.join-steps article,' +
    '.stats article,.method-list article,.meeting-image,.meeting-card,' +
    '.bible-3d-copy,.bible-stage,.footer-brand,.contact-list,.signup,.verse-band'
  ).forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
} else {

  /* ── HERO ────────────────────────────────────────────── */
  gsap.set([
    '.hero-eyebrow', '.hero h1', '.hero-sub',
    '.hero-actions .primary-button', '.hero-actions .secondary-button',
    '.hero-strip span',
  ], { opacity: 0, y: 28 });

  gsap.timeline({ delay: 0.1 })
    .to('.hero-eyebrow',                    { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' })
    .to('.hero h1',                         { opacity: 1, y: 0, duration: 0.85, ease: 'power4.out' }, '-=0.35')
    .to('.hero-sub',                        { opacity: 1, y: 0, duration: 0.7,  ease: 'power3.out' }, '-=0.5')
    .to('.hero-actions .primary-button',    { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.4')
    .to('.hero-actions .secondary-button',  { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.42')
    .to('.hero-strip span',                 { opacity: 1, y: 0, duration: 0.5,  stagger: 0.07, ease: 'power3.out' }, '-=0.4');

  /* ── PARALLAX — meeting image ────────────────────────── */
  gsap.to('.meeting-image img', {
    yPercent: -16,
    ease: 'none',
    scrollTrigger: {
      trigger: '.meeting-band',
      start: 'top bottom',
      end:   'bottom top',
      scrub: 1.4,
    },
  });

  /* ── BATCH REVEAL helper ──────────────────────────────── */
  function batchReveal(selector, fromExtra = {}) {
    gsap.set(selector, { opacity: 0, y: 40, ...fromExtra });
    ScrollTrigger.batch(selector, {
      onEnter: batch => gsap.to(batch, {
        opacity: 1, y: 0, x: 0, duration: 0.85, stagger: 0.11,
        ease: 'power3.out', clearProps: 'opacity,y,x,transform',
      }),
      start: 'top 88%',
      once:  true,
    });
  }

  batchReveal('.section-copy');
  batchReveal('.intro-grid article');
  batchReveal('.path-grid article');
  batchReveal('.instruments-grid article');
  batchReveal('.join-steps article');
  batchReveal('.stats article');
  batchReveal('.method-list article');
  batchReveal('.meeting-image, .meeting-card');
  batchReveal('.footer-brand, .contact-list, .signup');

  /* Big number pop for intro cards */
  gsap.set('.intro-grid span', { opacity: 0, scale: 0.35, y: 8 });
  ScrollTrigger.batch('.intro-grid span', {
    onEnter: batch => gsap.to(batch, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.75, stagger: 0.15, ease: 'back.out(1.8)',
      clearProps: 'opacity,scale,y,transform',
    }),
    start: 'top 88%',
    once: true,
  });

  /* ── STATS COUNTER ───────────────────────────────────── */
  document.querySelectorAll('.stats strong[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(obj, {
        val: target,
        duration: 1.9,
        ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(obj.val); },
      }),
    });
  });

  /* ── VERSE BAND word-by-word reveal ──────────────────── */
  const verseEl = document.querySelector('.verse-band blockquote');
  if (verseEl) {
    const words = verseEl.textContent.trim().split(/\s+/);
    verseEl.innerHTML = words.map(w =>
      `<span class="gsap-word-wrap"><span class="gsap-word">${w}</span></span>`
    ).join(' ');
    const spans = verseEl.querySelectorAll('.gsap-word');

    gsap.set(spans, { yPercent: 110, opacity: 0 });
    gsap.set('.verse-ref', { opacity: 0, y: 14 });

    ScrollTrigger.create({
      trigger: '.verse-band',
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to('.verse-ref', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        gsap.to(spans, {
          yPercent: 0, opacity: 1,
          duration: 0.7, stagger: 0.04, ease: 'power3.out', delay: 0.2,
          clearProps: 'yPercent,opacity,transform',
        });
      },
    });
  }

  /* ── 3D TILT — trilha cards ──────────────────────────── */
  document.querySelectorAll('.path-grid article').forEach(card => {
    card.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top)  / r.height;
      card.style.setProperty('--tilt-x', `${((0.5 - y) * 10).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${((x - 0.5) * 12).toFixed(2)}deg`);
      card.style.setProperty('--shine-x', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--shine-y', `${(y * 100).toFixed(1)}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--shine-x', '50%');
      card.style.setProperty('--shine-y', '0%');
    });
  });

  /* ── INSTRUMENT ICON elastic hover ───────────────────── */
  document.querySelectorAll('.instrument-card').forEach(card => {
    const icon = card.querySelector('.instrument-icon');
    card.addEventListener('mouseenter', () =>
      gsap.to(icon, { scale: 1.14, duration: 0.32, ease: 'power2.out' })
    );
    card.addEventListener('mouseleave', () =>
      gsap.to(icon, { scale: 1, duration: 0.55, ease: 'elastic.out(1, 0.5)' })
    );
  });

  /* ── HORIZONTAL SCROLL — generic init ───────────────── */
  function initHScroll(containerEl, panelSelector) {
    if (!containerEl) return;
    const track  = containerEl.querySelector('.ps-track');
    const panels = gsap.utils.toArray(panelSelector, containerEl);
    if (!track || !panels.length) return;

    const count = panels.length;
    track.style.width = `${count * 100}vw`;
    const dist = () => (count - 1) * window.innerWidth;

    /* Images stay visible — only text starts hidden */
    panels.forEach(panel => {
      gsap.set([
        panel.querySelector('.ps-index'), panel.querySelector('.ps-line'),
        panel.querySelector('.ps-date'),  panel.querySelector('.ps-name'),
        panel.querySelector('.ps-tag'),   panel.querySelector('.ps-desc'),
        panel.querySelector('.ps-verse'),
      ], { opacity: 0, y: 18 });
    });

    /* Reveal text — fast stagger */
    function revealPanel(panel) {
      if (!panel || panel._revealed) return;
      panel._revealed = true;
      const els = [
        panel.querySelector('.ps-index'), panel.querySelector('.ps-line'),
        panel.querySelector('.ps-date'),  panel.querySelector('.ps-name'),
        panel.querySelector('.ps-tag'),   panel.querySelector('.ps-desc'),
        panel.querySelector('.ps-verse'),
      ].filter(Boolean);
      gsap.to(els, {
        opacity: 1, y: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: 'power3.out',
        clearProps: 'opacity,y,transform',
      });
    }

    /* Reveal first panel as section enters view (well before pin) */
    ScrollTrigger.create({
      trigger: containerEl,
      start: 'top 85%',
      once: true,
      onEnter: () => revealPanel(panels[0]),
    });

    /* Main horizontal scroll */
    gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: containerEl,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 1 / (count - 1),
          duration: { min: 0.25, max: 0.5 },
          ease: 'power2.inOut',
        },
        start: 'top top',
        end: () => `+=${dist()}`,
        invalidateOnRefresh: true,
        onSnapComplete(self) {
          const idx = Math.round(self.progress * (count - 1));
          revealPanel(panels[idx]);
        },
      },
    });
  }

  /* Profetas scroll */
  initHScroll(document.querySelector('#profetas'), '.panel-slide');

  /* Usados por Deus scroll */
  initHScroll(document.querySelector('#personagens'), '.ud-slide');

  /* Recalculate all positions after both pins are registered */
  requestAnimationFrame(() => ScrollTrigger.refresh());

}