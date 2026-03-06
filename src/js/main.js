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
    this.size = Math.random() * 3 + 0.5;
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
    ctx.globalAlpha = this.life * 0.6;
    ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`;
    ctx.shadowBlur = this.size * 4;
    ctx.shadowColor = `rgb(${this.r},${this.g},${this.b})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 60; i++) {
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

/* ========== DIVORCE / AFFAIR MODE ========== */
function clearModes() {
  document.querySelectorAll('.divorce-btn').forEach(b => b.classList.remove('active'));
  document.body.classList.remove('divorce-barb', 'divorce-zon', 'affair');
  document.querySelectorAll('.hero-line').forEach(l => l.classList.remove('divorce-hidden'));
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
        document.querySelector('.hero-line-barb').classList.add('divorce-hidden');
      } else {
        document.body.classList.add('divorce-' + mode);
        if (mode === 'barb') {
          document.querySelector('.hero-line-zon').classList.add('divorce-hidden');
          document.querySelector('.hero-line-necro').classList.add('divorce-hidden');
          document.querySelector('.hero-line-mid').classList.add('divorce-hidden');
        } else {
          document.querySelector('.hero-line-barb').classList.add('divorce-hidden');
          document.querySelector('.hero-line-necro').classList.add('divorce-hidden');
          document.querySelector('.hero-line-mid').classList.add('divorce-hidden');
        }
      }
    }
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
