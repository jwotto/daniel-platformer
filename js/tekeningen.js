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

// ---------- VIJANDEN ----------
function tekenKruiper(ctx, k) {
  ctx.save();
  ctx.translate(35, 46);
  ctx.fillStyle = k.stekel; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  for (let a = -2.6; a <= -0.5; a += 0.42) {
    ctx.beginPath();
    ctx.moveTo(Math.cos(a - 0.16) * 24, Math.sin(a - 0.16) * 21);
    ctx.lineTo(Math.cos(a) * 36, Math.sin(a) * 33);
    ctx.lineTo(Math.cos(a + 0.16) * 24, Math.sin(a + 0.16) * 21);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = '#2a1a10';
  for (const fx of [-13, 13]) { ctx.beginPath(); ctx.ellipse(fx, 0, 6, 3, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
  const g = ctx.createLinearGradient(0, -26, 0, 0);
  g.addColorStop(0, k.lijf[0]); g.addColorStop(1, k.lijf[1]);
  ctx.fillStyle = g; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(0, 0, 27, 24, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-10, -10, 6.5, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = k.oog;
  ctx.beginPath(); ctx.arc(-12.5, -10, 3.4, 0, TAU); ctx.fill();
  ctx.restore();
}

function tekenDwaallicht(ctx, k) {
  ctx.save();
  ctx.translate(30, 36);
  ctx.strokeStyle = k.staart; ctx.lineWidth = 4;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath(); ctx.moveTo(i * 8, 14);
    for (let s = 1; s <= 5; s++) ctx.lineTo(i * 8 + Math.sin(s * 1.3 + i) * 5 + s * 1.5, 14 + s * 6);
    ctx.stroke();
  }
  const g = ctx.createRadialGradient(-4, -8, 2, 0, 0, 28);
  g.addColorStop(0, k.lijf[0]); g.addColorStop(1, k.lijf[1]);
  ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -30);
  ctx.bezierCurveTo(26, -10, 24, 22, 0, 22);
  ctx.bezierCurveTo(-24, 22, -26, -10, 0, -30);
  ctx.fill(); ctx.stroke();
  ctx.shadowColor = k.oog; ctx.shadowBlur = 10;
  ctx.fillStyle = k.oog;
  ctx.beginPath(); ctx.ellipse(-6, 0, 6, 8, 0, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = INKT;
  ctx.beginPath(); ctx.ellipse(-8, 1, 2.5, 4, 0, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------- NIEUWE MONSTERS (per regio) ----------
// Ze kijken allemaal naar links; het spel spiegelt ze als ze naar rechts lopen.
function boosOog(ctx, x, y, r, iris, wenkbrauw) {
  ctx.fillStyle = '#fff'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = iris || INKT; ctx.beginPath(); ctx.arc(x - r * 0.35, y + r * 0.1, r * 0.55, 0, TAU); ctx.fill();
  if (wenkbrauw) {
    ctx.lineWidth = 2.2; ctx.beginPath();
    ctx.moveTo(x - r * 1.2, y - r * 1.5); ctx.lineTo(x + r * 1.1, y - r * 0.9); ctx.stroke();
  }
}

// IJsvlakte: een boos ijsklontje met een bevroren bierbelletje erin
function tekenIJsklont(ctx, w, h) {
  const k = w / 48;
  ctx.save(); ctx.scale(k, k);
  const g = ctx.createLinearGradient(0, 4, 0, 42);
  g.addColorStop(0, '#eef8ff'); g.addColorStop(1, '#7fb6e6');
  ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 2.5;
  rondRect(ctx, 4, 6, 40, 36, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(242,193,78,.55)'; ctx.beginPath(); ctx.arc(31, 30, 5, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.8)';
  ctx.beginPath(); ctx.moveTo(9, 12); ctx.lineTo(20, 10); ctx.lineTo(10, 17); ctx.closePath(); ctx.fill();
  boosOog(ctx, 14, 22, 4.6, '#1b2f6b', true);
  boosOog(ctx, 27, 22, 4.2, '#1b2f6b', false);
  ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(13, 34); ctx.lineTo(17, 31); ctx.lineTo(21, 34); ctx.lineTo(25, 31); ctx.stroke();
  ctx.restore();
}

// IJsvlakte: een pinguïn-ober met een strikje en een dienblad met bier
function tekenPinguin(ctx) {
  ctx.save();
  ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.fillStyle = '#ff9a2c';
  for (const fx of [20, 33]) { ctx.beginPath(); ctx.ellipse(fx, 57, 6, 2.6, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
  const g = ctx.createLinearGradient(14, 0, 44, 0);
  g.addColorStop(0, '#1a1f36'); g.addColorStop(1, '#2e365c');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(28, 34, 15, 22, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f3ead6';
  ctx.beginPath(); ctx.ellipse(25, 38, 9, 16, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#d1495b'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(25, 24); ctx.lineTo(19, 21); ctx.lineTo(19, 27); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(25, 24); ctx.lineTo(31, 21); ctx.lineTo(31, 27); ctx.closePath(); ctx.fill(); ctx.stroke();
  boosOog(ctx, 22, 15, 3.6, INKT, true);
  ctx.fillStyle = '#ff9a2c'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(15, 18); ctx.lineTo(7, 20); ctx.lineTo(15, 22); ctx.closePath(); ctx.fill(); ctx.stroke();
  // vleugel met dienblad
  ctx.fillStyle = '#1a1f36'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(15, 36, 4, 10, 0.6, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#cfd6e6';
  ctx.beginPath(); ctx.ellipse(8, 29, 9, 2.4, 0, 0, TAU); ctx.fill(); ctx.stroke();
  tekenBierglasOp(ctx, 8, 27, 0.8);
  ctx.restore();
}

function tekenBierglasOp(ctx, x, onder, s) {
  ctx.save(); ctx.translate(x, onder); ctx.scale(s, s);
  ctx.strokeStyle = INKT; ctx.lineWidth = 1.6;
  ctx.fillStyle = '#f2a33a';
  ctx.beginPath(); ctx.moveTo(-6, -16); ctx.lineTo(6, -16); ctx.lineTo(5, 0); ctx.lineTo(-5, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fffaf0';
  for (const [bx, r] of [[-4, 3.2], [0, 3.8], [4, 3.2]]) { ctx.beginPath(); ctx.arc(bx, -17, r, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}

// Bergen: een biervat dat op je af rolt
function tekenFust(ctx) {
  ctx.save(); ctx.translate(23, 23);
  ctx.strokeStyle = INKT; ctx.lineWidth = 2.5;
  const g = ctx.createRadialGradient(-6, -6, 3, 0, 0, 22);
  g.addColorStop(0, '#c98a4a'); g.addColorStop(1, '#6b3a12');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 20, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 1.5;
  for (const r of [8, 14]) { ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); }
  ctx.strokeStyle = '#9aa4b8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.stroke();
  ctx.fillStyle = '#f2c14e'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, TAU); ctx.fill(); ctx.stroke();
  boosOog(ctx, -7, -5, 4, '#d1495b', true);
  boosOog(ctx, 6, -5, 3.6, '#d1495b', false);
  ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 8, 5, Math.PI + 0.3, -0.3); ctx.stroke();
  ctx.restore();
}

// Bergen: een vleermuis met een hopbel als lijfje
function tekenVleermuis(ctx) {
  ctx.save(); ctx.translate(32, 20);
  ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.fillStyle = '#4a2a5a';
  for (const z of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(z * 8, -4);
    ctx.quadraticCurveTo(z * 22, -18, z * 31, -6);
    ctx.quadraticCurveTo(z * 26, -2, z * 25, 4);
    ctx.quadraticCurveTo(z * 20, 0, z * 17, 7);
    ctx.quadraticCurveTo(z * 13, 3, z * 8, 8);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  // hopbel: schubjes over elkaar
  for (let rij = 0; rij < 4; rij++) {
    for (let i = -1; i <= 1; i++) {
      if (rij === 3 && i !== 0) continue;
      const x = i * 5.5 + (rij % 2 ? 2.7 : 0) - (rij % 2 ? 2.7 : 0) * (i === 1 ? 2 : 0);
      ctx.fillStyle = rij % 2 ? '#7cc45a' : '#9ad86e';
      ctx.beginPath(); ctx.ellipse(x * (rij === 3 ? 0 : 1), -9 + rij * 6, 5.5 - rij * 0.6, 4.5, 0, 0, TAU); ctx.fill(); ctx.stroke();
    }
  }
  ctx.fillStyle = '#4a2a5a';
  for (const z of [-1, 1]) { ctx.beginPath(); ctx.moveTo(z * 3, -13); ctx.lineTo(z * 7, -20); ctx.lineTo(z * 7, -11); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  ctx.shadowColor = '#ff4a4a'; ctx.shadowBlur = 6;
  ctx.fillStyle = '#ff4a4a';
  for (const z of [-1, 1]) { ctx.beginPath(); ctx.arc(z * 3.2 - 1, -8, 2, 0, TAU); ctx.fill(); }
  ctx.shadowBlur = 0;
  ctx.restore();
}

// Vulkaan: een glas gloeiend lavabier dat ontploft
function tekenLavalager(ctx) {
  ctx.save();
  ctx.strokeStyle = INKT; ctx.lineWidth = 2.4;
  ctx.shadowColor = '#ff6a2c'; ctx.shadowBlur = 8;
  const g = ctx.createLinearGradient(0, 14, 0, 48);
  g.addColorStop(0, '#ffd27a'); g.addColorStop(0.5, '#ff6a2c'); g.addColorStop(1, '#a01a10');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(6, 14); ctx.lineTo(32, 14); ctx.lineTo(29, 47); ctx.lineTo(9, 47); ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0; ctx.stroke();
  ctx.fillStyle = '#3a2a2a';
  for (const [x, y, r] of [[10, 13, 4.5], [17, 10, 5.5], [25, 11, 5], [31, 14, 3.6]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = '#ff8a2c';
  for (const [x, y] of [[16, 9], [24, 11]]) { ctx.beginPath(); ctx.arc(x, y, 1.6, 0, TAU); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,240,180,.8)';
  for (const [x, y] of [[13, 38], [22, 32], [18, 42]]) { ctx.beginPath(); ctx.arc(x, y, 1.8, 0, TAU); ctx.fill(); }
  boosOog(ctx, 14, 25, 3.8, '#a01a10', true);
  boosOog(ctx, 24, 25, 3.4, '#a01a10', false);
  ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(13, 35); ctx.quadraticCurveTo(19, 31, 25, 35); ctx.stroke();
  ctx.restore();
}

// Vulkaan: een grote koperen brouwketel op pootjes
function tekenGolem(ctx) {
  ctx.save();
  ctx.strokeStyle = INKT; ctx.lineWidth = 3;
  ctx.fillStyle = '#3a2a2a';
  for (const fx of [26, 52]) { rondRect(ctx, fx - 7, 66, 14, 16, 4); ctx.fill(); ctx.stroke(); }
  // schoorsteen
  ctx.fillStyle = '#8a4a1c';
  ctx.beginPath(); ctx.moveTo(48, 22); ctx.lineTo(56, 2); ctx.lineTo(64, 4); ctx.lineTo(57, 24); ctx.closePath(); ctx.fill(); ctx.stroke();
  const g = ctx.createRadialGradient(30, 30, 4, 40, 44, 40);
  g.addColorStop(0, '#ffb070'); g.addColorStop(0.5, '#c8682a'); g.addColorStop(1, '#6b2a10');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(6, 66); ctx.bezierCurveTo(2, 24, 18, 14, 40, 14); ctx.bezierCurveTo(62, 14, 78, 24, 74, 66); ctx.closePath(); ctx.fill(); ctx.stroke();
  // klinknagels en band
  ctx.fillStyle = '#6b2a10'; ctx.fillRect(7, 52, 66, 6); ctx.strokeRect(7, 52, 66, 6);
  ctx.fillStyle = '#f2c14e';
  for (let x = 12; x < 72; x += 10) { ctx.beginPath(); ctx.arc(x, 55, 1.6, 0, TAU); ctx.fill(); }
  // gloeiende ogen
  ctx.shadowColor = '#ffd27a'; ctx.shadowBlur = 10; ctx.fillStyle = '#ffd27a';
  ctx.beginPath(); ctx.ellipse(26, 34, 6, 4, -0.3, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(44, 34, 6, 4, 0.3, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = INKT; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(18, 26); ctx.lineTo(31, 31); ctx.moveTo(52, 26); ctx.lineTo(39, 31); ctx.stroke();
  ctx.fillStyle = '#2a0a06';
  rondRect(ctx, 24, 42, 22, 6, 3); ctx.fill();
  // armpjes
  ctx.strokeStyle = INKT; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(8, 44); ctx.lineTo(0, 56); ctx.stroke();
  ctx.strokeStyle = '#8a4a1c'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(8, 44); ctx.lineTo(0, 56); ctx.stroke();
  ctx.restore();
}

// Overal (zeldzaam): een gouden flesje met pootjes dat wegrent
function tekenGoudfles(ctx) {
  ctx.save();
  ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.strokeStyle = INKT; ctx.lineWidth = 3;
  for (const [x1, x2] of [[11, 8], [19, 22]]) { ctx.beginPath(); ctx.moveTo(x1, 42); ctx.lineTo(x2, 50); ctx.stroke(); }
  ctx.lineWidth = 2;
  ctx.shadowColor = '#fff2a0'; ctx.shadowBlur = 10;
  const g = ctx.createLinearGradient(5, 0, 25, 0);
  g.addColorStop(0, '#b8862a'); g.addColorStop(0.45, '#ffe08a'); g.addColorStop(1, '#b8862a');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(5, 44); ctx.lineTo(5, 22); ctx.quadraticCurveTo(5, 15, 11, 13); ctx.lineTo(11, 4);
  ctx.lineTo(19, 4); ctx.lineTo(19, 13); ctx.quadraticCurveTo(25, 15, 25, 22); ctx.lineTo(25, 44); ctx.closePath();
  ctx.fill(); ctx.shadowBlur = 0; ctx.stroke();
  ctx.fillStyle = '#d1495b'; rondRect(ctx, 6.5, 26, 17, 9, 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(15, 30.5, 2, 0, TAU); ctx.fill();
  boosOog(ctx, 11, 19, 2.8, INKT, false);
  boosOog(ctx, 19, 19, 2.8, INKT, false);
  ctx.fillStyle = '#f2c14e'; ctx.lineWidth = 1.2;
  ctx.beginPath(); for (let i = 0; i <= 6; i++) ctx.lineTo(11 + i * 8 / 6, i % 2 ? 2.4 : 0.6); ctx.lineTo(19, 4); ctx.lineTo(11, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function maakMonsterTexturen(scene) {
  tekenTextuur(scene, 'ijsklont', 48, 44, tekenIJsklont);
  tekenTextuur(scene, 'ijsklont_klein', 26, 24, tekenIJsklont);
  tekenTextuur(scene, 'pinguin', 52, 60, tekenPinguin);
  tekenTextuur(scene, 'bierglas', 16, 24, ctx => tekenBierglasOp(ctx, 8, 23, 1));
  tekenTextuur(scene, 'fust', 46, 46, tekenFust);
  tekenTextuur(scene, 'vleermuis', 64, 40, tekenVleermuis);
  tekenTextuur(scene, 'lavalager', 38, 50, tekenLavalager);
  tekenTextuur(scene, 'golem', 80, 84, tekenGolem);
  tekenTextuur(scene, 'goudfles', 30, 52, tekenGoudfles);
  // puntje van de padden-tong
  tekenTextuur(scene, 'tong', 28, 22, ctx => {
    ctx.fillStyle = '#ff7aa8'; ctx.strokeStyle = INKT; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.ellipse(14, 11, 11, 8, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(10, 8, 2.5, 0, TAU); ctx.fill();
  });
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
  for (let i = 0; i < 80; i++) {
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
    ijs: [780, 80, 30, '#f4fbff', true], vulkaan: [700, 320, 90, '#ff9a3c', false] }[id];
  const [mx, my, mr, kleur, sikkel] = zon;
  const gl = ctx.createRadialGradient(mx, my, mr * 0.4, mx, my, mr * 4);
  gl.addColorStop(0, id === 'vulkaan' || id === 'berg' ? 'rgba(255,170,120,.55)' : 'rgba(255,230,160,.45)');
  gl.addColorStop(1, 'rgba(255,230,160,0)');
  ctx.fillStyle = gl; ctx.fillRect(0, 0, 960, 540);
  ctx.fillStyle = kleur;
  ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU);
  // maansikkel: tweede cirkel andersom tekenen maakt er een gat in
  if (sikkel) ctx.arc(mx + mr * 0.4, my - mr * 0.24, mr * 0.92, 0, TAU, true);
  ctx.fill();
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
    for (const x of [480, 1450]) tekenKasteel(ctx, x, basis + rug(x, 2048, golven) + 8, k.kasteel);
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
      } else if (id === 'vulkaan') {
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
    if (id === 'rivier' || id === 'ijs' || id === 'vulkaan') {
      const kl = { rivier: ['#2aa9a6', '#14285e'], ijs: ['#a8e4f5', '#2a5a96'], vulkaan: ['#ffb03c', '#a8200c'] }[id];
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

// ---------- EINDBAZEN (kijken naar links) ----------
function lijn(ctx, w) { ctx.strokeStyle = INKT; ctx.lineWidth = w || 3; }
function ovaal(ctx, x, y, rx, ry, kleur, rot) {
  ctx.fillStyle = kleur; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, TAU); ctx.fill(); ctx.stroke();
}
function schuim(ctx, punten) {
  ctx.fillStyle = '#fffaf0'; lijn(ctx, 2);
  for (const [x, y, r] of punten) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke(); }
}
function kroonkurk(ctx, x, y, r) {
  ctx.fillStyle = '#f2c14e'; lijn(ctx, 2.5);
  ctx.beginPath();
  for (let i = 0; i < 9; i++) { const xx = x - r + i * (2 * r / 8); ctx.lineTo(xx, y - (i % 2 ? r * 0.6 : r * 1.3)); }
  ctx.lineTo(x + r, y); ctx.lineTo(x - r, y); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.arc(x, y - r * 0.45, r * 0.25, 0, TAU); ctx.fill();
}
function oog(ctx, x, y, r, iris) {
  ovaal(ctx, x, y, r, r, '#fff');
  ctx.fillStyle = iris || INKT; ctx.beginPath(); ctx.arc(x - r * 0.35, y + r * 0.1, r * 0.5, 0, TAU); ctx.fill();
  ctx.fillStyle = INKT; ctx.beginPath(); ctx.arc(x - r * 0.4, y + r * 0.1, r * 0.25, 0, TAU); ctx.fill();
}

function tekenPad(ctx) {
  ctx.save(); ctx.translate(90, 128); lijn(ctx);
  ovaal(ctx, -56, -12, 30, 16, '#8a5a14'); ovaal(ctx, 56, -12, 30, 16, '#8a5a14');
  const g = ctx.createRadialGradient(-10, -70, 10, 0, -44, 90);
  g.addColorStop(0, '#f6c454'); g.addColorStop(1, '#9a5a14');
  ovaal(ctx, 0, -46, 78, 46, g);
  ctx.fillStyle = '#fff3d6'; ctx.beginPath(); ctx.ellipse(-8, -30, 48, 24, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.45)';
  for (const [x, y, r] of [[30, -62, 5], [44, -44, 4], [14, -76, 3.5], [52, -64, 3]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  lijn(ctx, 3); ctx.beginPath(); ctx.moveTo(-74, -54); ctx.quadraticCurveTo(-30, -36, 18, -50); ctx.stroke();
  ovaal(ctx, -40, -6, 15, 8, '#8a5a14'); ovaal(ctx, 16, -6, 15, 8, '#8a5a14');
  schuim(ctx, [[-44, -84, 10], [-26, -92, 11], [-6, -94, 11], [12, -88, 10], [26, -80, 8]]);
  oog(ctx, -44, -94, 14, '#3a6a1c'); oog(ctx, 8, -98, 14, '#3a6a1c');
  kroonkurk(ctx, -18, -110, 18);
  ctx.restore();
}

function tekenBeer(ctx) {
  ctx.save(); ctx.translate(85, 148); lijn(ctx);
  for (const x of [-34, -10, 30, 52]) ovaal(ctx, x, -14, 13, 16, '#dde9f6');
  const g = ctx.createLinearGradient(0, -100, 0, 0);
  g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#9fbede');
  ovaal(ctx, 12, -56, 64, 44, g);
  ovaal(ctx, -64, -114, 10, 10, '#eef4fb'); ovaal(ctx, -30, -118, 10, 10, '#eef4fb');
  ovaal(ctx, -48, -92, 32, 30, '#f4f8fd');
  ovaal(ctx, -74, -82, 15, 11, '#e2ecf7');
  ctx.fillStyle = INKT; ctx.beginPath(); ctx.ellipse(-86, -86, 5, 4, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(-54, -100, 4, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(-34, -102, 4, 0, TAU); ctx.fill();
  // rode sjaal
  ctx.fillStyle = '#d1495b'; lijn(ctx, 2.5);
  ctx.beginPath(); ctx.moveTo(-60, -66); ctx.quadraticCurveTo(-30, -54, -14, -70); ctx.lineTo(-12, -60); ctx.quadraticCurveTo(-30, -44, -62, -56); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillRect(-22, -62, 10, 28); ctx.strokeRect(-22, -62, 10, 28);
  // bevroren bierpul
  ctx.save(); ctx.translate(-96, -52);
  ctx.strokeStyle = '#bfe8f5'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(26, 14, 9, -1.4, 1.4); ctx.stroke();
  const bg = ctx.createLinearGradient(0, 0, 0, 34); bg.addColorStop(0, '#f6b544'); bg.addColorStop(1, '#b8651a');
  ctx.fillStyle = bg; lijn(ctx, 2.5); rondRect(ctx, 0, 0, 26, 34, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(200,240,255,.6)'; ctx.fillRect(3, 4, 5, 26);
  schuim(ctx, [[4, 0, 6], [13, -3, 7], [22, 0, 6]]);
  ctx.restore();
  ovaal(ctx, -76, -44, 13, 11, '#f4f8fd');
  ctx.restore();
}

function tekenGeit(ctx) {
  ctx.save(); ctx.translate(85, 148); lijn(ctx);
  for (const x of [-30, -14, 26, 42]) {
    ctx.fillStyle = '#6a4424'; ctx.fillRect(x - 5, -44, 10, 40); ctx.strokeRect(x - 5, -44, 10, 40);
    ovaal(ctx, x, -3, 7, 4, '#2a1a10');
  }
  const g = ctx.createLinearGradient(0, -90, 0, -30);
  g.addColorStop(0, '#e0b87a'); g.addColorStop(1, '#8a5a30');
  ovaal(ctx, 8, -62, 58, 30, g);
  // biervat op de rug
  ctx.fillStyle = '#8a4a1c'; rondRect(ctx, -12, -116, 56, 36, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e';
  for (const x of [-2, 30]) { ctx.fillRect(x, -116, 6, 36); ctx.strokeRect(x, -116, 6, 36); }
  ctx.fillStyle = '#b8862a'; ctx.fillRect(44, -102, 10, 6); ctx.strokeRect(44, -102, 10, 6);
  // nek en kop
  ctx.fillStyle = '#c89a62'; ctx.beginPath(); ctx.moveTo(-40, -70); ctx.lineTo(-56, -100); ctx.lineTo(-36, -108); ctx.lineTo(-22, -76); ctx.closePath(); ctx.fill(); ctx.stroke();
  ovaal(ctx, -56, -104, 22, 15, '#d8aa70', -0.3);
  ovaal(ctx, -74, -96, 10, 8, '#e8c08a', -0.3);
  ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.moveTo(-74, -90); ctx.lineTo(-64, -66); ctx.lineTo(-58, -92); ctx.closePath(); ctx.fill(); ctx.stroke();
  ovaal(ctx, -54, -110, 6, 5, '#f2c14e');
  ctx.fillStyle = INKT; ctx.fillRect(-58, -111, 8, 2.5);
  // gouden krulhoorns
  for (const [x, r] of [[-46, 18], [-36, 16]]) {
    ctx.strokeStyle = INKT; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(x + 8, -124, r, Math.PI * 0.9, Math.PI * 2.3); ctx.stroke();
    ctx.strokeStyle = '#e8c070'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x + 8, -124, r, Math.PI * 0.9, Math.PI * 2.3); ctx.stroke();
  }
  ctx.restore();
}

function tekenDraak(ctx) {
  ctx.save(); ctx.translate(110, 142); lijn(ctx);
  // vleugels
  for (const [dx, a] of [[30, 1], [0, 0.75]]) {
    ctx.globalAlpha = a;
    ctx.fillStyle = '#8e1f3c';
    ctx.beginPath(); ctx.moveTo(dx, -80); ctx.lineTo(dx + 40, -128); ctx.lineTo(dx + 70, -118); ctx.lineTo(dx + 60, -90);
    ctx.quadraticCurveTo(dx + 50, -76, dx + 30, -70); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(dx + 6, -80); ctx.lineTo(dx + 40, -124); ctx.moveTo(dx + 10, -78); ctx.lineTo(dx + 66, -116); ctx.stroke();
    lijn(ctx);
  }
  ctx.globalAlpha = 1;
  // staart
  ctx.strokeStyle = INKT; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(60, -60); ctx.quadraticCurveTo(100, -40, 84, -10); ctx.stroke();
  ctx.strokeStyle = '#c8321e'; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(60, -60); ctx.quadraticCurveTo(100, -40, 84, -10); ctx.stroke();
  ctx.fillStyle = '#f2c14e'; lijn(ctx, 2); ctx.beginPath(); ctx.moveTo(78, -14); ctx.lineTo(84, 2); ctx.lineTo(92, -12); ctx.closePath(); ctx.fill(); ctx.stroke();
  // lijf
  const g = ctx.createLinearGradient(0, -100, 0, -40);
  g.addColorStop(0, '#f0603c'); g.addColorStop(1, '#7a1424');
  lijn(ctx); ovaal(ctx, 20, -66, 54, 30, g);
  ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(10 + i * 4, -66, 20 + i * 5, 1.9, 2.6); ctx.stroke(); }
  // nek en kop
  lijn(ctx); ctx.fillStyle = '#d8402a';
  ctx.beginPath(); ctx.moveTo(-20, -80); ctx.quadraticCurveTo(-40, -100, -54, -96); ctx.lineTo(-48, -76); ctx.quadraticCurveTo(-32, -70, -18, -58); ctx.closePath(); ctx.fill(); ctx.stroke();
  ovaal(ctx, -64, -92, 30, 19, '#e8503c');
  ovaal(ctx, -92, -86, 14, 10, '#e8503c');
  ctx.fillStyle = '#fff'; for (const x of [-100, -92, -84]) { ctx.beginPath(); ctx.moveTo(x, -78); ctx.lineTo(x + 3, -71); ctx.lineTo(x + 6, -78); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = '#f2c14e'; lijn(ctx, 2);
  for (const x of [-60, -46]) { ctx.beginPath(); ctx.moveTo(x, -108); ctx.lineTo(x + 12, -132); ctx.lineTo(x + 8, -106); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  ctx.save(); ctx.shadowColor = '#f2c14e'; ctx.shadowBlur = 10; ovaal(ctx, -68, -98, 7, 6, '#f2c14e'); ctx.restore();
  ctx.fillStyle = INKT; ctx.fillRect(-72, -99, 7, 2.5);
  // bierschuim druipt uit de bek
  schuim(ctx, [[-104, -80, 5], [-98, -74, 4], [-104, -68, 3.5]]);
  ctx.restore();
}

function tekenProjectielen(scene) {
  tekenTextuur(scene, 'bubbel', 30, 30, ctx => {
    const g = ctx.createRadialGradient(11, 11, 2, 15, 15, 14);
    g.addColorStop(0, '#fffaf0'); g.addColorStop(0.6, 'rgba(246,181,68,.85)'); g.addColorStop(1, 'rgba(184,101,26,.9)');
    ctx.fillStyle = g; lijn(ctx, 2); ctx.beginPath(); ctx.arc(15, 15, 13, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(10, 10, 3.5, 0, TAU); ctx.fill();
  });
  tekenTextuur(scene, 'ijsblok', 28, 28, ctx => {
    ctx.fillStyle = 'rgba(190,235,255,.9)'; lijn(ctx, 2.5); rondRect(ctx, 3, 3, 22, 22, 4); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(8, 8); ctx.lineTo(16, 8); ctx.moveTo(8, 8); ctx.lineTo(8, 16); ctx.stroke();
  });
  tekenTextuur(scene, 'ijspegel', 22, 50, ctx => {
    const g = ctx.createLinearGradient(0, 0, 22, 0); g.addColorStop(0, '#9fd8f0'); g.addColorStop(0.5, '#f4fbff'); g.addColorStop(1, '#6aa8d8');
    ctx.fillStyle = g; lijn(ctx, 2); ctx.beginPath(); ctx.moveTo(2, 2); ctx.lineTo(20, 2); ctx.lineTo(11, 48); ctx.closePath(); ctx.fill(); ctx.stroke();
  });
  tekenTextuur(scene, 'vat', 44, 44, ctx => {
    ovaal(ctx, 22, 22, 19, 19, '#8a4a1c');
    ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(22, 22, 13, 0, TAU); ctx.stroke();
    lijn(ctx, 2); ctx.beginPath(); ctx.moveTo(22, 4); ctx.lineTo(22, 40); ctx.moveTo(4, 22); ctx.lineTo(40, 22); ctx.stroke();
    ovaal(ctx, 22, 22, 5, 5, '#f6b544');
  });
  tekenTextuur(scene, 'vuurbal', 34, 34, ctx => {
    ctx.shadowColor = '#ff7a2c'; ctx.shadowBlur = 10;
    const g = ctx.createRadialGradient(14, 14, 2, 17, 17, 14);
    g.addColorStop(0, '#fff6d8'); g.addColorStop(0.5, '#ffb03c'); g.addColorStop(1, '#c8321e');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(17, 17, 13, 0, TAU); ctx.fill();
  });
  tekenTextuur(scene, 'golf', 46, 28, ctx => {
    ctx.fillStyle = 'rgba(255,250,240,.95)'; lijn(ctx, 2);
    ctx.beginPath(); ctx.moveTo(2, 26); ctx.quadraticCurveTo(6, 4, 22, 4); ctx.quadraticCurveTo(40, 4, 44, 26); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(246,181,68,.8)'; ctx.fillRect(6, 18, 34, 7);
  });
  tekenTextuur(scene, 'schaduw', 40, 12, ctx => {
    ctx.fillStyle = 'rgba(209,73,91,.55)'; ctx.beginPath(); ctx.ellipse(20, 6, 18, 5, 0, 0, TAU); ctx.fill();
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
}

function maakTexturen(scene) {
  tekenTextuur(scene, 'baas_pad', 180, 132, tekenPad);
  tekenTextuur(scene, 'baas_beer', 170, 152, tekenBeer);
  tekenTextuur(scene, 'baas_geit', 170, 152, tekenGeit);
  tekenTextuur(scene, 'baas_draak', 220, 152, tekenDraak);
  tekenProjectielen(scene);
  maakMonsterTexturen(scene);
  maakIcoonTexturen(scene);
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
