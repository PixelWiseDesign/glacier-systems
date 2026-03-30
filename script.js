/* ══════════════════════════════════════════════════════════
   GLACIER SYSTEMS — Interactive JavaScript
   ══════════════════════════════════════════════════════════ */

'use strict';

/* ── DOM Ready ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initParticles();
  initScrollAnimations();
  initCounters();
  initTestimonials();
  initContactForm();
  initActiveNavLinks();
  initHeroCounters();
});

/* ══════════════════════════════════════════════════════════
   NAVBAR — scroll effect
   ══════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  const onScroll = () => {
    const current = window.scrollY;
    if (current > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = current;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   HAMBURGER MENU
   ══════════════════════════════════════════════════════════ */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.classList.remove('open');
    }
  });
}

/* ══════════════════════════════════════════════════════════
   PARTICLE CANVAS
   ══════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;
  let W, H;

  const COLORS = ['rgba(90,200,245,', 'rgba(26,159,212,', 'rgba(13,122,176,'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.r  = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      const progress = this.life / this.maxLife;
      this.currentAlpha = this.alpha * Math.sin(progress * Math.PI);
      if (this.life >= this.maxLife || this.y < -10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.currentAlpha})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(26,159,212,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animId = requestAnimationFrame(loop);
  }

  function init() {
    resize();
    const count = Math.min(80, Math.floor((W * H) / 14000));
    particles = Array.from({ length: count }, () => new Particle());
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  const ro = new ResizeObserver(init);
  ro.observe(canvas.parentElement);
  init();
}

/* ══════════════════════════════════════════════════════════
   SCROLL ANIMATIONS (AOS-style)
   ══════════════════════════════════════════════════════════ */
function initScrollAnimations() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;

  // Stagger cards in grids
  document.querySelectorAll('.services-grid, .industries-grid, .metrics-grid').forEach(grid => {
    grid.querySelectorAll('[data-aos]').forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   COUNTER ANIMATION
   ══════════════════════════════════════════════════════════ */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('.metric-value.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function initHeroCounters() {
  const nums = document.querySelectorAll('.hero-stat .stat-num[data-target]');
  if (!nums.length) return;

  const hero = document.querySelector('.hero');
  let triggered = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true;
      nums.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, target, 2000);
      });
    }
  }, { threshold: 0.3 });

  if (hero) observer.observe(hero);
}

/* ══════════════════════════════════════════════════════════
   TESTIMONIAL ROTATOR
   ══════════════════════════════════════════════════════════ */
function initTestimonials() {
  const btns = document.querySelectorAll('.t-btn');
  if (!btns.length) return;

  let autoTimer;

  function showTestimonial(targetId) {
    // Hide all
    document.querySelectorAll('.testimonial').forEach(t => t.classList.remove('active'));
    btns.forEach(b => b.classList.remove('active'));

    // Show target
    const el = document.getElementById(targetId);
    if (el) el.classList.add('active');

    const btn = document.querySelector(`.t-btn[data-target="${targetId}"]`);
    if (btn) btn.classList.add('active');
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(autoTimer);
      showTestimonial(btn.getAttribute('data-target'));
      startAuto();
    });
  });

  function startAuto() {
    const ids = ['t1', 't2', 't3'];
    let idx = 0;
    autoTimer = setInterval(() => {
      idx = (idx + 1) % ids.length;
      showTestimonial(ids[idx]);
    }, 5000);
  }

  startAuto();
}

/* ══════════════════════════════════════════════════════════
   ACTIVE NAV LINKS (intersection-based)
   ══════════════════════════════════════════════════════════ */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ══════════════════════════════════════════════════════════
   CONTACT FORM
   ══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    // Basic validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#e05252';
        field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
      }
    });

    const emailField = form.querySelector('#email');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
      valid = false;
      emailField.style.borderColor = '#e05252';
    }

    if (!valid) return;

    // Loading state
    btn.disabled = true;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="animation:spin 1s linear infinite">
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-dasharray="20" stroke-dashoffset="10"/>
      </svg>
      Sending...
    `;

    // Simulate submission
    setTimeout(() => {
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Message Sent!
      `;
      btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1500);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ══════════════════════════════════════════════════════════
   SPINNER KEYFRAME (injected once)
   ══════════════════════════════════════════════════════════ */
(function injectSpinKeyframe() {
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
})();
