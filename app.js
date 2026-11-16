const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('mobile-nav');
function setMenu(open) {
 toggle.setAttribute('aria-expanded', String(open));
 toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
 menu.hidden = !open;
}
toggle.addEventListener('click', () => setMenu(menu.hidden));
document.addEventListener('keydown', event => {
 if (event.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
});
menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('click', event => { if (!menu.hidden && !event.target.closest('.site-header')) setMenu(false); });
const gallery = document.querySelector('.life-gallery');
if (gallery) {
 const move = direction => gallery.scrollBy({left: direction * (gallery.querySelector('figure').getBoundingClientRect().width + parseFloat(getComputedStyle(gallery).gap)), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
 document.querySelector('[data-gallery-prev]').addEventListener('click', () => move(-1));
 document.querySelector('[data-gallery-next]').addEventListener('click', () => move(1));
 gallery.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
 });
}
