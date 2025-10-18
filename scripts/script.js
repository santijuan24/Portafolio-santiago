// Animated background (simple particle field)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  particles = Array.from({ length: Math.min(120, Math.floor(width / 12)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    r: Math.random() * 1.6 + 0.4
  }));
}

function tick() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(138,92,255,0.9)';
  const linkDist = 90;
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
  }
  // Draw links
  ctx.strokeStyle = 'rgba(40,224,185,0.15)';
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const d = Math.hypot(dx, dy);
      if (d < linkDist) {
        ctx.globalAlpha = 1 - d / linkDist;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
  requestAnimationFrame(tick);
}

window.addEventListener('resize', resize);
resize();
tick();

// Simple scroll reveal
const observer = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) e.target.classList.add('is-visible');
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Typed role text
const phrases = ['Pentester Jr. (eJPT)', 'Ciberseguridad Ofensiva', 'Análisis de Tráfico', 'Automatización con Python'];
const typedEl = document.getElementById('typed');
let pi = 0, ci = 0, deleting = false;
function typeLoop() {
  const current = phrases[pi % phrases.length];
  if (!deleting) {
    ci++;
    if (ci === current.length + 8) deleting = true; // hold
  } else {
    ci--; if (ci === 0) { deleting = false; pi++; }
  }
  typedEl.textContent = current.slice(0, Math.max(0, Math.min(ci, current.length)));
  const delay = deleting ? 60 : 90;
  setTimeout(typeLoop, delay);
}
typeLoop();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
