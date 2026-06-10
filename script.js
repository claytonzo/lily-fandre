// Sticky nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Gold scroll progress bar ──
const bar = document.createElement('div');
bar.id = 'progress-bar';
document.body.appendChild(bar);
addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (scrollY / max * 100) + '%';
}, { passive: true });

// ── Gold dust particles in hero ──
if (!reduced) {
  const hero = document.getElementById('hero');
  const dust = document.createElement('canvas');
  dust.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;';
  hero.appendChild(dust);
  const dctx = dust.getContext('2d');
  let DW, DH;
  const sizeDust = () => { DW = dust.width = hero.offsetWidth; DH = dust.height = hero.offsetHeight; };
  sizeDust();
  addEventListener('resize', sizeDust);

  const motes = Array.from({ length: 70 }, () => ({
    x: Math.random() * 2000, y: Math.random() * 1200,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.18,
    vy: -Math.random() * 0.25 - 0.05,
    tw: Math.random() * Math.PI * 2,
  }));

  (function drawDust() {
    dctx.clearRect(0, 0, DW, DH);
    for (const m of motes) {
      m.x += m.vx; m.y += m.vy; m.tw += 0.03;
      if (m.y < -5) { m.y = DH + 5; m.x = Math.random() * DW; }
      if (m.x < -5) m.x = DW + 5;
      if (m.x > DW + 5) m.x = -5;
      const a = 0.25 + Math.sin(m.tw) * 0.2;
      dctx.beginPath();
      dctx.arc(m.x % (DW + 10), m.y, m.r, 0, Math.PI * 2);
      dctx.fillStyle = `rgba(232, 201, 122, ${Math.max(0, a)})`;
      dctx.fill();
    }
    requestAnimationFrame(drawDust);
  })();
}

// ── 3D tilt on stat cards ──
document.querySelectorAll('.stat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// Fade-in on scroll
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll('.timeline-item, .stat-card, .story-text p, .next-text p')
  .forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

document.addEventListener('animationend', () => {}, { once: true });

// Add visible class CSS
const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: none !important; }';
document.head.appendChild(style);

// Count-up animation for stat numbers
const countObserver = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (!e.isIntersecting) return;
    countObserver.unobserve(e.target);

    const node = e.target.firstChild;          // leading text node, e.g. "1,000"
    const raw = node.textContent;
    const match = raw.match(/^[\d,]+(\.\d+)?/);
    if (!match) return;

    const target = parseFloat(match[0].replace(/,/g, ''));
    const decimals = (match[0].split('.')[1] || '').length;
    const useCommas = match[0].includes(',');
    const suffix = raw.slice(match[0].length);
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      let val = (target * eased).toFixed(decimals);
      if (useCommas) val = Number(val).toLocaleString('en-US');
      node.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }),
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-number').forEach(el => countObserver.observe(el));
