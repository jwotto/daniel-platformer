// Het allerlaatste level: de Terminatorgrot van Alexander.
// Een vulkaangrot vol Alexander-terminatorrobots: vliegende Alexanders met een raketrugzak
// en lopende spinrobot-Alexanders. Alle Alexanders hebben kort bruin haar, een kort bruin baardje,
// een blauwe jas, een spijkerbroek en een zonnebril.
// De eindbaas is Alexander zelf, met Robot-Tara (zijn kat) en Daniel (zijn slaaf, een klein
// mannetje met een groot hoofd dat de hele tijd roept dat hij een noob is, en scheten laat).

// ---------- TEKENINGEN ----------
const ALEX = { huid: '#f1c49b', haar: '#5a3a1a', baard: '#6b4422', jas: ['#3a72d8', '#1a3a80'], broek: ['#4a6a9a', '#2a3f66'], metaal: ['#9aa4b8', '#3a3e4a'] };

// het hoofd van Alexander: kort bruin haar, kort baardje, zonnebril (en een stukje robot op zijn wang)
function alexKop(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = INKT; ctx.lineWidth = Math.max(1.6, r * 0.12);
  ctx.fillStyle = ALEX.huid; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
  // kort baardje langs de kaak en kin
  ctx.fillStyle = ALEX.baard;
  ctx.beginPath(); ctx.arc(x, y + r * 0.05, r, 0.12 * Math.PI, 0.88 * Math.PI); ctx.arc(x, y + r * 0.15, r * 0.62, 0.8 * Math.PI, 0.2 * Math.PI, true); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y + r * 0.42, r * 0.3, r * 0.1, 0, 0, TAU); ctx.fill(); // snorretje
  // kort bruin haar
  ctx.fillStyle = ALEX.haar;
  ctx.beginPath(); ctx.arc(x, y, r * 1.02, 1.08 * Math.PI, 1.92 * Math.PI); ctx.quadraticCurveTo(x + r * 0.4, y - r * 0.55, x - r * 0.9, y - r * 0.35); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r, 1.05 * Math.PI, 1.95 * Math.PI); ctx.stroke();
  // zonnebril
  ctx.fillStyle = '#0a0a12';
  rondRect(ctx, x - r * 0.88, y - r * 0.24, r * 0.78, r * 0.42, r * 0.14); ctx.fill();
  rondRect(ctx, x + r * 0.1, y - r * 0.24, r * 0.78, r * 0.42, r * 0.14); ctx.fill();
  ctx.fillRect(x - r * 0.12, y - r * 0.16, r * 0.24, r * 0.1);
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = Math.max(1, r * 0.07);
  ctx.beginPath(); ctx.moveTo(x - r * 0.75, y - r * 0.12); ctx.lineTo(x - r * 0.5, y - r * 0.12); ctx.moveTo(x + r * 0.22, y - r * 0.12); ctx.lineTo(x + r * 0.47, y - r * 0.12); ctx.stroke();
  // terminator: metalen plaatje op zijn wang met een rood lampje
  ctx.fillStyle = ALEX.metaal[0]; ctx.strokeStyle = INKT; ctx.lineWidth = Math.max(1, r * 0.06);
  ctx.beginPath(); ctx.moveTo(x + r * 0.55, y + r * 0.22); ctx.lineTo(x + r * 0.95, y + r * 0.1); ctx.lineTo(x + r * 0.85, y + r * 0.5); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ff3a2c'; ctx.beginPath(); ctx.arc(x + r * 0.78, y + r * 0.27, r * 0.07, 0, TAU); ctx.fill();
  ctx.restore();
}

// romp met blauwe jas, en een spijkerbroek
function alexLijf(ctx, x, y, w, h, beenH) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.4;
  // benen (spijkerbroek) en zwarte schoenen
  if (beenH) {
    const g = ctx.createLinearGradient(0, y + h, 0, y + h + beenH);
    g.addColorStop(0, ALEX.broek[0]); g.addColorStop(1, ALEX.broek[1]);
    ctx.fillStyle = g;
    ctx.fillRect(x + w * 0.12, y + h - 2, w * 0.34, beenH); ctx.strokeRect(x + w * 0.12, y + h - 2, w * 0.34, beenH);
    ctx.fillRect(x + w * 0.54, y + h - 2, w * 0.34, beenH); ctx.strokeRect(x + w * 0.54, y + h - 2, w * 0.34, beenH);
    ctx.fillStyle = '#16161c';
    rondRect(ctx, x + w * 0.04, y + h + beenH - 6, w * 0.44, 8, 3); ctx.fill(); ctx.stroke();
    rondRect(ctx, x + w * 0.52, y + h + beenH - 6, w * 0.44, 8, 3); ctx.fill(); ctx.stroke();
  }
  // blauwe jas
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, ALEX.jas[0]); g.addColorStop(1, ALEX.jas[1]);
  ctx.fillStyle = g; rondRect(ctx, x, y, w, h, w * 0.18); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(10,16,40,.6)'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(x + w / 2, y + 4); ctx.lineTo(x + w / 2, y + h - 2); ctx.stroke();
  ctx.fillStyle = '#f2c14e';
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x + w / 2 + 4, y + h * (0.25 + i * 0.25), Math.max(1.2, w * 0.04), 0, TAU); ctx.fill(); }
  // kraag
  ctx.fillStyle = ALEX.jas[1]; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(x + w * 0.22, y); ctx.lineTo(x + w / 2, y + h * 0.22); ctx.lineTo(x + w * 0.78, y); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// raketrugzak (achter het lijf)
function alexRugzak(ctx, x, y, w, h) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  g.addColorStop(0, ALEX.metaal[1]); g.addColorStop(0.5, ALEX.metaal[0]); g.addColorStop(1, ALEX.metaal[1]);
  ctx.fillStyle = g;
  rondRect(ctx, x, y, w * 0.42, h, 5); ctx.fill(); ctx.stroke();
  rondRect(ctx, x + w * 0.58, y, w * 0.42, h, 5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d1495b'; ctx.fillRect(x + 2, y + 4, w * 0.42 - 4, 4); ctx.fillRect(x + w * 0.58 + 2, y + 4, w * 0.42 - 4, 4);
  ctx.restore();
}

function tekenVlam(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#fff6c8'); g.addColorStop(0.4, '#ffb03c'); g.addColorStop(1, 'rgba(255,60,30,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.quadraticCurveTo(x - w * 0.3, y + h * 0.6, x, y + h); ctx.quadraticCurveTo(x + w * 0.3, y + h * 0.6, x + w / 2, y); ctx.closePath(); ctx.fill();
}

// metalen spinnenpoten (n per kant), vanaf het midden naar de grond
function spinPoten(ctx, cx, cy, n, breed, grondY) {
  ctx.save();
  for (const kant of [-1, 1]) for (let i = 0; i < n; i++) {
    const knieX = cx + kant * (breed * (0.35 + i * 0.18)), knieY = cy - 14 - (i % 2) * 6;
    const voetX = cx + kant * (breed * (0.55 + i * 0.22)), voetY = grondY;
    ctx.strokeStyle = INKT; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx + kant * 8, cy); ctx.lineTo(knieX, knieY); ctx.lineTo(voetX, voetY); ctx.stroke();
    ctx.strokeStyle = ALEX.metaal[0]; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx + kant * 8, cy); ctx.lineTo(knieX, knieY); ctx.lineTo(voetX, voetY); ctx.stroke();
    ctx.fillStyle = '#ff3a2c'; ctx.beginPath(); ctx.arc(knieX, knieY, 2.2, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

function tekenRaketlex(ctx) {
  alexRugzak(ctx, 18, 30, 28, 30);
  tekenVlam(ctx, 23, 60, 9, 16); tekenVlam(ctx, 41, 60, 9, 16);
  alexLijf(ctx, 20, 32, 24, 24, 14);
  // armen wijd (vliegen!)
  ctx.strokeStyle = INKT; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(22, 38); ctx.lineTo(8, 46); ctx.moveTo(42, 38); ctx.lineTo(56, 30); ctx.stroke();
  ctx.strokeStyle = ALEX.jas[0]; ctx.lineWidth = 4.5;
  ctx.beginPath(); ctx.moveTo(22, 38); ctx.lineTo(8, 46); ctx.moveTo(42, 38); ctx.lineTo(56, 30); ctx.stroke();
  // armkanon
  ctx.fillStyle = ALEX.metaal[1]; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6; rondRect(ctx, 52, 25, 10, 8, 2); ctx.fill(); ctx.stroke();
  alexKop(ctx, 32, 18, 13);
}

function tekenSpinlex(ctx) {
  spinPoten(ctx, 42, 44, 3, 38, 62);
  ctx.fillStyle = ALEX.metaal[1]; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(42, 46, 22, 10, 0, 0, TAU); ctx.fill(); ctx.stroke();
  alexLijf(ctx, 31, 24, 22, 20, 0);
  alexKop(ctx, 42, 15, 12);
}

function tekenAlexBaas(ctx) {
  alexRugzak(ctx, 38, 76, 64, 56);
  alexLijf(ctx, 40, 72, 60, 62, 38);
  // armen: links een vuist, rechts een groot armkanon
  ctx.strokeStyle = INKT; ctx.lineWidth = 15; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(44, 84); ctx.lineTo(20, 116); ctx.moveTo(96, 84); ctx.lineTo(118, 108); ctx.stroke();
  ctx.strokeStyle = ALEX.jas[0]; ctx.lineWidth = 11;
  ctx.beginPath(); ctx.moveTo(44, 84); ctx.lineTo(20, 116); ctx.moveTo(96, 84); ctx.lineTo(118, 108); ctx.stroke();
  ctx.fillStyle = ALEX.huid; ctx.strokeStyle = INKT; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(18, 120, 8, 0, TAU); ctx.fill(); ctx.stroke();
  const g = ctx.createLinearGradient(0, 98, 0, 124); g.addColorStop(0, ALEX.metaal[0]); g.addColorStop(1, ALEX.metaal[1]);
  ctx.fillStyle = g; rondRect(ctx, 106, 98, 30, 24, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ff3a2c'; ctx.beginPath(); ctx.arc(132, 110, 4, 0, TAU); ctx.fill();
  // riem met een A
  ctx.fillStyle = '#16161c'; ctx.fillRect(40, 128, 60, 7);
  ctx.fillStyle = '#f2c14e'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('A', 70, 135);
  alexKop(ctx, 70, 40, 30);
}

function tekenAlexSpin(ctx) {
  spinPoten(ctx, 90, 72, 3, 80, 118);
  const g = ctx.createLinearGradient(0, 50, 0, 100); g.addColorStop(0, ALEX.metaal[0]); g.addColorStop(1, ALEX.metaal[1]);
  ctx.fillStyle = g; ctx.strokeStyle = INKT; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(90, 78, 48, 22, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ff3a2c'; for (const x of [62, 78, 102, 118]) { ctx.beginPath(); ctx.arc(x, 84, 3, 0, TAU); ctx.fill(); }
  alexLijf(ctx, 68, 34, 44, 34, 0);
  alexKop(ctx, 90, 24, 22);
}

// Robot-Tara: een donkergrijze robotkat met korte oortjes en rode ogen
function tekenRobotTara(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  // staart van metalen schakels
  for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? '#5a5a66' : '#3a3a44'; ctx.beginPath(); ctx.arc(56 + i * 2, 26 - i * 4, 4, 0, TAU); ctx.fill(); ctx.stroke(); }
  // pootjes
  ctx.fillStyle = '#2a2a32'; for (const x of [22, 30, 44, 52]) { ctx.fillRect(x - 3, 34, 6, 12); ctx.strokeRect(x - 3, 34, 6, 12); }
  const g = ctx.createLinearGradient(0, 18, 0, 42); g.addColorStop(0, '#5a5a66'); g.addColorStop(1, '#2a2a32');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(38, 30, 20, 11, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e'; for (const x of [30, 38, 46]) { ctx.beginPath(); ctx.arc(x, 26, 1.6, 0, TAU); ctx.fill(); }
  // kop met korte oortjes
  ctx.fillStyle = '#4a4a56';
  ctx.beginPath(); ctx.moveTo(6, 14); ctx.lineTo(9, 5); ctx.lineTo(14, 12); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(18, 11); ctx.lineTo(23, 5); ctx.lineTo(25, 14); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(15, 21, 11, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.shadowColor = '#ff2a1c'; ctx.shadowBlur = 6; ctx.fillStyle = '#ff3a2c';
  ctx.fillRect(8, 18, 5, 3); ctx.fillRect(16, 18, 5, 3); ctx.restore();
  ctx.strokeStyle = '#9aa4b8'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(2, 24); ctx.lineTo(8, 25); ctx.moveTo(2, 28); ctx.lineTo(8, 27); ctx.stroke();
  ctx.restore();
}

// Daniel: klein mannetje, groot hoofd, halflang bruin haar
function tekenDanielNoob(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.fillStyle = '#2a3f66'; ctx.fillRect(18, 50, 5, 12); ctx.strokeRect(18, 50, 5, 12); ctx.fillRect(27, 50, 5, 12); ctx.strokeRect(27, 50, 5, 12);
  ctx.fillStyle = '#5fae4e'; rondRect(ctx, 15, 36, 20, 17, 5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 7px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('NOOB', 25, 47);
  // halflang haar achter het hoofd
  ctx.fillStyle = '#6b4422'; ctx.beginPath(); ctx.ellipse(25, 22, 19, 20, 0, Math.PI * 0.95, Math.PI * 2.05); ctx.lineTo(44, 34); ctx.lineTo(6, 34); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f1c49b'; ctx.beginPath(); ctx.arc(25, 22, 15, 0, TAU); ctx.fill(); ctx.stroke();
  // pony
  ctx.fillStyle = '#6b4422'; ctx.beginPath(); ctx.arc(25, 20, 16, Math.PI * 1.05, Math.PI * 1.95); ctx.quadraticCurveTo(25, 14, 10, 16); ctx.closePath(); ctx.fill();
  ctx.fillStyle = INKT; ctx.beginPath(); ctx.arc(20, 23, 2, 0, TAU); ctx.arc(30, 23, 2, 0, TAU); ctx.fill();
  ctx.strokeStyle = INKT; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(25, 28, 4, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
  ctx.fillStyle = 'rgba(232,120,110,.6)'; ctx.beginPath(); ctx.arc(15, 27, 2.5, 0, TAU); ctx.arc(35, 27, 2.5, 0, TAU); ctx.fill();
  ctx.restore();
}

function maakAlexanderTexturen(scene) {
  tekenTextuur(scene, 'raketlex', 64, 78, tekenRaketlex);
  tekenTextuur(scene, 'spinlex', 84, 64, tekenSpinlex);
  tekenTextuur(scene, 'baas_alexander', 140, 180, tekenAlexBaas);
  tekenTextuur(scene, 'baas_alexspin', 180, 122, tekenAlexSpin);
  tekenTextuur(scene, 'robottara', 66, 48, tekenRobotTara);
  tekenTextuur(scene, 'danielnoob', 50, 64, tekenDanielNoob);
  tekenTextuur(scene, 'alexvlam', 50, 44, ctx => { tekenVlam(ctx, 14, 0, 16, 44); tekenVlam(ctx, 36, 0, 16, 44); });
  tekenTextuur(scene, 'raketje', 28, 12, ctx => {
    tekenVlam(ctx, 0, 6, 0, 0);
    ctx.fillStyle = '#ffb03c'; ctx.beginPath(); ctx.moveTo(0, 6); ctx.lineTo(8, 2); ctx.lineTo(8, 10); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d8dce6'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6; rondRect(ctx, 7, 3, 15, 6, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d1495b'; ctx.beginPath(); ctx.moveTo(21, 3); ctx.lineTo(27, 6); ctx.lineTo(21, 9); ctx.closePath(); ctx.fill(); ctx.stroke();
  });
  tekenTextuur(scene, 'muisraket', 30, 18, ctx => {
    ctx.fillStyle = '#ffb03c'; ctx.beginPath(); ctx.moveTo(0, 9); ctx.lineTo(8, 5); ctx.lineTo(8, 13); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#9aa4b8'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(17, 10, 10, 6, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(18, 4, 3, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff3a2c'; ctx.beginPath(); ctx.arc(24, 9, 1.6, 0, TAU); ctx.fill();
  });
  tekenTextuur(scene, 'scheetwolk', 80, 56, ctx => {
    ctx.fillStyle = 'rgba(140,200,60,.55)';
    for (const [x, y, r] of [[40, 30, 22], [22, 32, 15], [58, 32, 15], [32, 18, 13], [50, 18, 13], [40, 40, 14]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    ctx.fillStyle = 'rgba(200,240,120,.5)'; for (const [x, y] of [[30, 26], [48, 34], [42, 20]]) { ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill(); }
  });
}

// ---------- DE MONSTERS ----------
class AlexanderDeel {
  // vliegende Alexander met een raketrugzak: hangt schuin boven je en vuurt raketjes
  maakRaketlex(x, y) {
    const L = this.moeilijkheid(x);
    const v = this.maakVlieger('raketlex', 'raketlex', x, y);
    v.hp = 6 + Math.floor(L * 1.2);
    v.shots = 7; v.schietT = 1.2 + Math.random(); v.zij = Math.random() < 0.5 ? -1 : 1;
    v.jaagSnelheid = 120 + Math.min(80, L * 10);
    return v;
  }

  raketlexUpdate(v, dt, dx, dy, inBeeld) {
    const sp = this.speler;
    v.fase += dt;
    if (Math.abs(dx) < 700) {
      const doelX = sp.x + v.zij * 210, doelY = Math.max(100, sp.y - 210);
      v.x += Phaser.Math.Clamp(doelX - v.x, -v.jaagSnelheid * dt, v.jaagSnelheid * dt);
      v.basisY += Phaser.Math.Clamp(doelY - v.basisY, -90 * dt, 90 * dt);
    }
    v.y = v.basisY + Math.sin(v.fase * 3.2) * 10;
    v.setFlipX(dx < 0);
    v.rotation = Math.sin(v.fase * 2.4) * 0.1;
    v.schietT -= dt;
    if (v.schietT <= 0 && inBeeld && Math.abs(dx) < 650) {
      v.schietT = 2.2;
      const d = Math.hypot(dx, dy) || 1;
      const k = this.kogel('raketje', v.x, v.y, dx / d * 330, dy / d * 330, 0);
      k.setRotation(Math.atan2(dy, dx));
      Geluid.effect('schiet');
    }
  }

  // lopende spinrobot-Alexander: rent heen en weer, springt op je af en schiet laser uit zijn zonnebril
  spinlexUpdate(v, dt, dx, dy, dichtbij, patrouille) {
    const opGrond = v.body.blocked.down || v.body.touching.down;
    v.scaleY = 1 + Math.sin(this.tijd * 22) * 0.04;
    if (!opGrond) return;
    if (v.actieT <= 0 && dichtbij) {
      v.actieT = 1.5 + Math.random() * 0.6;
      v.setFlipX(dx < 0);
      if (Math.random() < 0.5 && Math.abs(dy) < 80) {
        const k = this.kogel('laser', v.x + Math.sign(dx) * 20, v.y - 50, Math.sign(dx) * 540, 0, 0);
        k.setTint(0xff3a2c).setFlipX(dx < 0);
        Geluid.effect('laser');
      } else {
        v.body.setVelocity(Phaser.Math.Clamp(dx * 1.4, -340, 340), -560);
        Geluid.effect('spring');
      }
    } else patrouille(v, 1.6);
    v.setFlipX(v.body.velocity.x < 0);
  }

  // ---------- DE EINDBAAS ----------
  alexStart(b) {
    b.setPosition(700, 150);
    b.status = 'zweeft'; b.timer = 2.4; b.beurt = 0; b.t = 0;
    this.alexLichaam(b);
    this.alexVlam = this.add.image(b.x, b.y, 'alexvlam').setDepth(8).setOrigin(0.5, 0);
    this.alexSchild = 0; this.alexMeldT = 0;
    this.alexBel = this.add.circle(b.x, b.y, 100, 0x7aff8a, 0.22).setStrokeStyle(4, 0x7aff8a, 0.8).setDepth(10).setVisible(false);
    this.alexG = this.add.graphics().setDepth(12);
    this.alexLaser = null; this.alexLava = null; this.alexKlonen = [];
    // Robot-Tara
    const tara = this.vijanden.create(300, 440, 'robottara').setOrigin(0.5, 1).setDepth(9);
    tara.body.setSize(50, 30).setOffset(8, 16);
    tara.hulp = 'tara'; tara.loopt = true; tara.hp = 999; tara.uit = 0;
    // Daniel de noob
    const dan = this.vijanden.create(560, 440, 'danielnoob').setOrigin(0.5, 1).setDepth(9);
    dan.body.setSize(30, 56).setOffset(10, 6);
    dan.hulp = 'daniel'; dan.loopt = true; dan.hp = 999; dan.richting = 1; dan.praatT = 1;
    this.alexTara = tara; this.alexDaniel = dan;
    this.alexPraat = this.add.text(0, 0, 'Ik ben een noob!', {
      fontFamily: FONT, fontSize: '15px', fontStyle: 'bold', color: '#0a1028', backgroundColor: '#fffaf0', padding: { x: 6, y: 3 },
    }).setOrigin(0.5, 1).setDepth(30).setVisible(false);
    this.time.delayedCall(900, () => this.baasRoep('Hasta la vista, flesje!'));
  }

  // de botsdoos passend maken bij het plaatje (na het wisselen tussen gewoon en spin)
  alexLichaam(b) {
    b.body.setSize(b.width * 0.6, b.height * 0.7).setOffset(b.width * 0.2, b.height * 0.18);
  }

  alexBezig(b, ms) {
    b.status = 'bezig';
    this.time.delayedCall(ms, () => { if (b.active && b.status === 'bezig') { b.status = 'zweeft'; b.timer = b.woedend ? 0.7 : 1.3; } });
  }

  alexUpdate(b, dt, woede) {
    const sp = this.speler, tara = this.alexTara, dan = this.alexDaniel;
    b.t += dt;
    // zweven met de raketrugzak
    if (b.status === 'zweeft') {
      const doelX = 480 + Math.sin(b.t * 0.7) * 280, doelY = 150 + Math.sin(b.t * 1.3) * 35;
      b.x += (doelX - b.x) * Math.min(1, dt * 2.5); b.y += (doelY - b.y) * Math.min(1, dt * 2.5);
      b.timer -= dt * woede * 0.8;
      if (b.timer <= 0) this.alexAanval(b);
    }
    if (b.status !== 'spin') b.setFlipX(sp.x < b.x); // het plaatje kijkt naar rechts
    this.alexVlam.setVisible(b.status !== 'spin').setPosition(b.x + (b.flipX ? 0 : 0), b.y + 42).setScale(1, 0.8 + Math.random() * 0.4);
    // het noob-schild
    if (this.alexSchild > 0) {
      this.alexSchild -= dt;
      this.alexBel.setVisible(true).setPosition(b.x, b.y).setRadius(96 + Math.sin(b.t * 8) * 4);
      if (this.alexSchild <= 0) this.alexBel.setVisible(false);
    }
    this.alexMeldT -= dt;
    // Robot-Tara loopt achter je aan
    if (tara && tara.active) {
      tara.x = Phaser.Math.Clamp(tara.x, 40, 920);
      const opGrond = tara.body.blocked.down || tara.body.touching.down;
      if (tara.uit > 0) { tara.uit -= dt; tara.body.velocity.x = 0; if (tara.uit <= 0) tara.clearTint(); }
      else if (opGrond && !tara.springt) { const dx = sp.x - tara.x; tara.body.velocity.x = Math.abs(dx) > 30 ? Math.sign(dx) * 110 : 0; tara.setFlipX(dx > 0); }
      if (tara.springt && opGrond && tara.body.velocity.y >= 0) tara.springt = false;
    }
    // Daniel drentelt rond en roept dat hij een noob is
    if (dan && dan.active) {
      if (!dan.vliegt) {
        dan.x = Phaser.Math.Clamp(dan.x, 40, 920);
        if (dan.x < 120) dan.richting = 1; else if (dan.x > 840) dan.richting = -1;
        dan.body.velocity.x = dan.richting * 60; dan.setFlipX(dan.richting < 0);
      }
      dan.praatT -= dt;
      if (dan.praatT <= 0) { dan.praatT = 3.2; this.alexZeg(this.alexSchild > 0 ? 'IK BEN EEN NOOB!!' : 'Ik ben een noob!'); }
      this.alexPraat.setPosition(dan.x, dan.y - 66);
    }
    // muisraketten zoeken je op
    for (const k of this.kogels.getChildren()) {
      if (k.zoekt > 0) {
        k.zoekt -= dt;
        const v = k.body.velocity, sn = Math.hypot(v.x, v.y) || 1;
        const doel = Math.atan2(sp.y - 30 - k.y, sp.x - k.x), nu = Math.atan2(v.y, v.x);
        const hoek = nu + Phaser.Math.Clamp(Phaser.Math.Angle.Wrap(doel - nu), -3 * dt, 3 * dt);
        k.body.setVelocity(Math.cos(hoek) * sn, Math.sin(hoek) * sn); k.setRotation(hoek);
      }
      // in een scheetwolk loop je langzamer
      if (k.scheet && Phaser.Math.Distance.Between(k.x, k.y, sp.x, sp.y - 30) < 46 * k.scale) sp.body.velocity.x *= 0.82;
    }
    // laserstralen uit de zonnebril
    this.alexG.clear();
    if (this.alexLaser) {
      const L = this.alexLaser; L.t += dt;
      const ogen = { x: b.x + (b.flipX ? -6 : 6), y: b.y - 50 };
      const f = Phaser.Math.Clamp((L.t - 0.6) / 1.3, 0, 1);
      const x = L.van + (L.naar - L.van) * f;
      if (L.t < 0.6) this.alexG.lineStyle(2, 0xff3a2c, 0.5).lineBetween(ogen.x, ogen.y, x, 470);
      else {
        for (const o of [-12, 12]) {
          this.alexG.lineStyle(12, 0xff3a2c, 0.45).lineBetween(ogen.x + o, ogen.y, x + o, 470);
          this.alexG.lineStyle(4, 0xfff0e0, 1).lineBetween(ogen.x + o, ogen.y, x + o, 470);
        }
        const lijn = new Phaser.Geom.Line(ogen.x, ogen.y, x, 470);
        if (this.onkwetsbaar <= 0 && Phaser.Geom.Intersects.LineToRectangle(lijn, sp.getBounds())) this.schade(Math.sign(sp.x - x) || 1);
      }
      if (L.t > 1.9) this.alexLaser = null;
    }
    // de lava stijgt
    if (this.alexLava) {
      const lv = this.alexLava;
      if (lv.heet && this.onkwetsbaar <= 0 && sp.y > lv.r.y + 8) { this.schade(Math.sign(480 - sp.x) || 1); sp.body.setVelocityY(-760); }
    }
  }

  alexZeg(t) {
    const p = this.alexPraat; if (!p) return;
    p.setText(t).setVisible(true);
    this.time.delayedCall(1500, () => { if (p.active) p.setVisible(false); });
  }

  alexAanval(b) {
    const lijst = ['raketregen', 'klauwen', 'laser', 'scheetwolk', 'kloon', 'muisraketten', 'spin', 'scheetraket', 'lava', 'noobschild'];
    const a = lijst[b.beurt % lijst.length]; b.beurt++;
    const sp = this.speler, tara = this.alexTara, dan = this.alexDaniel;
    const klaar = () => !b.active || this.gewonnen || this.dood;
    if (a === 'raketregen') {
      this.baasRoep('Raketregen!');
      this.tweens.add({ targets: b, y: 125, duration: 400 });
      for (let i = 0; i < 14; i++) this.time.delayedCall(450 + i * 110, () => {
        if (klaar()) return;
        const tx = Phaser.Math.Between(40, 920), d = Math.hypot(tx - b.x, 470 - b.y) || 1;
        const k = this.kogel('raketje', b.x, b.y + 30, (tx - b.x) / d * 480, (470 - b.y) / d * 480, 0);
        k.setRotation(Math.atan2(470 - b.y, tx - b.x));
        Geluid.effect('schiet');
      });
      this.alexBezig(b, 2300);
    } else if (a === 'klauwen') {
      this.baasRoep('Robot-Tara: MIAUW! Laserklauwen!');
      if (tara && tara.active && tara.uit <= 0) {
        tara.springt = true; tara.setTint(0xff8a8a);
        tara.body.setVelocity(Phaser.Math.Clamp((sp.x - tara.x) * 1.6, -560, 560), -640);
        this.time.delayedCall(900, () => { if (tara.active && tara.uit <= 0) tara.clearTint(); });
        Geluid.effect('dash');
      }
      this.alexBezig(b, 1100);
    } else if (a === 'laser') {
      this.baasRoep('Zonnebrillaser!');
      const r = sp.x > 480 ? 1 : -1;
      this.alexLaser = { t: 0, van: Phaser.Math.Clamp(sp.x - r * 340, 20, 940), naar: Phaser.Math.Clamp(sp.x + r * 340, 20, 940) };
      Geluid.effect('laser');
      this.alexBezig(b, 2000);
    } else if (a === 'scheetwolk') {
      this.baasRoep('Daniel: PRRRRRT!');
      if (dan && dan.active) for (const o of [-70, 0, 70]) {
        const k = this.kogel('scheetwolk', dan.x + o, dan.y - 30, o * 0.4, -20, 0);
        k.golf = true; k.scheet = true; k.leeft = 4.5; k.setScale(0.5);
        this.tweens.add({ targets: k, scale: 1.4, duration: 900 });
      }
      Geluid.effect('plop');
      this.alexBezig(b, 1300);
    } else if (a === 'kloon') {
      this.baasRoep('Kloonleger! Welke is de echte?');
      const plekken = Phaser.Utils.Array.Shuffle([180, 480, 780]);
      b.x = plekken[0];
      for (const x of plekken.slice(1)) {
        const k = this.vijanden.create(x, b.y, 'baas_alexander').setDepth(9);
        k.body.setAllowGravity(false); k.body.setSize(84, 120);
        k.hulp = 'kloon'; k.hp = 999; k.fase = Math.random() * 6;
        this.alexKlonen.push(k);
        for (let i = 0; i < 2; i++) this.time.delayedCall(800 + i * 1300, () => {
          if (!k.active || klaar()) return;
          const d = Math.hypot(sp.x - k.x, sp.y - k.y) || 1;
          this.kogel('raketje', k.x, k.y, (sp.x - k.x) / d * 360, (sp.y - 30 - k.y) / d * 360, 0).setRotation(Math.atan2(sp.y - k.y, sp.x - k.x));
        });
        this.tweens.add({ targets: k, y: k.y + 30, yoyo: true, repeat: -1, duration: 500 + Math.random() * 300 });
        this.time.delayedCall(4500, () => { if (k.active) { this.vonken.explode(16, k.x, k.y); k.destroy(); } });
      }
      this.vonken.explode(20, b.x, b.y);
      Geluid.effect('dubbel');
      this.alexBezig(b, 3200);
    } else if (a === 'muisraketten') {
      this.baasRoep('Robot-Tara: muisraketten!');
      if (tara && tara.active) for (let i = 0; i < 3; i++) this.time.delayedCall(i * 250, () => {
        if (klaar() || !tara.active) return;
        const k = this.kogel('muisraket', tara.x, tara.y - 30, (i - 1) * 160, -280, 0);
        k.zoekt = 2.6; k.leeft = 4;
        Geluid.effect('schiet');
      });
      this.alexBezig(b, 1400);
    } else if (a === 'spin') {
      this.baasRoep('SPINVORM!');
      b.status = 'spin';
      b.setTexture('baas_alexspin').setFlipX(false); this.alexLichaam(b);
      Geluid.effect('smash');
      const ren = (n) => {
        if (klaar()) return;
        if (n === 0) {
          b.setTexture('baas_alexander'); this.alexLichaam(b);
          this.tweens.add({ targets: b, y: 150, duration: 500, onComplete: () => { if (b.active) { b.status = 'zweeft'; b.timer = 1; } } });
          return;
        }
        const doel = Phaser.Math.Clamp(sp.x + Math.sign(sp.x - b.x || 1) * 220, 100, 860);
        this.tweens.add({ targets: b, x: doel, duration: 650, ease: 'Quad.easeIn', onComplete: () => { this.cameras.main.shake(120, 0.01); Geluid.effect('smash'); this.time.delayedCall(250, () => ren(n - 1)); } });
      };
      this.tweens.add({ targets: b, y: 410, duration: 400, onComplete: () => ren(b.woedend ? 3 : 2) });
    } else if (a === 'scheetraket') {
      this.baasRoep('Daniel: SCHEETRAKET!');
      if (dan && dan.active) {
        dan.vliegt = true; dan.body.setAllowGravity(false); dan.body.setVelocity(0, 0);
        const r = dan.x < 480 ? 1 : -1, y = Phaser.Math.Clamp(sp.y - 20, 160, 440);
        this.tweens.add({ targets: dan, y, duration: 300, onComplete: () => {
          if (!dan.active) return;
          this.tweens.add({ targets: dan, x: r > 0 ? 920 : 40, duration: 1100, ease: 'Linear',
            onUpdate: () => { if (Math.random() < 0.25) { const k = this.kogel('scheetwolk', dan.x - r * 20, dan.y - 30, 0, 0, 0); k.golf = true; k.scheet = true; k.leeft = 1.6; k.setScale(0.6); } },
            onComplete: () => { if (dan.active) { dan.vliegt = false; dan.body.setAllowGravity(true); } } });
        } });
        dan.setFlipX(r < 0);
        Geluid.effect('dash');
      }
      this.alexBezig(b, 1900);
    } else if (a === 'lava') {
      this.baasRoep('De lava stijgt!');
      const r = this.add.rectangle(0, 540, 960, 140, 0xff5a1c, 0.35).setOrigin(0).setDepth(10);
      this.alexLava = { r, heet: false };
      this.tweens.add({ targets: r, y: 470, duration: 900, onComplete: () => {
        if (!r.active) return;
        r.setFillStyle(0xff5a1c, 0.92); this.alexLava.heet = true;
        this.cameras.main.shake(300, 0.01);
        this.tweens.add({ targets: r, y: 390, duration: 300 });
        this.time.delayedCall(1700, () => {
          if (!r.active) return;
          if (this.alexLava) this.alexLava.heet = false;
          this.tweens.add({ targets: r, y: 540, alpha: 0, duration: 500, onComplete: () => { r.destroy(); this.alexLava = null; } });
        });
      } });
      this.alexBezig(b, 3000);
    } else if (a === 'noobschild') {
      this.baasRoep('Noob-schild! Geef Daniel een tik!');
      this.alexSchild = 7;
      this.alexZeg('IK BEN EEN NOOB!!');
      this.alexBezig(b, 900);
    }
  }

  // is Alexander nu onraakbaar door het noob-schild?
  alexSchildOp() {
    if (!(this.alexSchild > 0)) return false;
    if (this.alexMeldT <= 0) { this.alexMeldT = 1.2; this.popTekst('Noob-schild! Eerst Daniel een tik geven!'); Geluid.effect('tink'); }
    return true;
  }

  // een hulpje (of een nep-Alexander) wordt geraakt
  alexHulpGeraakt(v) {
    if (v.hulp === 'kloon') {
      this.vonken.explode(18, v.x, v.y); this.popTekst('Nep-Alexander!'); Geluid.effect('plop'); v.destroy();
    } else if (v.hulp === 'tara') {
      if (v.uit > 0) return;
      v.uit = 1.6; v.setTint(0x777788); this.popTekst('Robot-Tara is even uit!'); Geluid.effect('tink');
    } else if (v.hulp === 'daniel') {
      if (this.alexSchild > 0) { this.alexSchild = 0; this.alexBel.setVisible(false); this.popTekst('Noob-schild kapot!'); Geluid.effect('baasRaak'); }
      if (!v.vliegt) v.body.setVelocity(Math.sign(v.x - this.speler.x) * 220, -300);
      this.alexZeg('Au! Ik ben een noob!');
    }
  }

  alexOpruimen() {
    for (const o of [this.alexTara, this.alexDaniel, this.alexVlam, this.alexBel, this.alexG, this.alexPraat, this.alexLava && this.alexLava.r, ...(this.alexKlonen || [])]) if (o && o.active) o.destroy();
    this.alexLava = null; this.alexLaser = null; this.alexSchild = 0;
  }
}

voegToeAanSpel(AlexanderDeel);
