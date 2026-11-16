(()=>{
'use strict';
const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)');
let button=document.querySelector('.v8-motion'),paused=false,pending=false;
if(button)button.remove();button=document.createElement('button');

const heroSection=document.querySelector('.v8-hero');
if(heroSection){const band=document.createElement('div');band.className='v8-type-band';band.setAttribute('aria-hidden','true');band.innerHTML='<div class="v12-band-track"><div class="v12-band-group"><span class="v12-band-item">LEARN. CARE. GROW. <span>その手から、未来へ。</span></span></div><div class="v12-band-group"></div></div>';heroSection.after(band);
const track=band.querySelector('.v12-band-track'),groups=band.querySelectorAll('.v12-band-group'),item=groups[0].firstElementChild;
function sizeBand(){groups[0].replaceChildren(item);const width=item.getBoundingClientRect().width;if(!width)return;const count=Math.max(1,Math.ceil(band.clientWidth/width));for(let i=1;i<count;i++)groups[0].append(item.cloneNode(true));groups[1].innerHTML=groups[0].innerHTML;track.style.setProperty('--band-duration',(groups[0].getBoundingClientRect().width/80)+'s')}
sizeBand();addEventListener('resize',sizeBand);if(document.fonts)document.fonts.ready.then(sizeBand)}
const band=document.querySelector('.v8-type-band');
document.querySelectorAll('.v8-message h2,.c-heading h2,.v7-voices>h2,.c-detail .section-title h2').forEach(h=>{const span=document.createElement('span');span.className='v8-title-inner';while(h.firstChild)span.append(h.firstChild);h.append(span);h.classList.add('v8-title-mask')});
const cinematic=[...document.querySelectorAll('.v8-message,.c-courses,.c-contact')];cinematic.forEach(el=>el.classList.add('v8-cinematic'));
const number=document.querySelector('.v7-year-gauge>strong');let counter=null;
if(number){const text=[...number.childNodes].find(n=>n.nodeType===3);if(text){number.setAttribute('aria-label','30年以上の実績');const span=document.createElement('span');span.className='v8-counter';span.setAttribute('aria-hidden','true');span.textContent='30';text.replaceWith(span);counter=span}}
const progress=document.createElement('div');progress.className='v8-scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
const items=[...document.querySelectorAll('.v8-message>div,.v7-history,.c-portals>a,.c-heading,.v7-voice,.c-future>div,.c-for-you>div,.c-guide>div,.c-contact>div,.c-detail .section-title,.c-detail .editorial-split,.c-detail .messages article,.c-person-card')];
items.forEach((el,i)=>{el.classList.add('v8-reveal');el.style.setProperty('--reveal-delay',((i%2)*100)+'ms');if(el.matches('.c-portals>a,.v7-voice,.c-detail .editorial-split'))el.classList.add(i%2?'v8-from-right':'v8-from-left')});
document.querySelectorAll('.c-portals>a>img').forEach(img=>{const window=document.createElement('div');window.className='v8-image-window';img.before(window);window.append(img)});
// Work on existing image frames, preserving alt text and the document layout.
const frames=[...document.querySelectorAll('.c-portals>a,.c-future-image,.detail-cover,.c-course-photo')];
const photos=frames.map(frame=>{const img=frame.querySelector('img');if(img){frame.classList.add('v8-scroll-frame');img.classList.add('v8-scroll-photo')}return {frame,img}}).filter(p=>p.img);
const hero=document.querySelector('.v8-hero'),composition=document.querySelector('.v8-photo-composition'),history=document.querySelector('.v7-history');
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v8-visible');observer.unobserve(e.target)}}),{threshold:.08});items.forEach(el=>observer.observe(el));root.classList.add('v8-motion-ready')}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function update(){pending=false;const enabled=!paused&&!reduced.matches;root.classList.toggle('v8-motion-off',!enabled);const h=innerHeight,max=root.scrollHeight-h;progress.style.transform='scaleX('+(max>0?clamp(scrollY/max,0,1):0)+')';
if(composition){const amount=enabled?clamp(scrollY*.3,0,180)*(innerWidth<=750?.4:1):0;composition.style.setProperty('--hero-shift',amount+'px');composition.style.setProperty('--hero-turn',((enabled?clamp(scrollY/30,0,24):0))+'deg')}
if(hero){const t=enabled?clamp(scrollY/(hero.offsetHeight*.9),0,1):0;hero.style.setProperty('--hero-depth',t);hero.style.setProperty('--hero-angle',(t*-7)+'deg')}
cinematic.forEach(el=>{const r=el.getBoundingClientRect(),t=enabled?clamp((innerHeight-r.top)/(innerHeight*.8),0,1):1;el.style.setProperty('--scene-enter',t);el.style.setProperty('--scene-radius',(enabled?(1-t)*100:0)+'px')});
photos.forEach(({frame,img})=>{const rect=frame.getBoundingClientRect();if(rect.bottom< -100||rect.top>h+100)return;const t=clamp((h/2-(rect.top+rect.height/2))/h,-1,1);img.style.setProperty('--photo-scale',enabled?1.08+Math.abs(t)*.14:1);img.style.setProperty('--photo-y',(enabled?t*(innerWidth<=750?28:70):0)+'px')});
if(history){const r=history.getBoundingClientRect();history.style.setProperty('--track-progress',enabled?clamp((h-r.top)/(h*.65),0,1):1)}
}
if(counter&&'IntersectionObserver'in window){const countObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){countObserver.disconnect();if(paused||reduced.matches)return;const start=performance.now();const tick=now=>{if(paused||reduced.matches){counter.textContent='30';return}const t=clamp((now-start)/1500,0,1);counter.textContent=String(Math.round(30*(1-Math.pow(1-t,3))));if(t<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}},{threshold:.5});countObserver.observe(counter)}
function schedule(){if(!pending){pending=true;requestAnimationFrame(update)}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);addEventListener('load',schedule);
button.addEventListener('click',()=>{paused=!paused;root.classList.toggle('v8-paused',paused);button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'動きを再開する':'動きを止める';update()});
update();
})();
