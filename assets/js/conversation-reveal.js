(() => {
  const home = document.querySelector('.home-profile');
  if (!home || !('IntersectionObserver' in window)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;
  const sessionKey = 'home-conversation-seen';
  try { if (sessionStorage.getItem(sessionKey) === 'true') return; } catch (_) { /* Storage may be unavailable. */ }
  const items = [...home.querySelectorAll('.conversation-turn, .home-closing-profile')];
  if (!items.length) return;
  let next = 0;
  let eligibleThrough = -1;
  let timer;
  let observer;
  const revealAll = () => {
    clearTimeout(timer);
    observer?.disconnect();
    items.forEach(item => item.classList.remove('reveal-pending'));
    next = items.length;
  };
  const drain = () => {
    timer = undefined;
    if (next > eligibleThrough || next >= items.length) return;
    const item = items[next++];
    item.classList.remove('reveal-pending');
    observer.unobserve(item);
    if (next <= eligibleThrough) timer = setTimeout(drain, 400);
  };
  try {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) eligibleThrough = Math.max(eligibleThrough, items.indexOf(entry.target));
      }
      if (!timer && next <= eligibleThrough) timer = setTimeout(drain, 100);
    }, { threshold: 0, rootMargin: '0px 0px -36px 0px' });
    // Hide only after setup succeeds. Without JavaScript, everything stays visible.
    items.forEach(item => {
      item.classList.add('reveal-item', 'reveal-pending');
      observer.observe(item);
    });
    try { sessionStorage.setItem(sessionKey, 'true'); } catch (_) { /* Animation still works without storage. */ }
    window.addEventListener('pageshow', event => { if (event.persisted) revealAll(); });
    // Keyboard navigation must never land in an invisible link.
    home.addEventListener('focusin', event => {
      const index = items.findIndex(item => item.contains(event.target));
      if (index < 0) return;
      while (next <= index) {
        const item = items[next++];
        item.classList.remove('reveal-pending');
        observer.unobserve(item);
      }
    });
    motion.addEventListener('change', event => { if (event.matches) revealAll(); });
    window.addEventListener('beforeprint', revealAll);
  } catch (_) {
    revealAll();
  }
})();
