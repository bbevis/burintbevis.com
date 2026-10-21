(() => {
  const grid = document.querySelector('.collaborators-grid');
  if (!grid || !('IntersectionObserver' in window)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;
  const people = [...grid.querySelectorAll('.collaborator')];
  let observer;
  let next = 0;
  let eligibleThrough = -1;
  let timer;
  const show = person => {
    person.classList.remove('person-pending');
    observer?.unobserve(person);
  };
  const showAll = () => {
    clearTimeout(timer);
    observer?.disconnect();
    people.forEach(show);
    next = people.length;
  };
  const advance = () => {
    timer = undefined;
    if (next > eligibleThrough || next >= people.length) return;
    show(people[next++]);
    // One clock across every row keeps visible rows from starting together.
    timer = setTimeout(advance, 240);
  };
  try {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          eligibleThrough = Math.max(eligibleThrough, people.indexOf(entry.target));
        }
      }
      if (timer === undefined) advance();
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    // Without JavaScript, or if setup fails, all content remains visible.
    people.forEach(person => {
      person.classList.add('person-reveal', 'person-pending');
      observer.observe(person);
    });
    grid.addEventListener('focusin', event => {
      const person = event.target.closest('.collaborator');
      const index = people.indexOf(person);
      // Keyboard users can reach links immediately, without waiting for animation.
      while (next <= index) show(people[next++]);
    });
    motion.addEventListener('change', event => { if (event.matches) showAll(); });
    window.addEventListener('pageshow', event => { if (event.persisted) showAll(); });
    window.addEventListener('beforeprint', showAll);
  } catch (_) {
    showAll();
  }
})();
