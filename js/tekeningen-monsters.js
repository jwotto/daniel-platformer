// Tekeningen van alle monsters, eindbazen en hun kogels.
// Ze kijken allemaal naar links; het spel spiegelt ze als ze naar rechts lopen.

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

// IJsvlakte (vliegt): een sneeuwvlok met een boos gezichtje
function tekenVriesvlok(ctx) {
  ctx.save(); ctx.translate(26, 26);
  for (let i = 0; i < 6; i++) {
    ctx.save(); ctx.rotate(i * TAU / 6);
    ctx.strokeStyle = INKT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -23); ctx.stroke();
    ctx.strokeStyle = '#dff2ff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -23); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(-6, -19); ctx.moveTo(0, -14); ctx.lineTo(6, -19); ctx.stroke();
    ctx.restore();
  }
  const g = ctx.createRadialGradient(-3, -3, 2, 0, 0, 12);
  g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#8cc8f0');
  ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.arc(0, 0, 11, 0, TAU); ctx.fill(); ctx.stroke();
  boosOog(ctx, -4, -1, 3, '#1b2f6b', true); boosOog(ctx, 4, -1, 3, '#1b2f6b', false);
  ctx.restore();
}

// Vulkaan (vliegt): een mot met vlammende vleugels
function tekenVuurmot(ctx) {
  ctx.save(); ctx.translate(28, 24);
  for (const z of [-1, 1]) {
    const g = ctx.createRadialGradient(z * 14, -4, 2, z * 14, -2, 16);
    g.addColorStop(0, '#ffe08a'); g.addColorStop(0.6, '#ff6a2c'); g.addColorStop(1, '#a01a10');
    ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(z * 3, -2); ctx.bezierCurveTo(z * 18, -24, z * 30, -10, z * 24, 4); ctx.bezierCurveTo(z * 20, 14, z * 8, 10, z * 3, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = '#3a2a2a'; ctx.beginPath(); ctx.ellipse(0, 2, 5, 13, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = INKT; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(-2, -10); ctx.quadraticCurveTo(-8, -20, -12, -18); ctx.moveTo(2, -10); ctx.quadraticCurveTo(8, -20, 12, -18); ctx.stroke();
  ctx.shadowColor = '#ffd27a'; ctx.shadowBlur = 6; ctx.fillStyle = '#ffd27a';
  ctx.beginPath(); ctx.arc(-2, -5, 1.8, 0, TAU); ctx.arc(2, -5, 1.8, 0, TAU); ctx.fill();
  ctx.restore();
}

// Rivier (vliegt): een goudvis met vinnen als vleugels
function tekenVliegvis(ctx) {
  ctx.save(); ctx.translate(28, 22);
  ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(169,220,255,.85)';
  for (const z of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-2, 0); ctx.quadraticCurveTo(6, z * 22, 18, z * 18); ctx.quadraticCurveTo(10, z * 6, 6, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  const g = ctx.createLinearGradient(0, -10, 0, 10);
  g.addColorStop(0, '#ffb04a'); g.addColorStop(1, '#d1495b');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(-4, 0, 16, 10, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(24, -10); ctx.lineTo(22, 0); ctx.lineTo(24, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
  boosOog(ctx, -12, -2, 3.4, INKT, true);
  ctx.beginPath(); ctx.arc(-19, 3, 2, 0, TAU); ctx.stroke();
  ctx.restore();
}

// IJsvlakte (vliegt): een pinguïn zonder vleugels, met een vliegbril en snelheidsstreepjes
function tekenVliegpinguin(ctx) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2.5;
  for (const y of [14, 22, 30]) { ctx.beginPath(); ctx.moveTo(42, y); ctx.lineTo(56, y); ctx.stroke(); }
  ctx.translate(24, 22);
  ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.fillStyle = '#1a1f36'; ctx.beginPath(); ctx.ellipse(0, 0, 20, 12, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f3ead6'; ctx.beginPath(); ctx.ellipse(-2, 4, 14, 7, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#ff9a2c'; ctx.beginPath(); ctx.moveTo(-19, -2); ctx.lineTo(-27, 0); ctx.lineTo(-19, 3); ctx.closePath(); ctx.fill(); ctx.stroke();
  for (const fx of [16, 20]) { ctx.beginPath(); ctx.ellipse(fx, 9, 4, 2.2, 0.4, 0, TAU); ctx.fill(); ctx.stroke(); }
  // vliegbril
  ctx.fillStyle = '#8a4a1c'; ctx.fillRect(-14, -7, 18, 3);
  ctx.fillStyle = '#9ad8ff'; ctx.lineWidth = 1.6;
  for (const bx of [-12, -5]) { ctx.beginPath(); ctx.arc(bx, -5, 3.4, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}

// Bergen (vliegt): een adelaar met gespreide vleugels
function tekenAdelaar(ctx) {
  ctx.save(); ctx.translate(38, 24);
  ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.fillStyle = '#6b3a12';
  for (const z of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(z * 6, -2);
    ctx.quadraticCurveTo(z * 22, -20, z * 36, -12);
    for (let i = 0; i < 4; i++) ctx.lineTo(z * (34 - i * 6), -6 + i * 2 + (i % 2 ? 4 : 0));
    ctx.lineTo(z * 8, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = '#8a5a2a'; ctx.beginPath(); ctx.ellipse(0, 2, 10, 13, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f3ead6'; ctx.beginPath(); ctx.arc(-4, -10, 7, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.moveTo(-10, -11); ctx.lineTo(-17, -8); ctx.lineTo(-10, -6); ctx.closePath(); ctx.fill(); ctx.stroke();
  boosOog(ctx, -6, -12, 2.2, INKT, true);
  ctx.restore();
}

// Vulkaan (vliegt): een pterodactyl met een kam op zijn kop
function tekenPtero(ctx) {
  ctx.save(); ctx.translate(46, 26);
  ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.fillStyle = '#8a2a3a';
  for (const z of [-1, 1]) { ctx.beginPath(); ctx.moveTo(z * 4, -4); ctx.lineTo(z * 40, -18); ctx.quadraticCurveTo(z * 30, -2, z * 34, 8); ctx.quadraticCurveTo(z * 20, 2, z * 6, 8); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = '#c84a4a'; ctx.beginPath(); ctx.ellipse(0, 2, 8, 12, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c84a4a';
  ctx.beginPath(); ctx.moveTo(-2, -10); ctx.lineTo(-24, -6); ctx.lineTo(-4, -4); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(10, -24); ctx.lineTo(4, -8); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(-2, -9, 5, 0, TAU); ctx.fill(); ctx.stroke();
  boosOog(ctx, -4, -10, 2.2, '#f2c14e', true);
  ctx.restore();
}

// Grot: een mol met een mijnwerkershelm en lampje
function tekenMol(ctx) {
  ctx.save(); ctx.translate(25, 26);
  ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.fillStyle = '#5a4a5a'; ctx.beginPath(); ctx.ellipse(0, 4, 18, 14, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffb0c0';
  for (const [x, y] of [[-14, 16], [10, 16]]) { ctx.beginPath(); ctx.ellipse(x, y, 6, 3.5, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(-17, 4, 5, 4, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.moveTo(-14, -6); ctx.quadraticCurveTo(0, -24, 14, -6); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillRect(-16, -8, 32, 4); ctx.strokeRect(-16, -8, 32, 4);
  ctx.shadowColor = '#fff6a0'; ctx.shadowBlur = 10; ctx.fillStyle = '#fff6a0';
  ctx.beginPath(); ctx.arc(-4, -14, 3.6, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; ctx.stroke();
  ctx.fillStyle = INKT; ctx.beginPath(); ctx.arc(-9, 0, 1.8, 0, TAU); ctx.arc(-3, 0, 1.8, 0, TAU); ctx.fill();
  ctx.restore();
}

// Savanne: een neushoorn
function tekenNeushoorn(ctx) {
  ctx.save();
  ctx.strokeStyle = INKT; ctx.lineWidth = 2.4;
  ctx.fillStyle = '#6a6a7a';
  for (const x of [20, 34, 48, 58]) { rondRect(ctx, x - 5, 36, 10, 14, 3); ctx.fill(); ctx.stroke(); }
  const g = ctx.createLinearGradient(0, 10, 0, 44);
  g.addColorStop(0, '#9a9aaa'); g.addColorStop(1, '#5a5a6a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(40, 28, 26, 16, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(16, 30, 14, 11, -0.2, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f3ead6';
  ctx.beginPath(); ctx.moveTo(6, 26); ctx.lineTo(0, 10); ctx.lineTo(12, 22); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(14, 21); ctx.lineTo(12, 13); ctx.lineTo(18, 20); ctx.closePath(); ctx.fill(); ctx.stroke();
  boosOog(ctx, 18, 26, 2.6, INKT, true);
  ctx.fillStyle = '#6a6a7a'; ctx.beginPath(); ctx.ellipse(24, 18, 3, 5, 0.4, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// Savanne (vliegt): een gier met een kale roze kop
function tekenGier(ctx) {
  ctx.save(); ctx.translate(36, 22);
  ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.fillStyle = '#3a2a2a';
  for (const z of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(z * 6, -2); ctx.quadraticCurveTo(z * 20, -18, z * 34, -8);
    for (let i = 0; i < 4; i++) ctx.lineTo(z * (32 - i * 6), -2 + (i % 2 ? 6 : 0));
    ctx.lineTo(z * 6, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = '#5a3a2a'; ctx.beginPath(); ctx.ellipse(0, 2, 10, 11, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f3ead6'; ctx.beginPath(); ctx.ellipse(-4, -6, 8, 4, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e88a8a'; ctx.beginPath(); ctx.arc(-9, -11, 6, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c8c8a0'; ctx.beginPath(); ctx.moveTo(-14, -12); ctx.lineTo(-21, -8); ctx.lineTo(-14, -8); ctx.closePath(); ctx.fill(); ctx.stroke();
  boosOog(ctx, -10, -12, 2, INKT, true);
  ctx.restore();
}

// Eindbaas Grot: de Salamander (lang, oranje met zwarte vlekken)
function tekenSalamander(ctx) {
  ctx.save(); ctx.translate(0, 0);
  ctx.strokeStyle = INKT; lijn(ctx, 3);
  // staart
  ctx.fillStyle = '#e8701c';
  ctx.beginPath(); ctx.moveTo(130, 44); ctx.quadraticCurveTo(170, 30, 198, 52); ctx.quadraticCurveTo(170, 46, 130, 62); ctx.closePath(); ctx.fill(); ctx.stroke();
  // poten
  ctx.fillStyle = '#c85a1c';
  for (const x of [50, 110]) for (const z of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(x, 60); ctx.lineTo(x + z * 16, 80); ctx.lineTo(x + z * 16 + 8, 80); ctx.lineTo(x + 8, 58); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  // lijf
  const g = ctx.createLinearGradient(0, 30, 0, 70);
  g.addColorStop(0, '#ff9a3c'); g.addColorStop(1, '#c8501c');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(85, 52, 56, 18, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // kop
  ctx.beginPath(); ctx.ellipse(30, 48, 28, 18, -0.1, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INKT;
  for (const [x, y, r] of [[70, 46, 6], [95, 56, 5], [118, 46, 6], [140, 52, 4], [45, 40, 4], [160, 44, 3]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  oog(ctx, 24, 38, 7, '#f2c14e');
  ctx.strokeStyle = INKT; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(4, 52); ctx.quadraticCurveTo(20, 60, 40, 54); ctx.stroke();
  ctx.restore();
}

// Eindbaas Savanne: de Lepelaar (roze vogel met een lepelsnavel)
function tekenLepelaar(ctx) {
  ctx.save();
  ctx.strokeStyle = INKT; lijn(ctx, 3);
  ctx.strokeStyle = INKT; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(70, 100); ctx.lineTo(64, 150); ctx.moveTo(84, 100); ctx.lineTo(90, 150); ctx.stroke();
  ctx.strokeStyle = '#e8708a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(70, 100); ctx.lineTo(64, 150); ctx.moveTo(84, 100); ctx.lineTo(90, 150); ctx.stroke();
  lijn(ctx, 3);
  const g = ctx.createLinearGradient(0, 50, 0, 110);
  g.addColorStop(0, '#ffc0d8'); g.addColorStop(1, '#e8708a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(82, 80, 44, 28, 0.15, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d0507a'; ctx.beginPath(); ctx.ellipse(96, 76, 28, 16, 0.3, 0, TAU); ctx.fill(); ctx.stroke();
  // nek en kop
  ctx.strokeStyle = INKT; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(56, 70); ctx.quadraticCurveTo(40, 40, 52, 24); ctx.stroke();
  ctx.strokeStyle = '#ffc0d8'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(56, 70); ctx.quadraticCurveTo(40, 40, 52, 24); ctx.stroke();
  lijn(ctx, 3); ctx.fillStyle = '#ffc0d8'; ctx.beginPath(); ctx.arc(52, 22, 13, 0, TAU); ctx.fill(); ctx.stroke();
  // lepelsnavel
  ctx.fillStyle = '#3a3a4a'; ctx.beginPath(); ctx.moveTo(42, 22); ctx.lineTo(10, 30); ctx.lineTo(12, 34); ctx.lineTo(42, 27); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.ellipse(8, 32, 9, 7, 0, 0, TAU); ctx.fill(); ctx.stroke();
  oog(ctx, 50, 18, 5, '#d1495b');
  ctx.restore();
}

// De Lepelaar in pinguïn-glijhouding: plat op zijn buik, kop en snavel vooruit, poten naar achteren
function tekenLepelaarGlij(ctx) {
  ctx.save();
  ctx.strokeStyle = INKT; lijn(ctx, 3);
  // poten gestrekt naar achteren
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(110, 82); ctx.lineTo(138, 78); ctx.moveTo(110, 90); ctx.lineTo(138, 94); ctx.stroke();
  ctx.strokeStyle = '#e8708a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(110, 82); ctx.lineTo(138, 78); ctx.moveTo(110, 90); ctx.lineTo(138, 94); ctx.stroke();
  lijn(ctx, 3); ctx.strokeStyle = INKT;
  // lijf plat en gestroomlijnd
  const g = ctx.createLinearGradient(0, 66, 0, 104);
  g.addColorStop(0, '#ffc0d8'); g.addColorStop(1, '#e8708a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(80, 86, 40, 18, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // vleugels plat langs het lijf
  ctx.fillStyle = '#d0507a'; ctx.beginPath(); ctx.ellipse(90, 80, 30, 9, -0.05, 0, TAU); ctx.fill(); ctx.stroke();
  // nek recht vooruit
  ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(48, 84); ctx.lineTo(30, 82); ctx.stroke();
  ctx.strokeStyle = '#ffc0d8'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(48, 84); ctx.lineTo(30, 82); ctx.stroke();
  lijn(ctx, 3); ctx.strokeStyle = INKT;
  ctx.fillStyle = '#ffc0d8'; ctx.beginPath(); ctx.arc(28, 80, 12, 0, TAU); ctx.fill(); ctx.stroke();
  // lepelsnavel vooruit
  ctx.fillStyle = '#3a3a4a'; ctx.beginPath(); ctx.moveTo(18, 77); ctx.lineTo(4, 80); ctx.lineTo(4, 85); ctx.lineTo(18, 84); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.ellipse(4, 82, 6, 7, 0, 0, TAU); ctx.fill(); ctx.stroke();
  oog(ctx, 26, 76, 5, '#d1495b');
  // snelheidsstreepjes
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 3;
  for (const [y, l] of [[66, 22], [106, 28], [74, 14]]) { ctx.beginPath(); ctx.moveTo(118, y); ctx.lineTo(118 + l, y); ctx.stroke(); }
  ctx.restore();
}

function kroonkurkKlein(ctx, x, y, r) {
  ctx.fillStyle = '#f2c14e'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.4;
  ctx.beginPath(); for (let i = 0; i < 16; i++) { const a = i * TAU / 16, rr = i % 2 ? r : r * 0.82; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.arc(x, y, r * 0.4, 0, TAU); ctx.fill();
}

// ---------- KROEG ----------
function tekenDarter(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.fillStyle = '#2a2a3a'; for (const x of [16, 26]) { ctx.fillRect(x - 3, 42, 6, 14); ctx.strokeRect(x - 3, 42, 6, 14); }
  ctx.fillStyle = '#5a2a6a'; rondRect(ctx, 8, 22, 26, 24, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f1c49b'; ctx.beginPath(); ctx.arc(21, 14, 9, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3a2a1a'; ctx.beginPath(); ctx.arc(21, 9, 9, Math.PI, 0); ctx.fill();
  boosOog(ctx, 17, 14, 2.4, INKT, true);
  ctx.fillStyle = 'rgba(232,120,110,.7)'; ctx.beginPath(); ctx.arc(14, 18, 2.4, 0, TAU); ctx.fill();
  lijnDik(ctx, [[10, 30], [2, 22]], '#f1c49b');
  ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(4, 22); ctx.lineTo(0, 24); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function lijnDik(ctx, p, kleur) {
  ctx.strokeStyle = INKT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(...p[0]); ctx.lineTo(...p[1]); ctx.stroke();
  ctx.strokeStyle = kleur; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(...p[0]); ctx.lineTo(...p[1]); ctx.stroke();
  ctx.strokeStyle = INKT; ctx.lineWidth = 2;
}
function tekenUitsmijter(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.6;
  ctx.fillStyle = '#1a1a22'; for (const x of [18, 36]) { ctx.fillRect(x - 5, 56, 10, 16); ctx.strokeRect(x - 5, 56, 10, 16); }
  ctx.fillStyle = '#1a1a22'; rondRect(ctx, 4, 24, 46, 36, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('BEVEILIGING', 27, 44);
  ctx.fillStyle = '#c8926a'; ctx.beginPath(); ctx.arc(27, 16, 13, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#0a0a0a'; rondRect(ctx, 14, 11, 26, 6, 3); ctx.fill();
  ctx.strokeStyle = INKT; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 24); ctx.lineTo(32, 24); ctx.stroke();
  for (const x of [4, 50]) { ctx.fillStyle = '#c8926a'; ctx.beginPath(); ctx.arc(x, 44, 6, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}
function tekenBierpul(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.4;
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  for (const z of [-1, 1]) { ctx.beginPath(); ctx.ellipse(24 + z * 22, 22, 12, 6, z * 0.4, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.strokeStyle = INKT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(38, 30, 8, -1.2, 1.2); ctx.stroke();
  ctx.lineWidth = 2.4;
  ctx.fillStyle = '#f2a33a'; rondRect(ctx, 12, 14, 26, 32, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(16, 18, 4, 24);
  ctx.fillStyle = '#fffaf0'; for (const [x, r] of [[15, 6], [24, 7], [33, 6]]) { ctx.beginPath(); ctx.arc(x, 13, r, 0, TAU); ctx.fill(); ctx.stroke(); }
  boosOog(ctx, 20, 28, 3, INKT, true); boosOog(ctx, 30, 28, 3, INKT, false);
  ctx.restore();
}
// ---------- FABRIEK ----------
function tekenRobot(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.fillStyle = '#3a3e4a'; for (const x of [14, 28]) { ctx.fillRect(x - 3, 40, 6, 12); ctx.strokeRect(x - 3, 40, 6, 12); }
  ctx.fillStyle = '#9aa4b8'; rondRect(ctx, 5, 20, 32, 22, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2a33a'; ctx.beginPath(); ctx.arc(21, 31, 5, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#7a8090'; rondRect(ctx, 9, 4, 24, 16, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d1495b'; ctx.shadowColor = '#ff4a4a'; ctx.shadowBlur = 6; ctx.fillRect(12, 9, 18, 4); ctx.shadowBlur = 0;
  lijnDik(ctx, [[21, 4], [21, -2]], '#9aa4b8');
  ctx.fillStyle = '#5a5e6a'; rondRect(ctx, -2, 26, 10, 6, 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function tekenStoomketel(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.4;
  const g = ctx.createLinearGradient(4, 0, 44, 0); g.addColorStop(0, '#8a4a1c'); g.addColorStop(0.5, '#e8904a'); g.addColorStop(1, '#8a4a1c');
  ctx.fillStyle = g; rondRect(ctx, 4, 12, 40, 36, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#5a5e6a'; ctx.fillRect(18, 2, 12, 12); ctx.strokeRect(18, 2, 12, 12);
  ctx.fillStyle = '#f3ead6'; ctx.beginPath(); ctx.arc(24, 30, 8, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#d1495b'; ctx.beginPath(); ctx.moveTo(24, 30); ctx.lineTo(29, 25); ctx.stroke();
  ctx.strokeStyle = INKT; boosOog(ctx, 13, 22, 2.6, INKT, true); boosOog(ctx, 35, 22, 2.6, INKT, false);
  ctx.restore();
}
function tekenDrone(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  for (const x of [8, 48]) { ctx.fillStyle = 'rgba(200,210,230,.6)'; ctx.beginPath(); ctx.ellipse(x, 6, 10, 2.5, 0, 0, TAU); ctx.fill(); ctx.stroke(); lijnDik(ctx, [[x, 8], [x, 14]], '#5a5e6a'); }
  lijnDik(ctx, [[8, 14], [48, 14]], '#5a5e6a');
  ctx.fillStyle = '#3a3e4a'; rondRect(ctx, 16, 12, 24, 14, 5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.arc(28, 19, 3.5, 0, TAU); ctx.fill();
  ctx.fillStyle = '#5fae4e'; ctx.fillRect(25, 26, 6, 10); ctx.strokeRect(25, 26, 6, 10);
  ctx.restore();
}
// ---------- SPEELTUIN ----------
function tekenWipkip(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.strokeStyle = '#9aa4b8'; ctx.lineWidth = 3; ctx.beginPath();
  for (let i = 0; i < 4; i++) { ctx.moveTo(14, 34 + i * 3); ctx.lineTo(30, 34 + i * 3); } ctx.stroke();
  ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.ellipse(24, 22, 16, 12, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(10, 10, 8, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.moveTo(6, 2); ctx.lineTo(9, -2); ctx.lineTo(12, 2); ctx.lineTo(15, -1); ctx.lineTo(14, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2a33a'; ctx.beginPath(); ctx.moveTo(2, 9); ctx.lineTo(-3, 11); ctx.lineTo(2, 13); ctx.closePath(); ctx.fill(); ctx.stroke();
  boosOog(ctx, 8, 9, 2.4, INKT, true);
  ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.ellipse(36, 14, 6, 10, 0.6, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function tekenZandmonster(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.fillStyle = '#e8c07a'; ctx.beginPath(); ctx.moveTo(2, 36); ctx.quadraticCurveTo(4, 6, 24, 6); ctx.quadraticCurveTo(44, 6, 46, 36); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(160,110,50,.6)'; for (const [x, y] of [[12, 26], [34, 22], [22, 30], [30, 14]]) { ctx.beginPath(); ctx.arc(x, y, 1.6, 0, TAU); ctx.fill(); }
  boosOog(ctx, 17, 18, 3.4, INKT, true); boosOog(ctx, 31, 18, 3.4, INKT, false);
  ctx.fillStyle = '#3cc8bb'; ctx.beginPath(); ctx.moveTo(38, 8); ctx.lineTo(44, -4); ctx.lineTo(48, 0); ctx.lineTo(42, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function tekenBallon(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(20, 46); ctx.quadraticCurveTo(26, 54, 20, 60); ctx.stroke();
  ctx.lineWidth = 2.2;
  const g = ctx.createRadialGradient(14, 14, 3, 20, 22, 22); g.addColorStop(0, '#ff9aa8'); g.addColorStop(1, '#d1495b');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(20, 22, 17, 21, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.moveTo(16, 43); ctx.lineTo(24, 43); ctx.lineTo(20, 47); ctx.closePath(); ctx.fill(); ctx.stroke();
  boosOog(ctx, 14, 20, 3, INKT, true); boosOog(ctx, 26, 20, 3, INKT, false);
  ctx.beginPath(); ctx.arc(20, 30, 5, 0.2, Math.PI - 0.2); ctx.stroke();
  ctx.restore();
}
// ---------- MAAN ----------
function tekenAlien(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.fillStyle = '#5a2aa8'; for (const x of [12, 22]) { ctx.fillRect(x - 3, 40, 6, 14); ctx.strokeRect(x - 3, 40, 6, 14); }
  ctx.fillStyle = '#7a4ac8'; rondRect(ctx, 6, 24, 22, 20, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#7aff8a'; ctx.beginPath(); ctx.ellipse(17, 14, 13, 11, 0, 0, TAU); ctx.fill(); ctx.stroke();
  for (const x of [10, 24]) { lijnDik(ctx, [[x, 6], [x + (x < 17 ? -4 : 4), -4]], '#7aff8a'); ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.arc(x + (x < 17 ? -4 : 4), -4, 2.6, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = INKT; for (const x of [12, 22]) { ctx.beginPath(); ctx.ellipse(x, 14, 3.6, 4.6, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#9aa4b8'; rondRect(ctx, -4, 28, 12, 6, 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function tekenKraterkruiper(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.4;
  ctx.fillStyle = '#5a5a6a'; for (const x of [10, 22, 34, 44]) { ctx.beginPath(); ctx.ellipse(x, 34, 4, 3, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = '#9a9aaa'; ctx.beginPath(); ctx.ellipse(28, 26, 22, 14, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(40,40,60,.4)'; for (const [x, y, r] of [[20, 20, 4], [34, 18, 5], [28, 24, 2.5]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#7aff8a'; ctx.beginPath(); ctx.ellipse(6, 28, 8, 6, 0, 0, TAU); ctx.fill(); ctx.stroke();
  boosOog(ctx, 4, 26, 2.4, INKT, true);
  ctx.restore();
}
function tekenUfo(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.fillStyle = 'rgba(160,230,255,.7)'; ctx.beginPath(); ctx.ellipse(30, 14, 12, 11, 0, Math.PI, 0); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#7aff8a'; ctx.beginPath(); ctx.arc(30, 12, 5, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INKT; ctx.beginPath(); ctx.arc(28, 11, 1.2, 0, TAU); ctx.arc(32, 11, 1.2, 0, TAU); ctx.fill();
  const g = ctx.createLinearGradient(0, 14, 0, 26); g.addColorStop(0, '#cfd6e6'); g.addColorStop(1, '#5a5e6a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(30, 19, 28, 8, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e'; for (const x of [12, 22, 38, 48]) { ctx.beginPath(); ctx.arc(x, 20, 2, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// ---------- NIEUWE EINDBAZEN ----------
// De Kroegbaas: een dikke barman met snor en een schort
function tekenKroegbaas(ctx) {
  ctx.save(); lijn(ctx, 3);
  ctx.fillStyle = '#1a1a22'; for (const x of [52, 88]) { ctx.fillRect(x - 9, 128, 18, 22); ctx.strokeRect(x - 9, 128, 18, 22); }
  ctx.fillStyle = '#f3ead6'; ctx.beginPath(); ctx.ellipse(70, 92, 48, 44, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3a6a3a'; ctx.beginPath(); ctx.moveTo(40, 80); ctx.lineTo(100, 80); ctx.lineTo(104, 134); ctx.lineTo(36, 134); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.moveTo(62, 52); ctx.lineTo(70, 60); ctx.lineTo(78, 52); ctx.lineTo(78, 66); ctx.lineTo(70, 60); ctx.lineTo(62, 66); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e8b08a'; ctx.beginPath(); ctx.arc(70, 30, 26, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3a2a1a'; ctx.beginPath(); ctx.ellipse(58, 40, 14, 6, 0.3, 0, TAU); ctx.ellipse(82, 40, 14, 6, -0.3, 0, TAU); ctx.fill();
  oog(ctx, 60, 26, 5, INKT); oog(ctx, 80, 26, 5, INKT);
  ctx.strokeStyle = INKT; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(52, 16); ctx.lineTo(66, 20); ctx.moveTo(88, 16); ctx.lineTo(74, 20); ctx.stroke();
  // bierpul in zijn hand
  ctx.lineWidth = 3; ctx.fillStyle = '#f2a33a'; rondRect(ctx, 6, 70, 24, 30, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.arc(12, 70, 6, 0, TAU); ctx.arc(24, 70, 6, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// De Brouwmachine: een grote ketel met buizen, meters en een rood oog
function tekenMachine(ctx) {
  ctx.save(); lijn(ctx, 3);
  ctx.fillStyle = '#3a3e4a'; ctx.fillRect(10, 128, 140, 24); ctx.strokeRect(10, 128, 140, 24);
  const g = ctx.createLinearGradient(20, 0, 140, 0); g.addColorStop(0, '#8a4a1c'); g.addColorStop(0.5, '#e8904a'); g.addColorStop(1, '#8a4a1c');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(24, 130); ctx.lineTo(24, 50); ctx.quadraticCurveTo(80, 10, 136, 50); ctx.lineTo(136, 130); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#5a5e6a'; ctx.fillRect(110, 0, 18, 40); ctx.strokeRect(110, 0, 18, 40);
  ctx.fillStyle = '#9aa4b8'; ctx.fillRect(0, 90, 30, 14); ctx.strokeRect(0, 90, 30, 14);
  ctx.fillStyle = '#f3ead6'; for (const x of [50, 110]) { ctx.beginPath(); ctx.arc(x, 100, 11, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, 100); ctx.lineTo(x + 6, 93); ctx.stroke(); }
  ctx.shadowColor = '#ff4a4a'; ctx.shadowBlur = 14; ctx.fillStyle = '#ff4a4a'; ctx.beginPath(); ctx.arc(80, 66, 14, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; ctx.stroke();
  ctx.fillStyle = INKT; ctx.beginPath(); ctx.arc(76, 66, 5, 0, TAU); ctx.fill();
  ctx.fillStyle = '#f2c14e'; for (let x = 30; x < 136; x += 12) { ctx.beginPath(); ctx.arc(x, 122, 2, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// De Eenwielerclown
function tekenClown(ctx) {
  ctx.save(); lijn(ctx, 3);
  ctx.beginPath(); ctx.arc(60, 132, 18, 0, TAU); ctx.fillStyle = '#2a2a3a'; ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#9aa4b8'; for (let i = 0; i < 6; i++) { const a = i * TAU / 6; ctx.beginPath(); ctx.moveTo(60, 132); ctx.lineTo(60 + Math.cos(a) * 16, 132 + Math.sin(a) * 16); ctx.stroke(); }
  lijn(ctx, 3); ctx.beginPath(); ctx.moveTo(60, 132); ctx.lineTo(60, 100); ctx.stroke();
  ctx.fillStyle = '#7a5cff'; ctx.fillRect(48, 96, 24, 8); ctx.strokeRect(48, 96, 24, 8);
  ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.ellipse(60, 74, 26, 26, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e'; for (const [x, y] of [[50, 66], [68, 78], [56, 88], [70, 62]]) { ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(60, 34, 20, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ff7a2c'; for (const z of [-1, 1]) { ctx.beginPath(); ctx.arc(60 + z * 22, 30, 10, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.arc(60, 38, 6, 0, TAU); ctx.fill(); ctx.stroke();
  oog(ctx, 52, 28, 4, INKT); oog(ctx, 68, 28, 4, INKT);
  ctx.strokeStyle = '#d1495b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(60, 42, 9, 0.2, Math.PI - 0.2); ctx.stroke();
  lijn(ctx, 3); ctx.fillStyle = '#3cc8bb'; ctx.beginPath(); ctx.moveTo(46, 18); ctx.lineTo(60, -6); ctx.lineTo(74, 18); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// Het Moederschip: een grote vliegende schotel met een alien erin
function tekenMoederschip(ctx) {
  ctx.save(); lijn(ctx, 3);
  ctx.fillStyle = 'rgba(160,230,255,.7)'; ctx.beginPath(); ctx.ellipse(100, 44, 42, 38, 0, Math.PI, 0); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#7aff8a'; ctx.beginPath(); ctx.ellipse(100, 36, 20, 18, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INKT; for (const x of [92, 108]) { ctx.beginPath(); ctx.ellipse(x, 34, 5, 7, 0, 0, TAU); ctx.fill(); }
  const g = ctx.createLinearGradient(0, 40, 0, 74); g.addColorStop(0, '#e6ecf5'); g.addColorStop(1, '#5a5e6a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(100, 56, 96, 20, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3a3e4a'; ctx.beginPath(); ctx.ellipse(100, 68, 40, 8, 0, 0, TAU); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 9; i++) { ctx.fillStyle = ['#f2c14e', '#d1495b', '#3cc8bb'][i % 3]; ctx.beginPath(); ctx.arc(24 + i * 19, 58, 4, 0, TAU); ctx.fill(); }
  ctx.restore();
}

function maakMonsterTexturen(scene) {
  tekenTextuur(scene, 'baas_kroegbaas', 140, 152, tekenKroegbaas);
  tekenTextuur(scene, 'baas_machine', 160, 152, tekenMachine);
  tekenTextuur(scene, 'baas_clown', 120, 152, tekenClown);
  tekenTextuur(scene, 'baas_moederschip', 200, 80, tekenMoederschip);
  // licht uit: zwart met een gat in het midden (het spel zet het gat op jouw plek)
  tekenTextuur(scene, 'donker', 960, 540, ctx => {
    const g = ctx.createRadialGradient(480, 270, 40, 480, 270, 110);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(5,3,10,.96)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 960, 540);
  });
  // taart in je gezicht
  tekenTextuur(scene, 'taartsplat', 760, 460, ctx => {
    ctx.fillStyle = '#f3ead6';
    for (let i = 0; i < 26; i++) { const a = i * TAU / 26, r = 170 + (i % 3) * 50; ctx.beginPath(); ctx.arc(380 + Math.cos(a) * r * 0.9, 230 + Math.sin(a) * r * 0.55, 60 + (i % 4) * 14, 0, TAU); ctx.fill(); }
    ctx.beginPath(); ctx.ellipse(380, 230, 260, 160, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#d1495b'; for (const [x, y] of [[300, 200], [430, 260], [380, 170], [250, 280]]) { ctx.beginPath(); ctx.arc(x, y, 16, 0, TAU); ctx.fill(); }
  });
  tekenTextuur(scene, 'darter', 40, 58, tekenDarter);
  tekenTextuur(scene, 'uitsmijter', 56, 74, tekenUitsmijter);
  tekenTextuur(scene, 'bierpul', 50, 48, tekenBierpul);
  tekenTextuur(scene, 'robot', 44, 54, ctx => { ctx.translate(2, 0); tekenRobot(ctx); });
  tekenTextuur(scene, 'stoomketel', 48, 50, tekenStoomketel);
  tekenTextuur(scene, 'drone', 58, 38, tekenDrone);
  tekenTextuur(scene, 'wipkip', 48, 46, ctx => { ctx.translate(4, 4); tekenWipkip(ctx); });
  tekenTextuur(scene, 'zandmonster', 50, 38, tekenZandmonster);
  tekenTextuur(scene, 'ballon', 42, 62, tekenBallon);
  tekenTextuur(scene, 'alien', 40, 56, ctx => { ctx.translate(4, 4); tekenAlien(ctx); });
  tekenTextuur(scene, 'kraterkruiper', 56, 40, tekenKraterkruiper);
  tekenTextuur(scene, 'ufo', 60, 30, tekenUfo);
  // hun kogels
  tekenTextuur(scene, 'dart', 22, 8, ctx => { lijnDik(ctx, [[2, 4], [16, 4]], '#9aa4b8'); ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(22, 4); ctx.lineTo(14, 8); ctx.closePath(); ctx.fill(); });
  tekenTextuur(scene, 'kurkje', 16, 16, ctx => kroonkurkKlein(ctx, 8, 8, 6));
  tekenTextuur(scene, 'stoom', 30, 30, ctx => { ctx.fillStyle = 'rgba(230,236,245,.85)'; for (const [x, y, r] of [[15, 15, 10], [8, 18, 7], [22, 18, 7]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); } });
  tekenTextuur(scene, 'schuimdruppel', 16, 18, ctx => { ctx.fillStyle = '#fffaf0'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(8, 1); ctx.quadraticCurveTo(15, 12, 8, 17); ctx.quadraticCurveTo(1, 12, 8, 1); ctx.fill(); ctx.stroke(); });
  tekenTextuur(scene, 'flesbom', 14, 30, ctx => { ctx.fillStyle = '#5fae4e'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(3, 28); ctx.lineTo(3, 12); ctx.lineTo(5, 9); ctx.lineTo(5, 2); ctx.lineTo(9, 2); ctx.lineTo(9, 9); ctx.lineTo(11, 12); ctx.lineTo(11, 28); ctx.closePath(); ctx.fill(); ctx.stroke(); });
  tekenTextuur(scene, 'zandbal', 18, 18, ctx => { ctx.fillStyle = '#e8c07a'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(9, 9, 7, 0, TAU); ctx.fill(); ctx.stroke(); });
  tekenTextuur(scene, 'laser', 34, 8, ctx => { ctx.shadowColor = '#7aff8a'; ctx.shadowBlur = 6; ctx.fillStyle = '#c8ffd0'; rondRect(ctx, 2, 2, 30, 4, 2); ctx.fill(); });
  tekenTextuur(scene, 'scherf', 12, 12, ctx => { ctx.fillStyle = 'rgba(160,230,180,.9)'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(1, 10); ctx.lineTo(6, 1); ctx.lineTo(11, 9); ctx.closePath(); ctx.fill(); ctx.stroke(); });
  tekenTextuur(scene, 'bal', 26, 26, ctx => { ctx.fillStyle = '#f2c14e'; ctx.strokeStyle = INKT; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(13, 13, 11, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.arc(13, 13, 11, -0.6, 0.6); ctx.lineTo(13, 13); ctx.fill(); ctx.fillStyle = '#3cc8bb'; ctx.beginPath(); ctx.arc(13, 13, 11, 2.5, 3.7); ctx.lineTo(13, 13); ctx.fill(); });
  tekenTextuur(scene, 'taart', 34, 22, ctx => { ctx.fillStyle = '#f3ead6'; ctx.strokeStyle = INKT; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(17, 10, 15, 7, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#c8924a'; ctx.beginPath(); ctx.moveTo(3, 12); ctx.lineTo(31, 12); ctx.lineTo(28, 20); ctx.lineTo(6, 20); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.arc(17, 6, 3, 0, TAU); ctx.fill(); });
  // pers die vanaf de zijkant over de vloer schuift (punten naar rechts)
  tekenTextuur(scene, 'perszij', 130, 50, ctx => { const g = ctx.createLinearGradient(0, 0, 0, 50); g.addColorStop(0, '#9aa4b8'); g.addColorStop(1, '#3a3e4a'); ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 3; ctx.fillRect(2, 4, 110, 42); ctx.strokeRect(2, 4, 110, 42); ctx.fillStyle = '#f2c14e'; for (let y = 6; y < 44; y += 12) { ctx.beginPath(); ctx.moveTo(112, y); ctx.lineTo(128, y + 6); ctx.lineTo(112, y + 12); ctx.closePath(); ctx.fill(); ctx.stroke(); } });
  tekenTextuur(scene, 'persblok', 120, 70, ctx => { const g = ctx.createLinearGradient(0, 0, 0, 70); g.addColorStop(0, '#9aa4b8'); g.addColorStop(1, '#3a3e4a'); ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 3; ctx.fillRect(2, 2, 116, 66); ctx.strokeRect(2, 2, 116, 66); ctx.fillStyle = '#f2c14e'; for (let x = 6; x < 116; x += 20) { ctx.beginPath(); ctx.moveTo(x, 58); ctx.lineTo(x + 10, 58); ctx.lineTo(x + 4, 66); ctx.closePath(); ctx.fill(); } });
  tekenTextuur(scene, 'mol', 50, 46, tekenMol);
  tekenTextuur(scene, 'veer', 30, 12, ctx => {
    ctx.fillStyle = '#ffc0d8'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(2, 6); ctx.quadraticCurveTo(14, -2, 28, 6); ctx.quadraticCurveTo(14, 14, 2, 6); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(2, 6); ctx.lineTo(28, 6); ctx.stroke();
  });
  tekenTextuur(scene, 'neushoorn', 70, 52, tekenNeushoorn);
  tekenTextuur(scene, 'gier', 72, 44, tekenGier);
  tekenTextuur(scene, 'baas_salamander', 200, 84, tekenSalamander);
  tekenTextuur(scene, 'baas_lepelaar', 140, 154, tekenLepelaar);
  tekenTextuur(scene, 'baas_lepelaar_glij', 140, 154, tekenLepelaarGlij);
  tekenTextuur(scene, 'vliegvis', 56, 44, tekenVliegvis);
  tekenTextuur(scene, 'vliegpinguin', 58, 44, tekenVliegpinguin);
  tekenTextuur(scene, 'adelaar', 76, 46, tekenAdelaar);
  tekenTextuur(scene, 'ptero', 92, 54, tekenPtero);
  tekenTextuur(scene, 'vriesvlok', 52, 52, tekenVriesvlok);
  tekenTextuur(scene, 'vuurmot', 56, 44, tekenVuurmot);
  tekenTextuur(scene, 'ijsscherf', 12, 22, ctx => {
    ctx.fillStyle = '#dff2ff'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(2, 2); ctx.lineTo(10, 2); ctx.lineTo(6, 20); ctx.closePath(); ctx.fill(); ctx.stroke();
  });
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
