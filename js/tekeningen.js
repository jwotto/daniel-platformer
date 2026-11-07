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
};

function tekenTextuur(scene, key, w, h, tekenFn) {
  if (scene.textures.exists(key)) return key;
  const t = scene.textures.createCanvas(key, w, h);
  const ctx = t.getContext();
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
// Een mannetje met een biermuts en op zijn rug een bierblik als pijlenkoker.
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

function tekenSpeler(ctx, pose) {
  const P = Object.assign({ been1: 0.15, been2: -0.15, arm: 0.3, bob: 0 }, pose);
  ctx.save();
  ctx.translate(0, P.bob);

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
    ctx.strokeStyle = '#1b2f6b'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(fx, fy); ctx.stroke();
    ctx.fillStyle = '#4a2a12'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(fx + 2, fy + 1, 5, 3, 0, 0, TAU); ctx.fill(); ctx.stroke();
  };
  been(25, 52, P.been2);
  been(31, 52, P.been1);

  // lijf (tuniek)
  const tg = ctx.createLinearGradient(19, 0, 37, 0);
  tg.addColorStop(0, '#1f8a80'); tg.addColorStop(0.5, '#3cc8bb'); tg.addColorStop(1, '#1f8a80');
  ctx.fillStyle = tg; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  rondRect(ctx, 19, 32, 18, 22, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e'; ctx.fillRect(19.8, 45, 16.4, 3);
  ctx.fillStyle = '#b8862a'; ctx.fillRect(27, 44.5, 3, 4);

  // hoofd
  ctx.fillStyle = '#f1c49b'; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(29, 23, 9.5, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(232,120,110,.5)';
  ctx.beginPath(); ctx.arc(33.5, 27, 2, 0, TAU); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(33, 23.5, 2.3, 2.9, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = INKT;
  ctx.beginPath(); ctx.arc(33.8, 23.9, 1.4, 0, TAU); ctx.fill();
  ctx.strokeStyle = INKT; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(31.5, 27, 2.4, 0.3, 1.6); ctx.stroke();

  // biermuts: amberkleurig met schuim erop
  const mg = ctx.createLinearGradient(0, 8, 0, 22);
  mg.addColorStop(0, '#f6b544'); mg.addColorStop(1, '#b8651a');
  ctx.fillStyle = mg; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(18.5, 21); ctx.bezierCurveTo(18, 7, 40, 7, 39.5, 21); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  for (const [bx, by] of [[24, 16], [31, 14], [35, 18], [27, 19]]) { ctx.beginPath(); ctx.arc(bx, by, 0.9, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#8a4a12';
  rondRect(ctx, 17.5, 18.5, 23, 4.5, 2.2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fffaf0'; ctx.lineWidth = 1.2;
  for (const [sx, sy, r] of [[22, 10, 3.4], [27, 7.5, 4], [32.5, 8, 3.8], [37, 11, 2.8]]) {
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, TAU); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = '#f2c14e';
  ctx.beginPath(); ctx.arc(34, 20.7, 1.8, 0, TAU); ctx.fill();

  // armen
  const schouder = { x: 31, y: 36 };
  const arm = (hx, hy) => {
    ctx.strokeStyle = INKT; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(schouder.x, schouder.y); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = '#2aa597'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(schouder.x, schouder.y); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.fillStyle = '#f1c49b'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.4;
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
  const [mx, my, mr] = id === 'rivier' ? [720, 110, 42] : [260, 300, 70];
  const gl = ctx.createRadialGradient(mx, my, mr * 0.4, mx, my, mr * 4);
  gl.addColorStop(0, id === 'rivier' ? 'rgba(255,230,160,.5)' : 'rgba(255,170,120,.55)');
  gl.addColorStop(1, 'rgba(255,230,160,0)');
  ctx.fillStyle = gl; ctx.fillRect(0, 0, 960, 540);
  ctx.fillStyle = id === 'rivier' ? '#fbe7b0' : '#ffd27a';
  ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU);
  // maansikkel: tweede cirkel andersom tekenen maakt er een gat in
  if (id === 'rivier') ctx.arc(mx + 17, my - 10, mr * 0.92, 0, TAU, true);
  ctx.fill();
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
    const golven = id === 'rivier' ? [[3, 45, 0.3], [7, 22, 1.2], [17, 8, 2]] : [[3, 75, 0.5], [8, 32, 1.1], [19, 10, 2.4]];
    const basis = id === 'rivier' ? 250 : 270;
    tekenLaag(ctx, 2048, 512, basis, golven, k.ver, k.sneeuw);
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
      } else {
        for (let t = 0; t < 3; t++) {
          ctx.beginPath();
          ctx.moveTo(x - (22 - t * 5) * s, y - t * 22 * s);
          ctx.lineTo(x, y - (40 + t * 22) * s);
          ctx.lineTo(x + (22 - t * 5) * s, y - t * 22 * s);
          ctx.closePath(); ctx.fill();
        }
      }
    }
  });
  tekenTextuur(scene, 'bodem_' + id, 512, 64, ctx => {
    if (id === 'rivier') {
      const g = ctx.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, '#2aa9a6'); g.addColorStop(1, '#14285e');
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

// Maakt alle vaste plaatjes één keer aan het begin
function maakTexturen(scene) {
  for (const [key, pose] of Object.entries(POSES)) tekenTextuur(scene, key, 56, 72, ctx => tekenSpeler(ctx, pose));
  for (const id of Object.keys(THEMA_KLEUR)) {
    tekenTextuur(scene, 'kruiper_' + id, 70, 50, ctx => tekenKruiper(ctx, THMA(id).kruiper));
    tekenTextuur(scene, 'licht_' + id, 60, 84, ctx => tekenDwaallicht(ctx, THMA(id).licht));
    tekenAchtergronden(scene, id);
  }
  tekenTextuur(scene, 'shotje', 24, 28, tekenShotje);
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
