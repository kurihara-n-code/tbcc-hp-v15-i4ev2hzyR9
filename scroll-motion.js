/* Scroll choreography: progressive enhancement, no content rewrites. */
(() => {
  'use strict';
  if (!('IntersectionObserver' in window)) return;
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const all = selector => [...document.querySelectorAll(selector)];
  const candidates = all('[data-reveal], .c-rail-heading, .c-course-card, .c-guide > div, .c-contact-photo, .c-detail .page-intro > .container, .c-detail .detail-cover, .c-detail .section-title, .c-detail .editorial-split, .c-detail .grid > *, .c-detail .history-banner, .c-detail .specialty-list');
  const candidateSet = new Set(candidates);
  // Animate only the outermost block so nested text is never hidden twice.
  const blocks = candidates.filter(el => {
    for (let p = el.parentElement; p; p = p.parentElement) if (candidateSet.has(p)) return false;
    return true;
  });
  blocks.forEach(el => {
    let type = 'rise';
    if (el.matches('.c-portals > a, .c-detail .detail-cover, .c-contact-photo')) type = 'wipe';
    else if (el.matches('.c-future-image, .c-intro > div:first-child, .c-for-you > div:first-child')) type = 'left';
    else if (el.matches('.c-future > div:last-child, .c-intro-right, .c-for-links > a')) type = 'right';
    else if (el.matches('.c-course-card, .c-learning-grid > *, .c-people-grid > *')) type = 'zoom';
    el.dataset.motion = type;
    const index = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--motion-delay', `${Math.min(index % 4, 3) * 85}ms`);
  });
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(({target, isIntersecting, boundingClientRect}) => {
      if (isIntersecting) target.classList.add('motion-in');
      // Reset only once fully off screen; never fade text while it is being read.
      else if (boundingClientRect.bottom < 0 || boundingClientRect.top > innerHeight) target.classList.remove('motion-in');
    });
  }, {threshold: 0});
  blocks.forEach(el => reveal.observe(el));

  const scenes = [];
  const addScene = (selector, imageSelector, strength) => all(selector).forEach(el => {
    const images = [...el.querySelectorAll(imageSelector)];
    if (!images.length) return;
    el.classList.add('motion-scene');
    images.forEach(img => img.classList.add('motion-image'));
    scenes.push({el, images, strength});
  });
  addScene('.c-portals > a', 'img', 28);
  addScene('.c-course-intro', ':scope > img', 52);
  addScene('.c-contact-photo', 'img', 34);
  addScene('.c-detail .detail-cover', 'img', 28);
  addScene('.c-people-portraits', 'img', 18);
  const active = new Set();
  const sceneMap = new Map(scenes.map(scene => [scene.el, scene]));
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? active.add(sceneMap.get(e.target)) : active.delete(sceneMap.get(e.target)));
    schedule();
  }, {rootMargin: '120px 0px'});
  scenes.forEach(scene => visibility.observe(scene.el));
  const progress = document.createElement('div');
  progress.className = 'c-reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const hero = document.querySelector('.c-hero');
  const word = document.querySelector('.c-hero-word');
  let frame = 0;
  const clamp = n => Math.max(-1, Math.min(1, n));
  function render() {
    frame = 0;
    if (reduced.matches) return;
    const height = innerHeight;
    const small = innerWidth <= 600;
    const updates = [...active].map(scene => {
      const rect = scene.el.getBoundingClientRect();
      return {scene, offset: clamp((height / 2 - rect.top - rect.height / 2) / ((height + rect.height) / 2)) * scene.strength * (small ? .55 : 1)};
    });
    const distance = root.scrollHeight - height;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
    updates.forEach(({scene, offset}) => scene.images.forEach((img, index) => {
      img.style.setProperty('--photo-y', `${(offset * (index % 2 ? -.7 : 1)).toFixed(2)}px`);
    }));
    if (word && hero && scrollY < hero.offsetHeight + height) word.style.translate = `${Math.min(scrollY, hero.offsetHeight) * (small ? .045 : .12)}px 0`;
  }
  function schedule() { if (!frame && !reduced.matches) frame = requestAnimationFrame(render); }
  function preference() {
    root.classList.toggle('scroll-motion-ready', !reduced.matches);
    if (reduced.matches) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      scenes.forEach(s => s.images.forEach(img => img.style.removeProperty('--photo-y')));
      if (word) word.style.removeProperty('translate');
    } else schedule();
  }
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', schedule, {passive: true});
  addEventListener('pageshow', schedule);
  reduced.addEventListener('change', preference);
  // Focused links must remain visible even during a reveal or a fast anchor jump.
  document.addEventListener('focusin', event => {
    const block = event.target.closest('[data-motion]');
    if (block) block.classList.add('motion-in');
  });
  preference();
})();
