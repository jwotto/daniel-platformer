// Icoontjes voor de power-ups (winkel) en de upgrade-keuzes (na doodgaan).
// Elk icoontje is een rond badge met een tekening erin, 64×64.

const ICOON_KLEUR = {
  // power-ups
  dash: '#3cc8bb', dubbel: '#5fd38a', muur: '#8a6a4a', hart: '#d1495b', zweef: '#a9c4ee',
  slash: '#9aa4b8', pijlen: '#f2a33a', boem: '#ff6a2c', smash: '#7a5cff',
  // keuzes
  springveer: '#5fd38a', gulzig: '#f2c14e', renner: '#3cc8bb', tank: '#5a6a9a', kanon: '#d1495b',
  maan: '#2c4387', kracht: '#c8682a', spaarvarken: '#ff8ac8', raket: '#ff6a2c', zwaar: '#4a4a5e',
};

function lijnPad(ctx, punten, dikte, kleur) {
  ctx.strokeStyle = INKT; ctx.lineWidth = dikte + 3;
  ctx.beginPath(); punten.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
  ctx.strokeStyle = kleur; ctx.lineWidth = dikte;
  ctx.beginPath(); punten.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
}
function vorm(ctx, punten, kleur) {
  ctx.fillStyle = kleur; ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.beginPath(); punten.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); ctx.stroke();
}
function rondje(ctx, x, y, r, kleur) {
  ctx.fillStyle = kleur; ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
}
function pijltjeOp(ctx, x, y, s, kleur) {
  vorm(ctx, [[x, y - 12 * s], [x + 10 * s, y], [x + 4 * s, y], [x + 4 * s, y + 11 * s], [x - 4 * s, y + 11 * s], [x - 4 * s, y], [x - 10 * s, y]], kleur);
}
function hartVorm(ctx, x, y, s, kleur) {
  ctx.fillStyle = kleur; ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(x, y + 12 * s);
  ctx.bezierCurveTo(x - 16 * s, y + 1 * s, x - 13 * s, y - 13 * s, x, y - 5 * s);
  ctx.bezierCurveTo(x + 13 * s, y - 13 * s, x + 16 * s, y + 1 * s, x, y + 12 * s);
  ctx.fill(); ctx.stroke();
}
function sterVorm(ctx, x, y, r1, r2, n, kleur) {
  const p = [];
  for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n - Math.PI / 2, r = i % 2 ? r2 : r1; p.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  vorm(ctx, p, kleur);
}

const CREME = '#fffaf0';
const ICOON_TEKEN = {
  dash: ctx => { for (const y of [24, 32, 40]) lijnPad(ctx, [[12, y], [30, y]], 3, CREME); vorm(ctx, [[30, 18], [52, 32], [30, 46]], CREME); },
  dubbel: ctx => { pijltjeOp(ctx, 32, 24, 0.9, CREME); pijltjeOp(ctx, 32, 44, 0.9, CREME); },
  muur: ctx => {
    ctx.fillStyle = '#c8924a'; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
    for (let r = 0; r < 4; r++) for (let k = 0; k < 2; k++) { ctx.fillRect(12 + k * 10 + (r % 2) * 5, 14 + r * 9, 10, 9); ctx.strokeRect(12 + k * 10 + (r % 2) * 5, 14 + r * 9, 10, 9); }
    pijltjeOp(ctx, 43, 32, 0.9, CREME);
  },
  hart: ctx => hartVorm(ctx, 32, 32, 1.35, '#ff8a8a'),
  zweef: ctx => {
    ctx.fillStyle = CREME; ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(14, 44); ctx.quadraticCurveTo(20, 14, 50, 14); ctx.quadraticCurveTo(46, 38, 14, 44); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16, 42); ctx.lineTo(40, 22); ctx.stroke();
  },
  slash: ctx => { lijnPad(ctx, [[18, 46], [46, 18]], 5, '#e6ecf5'); lijnPad(ctx, [[14, 38], [26, 50]], 4, '#f2c14e'); rondje(ctx, 17, 47, 3.5, '#8a4a1c'); },
  pijlen: ctx => {
    for (const dy of [-7, 7]) { lijnPad(ctx, [[14, 32 + dy], [44, 32 + dy]], 3, '#8a4a1c'); vorm(ctx, [[44, 26 + dy], [52, 32 + dy], [44, 38 + dy]], '#e6ecf5'); }
  },
  boem: ctx => { sterVorm(ctx, 32, 32, 20, 10, 8, '#ffd27a'); rondje(ctx, 32, 32, 6, '#d1495b'); },
  smash: ctx => {
    vorm(ctx, [[32, 50], [20, 34], [27, 34], [27, 14], [37, 14], [37, 34], [44, 34]], CREME);
    lijnPad(ctx, [[12, 52], [52, 52]], 3, '#f2c14e');
  },
  springveer: ctx => {
    const p = []; for (let i = 0; i <= 40; i++) p.push([32 + Math.sin(i * 0.95) * 11, 50 - i * 0.8]);
    lijnPad(ctx, p, 3, '#e6ecf5'); rondRect(ctx, 18, 12, 28, 6, 3); ctx.fillStyle = '#f2c14e'; ctx.fill(); ctx.stroke();
  },
  gulzig: ctx => {
    vorm(ctx, [[20, 16], [44, 16], [41, 48], [23, 48]], '#f2a33a');
    for (const [x, r] of [[23, 6], [32, 7], [41, 6]]) rondje(ctx, x, 16, r, CREME);
  },
  renner: ctx => {
    ctx.fillStyle = '#d1495b'; ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(22, 22); ctx.lineTo(32, 22); ctx.lineTo(36, 34); ctx.lineTo(52, 38); ctx.lineTo(52, 46); ctx.lineTo(20, 46); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = CREME; ctx.fillRect(20, 42, 32, 4);
    for (const y of [26, 34]) lijnPad(ctx, [[6, y], [16, y]], 3, CREME);
  },
  tank: ctx => {
    vorm(ctx, [[32, 12], [50, 18], [48, 36], [32, 52], [16, 36], [14, 18]], '#cfd6e6');
    hartVorm(ctx, 32, 31, 0.75, '#d1495b');
  },
  kanon: ctx => { rondje(ctx, 30, 36, 14, '#2a2a3a'); lijnPad(ctx, [[38, 24], [46, 14]], 3, '#c8924a'); sterVorm(ctx, 47, 13, 7, 3, 6, '#ffd27a'); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(25, 31, 4, 0, TAU); ctx.fill(); },
  maan: ctx => {
    ctx.fillStyle = '#ffe08a'; ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(32, 32, 17, 0, TAU); ctx.arc(39, 27, 14, 0, TAU, true); ctx.fill('evenodd'); ctx.stroke();
    sterVorm(ctx, 46, 44, 5, 2, 5, CREME);
  },
  kracht: ctx => {
    ctx.fillStyle = '#f1c49b'; ctx.strokeStyle = INKT; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(12, 46); ctx.lineTo(24, 46); ctx.quadraticCurveTo(30, 34, 28, 22); ctx.quadraticCurveTo(36, 12, 44, 20);
    ctx.quadraticCurveTo(48, 26, 40, 28); ctx.quadraticCurveTo(52, 34, 46, 46); ctx.closePath(); ctx.fill(); ctx.stroke();
  },
  spaarvarken: ctx => {
    ctx.fillStyle = '#ffb0d8'; ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.ellipse(32, 36, 18, 13, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(48, 36, 4, 5, 0, 0, TAU); ctx.fill(); ctx.stroke();
    vorm(ctx, [[24, 26], [22, 16], [31, 24]], '#ffb0d8');
    ctx.fillStyle = INKT; ctx.fillRect(28, 23, 8, 2.5); ctx.beginPath(); ctx.arc(40, 32, 1.8, 0, TAU); ctx.fill();
    rondje(ctx, 32, 14, 5, '#f2c14e');
  },
  raket: ctx => {
    vorm(ctx, [[26, 46], [20, 52], [22, 40]], '#d1495b'); vorm(ctx, [[38, 46], [44, 52], [42, 40]], '#d1495b');
    ctx.fillStyle = '#e6ecf5'; ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(32, 8); ctx.quadraticCurveTo(44, 22, 40, 46); ctx.lineTo(24, 46); ctx.quadraticCurveTo(20, 22, 32, 8); ctx.fill(); ctx.stroke();
    rondje(ctx, 32, 26, 4.5, '#3cc8bb');
    vorm(ctx, [[27, 47], [37, 47], [32, 58]], '#ffd27a');
  },
  zwaar: ctx => {
    ctx.strokeStyle = INKT; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(32, 22, 9, Math.PI, 0); ctx.stroke();
    ctx.strokeStyle = '#9aa4b8'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(32, 22, 9, Math.PI, 0); ctx.stroke();
    vorm(ctx, [[18, 26], [46, 26], [50, 50], [14, 50]], '#2a2a3a');
    ctx.fillStyle = CREME; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('10T', 32, 43);
  },
};

function maakIcoonTexturen(scene) {
  for (const [id, teken] of Object.entries(ICOON_TEKEN)) {
    tekenTextuur(scene, 'icoon_' + id, 64, 64, ctx => {
      const g = ctx.createRadialGradient(26, 24, 4, 32, 32, 30);
      g.addColorStop(0, ICOON_KLEUR[id]); g.addColorStop(1, '#0a1028');
      ctx.fillStyle = g; ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(32, 32, 29, 0, TAU); ctx.fill(); ctx.stroke();
      teken(ctx);
    }, 2);
  }
}
