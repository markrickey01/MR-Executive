document.addEventListener('DOMContentLoaded', () => {
  // Year
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // Reveal on scroll + KPI count-up (teaser cards)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('active');

      const kpis = entry.target.querySelectorAll('.teaser-kpi[data-val]');
      kpis.forEach(kpi => {
        const raw = kpi.getAttribute('data-val');
        const target = Number(raw);
        if (!Number.isFinite(target)) return;

        let count = 0;
        const steps = 40;
        const step = target / steps;

        const suffix = (target === 40) ? "+" : "%";

        const tick = () => {
          count += step;
          if (count < target) {
            kpi.textContent = `${Math.ceil(count)}${suffix}`;
            setTimeout(tick, 25);
          } else {
            kpi.textContent = `${target}${suffix}`;
          }
        };

        // Only animate if currently at a placeholder like "0%" / "0+"
        if (/^0[%+]/.test(kpi.textContent.trim())) tick();
      });

      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Operating Rhythm interactivity (node hover -> detail panel)
  const nodes = document.querySelectorAll('.node');
  const detail = document.getElementById('rhythm-detail');
  if (nodes.length && detail) {
    nodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        nodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        const desc = node.getAttribute('data-desc') || '';
        detail.innerHTML = `<strong>${node.innerText}:</strong> ${desc}`;
      });
    });
  }

  // Premium scroll gradient driver
  const fx = document.getElementById('fx');
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  if (fx) {
    window.addEventListener('scroll', () => {
      const doc = document.documentElement;
      const max = (doc.scrollHeight - window.innerHeight) || 1;
      const p = clamp(window.scrollY / max, 0, 1);

      fx.style.transform = `translateY(${-100 * p}px)`;
      fx.style.opacity = (0.9 - (0.4 * p)).toFixed(2);

      const h = 210 + (75 * p);
      doc.style.setProperty('--h1', h.toFixed(1));
      doc.style.setProperty('--rot', (200 + (220 * p)).toFixed(1) + 'deg');
    }, { passive: true });

    // Subtle mouse parallax (optional but matches your CSS variables)
    window.addEventListener('mousemove', (e) => {
      const doc = document.documentElement;
      const mx = (e.clientX / window.innerWidth) * 100;
      const my = (e.clientY / window.innerHeight) * 100;

      doc.style.setProperty('--mx', mx.toFixed(2) + '%');
      doc.style.setProperty('--my', my.toFixed(2) + '%');

      const gX = (e.clientX - window.innerWidth / 2) * 0.02;
      const gY = (e.clientY - window.innerHeight / 2) * 0.02;
      doc.style.setProperty('--gX', gX.toFixed(2) + 'px');
      doc.style.setProperty('--gY', gY.toFixed(2) + 'px');
    }, { passive: true });
  }
});
