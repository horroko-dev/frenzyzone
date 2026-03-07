/* ========== PARTICLE SYSTEM ========== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Ember {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 10;
    this.size = Math.random() * 3.5 + 0.8;
    this.speedY = -(Math.random() * 0.8 + 0.2);
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.life = 1;
    this.decay = Math.random() * 0.003 + 0.001;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    if (Math.random() > 0.5) {
      this.r = 255; this.g = Math.floor(Math.random() * 100 + 50); this.b = 0;
    } else {
      this.r = Math.floor(Math.random() * 50 + 100); this.g = Math.floor(Math.random() * 50 + 80); this.b = 255;
    }
  }
  update() {
    this.wobble += this.wobbleSpeed;
    this.x += this.speedX + Math.sin(this.wobble) * 0.3;
    this.y += this.speedY;
    this.life -= this.decay;
    if (this.life <= 0 || this.y < -10) this.reset();
  }
  draw() {
    ctx.globalAlpha = this.life * 0.75;
    ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`;
    ctx.shadowBlur = this.size * 4;
    ctx.shadowColor = `rgb(${this.r},${this.g},${this.b})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) {
  const p = new Ember();
  p.y = Math.random() * canvas.height;
  particles.push(p);
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.shadowBlur = 0;
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ========== SCROLL ANIMATIONS ========== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.synergy-card, .synergy-bottom, .build-card, .phase-header, .tip-card, .farm-card, .stat-block, .merc-card, .merc-strategy, .charm-card').forEach(el => {
  observer.observe(el);
});

/* ========== NAVIGATION ========== */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 300) {
    nav.classList.add('visible');
  } else {
    nav.classList.remove('visible');
  }

  const sections = ['synergy', 'leveling', 'gear', 'attributes', 'mercs', 'charms', 'farming', 'tips'];
  let current = '';
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section && scrollY >= section.offsetTop - 200) {
      current = id;
    }
  });
  nav.querySelectorAll('a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

/* ========== GEAR TABS ========== */
document.querySelectorAll('.gear-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.gear-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.gear-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('gear-' + tab.dataset.tab).classList.add('active');
  });
});

/* ========== MODE DATA ========== */
const MODE_DATA = JSON.parse(document.getElementById('mode-data').textContent);

function applyModeContent(mode) {
  const data = MODE_DATA[mode];
  if (!data) return;

  // Hero icons — left/right positioning
  const icons = data.heroIcons;
  document.querySelectorAll('[data-hero-icon]').forEach(el => {
    el.removeAttribute('data-hero-slot');
  });
  if (icons.left) {
    const el = document.querySelector('[data-hero-icon="' + icons.left + '"]');
    if (el) el.setAttribute('data-hero-slot', 'left');
  }
  if (icons.right) {
    const el = document.querySelector('[data-hero-icon="' + icons.right + '"]');
    if (el) el.setAttribute('data-hero-slot', 'right');
  }

  // Watermark
  const watermark = document.querySelector('[data-mode-target="watermark"]');
  if (watermark) {
    watermark.querySelector('use').setAttribute('href', '#icon-' + data.watermark);
  }

  // Hero lines — visibility and order
  const heroLines = data.heroLines;
  document.querySelectorAll('.hero-line').forEach(l => {
    l.classList.remove('divorce-hidden', 'hero-line-visible');
    l.style.order = '';
  });
  Object.entries(heroLines).forEach(([key, cfg]) => {
    const el = document.querySelector('.hero-line-' + key);
    if (!el) return;
    if (!cfg.visible) {
      el.classList.add('divorce-hidden');
    } else if (key === 'necro') {
      el.classList.add('hero-line-visible');
    }
    el.style.order = cfg.order;
  });

  // Synergy header
  const synergyHeader = document.querySelector('[data-mode-target="synergyHeader"]');
  if (synergyHeader) {
    const sh = data.synergyHeader;
    synergyHeader.querySelector('.section-label').textContent = sh.label;
    synergyHeader.querySelector('.section-title').textContent = sh.title;
    synergyHeader.querySelector('.section-desc').textContent = sh.desc;
  }

  // Synergy cards and grid layout
  const visibleCards = data.synergyCards;
  const synergyGrid = document.querySelector('.synergy-grid');
  const connector = document.querySelector('[data-mode-target="synergyConnector"]');
  const isSingle = visibleCards.length === 1;

  document.querySelectorAll('[data-synergy-card]').forEach(card => {
    const name = card.dataset.synergyCard;
    const show = visibleCards.includes(name);
    card.classList.toggle('synergy-hidden', !show);
    card.removeAttribute('data-synergy-slot');
    if (show) {
      const idx = visibleCards.indexOf(name);
      card.setAttribute('data-synergy-slot', idx === 0 ? 'left' : 'right');
      if (!card.classList.contains('visible')) {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          card.classList.add('visible');
        } else {
          observer.observe(card);
        }
      }
    }
  });

  if (connector) connector.classList.toggle('synergy-hidden', isSingle);
  if (synergyGrid) synergyGrid.classList.toggle('synergy-grid-single', isSingle);

  // Tagline
  const tagline = document.querySelector('[data-mode-target="tagline"]');
  if (tagline) {
    tagline.innerHTML = data.tagline;
    // Re-trigger fade animation
    tagline.style.animation = 'none';
    tagline.offsetHeight; // force reflow
    tagline.style.animation = '';
    if (mode !== 'default') {
      tagline.style.animation = 'fadeUp 1s 0.8s ease forwards';
      tagline.style.opacity = '0';
    } else {
      tagline.style.animation = '';
      tagline.style.opacity = '';
    }
  }

  // Synergy bottom
  const synergyBottom = document.querySelector('[data-mode-target="synergy"]');
  if (synergyBottom) {
    synergyBottom.classList.toggle('synergy-hidden', !data.synergyBottom);
    if (data.synergy) {
      const syn = data.synergy;
      synergyBottom.querySelector('h3').textContent = syn.title;
      synergyBottom.querySelector('p').textContent = syn.summary;
      const highlights = synergyBottom.querySelector('.synergy-highlights');
      highlights.innerHTML = syn.stats.map(s =>
        `<div class="synergy-stat"><span class="value">${s.value}</span><span class="label">${s.label}</span></div>`
      ).join('');
    }
  }

  // Merc strategy
  const mercStrategy = document.querySelector('[data-mode-target="mercStrategy"]');
  if (mercStrategy) {
    const merc = data.mercStrategy;
    mercStrategy.querySelector('h3').textContent = merc.title;
    mercStrategy.querySelector('ul').innerHTML = merc.points.map(p => `<li>${p}</li>`).join('');
  }

  // Farm strategies
  document.querySelectorAll('[data-farm-zone]').forEach(el => {
    const zone = el.dataset.farmZone;
    const farmData = data.farmStrategies[zone];
    if (farmData) {
      el.querySelector('p').textContent = farmData.text;
      const icon1 = el.querySelector('.farm-icon-1 use');
      const icon2 = el.querySelector('.farm-icon-2 use');
      if (icon1) icon1.setAttribute('href', '#icon-' + farmData.icons[0]);
      if (icon2) icon2.setAttribute('href', '#icon-' + farmData.icons[1]);
    }
  });

  // Tips grid
  const tipsGrid = document.querySelector('[data-mode-target="tips"]');
  if (tipsGrid) {
    tipsGrid.innerHTML = data.tips.map(tip =>
      `<div class="tip-card">
        <div class="tip-icon-wrap"><svg class="tip-icon"><use href="#icon-${tip.icon}"/></svg></div>
        <span class="tip-number">${tip.numeral}</span>
        <h3>${tip.title}</h3>
        <p>${tip.body}</p>
      </div>`
    ).join('');
    // Re-observe new tip cards for scroll animation
    tipsGrid.querySelectorAll('.tip-card').forEach(el => {
      // If tips section is already in viewport, show immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      } else {
        observer.observe(el);
      }
    });
  }
}

/* ========== DIVORCE / AFFAIR MODE ========== */
function clearModes() {
  document.querySelectorAll('.divorce-btn').forEach(b => b.classList.remove('active'));
  document.body.classList.remove('divorce-barb', 'divorce-zon', 'affair', 'rainbow');
  applyModeContent('default');
}

document.querySelectorAll('.divorce-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    const isActive = btn.classList.contains('active');

    clearModes();

    if (!isActive) {
      btn.classList.add('active');

      if (mode === 'affair') {
        document.body.classList.add('affair');
      } else if (mode === 'rainbow') {
        document.body.classList.add('rainbow');
      } else {
        document.body.classList.add('divorce-' + mode);
      }
      applyModeContent(mode);
    }
  });
});

/* ========== LANGUAGE SWITCHER ========== */
document.querySelectorAll('.lang-link').forEach(link => {
  link.addEventListener('click', () => {
    localStorage.setItem('fz-lang', link.dataset.lang);
  });
});

/* ========== FARMING FILTERS ========== */
document.querySelectorAll('.farm-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.farm-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.farm-card').forEach(card => {
      if (filter === 'all') {
        card.classList.remove('farm-hidden');
      } else {
        card.classList.toggle('farm-hidden', !card.classList.contains('farm-' + filter));
      }
    });
  });
});
