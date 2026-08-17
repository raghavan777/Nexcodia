'use strict';
/* ================================================================
   FORCE SCROLL TO TOP / HOME PAGE ON REFRESH
   ================================================================ */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname + window.location.search);
  }
});

/* ================================================================
   NEXCODIA '26 — script.js
   Marvel Avengers Doomsday Theme
   ================================================================ */

// EDITABLE: Event target date
const EVENT_DATE = new Date('2026-09-19T09:00:00+05:30');

// EDITABLE: Rotating typed text strings in hero
const TYPED_STRINGS = [
  'AVENGERS: DOOMSDAY',
  'VELAMMAL INSTITUTE OF TECHNOLOGY CSE SYMPOSIUM',
  'NATIONAL LEVEL EVENT',
  'DOOM HAS ARRIVED',
];

/* ================================================================
   CINEMATIC PRELOADER ANIMATION
   ================================================================ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const fill      = document.getElementById('plFill');
  const count     = document.getElementById('plCount');
  if (!preloader || !fill || !count) return;

  let progress = 0;
  const startTime = performance.now();
  const duration = 2200; // 2.2s loader duration

  function step(now) {
    const elapsed = now - startTime;
    progress = Math.min((elapsed / duration) * 100, 100);

    fill.style.width = progress + '%';
    count.textContent = Math.floor(progress);

    if (progress < 100) {
      requestAnimationFrame(step);
    } else {
      setTimeout(() => {
        preloader.classList.add('done');
        setTimeout(() => { preloader.remove(); }, 850);
      }, 200);
    }
  }

  requestAnimationFrame(step);
})();

/* ================================================================
   BG CANVAS — Green Cosmic Smoke Fog + Rising Energy Embers
   ================================================================ */
(function initBgCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const NEON   = 'rgba(0,255,136,';
  const EM     = 'rgba(0,194,110,';
  const SILVER = 'rgba(183,190,199,';

  let W, H, particles = [], embers = [], smokeClouds = [], mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // 1. Cosmic Smoke Cloud (Volumetric Glowing Fog Aura)
  class SmokeCloud {
    constructor() {
      const isMobile = (window.innerWidth || W || 1000) < 900;
      this.x = Math.random() * (W || 1000);
      this.y = Math.random() * (H || 1000);
      this.r = isMobile ? (150 + Math.random() * 180) : (220 + Math.random() * 280);
      this.vx = (Math.random() - 0.5) * (isMobile ? 0.12 : 0.15);
      this.vy = (Math.random() - 0.5) * (isMobile ? 0.12 : 0.15);
      this.baseAlpha = isMobile ? (0.024 + Math.random() * 0.022) : (0.030 + Math.random() * 0.030);
      this.alpha = this.baseAlpha;
      this.angle = Math.random() * Math.PI * 2;
      this.color = Math.random() > 0.4 ? 'rgba(0,255,136,' : 'rgba(0,194,110,';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += 0.006;
      this.alpha = this.baseAlpha + Math.sin(this.angle) * 0.015;

      if (this.x < -this.r) this.x = W + this.r;
      if (this.x > W + this.r) this.x = -this.r;
      if (this.y < -this.r) this.y = H + this.r;
      if (this.y > H + this.r) this.y = -this.r;
    }
    draw() {
      ctx.save();
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      grad.addColorStop(0, this.color + this.alpha + ')');
      grad.addColorStop(0.5, this.color + (this.alpha * 0.45) + ')');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // 2. Floating Rising Energy Ember / Glowing Orb (Image 2 style)
  class Ember {
    constructor() {
      this.reset(true);
    }
    reset(random) {
      this.x = Math.random() * (W || 1000);
      this.y = random ? Math.random() * (H || 1000) : (H + 10 + Math.random() * 20);
      this.vy = -(0.3 + Math.random() * 0.7);
      this.vx = (Math.random() - 0.5) * 0.3;
      this.r = 1.5 + Math.random() * 2.5;
      this.glowRadius = this.r * (3 + Math.random() * 4);
      this.alpha = 0.35 + Math.random() * 0.55;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.02 + Math.random() * 0.03;
      this.color = Math.random() > 0.3 ? NEON : EM;
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.vx + Math.sin(this.wobble) * 0.4;
      this.y += this.vy;

      // Mouse interaction
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 10000) {
        const d = Math.sqrt(d2);
        this.x += (dx / d) * 2;
        this.y += (dy / d) * 2;
      }

      if (this.y < -30 || this.x < -30 || this.x > W + 30) {
        this.reset(false);
      }
    }
    draw() {
      ctx.save();
      // Outer glow aura
      const auraGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glowRadius);
      auraGrad.addColorStop(0, this.color + (this.alpha * 0.6) + ')');
      auraGrad.addColorStop(0.4, this.color + (this.alpha * 0.2) + ')');
      auraGrad.addColorStop(1, 'rgba(0,255,136,0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner core dot
      ctx.fillStyle = 'rgba(255,255,255,' + this.alpha + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // 3. Constellation Node
  class Particle {
    constructor(i) {
      this.reset(true);
      this.id = i;
    }
    reset(random) {
      this.x  = random ? Math.random() * (W || 1) : 0;
      this.y  = random ? Math.random() * (H || 1) : 0;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.3 + 0.4;
      const c = Math.random();
      this.color = c < 0.6 ? NEON : c < 0.85 ? EM : SILVER;
      this.alpha = Math.random() * 0.45 + 0.15;
    }
    update() {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 9000) {
        const d = Math.sqrt(d2);
        this.x += (dx / d) * 2.5;
        this.y += (dy / d) * 2.5;
      }
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function initScene() {
    particles = [];
    embers = [];
    smokeClouds = [];

    const isMobile = (window.innerWidth || W || 1000) < 900;
    const smokeCount = isMobile ? 8 : 12;
    const emberCount = isMobile ? 30 : 45;
    const particleCount = isMobile ? 36 : 70;

    for (let i = 0; i < smokeCount; i++) smokeClouds.push(new SmokeCloud());
    for (let i = 0; i < emberCount; i++) embers.push(new Ember());
    for (let i = 0; i < particleCount; i++) particles.push(new Particle(i));
  }

  function drawConnections() {
    const len = particles.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14000) {
          const a = (1 - Math.sqrt(d2) / 118) * 0.08;
          ctx.strokeStyle = NEON + a + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function drawHexGrid() {
    const size = 50, w = size * Math.sqrt(3), h = size * 2;
    const cols = Math.ceil(W / w) + 1, rows = Math.ceil(H / h) + 1;
    ctx.strokeStyle = 'rgba(0,255,136,0.025)';
    ctx.lineWidth = 0.5;
    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const cx = col * w + (row % 2 === 0 ? 0 : w / 2);
        const cy = row * h * 0.75;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 180) * (60 * i - 30);
          const px = cx + size * Math.cos(angle);
          const py = cy + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Layer 1: Volumetric Green Cosmic Smoke Fog
    smokeClouds.forEach(s => { s.update(); s.draw(); });

    // Layer 2: Hex Tech Grid
    drawHexGrid();

    // Layer 3: Constellation Connections & Nodes
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });

    // Layer 4: Rising Glowing Cosmic Embers & Energy Orbs (Image 2 style)
    embers.forEach(e => { e.update(); e.draw(); });

    requestAnimationFrame(loop);
  }

  resize();
  initScene();
  loop();

  window.addEventListener('resize', () => { resize(); initScene(); }, { passive: true });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
})();

/* ================================================================
   REGISTER SECTION SVG GRID
   ================================================================ */
(function initRegGrid() {
  const el = document.getElementById('regGridBg');
  if (!el) return;
  el.innerHTML = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="rg" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M60 0 L0 0 0 60" fill="none" stroke="rgba(0,255,136,0.05)" stroke-width="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#rg)"/>
  </svg>`;
})();

/* ================================================================
   CUSTOM CURSOR
   ================================================================ */
(function initCursor() {
  const outer = document.getElementById('curOuter');
  const inner = document.getElementById('curInner');
  if (!outer || !inner) return;

  let mx = 0, my = 0, ox = 0, oy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function tick() {
    inner.style.left = mx + 'px';
    inner.style.top  = my + 'px';
    ox += (mx - ox) * 0.15;
    oy += (my - oy) * 0.15;
    outer.style.left = ox + 'px';
    outer.style.top  = oy + 'px';
    requestAnimationFrame(tick);
  }
  tick();

  document.addEventListener('mousedown', () => {
    inner.style.transform = 'translate(-50%,-50%) scale(2.2)';
    outer.style.transform = 'translate(-50%,-50%) scale(0.6)';
  });
  document.addEventListener('mouseup', () => {
    inner.style.transform = '';
    outer.style.transform = '';
  });
})();

/* ================================================================
   HEADER SCROLL & ACTIVE LINK TRACKING
   ================================================================ */
(function initHeader() {
  const hdr      = document.getElementById('hdr');
  const navItems = document.querySelectorAll('.hn');

  window.addEventListener('scroll', () => {
    if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 50);
    const sections = document.querySelectorAll('section[id]');
    let curr = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 110) curr = s.id; });
    navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + curr));
  }, { passive: true });
})();

/* ================================================================
   MOBILE NAVIGATION DRAWER
   ================================================================ */
(function initBurger() {
  const btn = document.getElementById('hdrBurger');
  const nav = document.getElementById('mobNav');
  if (!btn || !nav) return;

  let open = false;
  function toggle() {
    open = !open;
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    const spans = btn.querySelectorAll('span');
    if (spans.length >= 3) {
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans[0].style.transform = spans[1].style.opacity = spans[2].style.transform = '';
      }
    }
  }

  btn.addEventListener('click', toggle);
  nav.querySelectorAll('.mn-item').forEach(a => a.addEventListener('click', () => { if (open) toggle(); }));
  document.addEventListener('click', e => { if (open && !btn.contains(e.target) && !nav.contains(e.target)) toggle(); });
})();

/* ================================================================
   TYPEWRITER EFFECT IN HERO
   ================================================================ */
(function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;

  let si = 0, ci = 0, deleting = false, wait = 0;

  function frame() {
    const s = TYPED_STRINGS[si];
    if (!deleting) {
      el.textContent = s.slice(0, ++ci);
      if (ci >= s.length) { deleting = true; wait = 40; }
    } else {
      if (--wait > 0) { requestAnimationFrame(frame); return; }
      el.textContent = s.slice(0, --ci);
      if (ci <= 0) {
        deleting = false;
        si = (si + 1) % TYPED_STRINGS.length;
        wait = 12;
      }
    }
    setTimeout(() => requestAnimationFrame(frame), deleting ? 40 : 80);
  }

  setTimeout(frame, 600);
})();

/* ================================================================
   FLIP COUNTDOWN TIMER + PERSISTENT BACKGROUND TICK AUDIO
   Audio plays continuously without turning off when scrolling down.
   ================================================================ */
(function initCountdownAndTick() {
  // --- DOM elements ---
  const els = {
    d: document.getElementById('cdDays'),
    h: document.getElementById('cdHours'),
    m: document.getElementById('cdMin'),
    s: document.getElementById('cdSec'),
  };

  // --- Persistent Audio Setup ---
  const tickAudio = new Audio('tick-sound.wav');
  tickAudio.preload = 'auto';
  tickAudio.loop = true; // Enables continuous seamless looping across the entire website
  let lastSecond = -1;
  let isAudioStarted = false;

  function pad(n) { return String(n).padStart(2, '0'); }

  function flip(el, val) {
    const s = pad(val);
    if (!el || el.textContent === s) return;
    const box = el.parentElement;
    if (box) {
      box.classList.add('flip');
      setTimeout(() => { box.classList.remove('flip'); el.textContent = s; }, 150);
    } else {
      el.textContent = s;
    }
  }

  /* Start and maintain continuous playback */
  function startContinuousAudio() {
    if (isAudioStarted && !tickAudio.paused) return;

    tickAudio.play().then(() => {
      isAudioStarted = true;
    }).catch(() => {
      // If browser blocks immediate autoplay, attach persistent global interaction hooks
      const unlockAndPlay = () => {
        tickAudio.play().then(() => {
          isAudioStarted = true;
        }).catch(() => {});
      };

      ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown', 'scroll', 'wheel'].forEach(evt =>
        window.addEventListener(evt, unlockAndPlay, { passive: true })
      );
    });
  }

  // Keep-alive: If mobile browser tries to pause audio when scrolling out of viewport, immediately resume
  tickAudio.addEventListener('pause', () => {
    if (!document.hidden && isAudioStarted) {
      tickAudio.play().catch(() => {});
    }
  });

  tickAudio.addEventListener('ended', () => {
    tickAudio.currentTime = 0;
    tickAudio.play().catch(() => {});
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isAudioStarted) {
      tickAudio.play().catch(() => {});
    }
  });

  // Attempt auto-start on load
  startContinuousAudio();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startContinuousAudio);
  }
  window.addEventListener('load', startContinuousAudio);

  /* Main countdown digits loop — runs every 100ms for accurate flips */
  function update() {
    const diff = EVENT_DATE - Date.now();
    if (diff <= 0) {
      Object.values(els).forEach(e => { if (e) e.textContent = '00'; });
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const s = totalSec % 60;
    const m = Math.floor(totalSec / 60) % 60;
    const h = Math.floor(totalSec / 3600) % 24;
    const d = Math.floor(totalSec / 86400);

    if (s !== lastSecond) {
      lastSecond = s;
      flip(els.d, d);
      flip(els.h, h);
      flip(els.m, m);
      flip(els.s, s);

      // Ensure audio continues playing continuously
      if (!isAudioStarted || tickAudio.paused) {
        startContinuousAudio();
      }
    }
  }

  setInterval(update, 100);
  update();
})();

/* ================================================================
   SCROLL REVEAL (INTERSECTION OBSERVER) ACROSS ALL SECTIONS
   ================================================================ */
(function initReveal() {
  const all = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .pillar, .ev-strip, .sl-entry, .sec-slash, .coord-agent, .ss-item, .reg-left, .reg-right, .qr-frame, .about-manifesto');
  if (!all.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  all.forEach(el => io.observe(el));
})();

/* ================================================================
   COUNTER ANIMATION
   ================================================================ */
(function initCounters() {
  const els = document.querySelectorAll('[data-target]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = '1';
        const target = parseInt(e.target.dataset.target, 10);
        const prefix = e.target.dataset.prefix || '';
        const t0 = performance.now();
        const dur = 1600;

        function step(now) {
          const p = Math.min((now - t0) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          e.target.textContent = prefix + Math.round(ease * target);
          if (p < 1) requestAnimationFrame(step);
          else e.target.textContent = prefix + target;
        }
        requestAnimationFrame(step);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  els.forEach(el => io.observe(el));
})();

/* ================================================================
   SMOOTH SCROLLING WITH NAVBAR OFFSET
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});

/* ================================================================
   BUTTON RIPPLE EFFECT
   ================================================================ */
(function initRipple() {
  function spawn(x, y) {
    for (let i = 0; i < 4; i++) {
      const d = document.createElement('div');
      const delay = i * 80;
      d.style.cssText = `
        position:fixed; left:${x}px; top:${y}px; width:4px; height:4px;
        border-radius:50%; border:1px solid rgba(0,255,136,${0.8 - i * 0.15});
        pointer-events:none; z-index:9990;
        transform:translate(-50%,-50%) scale(0);
        animation: rippleOut 0.6s ease-out ${delay}ms forwards;
      `;
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 700 + delay);
    }
  }

  if (!document.getElementById('_rippleKF')) {
    const s = document.createElement('style');
    s.id = '_rippleKF';
    s.textContent = `@keyframes rippleOut { to { transform:translate(-50%,-50%) scale(20); opacity:0; } }`;
    document.head.appendChild(s);
  }

  document.querySelectorAll('.btn-doom').forEach(btn => {
    btn.addEventListener('click', e => spawn(e.clientX, e.clientY));
  });
})();

/* ================================================================
   RANDOMIZE ENERGY BEAMS
   ================================================================ */
(function initBeams() {
  const beams = document.querySelectorAll('.beam');
  beams.forEach((beam, i) => {
    setInterval(() => {
      beam.style.width = (40 + Math.random() * 50) + '%';
      beam.style.top   = (10 + Math.random() * 80) + '%';
    }, 4000 + i * 1500);
  });
})();

/* ================================================================
   HERO LIGHTNING FLASH EFFECT
   ================================================================ */
(function initLightning() {
  const canvas = document.getElementById('lightningCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let active = false; // only render in hero viewport

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Check if hero is in view
  const heroSection = document.getElementById('hero');
  const io = new IntersectionObserver(entries => {
    active = entries[0].isIntersecting;
    if (!active) ctx.clearRect(0, 0, W, H);
  }, { threshold: 0.1 });
  if (heroSection) io.observe(heroSection);

  // --- Draw a jagged lightning bolt ---
  function drawBolt(x1, y1, x2, y2, roughness, depth) {
    if (depth <= 0) {
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      return;
    }
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness;
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness * 0.4;
    drawBolt(x1, y1, mx, my, roughness / 1.8, depth - 1);
    drawBolt(mx, my, x2, y2, roughness / 1.8, depth - 1);

    // Random branch
    if (depth === 3 && Math.random() > 0.55) {
      const bx = mx + (Math.random() - 0.5) * 200;
      const by = my + Math.random() * (H * 0.3);
      drawBolt(mx, my, bx, by, roughness / 2.5, depth - 2);
    }
  }

  function flashLightning() {
    if (!active) return;

    const x     = W * (0.1 + Math.random() * 0.8);
    const flashes = 2 + Math.floor(Math.random() * 2);
    let   count = 0;

    function doFlash() {
      ctx.clearRect(0, 0, W, H);

      // Screen green flash overlay
      ctx.fillStyle = 'rgba(0, 255, 136, 0.04)';
      ctx.fillRect(0, 0, W, H);

      // Main bolt glow (wide)
      ctx.save();
      ctx.shadowColor = '#00FF88';
      ctx.shadowBlur  = 60;
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.55)';
      ctx.lineWidth   = 4;
      ctx.beginPath();
      drawBolt(x, 0, x + (Math.random() - 0.5) * 180, H * 0.65, 200, 5);
      ctx.stroke();
      ctx.restore();

      // Main bolt core (thin bright)
      ctx.save();
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur  = 20;
      ctx.strokeStyle = 'rgba(200, 255, 230, 0.85)';
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      drawBolt(x, 0, x + (Math.random() - 0.5) * 80, H * 0.65, 140, 4);
      ctx.stroke();
      ctx.restore();

      count++;
      if (count < flashes) {
        setTimeout(() => {
          ctx.clearRect(0, 0, W, H);
          setTimeout(doFlash, 60 + Math.random() * 80);
        }, 40);
      } else {
        setTimeout(() => ctx.clearRect(0, 0, W, H), 120);
      }
    }

    doFlash();
  }

  // Fire lightning randomly every 4–12 seconds
  function scheduleNext() {
    const delay = 4000 + Math.random() * 8000;
    setTimeout(() => {
      flashLightning();
      scheduleNext();
    }, delay);
  }
  scheduleNext();
})();

/* ================================================================
   EXCLUSIVE EVENT RULES ACCORDIONS (AUTO-CLOSE & SMOOTH SCROLL ANCHOR)
   ================================================================ */
(function initExclusiveAccordions() {
  const accordions = document.querySelectorAll('.ev-rules-accordion');

  accordions.forEach((detail) => {
    const summary = detail.querySelector('.ev-rules-trigger') || detail.querySelector('summary');
    if (!summary) return;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpening = !detail.open;

      // Close any other open accordions
      accordions.forEach((other) => {
        if (other !== detail && other.open) {
          other.open = false;
        }
      });

      if (isOpening) {
        detail.open = true;

        // Scroll to the start of this clicked event rules after DOM layout reflow
        requestAnimationFrame(() => {
          setTimeout(() => {
            const nav = document.getElementById('hdr');
            const navHeight = nav ? nav.offsetHeight : 70;
            const parentStrip = detail.closest('.ev-strip');
            const targetEl = parentStrip || detail;
            const rect = targetEl.getBoundingClientRect();
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            const targetTop = currentScroll + rect.top - (navHeight + 15);

            window.scrollTo({
              top: Math.max(0, targetTop),
              behavior: 'smooth'
            });
          }, 40);
        });
      } else {
        detail.open = false;
      }
    });
  });
})();

console.log('%c[ NEXCODIA \'26 ]', 'color:#00FF88;font-family:monospace;font-size:16px;font-weight:bold;letter-spacing:4px;');
console.log('%cMarvel Avengers: Doomsday Theme initialized', 'color:#00C26E;font-family:monospace;font-size:11px;');

