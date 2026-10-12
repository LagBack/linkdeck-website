(() => {
  const config = window.LINKDECK_CONFIG || {};
  document.querySelectorAll('[data-link]').forEach((el) => {
    const key = el.dataset.link;
    const url = config[key];
    if (url) {
      el.href = url;
      el.classList.remove('is-unconfigured');
      el.removeAttribute('aria-disabled');
      el.removeAttribute('tabindex');
      if (el.dataset.configuredLabel) { const label = el.querySelector('.contact-link'); if (label) label.textContent = el.dataset.configuredLabel; }
    } else {
      el.href = '#discord-note';
      el.classList.add('is-unconfigured');
      el.setAttribute('aria-disabled', 'true');
      if (el.dataset.unconfiguredLabel) { const label = el.querySelector('.contact-link'); if (label) label.textContent = el.dataset.unconfiguredLabel; }
    }
    if (url && el.dataset.external !== 'false') { el.target = '_blank'; el.rel = 'noopener noreferrer'; }
  });

  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav-links]');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const themeButtons = [...document.querySelectorAll('[data-theme-pick]')];
  const heroImage = document.querySelector('[data-theme-hero-image]');
  const heroTitle = document.querySelector('[data-theme-title]');
  const heroCopy = document.querySelector('[data-theme-copy]');
  const heroIndex = document.querySelector('[data-theme-index]');
  const heroSurface = document.querySelector('[data-theme-surface]');
  function pickTheme(button, focus = false) {
    if (!button) return;
    themeButtons.forEach(b => {
      const active = b === button;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    const { image, title, copy, number, tone } = button.dataset;
    if (heroImage) {
      heroImage.classList.add('is-changing');
      window.setTimeout(() => {
        heroImage.src = image;
        heroImage.alt = `${title} theme screenshot of the LinkDeck bookmark dashboard`;
        heroImage.onload = () => heroImage.classList.remove('is-changing');
      }, 110);
    }
    if (heroTitle) heroTitle.textContent = title;
    if (heroCopy) heroCopy.textContent = copy;
    if (heroIndex) heroIndex.textContent = number;
    if (heroSurface) heroSurface.dataset.tone = tone || 'paper';
    if (focus) button.focus();
  }
  document.querySelectorAll('[data-collage-theme]').forEach((tile) => {
    tile.addEventListener('click', () => {
      const matchingTheme = themeButtons.find((button) => button.dataset.tone === tile.dataset.collageTheme);
      if (matchingTheme) matchingTheme.click();
    });
  });

  themeButtons.forEach((button, i) => {
    button.addEventListener('click', () => pickTheme(button));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = i;
      if (event.key === 'ArrowRight') next = (i + 1) % themeButtons.length;
      if (event.key === 'ArrowLeft') next = (i - 1 + themeButtons.length) % themeButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = themeButtons.length - 1;
      pickTheme(themeButtons[next], true);
    });
  });


  document.querySelectorAll('[data-copy-discord]').forEach((button) => {
    button.addEventListener('click', async () => {
      const handle = button.dataset.copyDiscord || 'lagb2ck';
      const status = button.closest('.discord-contact')?.querySelector('[data-copy-status]');
      try {
        await navigator.clipboard.writeText(handle);
        button.textContent = 'Copied!';
        if (status) status.textContent = 'Username copied — find @lagb2ck on Discord';
      } catch (_) {
        if (status) status.textContent = `Discord username: ${handle}`;
      }
    });
  });

  const revealNodes = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealNodes.forEach(node => observer.observe(node));
  } else revealNodes.forEach(node => node.classList.add('is-visible'));

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
