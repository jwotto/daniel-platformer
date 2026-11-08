// Alle plaatjes van de game worden hier met code getekend.
// Wil je iets anders laten uitzien? Pas dan de kleuren of de tekenfuncties aan.

const TAU = Math.PI * 2;
const INKT = '#0a1028';
const FONT = '"Alegreya Sans", "Segoe UI", sans-serif';
const FONT_TITEL = '"Alegreya SC", Georgia, serif';

// Kleuren per level-thema
const THEMA_KLEUR = {
  rivier: {
    lucht: ['#0a1238', '#1e3c80', '#2f8b98', '#f2c14e'],
    ver: ['#2b4c96', '#1a2f66'], mid: ['#1f6f84', '#123a5a'], nabij: ['#134c5c', '#0b2a3c'],
    boom: '#0c3343', steen: ['#7b2d45', '#371430'], top: '#26a596',
    pilaar: ['#2f63a8', '#142c5a'], kasteel: '#1b2c5e', sneeuw: false,
    kruiper: { lijf: ['#5a49b8', '#2a1f66'], stekel: '#f2c14e', oog: '#d1495b' },
    licht: { lijf: ['#ff8a8a', '#8e1f3c'], staart: 'rgba(209,73,91,.75)', oog: '#f2c14e' },
  },
  berg: {
    lucht: ['#120c3a', '#3b2a7a', '#c8506a', '#f2c14e'],
    ver: ['#5a6ab8', '#24306a'], mid: ['#3a4f8f', '#1c2752'], nabij: ['#5a2340', '#2a1030'],
    boom: '#1e0c22', steen: ['#5d6b8f', '#2a3352'], top: '#eef6ff',
    pilaar: ['#8a3450', '#3a1228'], kasteel: '#262f66', sneeuw: true,
    kruiper: { lijf: ['#a9c4ee', '#3b4f8a'], stekel: '#eef6ff', oog: '#1b2f6b' },
    licht: { lijf: ['#8ff5e8', '#1f6f84'], staart: 'rgba(60,200,187,.75)', oog: '#f2c14e' },
  },
  ijs: {
    lucht: ['#06122e', '#14306a', '#3a7fb0', '#bfe8f5'],
    ver: ['#7fa6d8', '#34508f'], mid: ['#5c86c0', '#26407a'], nabij: ['#3a5f98', '#1a2d5c'],
    boom: '#14284e', steen: ['#7fb8e0', '#2f5a96'], top: '#f4fbff',
    pilaar: ['#9fd8f0', '#3a6aa8'], kasteel: '#2a4a86', sneeuw: true,
    kruiper: { lijf: ['#e8f4ff', '#6a8fc8'], stekel: '#9fe8ff', oog: '#d1495b' },
    licht: { lijf: ['#d8f8ff', '#3a8fc0'], staart: 'rgba(160,230,255,.75)', oog: '#f2c14e' },
  },
  vulkaan: {
    lucht: ['#1a0610', '#4a0f1c', '#a8321e', '#f2a03c'],
    ver: ['#4a1a28', '#240a14'], mid: ['#3a1220', '#1c0610'], nabij: ['#2a0a14', '#12040a'],
    boom: '#0e0308', steen: ['#4a2a2a', '#1c0e0e'], top: '#ff7a2c',
    pilaar: ['#5a2a2a', '#240e0e'], kasteel: '#1c0810', sneeuw: false,
    kruiper: { lijf: ['#3a3a44', '#16161c'], stekel: '#ff7a2c', oog: '#f2c14e' },
    licht: { lijf: ['#ffd27a', '#c83a1c'], staart: 'rgba(255,122,44,.8)', oog: '#fff6d8' },
  },
  grot: {
    lucht: ['#05040c', '#120c22', '#1e1430', '#2a1e3a'],
    ver: ['#2a2240', '#140f22'], mid: ['#221a36', '#0e0a18'], nabij: ['#1a1428', '#08060e'],
    boom: '#0a0812', steen: ['#5a4a6a', '#2a2036'], top: '#7ae0c8',
    pilaar: ['#4a3c5a', '#1e1628'], kasteel: '#140f22', sneeuw: false,
    kruiper: { lijf: ['#6a5a8a', '#2a2040'], stekel: '#7ae0c8', oog: '#f2c14e' },
    licht: { lijf: ['#a8ffe8', '#2a8a7a'], staart: 'rgba(122,224,200,.75)', oog: '#f2c14e' },
  },
  kroeg: {
    lucht: ['#1a0a06', '#3a1a0a', '#5a2a10', '#8a4a1c'],
    ver: ['#4a2a14', '#2a140a'], mid: ['#3a200e', '#1c0e06'], nabij: ['#2a1608', '#120804'],
    boom: '#140a04', steen: ['#8a5a2a', '#4a2a10'], top: '#c8781c',
    pilaar: ['#6b4a2a', '#2a1a0a'], kasteel: '#2a140a', sneeuw: false,
    kruiper: { lijf: ['#8a5a2a', '#3a2010'], stekel: '#f2c14e', oog: '#d1495b' },
    licht: { lijf: ['#ffd27a', '#c8781c'], staart: 'rgba(255,200,100,.75)', oog: '#3a2010' },
  },
  fabriek: {
    lucht: ['#0e1016', '#2a2e3a', '#4a4a52', '#8a6a4a'],
    ver: ['#3a3e4a', '#1e2028'], mid: ['#2e323c', '#14161c'], nabij: ['#22252e', '#0c0e12'],
    boom: '#0a0b0e', steen: ['#7a8090', '#3a3e4a'], top: '#f2a33a',
    pilaar: ['#5a5e6a', '#24262e'], kasteel: '#1e2028', sneeuw: false,
    kruiper: { lijf: ['#9aa4b8', '#3a3e4a'], stekel: '#f2a33a', oog: '#d1495b' },
    licht: { lijf: ['#ffd27a', '#c8701c'], staart: 'rgba(255,160,60,.75)', oog: '#24262e' },
  },
  speeltuin: {
    lucht: ['#3a8ad8', '#7ac0f0', '#bfe4ff', '#fff2c0'],
    ver: ['#7ac06a', '#3a8a4a'], mid: ['#5aae5a', '#2a7a3a'], nabij: ['#3a8a3a', '#1a5a2a'],
    boom: '#1e5a2a', steen: ['#d1495b', '#7a1a2a'], top: '#f2c14e',
    pilaar: ['#3cc8bb', '#1f6f84'], kasteel: '#3a8a4a', sneeuw: false,
    kruiper: { lijf: ['#ff8ac8', '#c0508a'], stekel: '#f2c14e', oog: '#1b2f6b' },
    licht: { lijf: ['#fff2a0', '#f2a33a'], staart: 'rgba(255,240,160,.75)', oog: '#1b2f6b' },
  },
  maan: {
    lucht: ['#020208', '#0a0a1e', '#14142e', '#24243e'],
    ver: ['#6a6a7a', '#3a3a4a'], mid: ['#55556a', '#2a2a3a'], nabij: ['#44445a', '#1e1e2a'],
    boom: '#14141e', steen: ['#9a9aaa', '#5a5a6a'], top: '#7aff8a',
    pilaar: ['#7a7a8a', '#3a3a4a'], kasteel: '#2a2a3a', sneeuw: false,
    kruiper: { lijf: ['#7aff8a', '#2a8a3a'], stekel: '#c8a0ff', oog: '#1b2f6b' },
    licht: { lijf: ['#c8a0ff', '#5a2aa8'], staart: 'rgba(160,120,255,.75)', oog: '#7aff8a' },
  },
  // het allerlaatste level: de vulkaangrot van Alexander de Terminator
  alexgrot: {
    lucht: ['#060103', '#1e0406', '#4a0a0a', '#8a2010'],
    ver: ['#3a0e10', '#1a0406'], mid: ['#2e0a0c', '#140304'], nabij: ['#220608', '#0c0203'],
    boom: '#080102', steen: ['#4a4a56', '#1a1a22'], top: '#ff3a2c',
    pilaar: ['#4a4a56', '#1a1a22'], kasteel: '#1a0406', sneeuw: false,
    kruiper: { lijf: ['#3a3a44', '#16161c'], stekel: '#ff3a2c', oog: '#ff3a2c' },
    licht: { lijf: ['#ffd27a', '#c83a1c'], staart: 'rgba(255,60,44,.8)', oog: '#fff6d8' },
  },
  savanne: {
    lucht: ['#3a1a3a', '#c8504a', '#f2a03c', '#ffe08a'],
    ver: ['#c8705a', '#8a3a3a'], mid: ['#b8803a', '#7a4a1c'], nabij: ['#8a5a1c', '#4a2a0e'],
    boom: '#2a1a0e', steen: ['#c8924a', '#7a4a1c'], top: '#c8c84a',
    pilaar: ['#b8864a', '#6b4a1c'], kasteel: '#7a3a3a', sneeuw: false,
    kruiper: { lijf: ['#c8924a', '#6b3a12'], stekel: '#3a2a1a', oog: '#d1495b' },
    licht: { lijf: ['#ffe08a', '#c87a1c'], staart: 'rgba(255,200,100,.75)', oog: '#3a2a1a' },
  },
};

// schaal > 1 = scherper plaatje (bijvoorbeeld voor groot op het titelscherm)
function tekenTextuur(scene, key, w, h, tekenFn, schaal) {
  if (scene.textures.exists(key)) return key;
  const s = schaal || 1;
  const t = scene.textures.createCanvas(key, Math.round(w * s), Math.round(h * s));
  const ctx = t.getContext();
  ctx.scale(s, s);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  tekenFn(ctx, w, h);
  t.refresh();
  return key;
}

function rondRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function krul(ctx, x, y, r, richting) {
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 3.2; a += 0.15) {
    const rr = r * (1 - a / (Math.PI * 3.6));
    const px = x + Math.cos(a) * rr * richting, py = y + Math.sin(a) * rr;
    if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

// Golvende berglijn die naadloos herhaalt (k = aantal golven per breedte)
function rug(x, breedte, golven) {
  let y = 0;
  for (const [k, amp, fase] of golven) y += Math.sin(TAU * k * x / breedte + fase) * amp;
  return y;
}

// ---------- DE HELD ----------
// Een mannetje met een bierfles als muts en op zijn rug een bierblik als pijlenkoker.
// Het plaatje is 56 breed en 88 hoog: bovenin is ruimte voor de bierfles.

// Skins: andere kleren en een ander flesje. Win je in de shop aan het draairad.
const SKINS = [
  { id: 'standaard', naam: 'Gewoon', tuniek: ['#1f8a80', '#3cc8bb'], mouw: '#2aa597', broek: '#1b2f6b', fles: ['#c9771f', '#6b3a0e'], etiket: '#f3ead6', band: '#d1495b' },
  { id: 'groen', naam: 'Groene Fles', tuniek: ['#2f6b2a', '#5fae4e'], mouw: '#4f9a40', broek: '#3a2a1a', fles: ['#5cc455', '#1f5a1c'], etiket: '#f3ead6', band: '#d1495b' },
  { id: 'goud', naam: 'Goudkoning', tuniek: ['#b8862a', '#f2c14e'], mouw: '#d9a53a', broek: '#5a1a2a', fles: ['#ffe08a', '#c8921c'], etiket: '#d1495b', band: '#0a1028' },
  { id: 'nacht', naam: 'Nachtridder', tuniek: ['#141a3a', '#2c4387'], mouw: '#24366e', broek: '#0d0f1e', fles: ['#4a4a5e', '#101018'], etiket: '#f2c14e', band: '#7a5cff' },
  { id: 'duivel', naam: 'Rode Duivel', tuniek: ['#8a1a2a', '#d1495b'], mouw: '#b8343f', broek: '#2a0a10', fles: ['#ff6a4a', '#8a1a10'], etiket: '#0a1028', band: '#f2c14e' },
  { id: 'ijs', naam: 'IJskoud', tuniek: ['#6aa8d8', '#cfeaff'], mouw: '#9ccbec', broek: '#2c4387', fles: ['#e8f6ff', '#7ab8e0'], etiket: '#2c4387', band: '#3cc8bb' },
  { id: 'roze', naam: 'Roze Rosé', tuniek: ['#c04a8a', '#ff8ac8'], mouw: '#e070aa', broek: '#4a1a3a', fles: ['#ffb0d8', '#c0508a'], etiket: '#fff6fb', band: '#7a2a5a' },
  // baas-skins: alleen te winnen door die eindbaas te verslaan (met een gouden kroon)
  { id: 'padkoning', naam: 'Padkoning', baas: 'pad', kroon: true, tuniek: ['#2f6b2a', '#7cc45a'], mouw: '#5fae4e', broek: '#1f3a1a', fles: ['#9ad86e', '#2f6b2a'], etiket: '#f2c14e', band: '#d1495b' },
  { id: 'ijsbeer', naam: 'IJsbeer', baas: 'beer', kroon: true, tuniek: ['#cfe0f0', '#ffffff'], mouw: '#e8f0f8', broek: '#6a8ab8', fles: ['#ffffff', '#9ac0e0'], etiket: '#1b2f6b', band: '#3cc8bb' },
  { id: 'bokkenrijder', naam: 'Bokkenrijder', baas: 'geit', kroon: true, tuniek: ['#6b4a2a', '#b8864a'], mouw: '#9a6a3a', broek: '#3a2a1a', fles: ['#c98a4a', '#6b3a12'], etiket: '#f3ead6', band: '#2c4387' },
  { id: 'grottenjager', naam: 'Grottenjager', baas: 'salamander', kroon: true, tuniek: ['#3a2a4a', '#7ae0c8'], mouw: '#5ab8a8', broek: '#1a1428', fles: ['#ff9a3c', '#3a1a0a'], etiket: '#1a1428', band: '#f2c14e' },
  { id: 'flipperkoning', naam: 'Flipperkoning', baas: 'lepelaar', kroon: true, tuniek: ['#c04a8a', '#ffb0d8'], mouw: '#e88ab8', broek: '#6b3a12', fles: ['#ffd0e8', '#c0508a'], etiket: '#3a2a1a', band: '#f2a03c' },
  { id: 'barkeeper', naam: 'Barkeeper', baas: 'kroegbaas', kroon: true, tuniek: ['#1a1a1a', '#3a3a3a'], mouw: '#f3ead6', broek: '#1a1a1a', fles: ['#c9771f', '#6b3a0e'], etiket: '#f3ead6', band: '#d1495b' },
  { id: 'brouwmeester', naam: 'Brouwmeester', baas: 'machine', kroon: true, tuniek: ['#5a5e6a', '#9aa4b8'], mouw: '#7a8090', broek: '#2a2e3a', fles: ['#f2a33a', '#7a3a0a'], etiket: '#2a2e3a', band: '#f2a33a' },
  { id: 'clown', naam: 'Clown', baas: 'clown', kroon: true, tuniek: ['#d1495b', '#f2c14e'], mouw: '#3cc8bb', broek: '#7a5cff', fles: ['#ff8ac8', '#c0508a'], etiket: '#fff', band: '#3cc8bb' },
  { id: 'astronaut', naam: 'Astronaut', baas: 'moederschip', kroon: true, tuniek: ['#cfd6e6', '#ffffff'], mouw: '#e6ecf5', broek: '#9aa4b8', fles: ['#7aff8a', '#2a8a3a'], etiket: '#1b2f6b', band: '#d1495b' },
  { id: 'drakendoder', naam: 'Drakendoder', baas: 'draak', kroon: true, tuniek: ['#2a0a10', '#8a1a2a'], mouw: '#5a1020', broek: '#0d0f1e', fles: ['#ff6a2c', '#5a0a06'], etiket: '#f2c14e', band: '#0a1028' },
  { id: 'zombie', naam: 'Zombie', tuniek: ['#4a5a3a', '#7a8a5a'], mouw: '#6a7a4a', broek: '#3a2a2a', fles: ['#a0581c', '#4a2a0a'], etiket: '#c8c8a0', band: '#5a8a3a', huid: '#9cc48a' },
];
function skinVan(id) { return SKINS.find(k => k.id === id) || SKINS[0]; }
const POSES = {
  sp_stil: {},
  sp_loop0: { been1: 0.65, been2: -0.6, arm: -0.5 },
  sp_loop1: { been1: 0.2, been2: -0.15, arm: -0.1, bob: -1.5 },
  sp_loop2: { been1: -0.6, been2: 0.65, arm: 0.5 },
  sp_loop3: { been1: -0.15, been2: 0.2, arm: 0.1, bob: -1.5 },
  sp_spring: { been1: -0.7, been2: 0.4, arm: 2.5 },
  sp_val: { been1: 0.35, been2: -0.3, arm: 2.0 },
  sp_dash: { been1: -1.2, been2: -0.8, arm: 1.5 },
  sp_zweef: { been1: 0.25, been2: -0.15, armenWijd: true },
  sp_muur: { been1: 0.6, been2: 0.25, arm: 2.7 },
  sp_slash: { been1: 0.45, been2: -0.35, arm: 1.75, zwaard: true },
  sp_schiet: { been1: 0.35, been2: -0.35, arm: 1.57, boog: true },
  sp_smash: { been1: 0.1, been2: -0.1, arm: 3.0, zwaard: true },
};

function tekenSpeler(ctx, pose, skin) {
  const P = Object.assign({ been1: 0.15, been2: -0.15, arm: 0.3, bob: 0 }, pose);
  const K = skin || SKINS[0];
  const huid = K.huid || '#f1c49b';
  ctx.save();
  ctx.translate(0, 16 + P.bob);

  // pijlenkoker: een bierblik op de rug
  ctx.save();
  ctx.translate(19, 40);
  ctx.rotate(-0.35);
  for (const dx of [-3, 1, 4]) {
    ctx.strokeStyle = '#7a4a1c'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(dx, -10); ctx.lineTo(dx, -22); ctx.stroke();
    ctx.fillStyle = '#d1495b'; ctx.strokeStyle = INKT; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(dx - 2.2, -19); ctx.lineTo(dx, -26); ctx.lineTo(dx + 2.2, -19); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = '#d1495b'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.8;
  rondRect(ctx, -6, -12, 12, 24, 2.5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e';
  ctx.fillRect(-5.5, -10, 11, 3); ctx.fillRect(-5.5, 7, 11, 3);
  ctx.fillStyle = '#cfd6e6';
  ctx.beginPath(); ctx.ellipse(0, -12, 6, 1.8, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.restore();

  // benen
  const been = (x, y, a) => {
    const fx = x + Math.sin(a) * 15, fy = y + Math.cos(a) * 15;
    ctx.strokeStyle = INKT; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(fx, fy); ctx.stroke();
    ctx.strokeStyle = K.broek; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(fx, fy); ctx.stroke();
    ctx.fillStyle = '#4a2a12'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(fx + 2, fy + 1, 5, 3, 0, 0, TAU); ctx.fill(); ctx.stroke();
  };
  been(25, 52, P.been2);
  been(31, 52, P.been1);

  // lijf (tuniek)
  const tg = ctx.createLinearGradient(19, 0, 37, 0);
  tg.addColorStop(0, K.tuniek[0]); tg.addColorStop(0.5, K.tuniek[1]); tg.addColorStop(1, K.tuniek[0]);
  ctx.fillStyle = tg; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  rondRect(ctx, 19, 32, 18, 22, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e'; ctx.fillRect(19.8, 45, 16.4, 3);
  ctx.fillStyle = '#b8862a'; ctx.fillRect(27, 44.5, 3, 4);

  // hoofd
  ctx.fillStyle = huid; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(29, 23, 9.5, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(232,120,110,.5)';
  ctx.beginPath(); ctx.arc(33.5, 27, 2, 0, TAU); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(33, 23.5, 2.3, 2.9, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = INKT;
  ctx.beginPath(); ctx.arc(33.8, 23.9, 1.4, 0, TAU); ctx.fill();
  ctx.strokeStyle = INKT; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(31.5, 27, 2.4, 0.3, 1.6); ctx.stroke();

  // muts: een echte bierfles die op zijn hoofd staat
  const fg = ctx.createLinearGradient(19, 0, 39, 0);
  fg.addColorStop(0, K.fles[1]); fg.addColorStop(0.45, K.fles[0]); fg.addColorStop(1, K.fles[1]);
  ctx.fillStyle = fg; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(19.5, 20); ctx.lineTo(19.5, 6);
  ctx.quadraticCurveTo(19.5, -0.5, 25.8, -3); ctx.lineTo(25.8, -11);
  ctx.lineTo(32.2, -11); ctx.lineTo(32.2, -3);
  ctx.quadraticCurveTo(38.5, -0.5, 38.5, 6); ctx.lineTo(38.5, 20);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // glans op het glas
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(22.3, 16); ctx.lineTo(22.3, 5); ctx.quadraticCurveTo(22.6, 1.5, 26.5, -0.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(27.6, -9); ctx.lineTo(27.6, -4); ctx.stroke();
  // etiket met een streep en een sterretje
  ctx.fillStyle = K.etiket; ctx.strokeStyle = INKT; ctx.lineWidth = 1.3;
  rondRect(ctx, 21, 6.5, 16, 8.5, 1.8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = K.band; ctx.fillRect(21.6, 9.6, 14.8, 2.4);
  ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.arc(29, 10.8, 1.7, 0, TAU); ctx.fill();
  // folie om de hals
  ctx.fillStyle = K.etiket; ctx.fillRect(26.4, -7.5, 5.2, 2.6);
  // kroonkurk bovenop
  ctx.fillStyle = '#f2c14e'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.3;
  ctx.beginPath();
  for (let i = 0; i <= 8; i++) { const xx = 25 + i; ctx.lineTo(xx, i % 2 ? -12.2 : -14.6); }
  ctx.lineTo(33, -11); ctx.lineTo(25, -11); ctx.closePath(); ctx.fill(); ctx.stroke();
  // baas-skin: een gouden kroontje op de fles
  if (K.kroon) {
    ctx.fillStyle = '#ffd24a'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(21, 3); ctx.lineTo(21, -5); ctx.lineTo(24.5, -1); ctx.lineTo(29, -8); ctx.lineTo(33.5, -1); ctx.lineTo(37, -5); ctx.lineTo(37, 3); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.arc(29, 0, 1.8, 0, TAU); ctx.fill();
  }
  // rand van de muts over het voorhoofd
  ctx.fillStyle = K.fles[1]; ctx.lineWidth = 2;
  rondRect(ctx, 17.5, 18.5, 23, 4.5, 2.2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e';
  ctx.beginPath(); ctx.arc(34, 20.7, 1.8, 0, TAU); ctx.fill();

  // armen
  const schouder = { x: 31, y: 36 };
  const arm = (hx, hy) => {
    ctx.strokeStyle = INKT; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(schouder.x, schouder.y); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = K.mouw; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(schouder.x, schouder.y); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.fillStyle = huid; ctx.strokeStyle = INKT; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(hx, hy, 2.8, 0, TAU); ctx.fill(); ctx.stroke();
  };
  if (P.armenWijd) {
    arm(14, 33); arm(47, 33);
  } else {
    const hx = schouder.x + Math.sin(P.arm) * 12, hy = schouder.y + Math.cos(P.arm) * 12;
    if (P.boog) {
      ctx.strokeStyle = '#8a4a1c'; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.arc(hx - 5, hy, 12, -1.1, 1.1); ctx.stroke();
      ctx.strokeStyle = '#f3ead6'; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(hx - 5 + Math.cos(-1.1) * 12, hy + Math.sin(-1.1) * 12); ctx.lineTo(hx - 5 + Math.cos(1.1) * 12, hy + Math.sin(1.1) * 12); ctx.stroke();
    }
    arm(hx, hy);
    if (P.zwaard) {
      const ex = hx + Math.sin(P.arm) * 17, ey = hy + Math.cos(P.arm) * 17;
      ctx.strokeStyle = INKT; ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.strokeStyle = '#e6ecf5'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.fillStyle = '#f2c14e';
      ctx.beginPath(); ctx.arc(hx, hy, 2.2, 0, TAU); ctx.fill();
    }
  }
  ctx.restore();
}

// ---------- KLEINE DINGEN ----------
function tekenShotje(ctx) {
  const gl = ctx.createRadialGradient(12, 14, 2, 12, 14, 12);
  gl.addColorStop(0, 'rgba(242,193,78,.55)'); gl.addColorStop(1, 'rgba(242,193,78,0)');
  ctx.fillStyle = gl; ctx.fillRect(0, 0, 24, 28);
  const glas = () => { ctx.beginPath(); ctx.moveTo(5, 5); ctx.lineTo(19, 5); ctx.lineTo(17, 23); ctx.lineTo(7, 23); ctx.closePath(); };
  glas(); ctx.fillStyle = 'rgba(200,230,255,.35)'; ctx.fill();
  ctx.save(); glas(); ctx.clip();
  const bg = ctx.createLinearGradient(0, 9, 0, 23);
  bg.addColorStop(0, '#f6b544'); bg.addColorStop(1, '#b8651a');
  ctx.fillStyle = bg; ctx.fillRect(0, 10, 24, 14);
  ctx.fillStyle = '#fffaf0'; ctx.fillRect(0, 7, 24, 4);
  ctx.restore();
  glas(); ctx.strokeStyle = INKT; ctx.lineWidth = 1.8; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(8, 9); ctx.lineTo(9, 20); ctx.stroke();
}

// Een kebabrol (dürüm): opgerold brood met vlees, sla en tomaat, onderin een papiertje
function tekenKebab(ctx) {
  ctx.save();
  ctx.translate(23, 18); ctx.rotate(-0.35);
  // brood
  const bg = ctx.createLinearGradient(0, -9, 0, 9);
  bg.addColorStop(0, '#f6dca0'); bg.addColorStop(1, '#c8924a');
  ctx.fillStyle = bg; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  rondRect(ctx, -19, -8, 34, 16, 8); ctx.fill(); ctx.stroke();
  // bruine bakvlekjes
  ctx.fillStyle = 'rgba(140,80,30,.6)';
  for (const [x, y] of [[-10, -3], [-3, 3], [4, -4], [-14, 3]]) { ctx.beginPath(); ctx.arc(x, y, 1.4, 0, TAU); ctx.fill(); }
  // vulling aan de open kant: sla, tomaat, vlees
  ctx.lineWidth = 1.3;
  ctx.fillStyle = '#5fae4e'; ctx.beginPath(); ctx.ellipse(16, -5, 4, 3, 0.4, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#8a4a1c'; ctx.beginPath(); ctx.ellipse(17, 0, 4.5, 4.5, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.arc(15.5, 5, 2.6, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f3ead6'; ctx.beginPath(); ctx.arc(19.5, -3, 1.6, 0, TAU); ctx.fill();
  // papiertje
  ctx.fillStyle = '#f3ead6'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(-20, -9); ctx.lineTo(-8, -9); ctx.lineTo(-11, 9); ctx.lineTo(-20, 9); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d1495b'; ctx.fillRect(-18, -2, 8, 3);
  ctx.restore();
}

function tekenHart(ctx, vol) {
  ctx.save(); ctx.translate(14, 13); ctx.scale(0.55, 0.55);
  ctx.fillStyle = vol ? '#d1495b' : 'rgba(255,255,255,.18)';
  ctx.strokeStyle = INKT; ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.bezierCurveTo(-26, -2, -14, -24, 0, -10);
  ctx.bezierCurveTo(14, -24, 26, -2, 0, 14);
  ctx.fill(); ctx.stroke();
  if (vol) { ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(-9, -8, 3.5, 0, TAU); ctx.fill(); }
  ctx.restore();
}

function flesPad(ctx) {
  ctx.beginPath();
  ctx.moveTo(11, 4); ctx.lineTo(21, 4); ctx.lineTo(21, 22);
  ctx.bezierCurveTo(21, 28, 29, 30, 29, 38);
  ctx.lineTo(29, 70); ctx.quadraticCurveTo(29, 74, 25, 74);
  ctx.lineTo(7, 74); ctx.quadraticCurveTo(3, 74, 3, 70);
  ctx.lineTo(3, 38); ctx.bezierCurveTo(3, 30, 11, 28, 11, 22);
  ctx.closePath();
}

function tekenSlash(ctx) {
  ctx.save();
  ctx.shadowColor = '#f2c14e'; ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(20, 50, 46, -1.25, 1.25);
  ctx.arc(28, 50, 32, 1.1, -1.1, true);
  ctx.closePath();
  const g = ctx.createLinearGradient(20, 0, 70, 0);
  g.addColorStop(0, 'rgba(255,246,216,.2)'); g.addColorStop(1, 'rgba(255,250,235,.95)');
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.restore();
}

function tekenPijl(ctx, boem) {
  ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.moveTo(5, 6); ctx.lineTo(26, 6); ctx.stroke();
  ctx.fillStyle = '#d1495b'; ctx.strokeStyle = INKT; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(2, 2); ctx.lineTo(9, 6); ctx.lineTo(2, 10); ctx.lineTo(5, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
  if (boem) {
    ctx.shadowColor = '#ff5a3c'; ctx.shadowBlur = 8;
    ctx.fillStyle = '#ff7a3c';
    ctx.beginPath(); ctx.arc(28, 6, 4.5, 0, TAU); ctx.fill();
    ctx.shadowBlur = 0; ctx.stroke();
    ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.arc(29, 5, 1.6, 0, TAU); ctx.fill();
  } else {
    ctx.fillStyle = '#e6ecf5';
    ctx.beginPath(); ctx.moveTo(25, 2); ctx.lineTo(33, 6); ctx.lineTo(25, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
}

function tekenPoort(ctx) {
  const gl = ctx.createRadialGradient(60, 115, 5, 60, 115, 70);
  gl.addColorStop(0, 'rgba(160,255,245,.95)'); gl.addColorStop(1, 'rgba(60,200,187,.15)');
  ctx.fillStyle = gl;
  ctx.beginPath(); ctx.moveTo(26, 180); ctx.lineTo(26, 80); ctx.arc(60, 80, 34, Math.PI, 0); ctx.lineTo(94, 180); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2;
  krul(ctx, 60, 118, 24, 1);
  const g = ctx.createLinearGradient(0, 0, 120, 0);
  g.addColorStop(0, '#b8862a'); g.addColorStop(0.5, '#f6d27a'); g.addColorStop(1, '#b8862a');
  ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(8, 180); ctx.lineTo(8, 80); ctx.arc(60, 80, 52, Math.PI, 0); ctx.lineTo(112, 180);
  ctx.lineTo(94, 180); ctx.lineTo(94, 80); ctx.arc(60, 80, 34, 0, Math.PI, true); ctx.lineTo(26, 180);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d1495b';
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 6 : 13; ctx.lineTo(60 + Math.cos(a) * r, 20 + Math.sin(a) * r); }
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

// ---------- ACHTERGRONDEN ----------
function tekenLucht(ctx, k, id) {
  const g = ctx.createLinearGradient(0, 0, 0, 540);
  [0, 0.45, 0.78, 1].forEach((s, i) => g.addColorStop(s, k.lucht[i]));
  ctx.fillStyle = g; ctx.fillRect(0, 0, 960, 540);
  if (id === 'alexgrot') {
    // vulkaangrot: gloeiende lavavonkjes en overal rode robotogen in het donker
    for (let i = 0; i < 60; i++) {
      const x = (i * 397) % 960, y = 60 + (i * 151) % 440;
      ctx.fillStyle = `rgba(255,${90 + (i % 5) * 30},40,${0.25 + (i % 4) * 0.12})`;
      ctx.beginPath(); ctx.arc(x, y, 1 + (i % 3), 0, TAU); ctx.fill();
    }
    ctx.save(); ctx.shadowColor = '#ff2a1c'; ctx.shadowBlur = 8; ctx.fillStyle = '#ff3a2c';
    for (let i = 0; i < 14; i++) {
      const x = 40 + (i * 271) % 900, y = 80 + (i * 113) % 300;
      ctx.fillRect(x, y, 6, 3); ctx.fillRect(x + 12, y, 6, 3);
    }
    ctx.restore();
    const gl = ctx.createLinearGradient(0, 380, 0, 540);
    gl.addColorStop(0, 'rgba(255,90,30,0)'); gl.addColorStop(1, 'rgba(255,90,30,.35)');
    ctx.fillStyle = gl; ctx.fillRect(0, 380, 960, 160);
    return;
  }
  if (id === 'grot') {
    // geen lucht in een grot: gloeiende kristallen in het donker
    for (let i = 0; i < 40; i++) {
      const x = (i * 397) % 960, y = 120 + (i * 151) % 380, r = 2 + (i % 4);
      ctx.fillStyle = ['rgba(122,224,200,.5)', 'rgba(180,140,255,.45)', 'rgba(242,193,78,.4)'][i % 3];
      ctx.beginPath(); ctx.moveTo(x, y - r * 2.5); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r * 1.2); ctx.lineTo(x - r, y); ctx.closePath(); ctx.fill();
    }
    return;
  }
  const sterren = ['kroeg', 'fabriek', 'speeltuin'].includes(id) ? 0 : id === 'savanne' ? 15 : id === 'maan' ? 160 : 80;
  for (let i = 0; i < sterren; i++) {
    ctx.fillStyle = `rgba(255,245,220,${0.25 + ((i * 7) % 5) / 8})`;
    ctx.beginPath(); ctx.arc((i * 397) % 960, (i * 151) % 280, (i % 3) * 0.5 + 0.5, 0, TAU); ctx.fill();
  }
  if (id === 'ijs') {
    // noorderlicht
    for (let b = 0; b < 3; b++) {
      ctx.strokeStyle = ['rgba(60,200,187,.22)', 'rgba(120,255,180,.16)', 'rgba(160,120,255,.12)'][b];
      ctx.lineWidth = 40 - b * 10;
      ctx.beginPath();
      for (let x = -20; x <= 980; x += 10) ctx.lineTo(x, 90 + b * 35 + Math.sin(x / 120 + b) * 30 + Math.sin(x / 47) * 8);
      ctx.stroke();
    }
  }
  const zon = { rivier: [720, 110, 42, '#fbe7b0', true], berg: [260, 300, 70, '#ffd27a', false],
    ijs: [780, 80, 30, '#f4fbff', true], vulkaan: [700, 320, 90, '#ff9a3c', false],
    savanne: [480, 330, 95, '#ffd27a', false], kroeg: [480, 40, 26, '#ffd27a', false],
    fabriek: [180, 80, 34, '#ff9a3c', false], speeltuin: [800, 90, 50, '#fff2a0', false],
    maan: [770, 110, 48, '#3a8fd0', false] }[id];
  const [mx, my, mr, kleur, sikkel] = zon;
  const gl = ctx.createRadialGradient(mx, my, mr * 0.4, mx, my, mr * 4);
  gl.addColorStop(0, id === 'vulkaan' || id === 'berg' || id === 'savanne' ? 'rgba(255,170,120,.55)' : 'rgba(255,230,160,.45)');
  gl.addColorStop(1, 'rgba(255,230,160,0)');
  ctx.fillStyle = gl; ctx.fillRect(0, 0, 960, 540);
  ctx.fillStyle = kleur;
  ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU);
  // maansikkel: tweede cirkel andersom tekenen maakt er een gat in
  if (sikkel) ctx.arc(mx + mr * 0.4, my - mr * 0.24, mr * 0.92, 0, TAU, true);
  ctx.fill();
  if (id === 'maan') {
    // de aarde: groene landen op de blauwe bol
    ctx.fillStyle = '#5fae4e';
    for (const [x, y, r] of [[755, 98, 14], [785, 120, 11], [770, 135, 7]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  }
  if (id === 'kroeg') {
    // hanglampen
    for (const x of [140, 400, 660, 880]) {
      ctx.strokeStyle = '#0a0503'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 60); ctx.stroke();
      const lg = ctx.createRadialGradient(x, 70, 4, x, 70, 120);
      lg.addColorStop(0, 'rgba(255,210,120,.5)'); lg.addColorStop(1, 'rgba(255,210,120,0)');
      ctx.fillStyle = lg; ctx.fillRect(x - 120, 0, 240, 240);
      ctx.fillStyle = '#c8781c'; ctx.beginPath(); ctx.moveTo(x - 16, 72); ctx.lineTo(x - 6, 58); ctx.lineTo(x + 6, 58); ctx.lineTo(x + 16, 72); ctx.closePath(); ctx.fill();
    }
  }
  if (id === 'vulkaan') {
    ctx.fillStyle = 'rgba(20,6,10,.35)';
    for (const [cx, cy, rx] of [[200, 120, 200], [600, 80, 240], [880, 160, 160]]) { ctx.beginPath(); ctx.ellipse(cx, cy, rx, rx * 0.22, 0, 0, TAU); ctx.fill(); }
  }
  ctx.fillStyle = 'rgba(255,255,255,.06)';
  for (const [cx, cy, rx] of [[150, 90, 120], [520, 60, 160], [860, 200, 110]]) {
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, rx * 0.18, 0, 0, TAU); ctx.fill();
  }
}

function tekenLaag(ctx, W, H, basis, golven, kleuren, sneeuw) {
  const g = ctx.createLinearGradient(0, basis - 90, 0, H);
  g.addColorStop(0, kleuren[0]); g.addColorStop(1, kleuren[1]);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 4) ctx.lineTo(x, basis + rug(x, W, golven));
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  if (sneeuw) {
    ctx.save(); ctx.clip();
    const s = ctx.createLinearGradient(0, basis - 100, 0, basis + 10);
    s.addColorStop(0, 'rgba(240,248,255,.95)'); s.addColorStop(1, 'rgba(240,248,255,0)');
    ctx.fillStyle = s; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

function tekenKasteel(ctx, x, y, kleur) {
  ctx.fillStyle = kleur;
  const torens = [[-48, 56, 18], [-22, 96, 24], [8, 72, 19], [35, 48, 16]];
  for (const [dx, h, w] of torens) {
    ctx.fillRect(x + dx, y - h, w, h + 40);
    ctx.beginPath();
    ctx.moveTo(x + dx - 3, y - h);
    ctx.quadraticCurveTo(x + dx + w / 2, y - h - 8, x + dx + w / 2, y - h - w * 1.6);
    ctx.quadraticCurveTo(x + dx + w / 2, y - h - 8, x + dx + w + 3, y - h);
    ctx.fill();
  }
  ctx.save();
  ctx.shadowColor = '#f2c14e'; ctx.shadowBlur = 10; ctx.fillStyle = '#f2c14e';
  for (const [dx, h, w] of torens) { ctx.beginPath(); ctx.ellipse(x + dx + w / 2, y - h + 18, 2.5, 5, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
}

function tekenAchtergronden(scene, id) {
  const k = THMA(id);
  tekenTextuur(scene, 'lucht_' + id, 960, 540, ctx => tekenLucht(ctx, k, id));
  tekenTextuur(scene, 'ver_' + id, 2048, 512, ctx => {
    const golven = id === 'rivier' ? [[3, 45, 0.3], [7, 22, 1.2], [17, 8, 2]]
      : id === 'vulkaan' ? [[2, 90, 0.9], [5, 30, 0.2], [13, 12, 1.4]] : [[3, 75, 0.5], [8, 32, 1.1], [19, 10, 2.4]];
    const basis = id === 'rivier' ? 250 : 270;
    tekenLaag(ctx, 2048, 512, basis, golven, k.ver, k.sneeuw);
    if (id === 'vulkaan') {
      // gloeiende lavastromen op de vulkanen
      ctx.strokeStyle = 'rgba(255,122,44,.7)'; ctx.lineWidth = 4;
      for (const x0 of [300, 1100, 1700]) {
        const y0 = basis + rug(x0, 2048, golven);
        ctx.beginPath(); ctx.moveTo(x0, y0);
        for (let s = 1; s < 12; s++) ctx.lineTo(x0 + Math.sin(s) * 14, y0 + s * 18);
        ctx.stroke();
      }
    }
    if (['rivier', 'ijs', 'berg', 'vulkaan'].includes(id)) for (const x of [480, 1450]) tekenKasteel(ctx, x, basis + rug(x, 2048, golven) + 8, k.kasteel);
    if (id === 'kroeg') {
      // planken met flessen
      for (let x = 20; x < 2040; x += 26) {
        const y = basis - 60 + ((x / 26) % 2) * 2;
        ctx.fillStyle = ['#2a5a2a', '#6b3a12', '#5a2a4a', '#2a3a6a'][(x / 26) % 4 | 0];
        ctx.fillRect(x, y - 30, 12, 30); ctx.fillRect(x + 4, y - 42, 4, 12);
      }
      ctx.fillStyle = '#2a140a'; ctx.fillRect(0, basis - 60, 2048, 8);
    }
    if (id === 'fabriek') {
      // schoorstenen met rook
      for (const x of [200, 640, 1100, 1560, 1900]) {
        const y = basis + rug(x, 2048, golven);
        ctx.fillStyle = k.ver[1]; ctx.fillRect(x - 18, y - 190, 36, 200);
        ctx.fillStyle = 'rgba(200,200,210,.18)';
        for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(x + i * 14, y - 210 - i * 26, 22 + i * 6, 0, TAU); ctx.fill(); }
      }
    }
    if (id === 'speeltuin') {
      // een reuzenrad
      for (const x0 of [500, 1500]) {
        const y0 = basis - 40;
        ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(x0, y0, 110, 0, TAU); ctx.stroke();
        for (let i = 0; i < 8; i++) { const a = i * TAU / 8; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + Math.cos(a) * 110, y0 + Math.sin(a) * 110); ctx.stroke();
          ctx.fillStyle = ['#d1495b', '#f2c14e', '#3cc8bb', '#7a5cff'][i % 4]; ctx.fillRect(x0 + Math.cos(a) * 110 - 10, y0 + Math.sin(a) * 110, 20, 16); }
      }
    }
    if (id === 'maan') {
      // kraters
      ctx.fillStyle = 'rgba(20,20,30,.35)';
      for (let x = 60; x < 2040; x += 140 + (x * 7) % 90) { const y = basis + rug(x, 2048, golven) + 30; ctx.beginPath(); ctx.ellipse(x, y, 30 + (x % 30), 8, 0, 0, TAU); ctx.fill(); }
    }
    if (id === 'alexgrot') {
      // lavastromen langs de rotswand, en grote schermen met een zonnebril erop
      ctx.strokeStyle = 'rgba(255,90,30,.75)'; ctx.lineWidth = 5;
      for (const x0 of [180, 760, 1320, 1880]) {
        const y0 = basis + rug(x0, 2048, golven);
        ctx.beginPath(); ctx.moveTo(x0, y0);
        for (let i = 1; i < 14; i++) ctx.lineTo(x0 + Math.sin(i * 1.3) * 12, y0 + i * 18);
        ctx.stroke();
      }
      for (const x of [480, 1560]) {
        const y = basis + rug(x, 2048, golven) - 30;
        ctx.fillStyle = '#16161c'; ctx.fillRect(x - 70, y - 60, 140, 84);
        ctx.fillStyle = '#3a0a0a'; ctx.fillRect(x - 62, y - 52, 124, 68);
        ctx.fillStyle = '#ff3a2c';
        ctx.beginPath(); ctx.ellipse(x - 24, y - 20, 20, 11, 0, 0, TAU); ctx.ellipse(x + 24, y - 20, 20, 11, 0, 0, TAU); ctx.fill();
        ctx.fillRect(x - 6, y - 23, 12, 4);
        ctx.fillStyle = '#16161c'; ctx.fillRect(x - 4, y + 24, 8, 40);
      }
    }
    if (id === 'grot' || id === 'alexgrot') {
      // stalagmieten in de verte
      ctx.fillStyle = k.ver[1];
      for (let x = 30; x < 2040; x += 90 + (x * 7) % 60) {
        const h = 120 + (x * 13) % 140, y = basis + rug(x, 2048, golven) + 20;
        ctx.beginPath(); ctx.moveTo(x - 22, y); ctx.lineTo(x, y - h); ctx.lineTo(x + 22, y); ctx.closePath(); ctx.fill();
      }
    }
  });
  tekenTextuur(scene, 'mid_' + id, 2048, 256, ctx => tekenLaag(ctx, 2048, 256, 70, [[4, 30, 1], [9, 16, 2.2], [23, 6, 0.5]], k.mid, k.sneeuw));
  tekenTextuur(scene, 'nabij_' + id, 2048, 256, ctx => {
    const golven = [[6, 18, 0.7], [13, 9, 1.9]];
    tekenLaag(ctx, 2048, 256, 150, golven, k.nabij, false);
    ctx.fillStyle = k.boom;
    for (let x = 40; x < 2000; x += 70 + ((x * 7) % 45)) {
      const y = 156 + rug(x, 2048, golven), s = 0.8 + ((x * 13) % 5) * 0.08;
      if (id === 'rivier') {
        ctx.fillRect(x - 3 * s, y - 30 * s, 6 * s, 34 * s);
        for (const [dx, dy, r] of [[0, -46, 22], [-16, -34, 16], [16, -34, 16], [0, -70, 15]]) {
          ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); ctx.fill();
        }
      } else if (id === 'kroeg') {
        // biervaten en barkrukken
        if ((x / 7 | 0) % 2) { ctx.beginPath(); ctx.ellipse(x, y - 18 * s, 16 * s, 20 * s, 0, 0, TAU); ctx.fill(); }
        else { ctx.fillRect(x - 12 * s, y - 34 * s, 24 * s, 6 * s); ctx.fillRect(x - 2 * s, y - 30 * s, 4 * s, 32 * s); ctx.fillRect(x - 10 * s, y - 2, 20 * s, 3); }
      } else if (id === 'fabriek') {
        // tandwielen en buizen
        ctx.beginPath();
        for (let i = 0; i < 16; i++) { const a = i * TAU / 16, r = (i % 2 ? 22 : 28) * s; ctx.lineTo(x + Math.cos(a) * r, y - 30 * s + Math.sin(a) * r); }
        ctx.closePath(); ctx.fill();
        ctx.fillRect(x + 20 * s, y - 70 * s, 8 * s, 74 * s);
      } else if (id === 'speeltuin') {
        // schommels en een glijbaan
        ctx.strokeStyle = k.boom; ctx.lineWidth = 5 * s;
        ctx.beginPath(); ctx.moveTo(x - 24 * s, y); ctx.lineTo(x - 10 * s, y - 60 * s); ctx.lineTo(x + 10 * s, y - 60 * s); ctx.lineTo(x + 24 * s, y); ctx.stroke();
        ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - 60 * s); ctx.lineTo(x, y - 20 * s); ctx.stroke();
        ctx.fillRect(x - 8 * s, y - 20 * s, 16 * s, 4 * s);
      } else if (id === 'maan') {
        // buitenaardse plantjes met een bolletje
        ctx.fillRect(x - 2 * s, y - 50 * s, 4 * s, 54 * s);
        ctx.beginPath(); ctx.arc(x, y - 54 * s, 9 * s, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x - 10 * s, y - 28 * s, 10 * s, 4 * s, -0.5, 0, TAU); ctx.fill();
      } else if (id === 'savanne') {
        // acaciabomen met een platte kruin
        ctx.fillRect(x - 3 * s, y - 50 * s, 6 * s, 54 * s);
        ctx.beginPath(); ctx.moveTo(x, y - 30 * s); ctx.lineTo(x - 16 * s, y - 52 * s); ctx.lineTo(x - 12 * s, y - 54 * s); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x - 4 * s, y - 60 * s, 36 * s, 9 * s, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x - 20 * s, y - 56 * s, 16 * s, 6 * s, 0, 0, TAU); ctx.fill();
      } else if (id === 'vulkaan' || id === 'grot' || id === 'alexgrot') {
        // kale, puntige rotsen
        ctx.beginPath();
        ctx.moveTo(x - 20 * s, y + 4); ctx.lineTo(x - 6 * s, y - 50 * s); ctx.lineTo(x + 2 * s, y - 30 * s);
        ctx.lineTo(x + 10 * s, y - 64 * s); ctx.lineTo(x + 22 * s, y + 4);
        ctx.closePath(); ctx.fill();
      } else {
        for (let t = 0; t < 3; t++) {
          ctx.beginPath();
          ctx.moveTo(x - (22 - t * 5) * s, y - t * 22 * s);
          ctx.lineTo(x, y - (40 + t * 22) * s);
          ctx.lineTo(x + (22 - t * 5) * s, y - t * 22 * s);
          ctx.closePath(); ctx.fill();
          if (id === 'ijs') {
            ctx.fillStyle = 'rgba(244,251,255,.85)';
            ctx.beginPath(); ctx.moveTo(x - 8 * s, y - (28 + t * 22) * s); ctx.lineTo(x, y - (40 + t * 22) * s); ctx.lineTo(x + 8 * s, y - (28 + t * 22) * s); ctx.closePath(); ctx.fill();
            ctx.fillStyle = k.boom;
          }
        }
      }
    }
  });
  tekenTextuur(scene, 'bodem_' + id, 512, 64, ctx => {
    if (id !== 'berg' && id !== 'maan') {
      const kl = { rivier: ['#2aa9a6', '#14285e'], ijs: ['#a8e4f5', '#2a5a96'], vulkaan: ['#ffb03c', '#a8200c'],
        grot: ['#2a6a7a', '#0a1020'], savanne: ['#c8924a', '#5a3a1a'], kroeg: ['#f2a33a', '#6b2a0a'],
        fabriek: ['#f2a33a', '#7a3a0a'], speeltuin: ['#f2d08a', '#b8864a'], alexgrot: ['#ff6a1c', '#7a0a04'] }[id];
      const g = ctx.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, kl[0]); g.addColorStop(1, kl[1]);
      ctx.fillStyle = g; ctx.fillRect(0, 6, 512, 58);
      ctx.strokeStyle = 'rgba(230,255,250,.7)'; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= 512; x += 4) ctx.lineTo(x, 6 + Math.sin(TAU * x * 4 / 512) * 3);
      ctx.stroke();
      for (let r = 0; r < 4; r++) {
        ctx.strokeStyle = r % 2 ? 'rgba(242,193,78,.35)' : 'rgba(230,255,250,.3)';
        ctx.beginPath();
        for (let x = 0; x <= 512; x += 4) ctx.lineTo(x, 22 + r * 11 + Math.sin(TAU * x * (3 + r) / 512 + r) * 2.5);
        ctx.stroke();
      }
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, 'rgba(20,10,50,0)'); g.addColorStop(1, '#0a0620');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 64);
      ctx.fillStyle = 'rgba(220,210,255,.12)';
      for (const [x, y, r] of [[60, 30, 70], [250, 40, 90], [430, 28, 60]]) {
        for (const dx of [-512, 0, 512]) { ctx.beginPath(); ctx.ellipse(x + dx, y, r, 12, 0, 0, TAU); ctx.fill(); }
      }
    }
  });
}

function THMA(id) { return THEMA_KLEUR[id]; }

// Platform-plaatjes worden pas gemaakt als ze nodig zijn (elke breedte een eigen plaatje)
function platTex(scene, id, w) {
  const key = `plat_${id}_${w}`;
  return tekenTextuur(scene, key, w, 30, ctx => {
    const k = THMA(id), h = 30;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, k.steen[0]); g.addColorStop(1, k.steen[1]);
    ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
    rondRect(ctx, 1, 3, w - 2, h - 4, 9); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 1.5;
    for (let x = 30; x < w - 12; x += 34) { ctx.beginPath(); ctx.moveTo(x, 15); ctx.lineTo(x - 3, h - 4); ctx.stroke(); }
    ctx.fillStyle = k.top; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(2, 12); ctx.quadraticCurveTo(2, 2, 12, 2); ctx.lineTo(w - 12, 2); ctx.quadraticCurveTo(w - 2, 2, w - 2, 12);
    for (let x = w - 2; x > 2; x -= 14) ctx.quadraticCurveTo(x - 7, 17, Math.max(2, x - 14), 11);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 1.6;
    krul(ctx, 14, h - 9, 5, 1); krul(ctx, w - 14, h - 9, 5, -1);
    ctx.strokeStyle = 'rgba(255,255,255,.4)';
    ctx.beginPath(); ctx.moveTo(12, 5); ctx.lineTo(w * 0.45, 5); ctx.stroke();
  });
}

// grot: het plafond met stalactieten (herhaalt naadloos)
function tekenPlafond(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 90);
  g.addColorStop(0, '#08060e'); g.addColorStop(1, '#2a2036');
  ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(512, 0);
  for (let x = 512; x >= 0; x -= 16) ctx.lineTo(x, 58 + Math.sin(x * 0.09) * 6 + ((x / 16) % 3 === 0 ? 14 : 0));
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(122,224,200,.35)';
  for (const x of [60, 200, 330, 450]) { ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x + 5, 52); ctx.lineTo(x, 60); ctx.lineTo(x - 5, 52); ctx.closePath(); ctx.fill(); }
}

// grot: een stalactiet die naar beneden kan vallen
function tekenStalactiet(ctx) {
  const g = ctx.createLinearGradient(0, 0, 24, 0);
  g.addColorStop(0, '#2a2036'); g.addColorStop(0.5, '#8a7aa8'); g.addColorStop(1, '#2a2036');
  ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1, 1); ctx.lineTo(23, 1); ctx.lineTo(13, 55); ctx.lineTo(11, 55); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(8, 4, 2, 24);
}

// spikes: een rij metalen punten, w breed
function spikesTex(scene, w) {
  return tekenTextuur(scene, 'spikes_' + w, w, 18, ctx => {
    for (let x = 0; x < w; x += 15) {
      const g = ctx.createLinearGradient(x, 0, x + 15, 0);
      g.addColorStop(0, '#6a7488'); g.addColorStop(0.5, '#e6ecf5'); g.addColorStop(1, '#6a7488');
      ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(x + 1, 17); ctx.lineTo(x + 7.5, 1); ctx.lineTo(x + 14, 17); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  });
}

function pilaarTex(scene, id, h) {
  const key = `pilaar_${id}_${h}`;
  return tekenTextuur(scene, key, 48, h, ctx => {
    const k = THMA(id), w = 48;
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, k.pilaar[1]); g.addColorStop(0.4, k.pilaar[0]); g.addColorStop(1, k.pilaar[1]);
    ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
    ctx.fillRect(5, 14, w - 10, h - 14); ctx.strokeRect(5, 14, w - 10, h - 14);
    ctx.strokeStyle = 'rgba(0,0,0,.25)';
    for (const x of [16, 24, 32]) { ctx.beginPath(); ctx.moveTo(x, 18); ctx.lineTo(x, h); ctx.stroke(); }
    ctx.strokeStyle = INKT;
    for (let y = 70; y < h; y += 70) { ctx.fillStyle = '#f2c14e'; ctx.fillRect(5, y, w - 10, 5); ctx.strokeRect(5, y, w - 10, 5); }
    ctx.save(); ctx.shadowColor = '#f2c14e'; ctx.shadowBlur = 8; ctx.fillStyle = '#f2c14e';
    ctx.beginPath(); ctx.ellipse(w / 2, 40, 4, 8, 0, 0, TAU); ctx.fill(); ctx.restore();
    const kg = ctx.createLinearGradient(0, 0, 0, 16);
    kg.addColorStop(0, '#f6d27a'); kg.addColorStop(1, '#b8862a');
    ctx.fillStyle = kg; rondRect(ctx, 1, 1, w - 2, 15, 5); ctx.fill(); ctx.stroke();
    if (k.sneeuw) { ctx.fillStyle = '#eef6ff'; rondRect(ctx, 1, 0, w - 2, 7, 3.5); ctx.fill(); ctx.stroke(); }
  });
}

// Maakt alle vaste plaatjes één keer aan het begin
// Tekent de speler in de skin die je nu aan hebt. Opnieuw aanroepen als je een andere skin kiest.
function maakSpelerTexturen(scene) {
  const skin = skinVan(PROFIEL.skin);
  for (const [key, pose] of Object.entries(POSES)) {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    tekenTextuur(scene, key, 56, 88, ctx => tekenSpeler(ctx, pose, skin));
  }
  // groot en scherp, voor het titelscherm
  if (scene.textures.exists('sp_groot')) scene.textures.remove('sp_groot');
  tekenTextuur(scene, 'sp_groot', 56, 88, ctx => tekenSpeler(ctx, {}, skin), 4);
  // het poppetje met een biertje aan zijn mond (titelscherm)
  if (scene.textures.exists('sp_drinkt')) scene.textures.remove('sp_drinkt');
  tekenTextuur(scene, 'sp_drinkt', 56, 88, ctx => {
    tekenSpeler(ctx, { arm: 2.7 }, skin);
    ctx.save(); ctx.translate(39, 41); ctx.rotate(-0.9);
    ctx.strokeStyle = INKT; ctx.lineWidth = 1.4; ctx.fillStyle = '#f2a33a';
    ctx.beginPath(); ctx.moveTo(-4, -10); ctx.lineTo(4, -10); ctx.lineTo(3.4, 2); ctx.lineTo(-3.4, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fffaf0'; for (const [x, r] of [[-2.6, 2.2], [0, 2.6], [2.6, 2.2]]) { ctx.beginPath(); ctx.arc(x, -10.5, r, 0, TAU); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  }, 4);
}

function maakTexturen(scene) {
  tekenTextuur(scene, 'baas_pad', 180, 132, tekenPad);
  tekenTextuur(scene, 'baas_beer', 170, 152, tekenBeer);
  tekenTextuur(scene, 'baas_geit', 170, 152, tekenGeit);
  tekenTextuur(scene, 'baas_draak', 220, 152, tekenDraak);
  tekenProjectielen(scene);
  maakMonsterTexturen(scene);
  maakIcoonTexturen(scene);
  maakDierTexturen(scene);
  maakAlexanderTexturen(scene);
  // titelbord: een glas bier met een schuimkraag
  tekenTextuur(scene, 'titelbord', 380, 170, ctx => {
    const g = ctx.createLinearGradient(0, 40, 0, 160);
    g.addColorStop(0, '#ffcf5a'); g.addColorStop(1, '#c8701a');
    ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 5;
    rondRect(ctx, 20, 44, 340, 116, 26); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.35)'; rondRect(ctx, 36, 60, 14, 84, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,250,220,.6)';
    for (const [x, y, r] of [[300, 130, 4], [320, 100, 3], [80, 140, 3], [270, 90, 2.5], [110, 110, 2]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    ctx.fillStyle = '#fffaf0'; ctx.lineWidth = 4;
    for (let i = 0; i < 9; i++) { const x = 32 + i * 39.5, r = 22 + (i % 3) * 5; ctx.beginPath(); ctx.arc(x, 48 - (i % 2) * 6, r, 0, TAU); ctx.fill(); ctx.stroke(); }
    ctx.fillStyle = '#fffaf0'; ctx.fillRect(14, 44, 352, 20);
  });
  tekenTextuur(scene, 'bel', 14, 14, ctx => {
    ctx.strokeStyle = 'rgba(255,250,220,.9)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(7, 7, 5.5, 0, TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(5, 5, 1.5, 0, TAU); ctx.fill();
  });
  tekenTextuur(scene, 'tandwiel', 40, 40, ctx => {
    ctx.fillStyle = 'rgba(10,16,40,.55)'; rondRect(ctx, 1, 1, 38, 38, 9); ctx.fill();
    ctx.fillStyle = '#f3ead6';
    ctx.beginPath();
    for (let i = 0; i < 16; i++) { const a = i * TAU / 16, r = i % 2 ? 9 : 13; ctx.lineTo(20 + Math.cos(a) * r, 20 + Math.sin(a) * r); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1b2f6b'; ctx.beginPath(); ctx.arc(20, 20, 4.5, 0, TAU); ctx.fill();
  });
  maakSpelerTexturen(scene);
  // scherpe plaatjes van elke skin, voor de shop
  for (const k of SKINS) tekenTextuur(scene, 'skin_' + k.id, 56, 88, ctx => tekenSpeler(ctx, {}, k), 3);
  for (const id of Object.keys(THEMA_KLEUR)) {
    tekenTextuur(scene, 'kruiper_' + id, 70, 50, ctx => tekenKruiper(ctx, THMA(id).kruiper));
    tekenTextuur(scene, 'licht_' + id, 60, 84, ctx => tekenDwaallicht(ctx, THMA(id).licht));
    tekenAchtergronden(scene, id);
  }
  tekenTextuur(scene, 'plafond_grot', 512, 90, tekenPlafond);
  tekenTextuur(scene, 'schatkist', 44, 36, tekenSchatkist);
  // stopknop in het spel
  tekenTextuur(scene, 'stopknop', 40, 40, ctx => {
    ctx.fillStyle = 'rgba(10,16,40,.55)'; rondRect(ctx, 1, 1, 38, 38, 9); ctx.fill();
    ctx.fillStyle = '#ff8a8a'; rondRect(ctx, 12, 12, 16, 16, 3); ctx.fill();
  });
  // klein plaatje van elke regio (voor het levelkeuzescherm): lucht, verre bergen, dichtbij en de bodem
  for (const id of Object.keys(THEMA_KLEUR)) {
    tekenTextuur(scene, 'mini_' + id, 160, 90, ctx => {
      const bron = k => scene.textures.get(k + '_' + id).getSourceImage();
      const s = 160 / 960;
      ctx.drawImage(bron('lucht'), 0, 0, 160, 90);
      ctx.drawImage(bron('ver'), 0, 0, 960, 512, 0, 28 * s, 160, 512 * s);
      ctx.drawImage(bron('mid'), 0, 0, 960, 256, 0, 284 * s, 160, 256 * s);
      ctx.drawImage(bron('nabij'), 0, 0, 960, 256, 0, 284 * s, 160, 256 * s);
      ctx.drawImage(bron('bodem'), 0, 0, 512, 64, 0, 476 * s, 85, 64 * s);
      ctx.drawImage(bron('bodem'), 0, 0, 512, 64, 85, 476 * s, 85, 64 * s);
    });
  }
  // kroeg: een plas gemorst bier (glad!)
  tekenTextuur(scene, 'plas', 80, 10, ctx => {
    ctx.fillStyle = 'rgba(242,163,58,.85)'; ctx.strokeStyle = 'rgba(10,16,40,.6)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(40, 6, 38, 4, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(28, 5, 8, 1.4, 0, 0, TAU); ctx.fill();
  });
  // fabriek: de streepjes van een lopende band
  tekenTextuur(scene, 'band', 40, 10, ctx => {
    ctx.fillStyle = '#2a2e3a'; ctx.fillRect(0, 0, 40, 10);
    ctx.fillStyle = '#f2a33a'; ctx.beginPath(); ctx.moveTo(10, 1); ctx.lineTo(22, 5); ctx.lineTo(10, 9); ctx.lineTo(14, 5); ctx.closePath(); ctx.fill();
  });
  // speeltuin: een trampoline
  tekenTextuur(scene, 'trampoline', 64, 22, ctx => {
    ctx.strokeStyle = INKT; ctx.lineWidth = 3;
    for (const x of [8, 56]) { ctx.beginPath(); ctx.moveTo(x, 8); ctx.lineTo(x + (x < 30 ? -4 : 4), 21); ctx.stroke(); }
    ctx.fillStyle = '#d1495b'; ctx.lineWidth = 2;
    rondRect(ctx, 2, 4, 60, 8, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2a2a3a'; ctx.fillRect(8, 6, 48, 4);
  });
  tekenTextuur(scene, 'stalactiet', 24, 56, tekenStalactiet);
  tekenTextuur(scene, 'shotje', 24, 28, tekenShotje);
  tekenTextuur(scene, 'kebab', 46, 34, tekenKebab);
  tekenTextuur(scene, 'wolkje', 24, 24, ctx => {
    ctx.fillStyle = 'rgba(150,170,70,.85)'; ctx.beginPath(); ctx.arc(12, 12, 11, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(120,90,40,.6)'; ctx.beginPath(); ctx.arc(9, 10, 6, 0, TAU); ctx.fill();
  });
  tekenTextuur(scene, 'hart', 28, 26, ctx => tekenHart(ctx, true));
  tekenTextuur(scene, 'hart_leeg', 28, 26, ctx => tekenHart(ctx, false));
  tekenTextuur(scene, 'fles_glas', 32, 78, ctx => { flesPad(ctx); ctx.fillStyle = 'rgba(20,30,70,.8)'; ctx.fill(); });
  tekenTextuur(scene, 'fles_bier', 32, 78, ctx => {
    flesPad(ctx); ctx.save(); ctx.clip();
    const g = ctx.createLinearGradient(0, 0, 32, 0);
    g.addColorStop(0, '#b8651a'); g.addColorStop(0.4, '#f6b544'); g.addColorStop(1, '#a85a14');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 32, 78);
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    for (const [x, y] of [[10, 60], [20, 50], [14, 40], [22, 66], [16, 28]]) { ctx.beginPath(); ctx.arc(x, y, 1.4, 0, TAU); ctx.fill(); }
    ctx.restore();
  });
  tekenTextuur(scene, 'fles_rand', 32, 78, ctx => {
    flesPad(ctx); ctx.strokeStyle = INKT; ctx.lineWidth = 4; ctx.stroke();
    ctx.strokeStyle = '#f3ead6'; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.fillStyle = '#f2c14e'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.5;
    ctx.fillRect(9, 1, 14, 5); ctx.strokeRect(9, 1, 14, 5);
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(7, 40); ctx.lineTo(7, 66); ctx.stroke();
  });
  tekenTextuur(scene, 'fles_mini', 18, 40, ctx => {
    ctx.scale(0.52, 0.52); flesPad(ctx);
    ctx.fillStyle = '#f6b544'; ctx.fill();
    ctx.strokeStyle = INKT; ctx.lineWidth = 4; ctx.stroke();
  });
  tekenTextuur(scene, 'slash', 100, 100, tekenSlash);
  tekenTextuur(scene, 'pijl', 34, 12, ctx => tekenPijl(ctx, false));
  tekenTextuur(scene, 'pijl_boem', 34, 12, ctx => tekenPijl(ctx, true));
  tekenTextuur(scene, 'poort', 120, 180, tekenPoort);
  tekenTextuur(scene, 'vonk', 10, 10, ctx => {
    const g = ctx.createRadialGradient(5, 5, 0, 5, 5, 5);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 10, 10);
  });
  tekenTextuur(scene, 'volscherm', 40, 40, ctx => {
    ctx.fillStyle = 'rgba(10,16,40,.55)';
    rondRect(ctx, 1, 1, 38, 38, 9); ctx.fill();
    ctx.strokeStyle = '#f3ead6'; ctx.lineWidth = 3;
    for (const [x, y, dx, dy] of [[10, 10, 1, 1], [30, 10, -1, 1], [10, 30, 1, -1], [30, 30, -1, -1]]) {
      ctx.beginPath(); ctx.moveTo(x, y + dy * 8); ctx.lineTo(x, y); ctx.lineTo(x + dx * 8, y); ctx.stroke();
    }
  });
  tekenTextuur(scene, 'mist', 960, 540, ctx => {
    const g = ctx.createLinearGradient(0, 250, 0, 470);
    g.addColorStop(0, 'rgba(200,235,245,0)'); g.addColorStop(0.6, 'rgba(200,235,245,.18)'); g.addColorStop(1, 'rgba(200,235,245,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 250, 960, 220);
  });
}

// Achtergrond met lagen die langzamer meeschuiven (parallax)
function maakAchtergrond(scene, id) {
  scene.add.image(0, 0, 'lucht_' + id).setOrigin(0).setScrollFactor(0).setDepth(-20);
  const lagen = [
    { ts: scene.add.tileSprite(0, 28, 960, 512, 'ver_' + id).setDepth(-19), par: 0.1 },
    { ts: scene.add.tileSprite(0, 284, 960, 256, 'mid_' + id).setDepth(-17), par: 0.25 },
    { ts: scene.add.tileSprite(0, 284, 960, 256, 'nabij_' + id).setDepth(-16), par: 0.5 },
  ];
  scene.add.image(0, 0, 'mist').setOrigin(0).setScrollFactor(0).setDepth(-18);
  for (const l of lagen) l.ts.setOrigin(0).setScrollFactor(0);
  const bodem = scene.add.tileSprite(0, 476, 960, 64, 'bodem_' + id).setOrigin(0).setScrollFactor(0).setDepth(7);
  return {
    update(camX, t) {
      for (const l of lagen) l.ts.tilePositionX = camX * l.par;
      bodem.tilePositionX = camX + t * 25;
    },
  };
}
