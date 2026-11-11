/* Aquí no necesitas editar. Todo el movimiento y la interacción viven aquí. */
const C = CONTENIDO, $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const parr = a => a.map(t => `<p>${esc(t)}</p>`).join('');
const petalos = (n, cy, ry, col, rot = 0) => Array.from({length: n}, (_, i) =>
  `<ellipse cx="0" cy="${cy}" rx="${Math.min(10, Math.PI * Math.abs(cy) / n)}" ry="${ry}" fill="${col}" stroke="#d98a00" stroke-width=".5" transform="rotate(${rot + i * 360 / n})"/>`).join('');
const centro = `<circle r="17" fill="url(#gc)"/><circle r="11" fill="none" stroke="#d9a25a" stroke-width="2" stroke-dasharray="1 3"/><circle r="5" fill="none" stroke="#d9a25a" stroke-width="1.5" stroke-dasharray="1 2.5"/>`;
$('#girasol').innerHTML = petalos(18, -33, 18, '#f2a900') + petalos(18, -30, 15, '#ffc929', 10) + centro;

/* Campo de girasoles de fondo */
const flor = (x, w, d, o) => `<div class="flor" style="left:${x}%;width:${w}px;animation-delay:${d}s;opacity:${o}"><svg viewBox="0 0 100 330">
<path d="M50 52C44 140 56 240 50 330" stroke="#3f7a2e" stroke-width="5" fill="none"/>
<path d="M50 210C20 200 8 180 6 170 30 170 46 186 50 210z" fill="#4f9a3a"/><path d="M52 160C80 152 92 134 94 124 70 124 55 138 52 160z" fill="#4f9a3a"/>
<use href="#girasol" x="0" y="2" width="100" height="100"/></svg></div>`;
$('#campo').innerHTML = [[-4,130,0,.95],[20,95,1.2,.8],[38,150,.5,.95],[60,100,2,.85],[78,140,.8,.95],[92,105,1.6,.8],[10,70,2.4,.6],[50,72,.3,.6],[70,64,1.9,.55]]
  .map(f => flor(...f)).join('');

/* Contenido de la página */
const fotos = a => `<div class="collage">${a.map(f => `<figure class="foto"><img src="${esc(f.archivo)}" alt="${esc(f.texto)}" loading="lazy" onerror="this.outerHTML='<div class=vacio>Aquí va tu foto<br>${esc(f.archivo)}</div>'"><figcaption>${esc(f.texto)}</figcaption></figure>`).join('')}</div>`;
const n = C.petalos.length;
const pet = C.petalos.map((_, i) => `<g class="pet" data-i="${i}" style="--dx:${Math.round(Math.random() * 60 - 30)}px;--r:${Math.round(Math.random() * 240 - 120)}deg"><ellipse cx="0" cy="-34" rx="${Math.min(10, Math.PI * 34 / n)}" ry="21" fill="#ffc929" stroke="#d98a00" stroke-width=".6" transform="rotate(${i * 360 / n})"/></g>`).join('');
$('#main').innerHTML = `
<section id="portada"><p class="feliz">Feliz cumpleaños, mi amor</p><h1>${esc(C.nombre)}</h1><div class="edad">${C.edad}</div><p id="cuenta"></p><p class="baja">desliza hacia abajo 🌻</p></section>
<section class="rev"><div class="papel"><h2>${esc(C.tituloCarta)}</h2>${parr(C.cartaCumple)}<p class="firma">${esc(C.firma)}</p></div></section>
<section class="rev"><h2 class="suelto">${esc(C.tituloGaleriaCumple)}</h2>${fotos(C.fotosCumple)}</section>
<section class="rev"><div class="papel centro"><p class="feliz">Y también celebramos</p><h2 class="grande">${esc(C.tituloAniv)}</h2>
 <div class="soles"><div class="sol"><b id="ta">0</b><span>años</span></div><div class="sol"><b id="tm">0</b><span>meses</span></div><div class="sol"><b id="td">0</b><span>días</span></div></div>
 <p>Llevamos juntos <b id="tdias"></b> días, y cada segundo cuenta:</p><div id="seg"></div></div></section>
<section class="rev"><div class="papel">${parr(C.cartaAniv)}</div></section>
<section class="rev"><h2 class="suelto">${esc(C.tituloGaleriaAniv)}</h2>${fotos(C.fotosAniv)}</section>
<section class="rev"><div class="papel centro"><h2>${esc(C.tituloPetalos)}</h2><p>Toca los pétalos, uno por uno 🌻</p>
 <svg id="fd" viewBox="-62 -62 124 124">${pet}<g style="pointer-events:none">${centro}</g></svg><div id="msg"></div><button class="suave" id="otra" hidden>Volver a florecer</button></div></section>
<section class="rev"><div class="papel"><h2>${esc(C.tituloMusica)}</h2><div id="canciones"></div></div></section>
<section id="final" class="rev"><p>${esc(C.mensajeFinal)}</p></section>`;
$('#textoPuerta').textContent = C.textoPuerta;
document.title = "Para " + C.nombre.split(' ')[0] + " 🌻";

/* Cuenta regresiva al cumpleaños */
(() => {
  const a = new Date(), hoy = new Date(a.getFullYear(), a.getMonth(), a.getDate()), {mes, dia} = C.cumple;
  let p = new Date(a.getFullYear(), mes - 1, dia);
  if (+hoy === +p) return $('#cuenta').textContent = "Hoy es tu día ✨";
  if (p < hoy) p = new Date(a.getFullYear() + 1, mes - 1, dia);
  const d = Math.round((p - hoy) / 864e5);
  $('#cuenta').textContent = d === 1 ? "Mañana es tu día ✨" : `Faltan ${d} días para tu cumpleaños`;
})();

/* Contador de aniversario, en vivo */
const ini = new Date(C.inicio.anio, C.inicio.mes - 1, C.inicio.dia);
function tic() {
  const h = new Date(); let y = h.getFullYear() - ini.getFullYear(), m = h.getMonth() - ini.getMonth(), d = h.getDate() - ini.getDate();
  if (d < 0) { m--; d += new Date(h.getFullYear(), h.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  $('#ta').textContent = y; $('#tm').textContent = m; $('#td').textContent = d;
  $('#tdias').textContent = Math.floor((h - ini) / 864e5).toLocaleString('es');
  $('#seg').textContent = Math.floor((h - ini) / 1000).toLocaleString('es') + " segundos";
}
tic(); setInterval(tic, 1000);

/* Música */
const audio = $('#audio'); let act = -1;
const bs = C.canciones.map((c, i) => {
  const b = document.createElement('button'); b.className = 'disco';
  b.innerHTML = `<div class="ico">▶</div><div><b>${esc(c.titulo)}</b><span>${esc(c.artista)}</span></div>`;
  b.onclick = () => act === i && !audio.paused ? audio.pause() : sonar(i);
  $('#canciones').appendChild(b); return b;
});
function sonar(i) { if (!C.canciones[i]) return; if (act !== i) { audio.src = C.canciones[i].archivo; act = i; } audio.play().catch(() => {}); }
function pintar() { const on = !audio.paused; $('#botonMusica').classList.toggle('suena', on);
  bs.forEach((b, i) => { const s = on && i === act; b.classList.toggle('suena', s); b.querySelector('.ico').textContent = s ? '❚❚' : '▶'; }); }
audio.onplay = audio.onpause = pintar;
audio.onended = () => sonar((act + 1) % C.canciones.length);
if (C.canciones.length) { $('#botonMusica').hidden = false; $('#botonMusica').onclick = () => audio.paused ? sonar(act < 0 ? 0 : act) : audio.pause(); }

/* Pétalos que caen (fondo) y explosión de pétalos */
const cv = $('#lluvia'), cx = cv.getContext('2d'); let P = [];
const ajusta = () => { cv.width = innerWidth; cv.height = innerHeight; }; ajusta(); addEventListener('resize', ajusta);
const nuevo = b => ({x: b ? innerWidth / 2 : Math.random() * innerWidth, y: b ? innerHeight * .5 : -20, vx: b ? (Math.random() - .5) * 12 : Math.random() - .5,
  vy: b ? -Math.random() * 11 - 3 : Math.random() + .6, s: 5 + Math.random() * 7, r: Math.random() * 6, vr: (Math.random() - .5) * .12, b, c: Math.random() < .5 ? '#ffc929' : '#ffe27a'});
for (let i = 0; i < 22; i++) { const p = nuevo(); p.y = Math.random() * innerHeight; P.push(p); }
const lluvia = () => { cx.clearRect(0, 0, cv.width, cv.height);
  P.forEach(p => { if (p.b) { p.vy += .22; p.vx *= .99; } p.x += p.vx + Math.sin(p.y / 40) * .4; p.y += p.vy; p.r += p.vr;
    if (!p.b && p.y > innerHeight + 20) Object.assign(p, nuevo());
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.beginPath(); cx.ellipse(0, 0, p.s * .45, p.s, 0, 0, 7); cx.fill(); cx.restore(); });
  P = P.filter(p => !p.b || p.y < innerHeight + 30); requestAnimationFrame(lluvia); };
const explota = () => { for (let i = 0; i < 90; i++) P.push(nuevo(true)); };
if (!matchMedia('(prefers-reduced-motion:reduce)').matches) lluvia();

/* Deshojar */
let quedan = n;
$('#fd').addEventListener('click', e => { const g = e.target.closest('.pet'); if (!g || g.classList.contains('cae')) return;
  g.classList.add('cae'); quedan--; $('#msg').textContent = C.petalos[+g.dataset.i];
  if (!quedan) setTimeout(() => { $('#msg').textContent = C.petaloFinal; explota(); $('#otra').hidden = false; }, 1500); });
$('#otra').onclick = () => { document.querySelectorAll('.pet').forEach(g => g.classList.remove('cae')); quedan = n; $('#msg').textContent = ''; $('#otra').hidden = true; };

/* Foto en grande al tocarla */
document.addEventListener('click', e => { const im = e.target.closest('.foto img');
  if (im) { $('#visor').innerHTML = `<img src="${im.src}" alt="">`; $('#visor').hidden = false; } else if (e.target.closest('#visor')) $('#visor').hidden = true; });

/* Corazones y girasoles donde toques */
document.addEventListener('click', e => { if (e.target.closest('#puerta,#botonMusica')) return;
  const c = document.createElement('div'); c.className = 'cora'; c.textContent = ['🌻','💛','🧡','✨','🌼'][Math.floor(Math.random() * 5)];
  c.style.left = e.clientX - 14 + 'px'; c.style.top = e.clientY - 14 + 'px'; document.body.appendChild(c); setTimeout(() => c.remove(), 1700); });

/* Aparecer suavemente al bajar */
const io = new IntersectionObserver(es => es.forEach(x => x.isIntersecting && x.target.classList.add('visto')), {threshold: .08});
document.querySelectorAll('.rev').forEach(s => io.observe(s));

/* Puerta: el girasol que se abre */
$('#capullo').onclick = () => { if ($('#capullo').classList.contains('abre')) return; $('#capullo').classList.add('abre');
  setTimeout(() => { explota(); sonar(0); }, 500);
  setTimeout(() => { $('#puerta').classList.add('fuera'); document.body.classList.remove('bloqueado'); }, 1500); };
