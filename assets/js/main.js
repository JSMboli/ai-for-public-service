(() => {
  'use strict';

  const config = window.SITE_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  document.documentElement.classList.add('js');

  // ---------- Config-driven content ----------
  $$('[data-config-text]').forEach((el) => {
    const value = config[el.dataset.configText];
    if (value) el.textContent = value;
  });

  $$('[data-config-href]').forEach((el) => {
    const key = el.dataset.configHref;
    const value = config[key];
    if (!value) return;
    el.href = key === 'email' ? `mailto:${value}` : value;
  });

  const directEmail = $('#direct-email');
  if (directEmail && config.email) {
    const isPlaceholder = /example\.com/i.test(config.email) || /YOUR_/i.test(config.email);
    directEmail.textContent = isPlaceholder ? 'Add your email in assets/js/config.js' : config.email;
    directEmail.href = isPlaceholder ? '#contact' : `mailto:${config.email}`;
    directEmail.dataset.placeholder = String(isPlaceholder);
  }

  const profile = $('#profile-image');
  const profileFallback = $('#profile-fallback');
  if (profile && profileFallback && config.profileImage) {
    profile.src = config.profileImage;
    profile.hidden = false;
    profileFallback.hidden = true;
    profile.addEventListener('error', () => {
      profile.hidden = true;
      profileFallback.hidden = false;
    });
  }

  // ---------- Mobile navigation ----------
  const navToggle = $('.nav-toggle');
  const nav = $('#site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });
    $$('#site-nav a').forEach((a) => a.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    }));
  }

  // ---------- Header state ----------
  const header = $('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // ---------- Scroll reveal ----------
  const revealItems = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach((el) => revealObserver.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- Animated counters ----------
  const counters = $$('[data-count]');
  const animateCounter = (el) => {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => counterObserver.observe(el));
  }

  // ---------- Course tabs ----------
  const tabButtons = $$('.course-tab');
  const tabPanels = $$('.course-panel');
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const day = button.dataset.day;
      tabButtons.forEach((b) => {
        const selected = b === button;
        b.classList.toggle('is-active', selected);
        b.setAttribute('aria-selected', String(selected));
      });
      tabPanels.forEach((panel) => {
        const selected = panel.dataset.panel === day;
        panel.hidden = !selected;
        panel.classList.toggle('is-active', selected);
      });
    });
  });

  // ---------- Gallery lightbox ----------
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightbox-image');
  const lightboxTitle = $('#lightbox-title');
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.close?.();
    lightbox.removeAttribute('open');
    document.body.classList.remove('modal-open');
  };
  $$('.gallery-card').forEach((card) => {
    card.addEventListener('click', () => {
      if (!lightbox || !lightboxImage) return;
      const img = $('img', card);
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      if (lightboxTitle) lightboxTitle.textContent = card.dataset.title || img.alt;
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
      else lightbox.setAttribute('open', '');
      document.body.classList.add('modal-open');
    });
  });
  $('#lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });

  // ---------- Card tilt (pointer devices only) ----------
  if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--rx', `${-y * 5}deg`);
        card.style.setProperty('--ry', `${x * 7}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  // ---------- Hero constellation ----------
  const canvas = $('#constellation');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canvas && !reducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let raf;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(18, Math.min(42, Math.floor(rect.width / 30)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1 + Math.random() * 1.6
      }));
    };
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > rect.width) p.vx *= -1;
        if (p.y < 0 || p.y > rect.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(135, 190, 255, .62)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 118) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(80, 152, 255, ${0.12 * (1 - dist / 118)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else draw();
    });
  }

  // ---------- Contact form: GitHub-Pages friendly mailto composer ----------
  const form = $('#contact-form');
  const formStatus = $('#form-status');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = config.email || '';
      const isPlaceholder = !email || /example\.com/i.test(email) || /YOUR_/i.test(email);
      if (isPlaceholder) {
        if (formStatus) {
          formStatus.textContent = 'Before publishing, add your real email address in assets/js/config.js. The form will then open a pre-filled email enquiry.';
          formStatus.className = 'form-status is-warning';
        }
        return;
      }
      const data = new FormData(form);
      const subject = `Public Sector AI enquiry — ${data.get('interest') || 'Training / consultancy'}`;
      const body = [
        `Name: ${data.get('name') || ''}`,
        `Organisation: ${data.get('organisation') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `Interest: ${data.get('interest') || ''}`,
        '',
        `${data.get('message') || ''}`
      ].join('\n');
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (formStatus) {
        formStatus.textContent = 'Your email application should open with the enquiry pre-filled.';
        formStatus.className = 'form-status is-success';
      }
    });
  }

  // ---------- Footer year ----------
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
