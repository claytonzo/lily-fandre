// Sticky nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
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
