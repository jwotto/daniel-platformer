// Huisdieren: 10 diertjes die met je meelopen of -vliegen en je helpen.
// Je wint ze aan het dierenrad (heel duur!) en je kunt ze upgraden tot niveau 5.
// Je kunt er één tegelijk meenemen.

const DIEREN = [
  { id: 'kuiken', naam: 'Kuiken', uitleg: l => `Shotjes ${5 * l}% meer waard`, vliegt: false },
  { id: 'hond', naam: 'Hondje', uitleg: l => `Haalt shotjes van ${40 * l} pixels verder op`, vliegt: false },
  { id: 'kat', naam: 'Kat', uitleg: l => `Krabt monsters vlakbij, elke ${(4 - l * 0.5).toFixed(1)} s`, vliegt: false },
  { id: 'uil', naam: 'Uil', uitleg: l => `Je springt ${3 * l}% hoger`, vliegt: true },
  { id: 'schildpad', naam: 'Schildpad', uitleg: l => `${Math.ceil(l / 2)} hartje${Math.ceil(l / 2) > 1 ? 's' : ''} extra`, vliegt: false },
  { id: 'vos', naam: 'Vos', uitleg: l => `Je loopt ${4 * l}% sneller`, vliegt: false },
  { id: 'papegaai', naam: 'Papegaai', uitleg: l => `Schiet pijlen, elke ${(3.2 - l * 0.4).toFixed(1)} s`, vliegt: true },
  { id: 'draakje', naam: 'Draakje', uitleg: l => `Spuwt vuurballen, elke ${(4 - l * 0.5).toFixed(1)} s`, vliegt: true },
  { id: 'eenhoorn', naam: 'Eenhoorn', uitleg: l => `${4 * l}% kans op een flesje per monster`, vliegt: false },
  { id: 'bierbeest', naam: 'Bierbeestje', uitleg: l => `Shotjes én schade ${6 * l}% meer`, vliegt: false },
];
const DIER_MAX = 5;
function dierPrijs() { return 500 + Object.keys(PROFIEL.dieren).length * 250; }
function upgradePrijs(l) { return 300 * l; }
// niveau van een dier dat je NU meeneemt (anders 0)
function dierLvl(id) { return PROFIEL.dier === id ? (PROFIEL.dieren[id] || 0) : 0; }

// ---------- TEKENINGEN ----------
function tekenDier(ctx, id) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  const oogje = (x, y) => { ctx.fillStyle = INKT; ctx.beginPath(); ctx.arc(x, y, 2, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x - 0.6, y - 0.6, 0.7, 0, TAU); ctx.fill(); };
  const rond = (x, y, rx, ry, k) => { ctx.fillStyle = k; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); ctx.stroke(); };
  const drie = (p, k) => { ctx.fillStyle = k; ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); ctx.stroke(); };
  if (id === 'kuiken') {
    rond(22, 26, 13, 11, '#ffe066'); rond(14, 14, 8, 8, '#ffe066'); drie([[6, 14], [1, 16], [6, 18]], '#f2a33a'); oogje(12, 12);
    drie([[20, 36], [18, 40], [22, 40]], '#f2a33a'); drie([[26, 36], [24, 40], [28, 40]], '#f2a33a');
  } else if (id === 'hond') {
    rond(24, 26, 14, 9, '#c8924a'); rond(11, 17, 9, 8, '#c8924a'); rond(8, 12, 3, 6, '#7a4a1c'); rond(5, 19, 3, 2, INKT); oogje(10, 15);
    for (const x of [16, 30]) { ctx.fillStyle = '#c8924a'; ctx.fillRect(x - 2, 32, 4, 8); ctx.strokeRect(x - 2, 32, 4, 8); }
    ctx.beginPath(); ctx.moveTo(37, 24); ctx.quadraticCurveTo(44, 16, 40, 12); ctx.stroke();
  } else if (id === 'kat') {
    rond(24, 28, 13, 9, '#5a5a6a'); rond(12, 18, 9, 8, '#5a5a6a');
    drie([[5, 13], [6, 4], [11, 11]], '#5a5a6a'); drie([[13, 11], [18, 4], [19, 13]], '#5a5a6a');
    ctx.fillStyle = '#7aff8a'; ctx.beginPath(); ctx.ellipse(9, 17, 1.6, 2.4, 0, 0, TAU); ctx.ellipse(15, 17, 1.6, 2.4, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(36, 26); ctx.quadraticCurveTo(46, 22, 42, 8); ctx.stroke();
  } else if (id === 'uil') {
    rond(20, 22, 14, 16, '#8a5a2a'); rond(20, 26, 9, 10, '#f3ead6');
    for (const x of [14, 26]) { rond(x, 16, 6, 6, '#fff'); oogje(x, 16); }
    drie([[18, 21], [22, 21], [20, 25]], '#f2a33a'); drie([[8, 8], [10, 2], [14, 8]], '#8a5a2a'); drie([[26, 8], [30, 2], [32, 8]], '#8a5a2a');
  } else if (id === 'schildpad') {
    rond(24, 26, 15, 10, '#5fae4e'); ctx.fillStyle = '#3a7a2a';
    for (const [x, y] of [[18, 24], [26, 22], [30, 28], [20, 30]]) { ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); }
    rond(7, 26, 6, 5, '#9ad86e'); oogje(5, 25);
    for (const x of [14, 32]) rond(x, 36, 3, 3, '#9ad86e');
  } else if (id === 'vos') {
    rond(24, 26, 13, 8, '#e8701c'); rond(11, 18, 8, 7, '#e8701c'); drie([[3, 18], [-1, 20], [3, 22]], '#f3ead6');
    drie([[7, 12], [8, 4], [12, 11]], '#e8701c'); drie([[13, 11], [17, 5], [17, 13]], '#e8701c'); oogje(10, 16);
    rond(40, 22, 7, 5, '#e8701c'); rond(44, 21, 3, 3, '#f3ead6');
  } else if (id === 'papegaai') {
    rond(20, 22, 11, 14, '#d1495b'); rond(22, 24, 6, 9, '#3cc8bb'); rond(14, 12, 7, 7, '#d1495b');
    drie([[8, 11], [3, 15], [8, 16]], '#f2c14e'); oogje(13, 10); drie([[24, 34], [20, 44], [28, 42]], '#3a8ad8');
  } else if (id === 'draakje') {
    drie([[20, 18], [34, 4], [30, 20]], '#a8321e'); rond(22, 26, 12, 9, '#d1495b'); rond(10, 18, 8, 7, '#d1495b');
    drie([[7, 12], [6, 5], [11, 11]], '#f2c14e'); oogje(9, 16); drie([[33, 26], [44, 22], [36, 30]], '#d1495b');
    ctx.fillStyle = '#ff9a3c'; ctx.beginPath(); ctx.arc(2, 20, 2.5, 0, TAU); ctx.fill();
  } else if (id === 'eenhoorn') {
    rond(24, 26, 14, 9, '#fff6fb'); rond(11, 17, 8, 8, '#fff6fb'); drie([[9, 10], [6, -2], [13, 9]], '#f2c14e'); oogje(9, 16);
    ctx.fillStyle = '#ff8ac8'; ctx.beginPath(); ctx.ellipse(17, 12, 3, 7, -0.5, 0, TAU); ctx.fill();
    for (const x of [16, 30]) { ctx.fillStyle = '#fff6fb'; ctx.fillRect(x - 2, 32, 4, 8); ctx.strokeRect(x - 2, 32, 4, 8); }
    ctx.strokeStyle = '#7a5cff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(38, 22); ctx.quadraticCurveTo(46, 26, 42, 34); ctx.stroke();
  } else if (id === 'bierbeest') {
    ctx.fillStyle = '#f2a33a'; rondRect(ctx, 10, 12, 24, 26, 6); ctx.fill(); ctx.stroke();
    for (const [x, r] of [[13, 6], [22, 7], [31, 6]]) rond(x, 12, r, r, '#fffaf0');
    for (const x of [17, 27]) { rond(x, 24, 4, 4, '#fff'); oogje(x, 24); }
    ctx.beginPath(); ctx.arc(22, 30, 4, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = '#f2c14e'; ctx.beginPath(); for (let i = 0; i <= 6; i++) ctx.lineTo(14 + i * 2.7, i % 2 ? 0 : -4); ctx.lineTo(30, 3); ctx.lineTo(14, 3); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}
function maakDierTexturen(scene) {
  for (const d of DIEREN) {
    tekenTextuur(scene, 'dier_' + d.id, 48, 46, ctx => { ctx.translate(2, 4); tekenDier(ctx, d.id); });
    tekenTextuur(scene, 'dier_groot_' + d.id, 48, 46, ctx => { ctx.translate(2, 4); tekenDier(ctx, d.id); }, 3);
  }
}

// ---------- IN HET SPEL ----------
// Wordt aan Spel toegevoegd: het dier maken, laten meelopen en zijn kracht gebruiken.
class DierDeel {
  maakDier() {
    this.dier = null;
    const d = DIEREN.find(x => x.id === PROFIEL.dier);
    if (!d || !PROFIEL.dieren[d.id]) return;
    this.dier = this.add.image(this.speler.x - 40, this.speler.y - 20, 'dier_' + d.id).setDepth(10);
    this.dier.info = d; this.dier.lvl = PROFIEL.dieren[d.id]; this.dier.cd = 2;
  }

  dierUpdate(dt) {
    const m = this.dier, sp = this.speler;
    if (!m) return;
    const vliegt = m.info.vliegt;
    const doelX = sp.x - this.kijk * 38, doelY = vliegt ? sp.y - 70 + Math.sin(this.tijd * 3) * 6 : sp.y - 18;
    m.x += (doelX - m.x) * Math.min(1, dt * 7);
    m.y += (doelY - m.y) * Math.min(1, dt * 7);
    if (!vliegt) m.y += Math.abs(Math.sin(this.tijd * 10)) * -3 * Math.min(1, Math.abs(sp.body.velocity.x) / 100);
    m.setFlipX(this.kijk > 0);
    m.cd -= dt;
    if (m.cd > 0 || this.dood) return;
    const id = m.info.id, l = m.lvl;
    // het dichtstbijzijnde monster
    let doel = null, best = id === 'kat' ? 90 : 460;
    this.vijanden.getChildren().forEach(v => {
      if (!v.active || v.soort === 'goud') return;
      const d = Phaser.Math.Distance.Between(m.x, m.y, v.x, v.getCenter().y);
      if (d < best) { best = d; doel = v; }
    });
    if (!doel) return;
    if (id === 'kat') {
      m.cd = 4 - l * 0.5;
      this.raakVijand(doel, 1 + Math.floor(l / 2), Math.sign(doel.x - m.x) || 1, 'boer');
      this.vonken.explode(6, doel.x, doel.getCenter().y);
      this.tweens.add({ targets: m, x: doel.x, yoyo: true, duration: 120 });
    } else if (id === 'papegaai' || id === 'draakje') {
      m.cd = id === 'papegaai' ? 3.2 - l * 0.4 : 4 - l * 0.5;
      const hoek = Phaser.Math.Angle.Between(m.x, m.y, doel.x, doel.getCenter().y);
      const p = this.pijlen.create(m.x, m.y, id === 'draakje' ? 'vuurbal' : 'pijl').setDepth(11).setScale(id === 'draakje' ? 0.7 : 0.8);
      p.body.setAllowGravity(false); p.body.setSize(14, 10);
      p.setVelocity(Math.cos(hoek) * 600, Math.sin(hoek) * 600); p.setRotation(hoek);
      p.leeft = 1; p.boem = id === 'draakje';
      Geluid.effect('schiet');
    }
  }
}
voegToeAanSpel(DierDeel);

// ---------- DE DIERENWINKEL ----------
class Dieren extends Phaser.Scene {
  constructor() { super('Dieren'); }

  create(data) {
    this.terugNaar = (data && data.terugNaar) || 'Titel';
    this.terugData = data && data.terugData;
    this.draait = false; this.weg = false;
    this.add.image(0, 0, 'lucht_speeltuin').setOrigin(0);
    this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.55).setOrigin(0);
    this.add.text(480, 8, '🐾 Huisdieren', { fontFamily: FONT_TITEL, fontSize: '38px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 7 }).setOrigin(0.5, 0);
    this.add.image(918, 12, 'fles_mini').setOrigin(0, 0);
    this.flesTekst = this.add.text(910, 16, '', { fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 5 }).setOrigin(1, 0);
    this.maakRad(240, 280, 165);
    this.add.text(716, 62, 'Tik op een dier om hem mee te nemen', { fontFamily: FONT, fontSize: '16px', fontStyle: 'bold', color: '#f3ead6' }).setOrigin(0.5, 0);
    this.vakjes = DIEREN.map((d, i) => this.maakVakje(d, 492 + (i % 5) * 90, 86 + Math.floor(i / 5) * 172));
    this.info = this.add.text(716, 438, '', { fontFamily: FONT, fontSize: '15px', fontStyle: 'bold', color: '#f2c14e', align: 'center', wordWrap: { width: 440 } }).setOrigin(0.5);
    knop(this, 500, 466, 200, 54, '← Terug', 0x3cc8bb, () => this.terug());
    this.draaiKnop = knop(this, 720, 466, 220, 54, '', 0xf2c14e, () => this.draai());
    this.input.keyboard.on('keydown-ESC', () => this.terug());
    this.vernieuw();
  }

  maakRad(x, y, r) {
    const n = DIEREN.length, stuk = 360 / n;
    this.stuk = stuk;
    this.rad = this.add.container(x, y);
    const g = this.add.graphics();
    const kleuren = [0x3cc8bb, 0xf2c14e, 0xd1495b, 0x7a5cff, 0x5fae4e];
    DIEREN.forEach((d, i) => {
      const a0 = Phaser.Math.DegToRad(i * stuk), a1 = Phaser.Math.DegToRad((i + 1) * stuk);
      g.fillStyle(kleuren[i % 5], 1).slice(0, 0, r, a0, a1, false).fillPath();
      g.lineStyle(3, 0x0a1028, 1).slice(0, 0, r, a0, a1, false).strokePath();
    });
    g.lineStyle(6, 0xf2c14e, 1).strokeCircle(0, 0, r);
    this.rad.add(g);
    this.radPlaatjes = DIEREN.map((d, i) => {
      const a = Phaser.Math.DegToRad((i + 0.5) * stuk);
      const img = this.add.image(Math.cos(a) * r * 0.66, Math.sin(a) * r * 0.66, 'dier_groot_' + d.id).setScale(0.32).setRotation(a + Math.PI / 2);
      this.rad.add(img);
      return img;
    });
    const m = this.add.graphics(); m.fillStyle(0xf2c14e, 1).fillCircle(0, 0, 22).lineStyle(3, 0x0a1028, 1).strokeCircle(0, 0, 22);
    this.rad.add(m);
    const p = this.add.graphics(); p.fillStyle(0xd1495b, 1).lineStyle(3, 0x0a1028, 1);
    p.beginPath(); p.moveTo(x - 18, y - r - 22); p.lineTo(x + 18, y - r - 22); p.lineTo(x, y - r + 12); p.closePath(); p.fillPath(); p.strokePath();
  }

  maakVakje(d, x, y) {
    const w = 84, h = 166;
    const v = {
      d, x, y, w, h, g: this.add.graphics(),
      img: this.add.image(x + w / 2, y + 44, 'dier_groot_' + d.id).setScale(0.5),
      slot: this.add.text(x + w / 2, y + 44, '?', { fontFamily: FONT_TITEL, fontSize: '34px', color: '#5a6a9a' }).setOrigin(0.5),
      naam: this.add.text(x + w / 2, y + 82, d.naam, { fontFamily: FONT, fontSize: '13px', fontStyle: 'bold', color: '#f3ead6', align: 'center', wordWrap: { width: w - 6 } }).setOrigin(0.5, 0),
      sterren: this.add.text(x + w / 2, y + 104, '', { fontFamily: FONT, fontSize: '13px', color: '#f2c14e' }).setOrigin(0.5, 0),
    };
    this.add.zone(x, y, w, 120).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerup', () => this.neemMee(v));
    v.up = knop(this, x + 4, y + 126, w - 8, 34, '', 0x5fd38a, () => this.upgrade(v), 14);
    return v;
  }

  vernieuw() {
    this.flesTekst.setText('× ' + PROFIEL.flessen);
    for (const v of this.vakjes) {
      const l = PROFIEL.dieren[v.d.id] || 0, mee = PROFIEL.dier === v.d.id;
      v.g.clear();
      v.g.fillStyle(0x16244f, 0.95).fillRoundedRect(v.x, v.y, v.w, v.h, 12);
      v.g.lineStyle(mee ? 4 : 2, mee ? 0xf2c14e : 0x2c4387, 1).strokeRoundedRect(v.x, v.y, v.w, v.h, 12);
      v.img.setVisible(l > 0); v.slot.setVisible(!l);
      v.naam.setText(l ? v.d.naam : '???').setColor(l ? '#f3ead6' : '#5a6a9a');
      v.sterren.setText(l ? '★'.repeat(l) + '☆'.repeat(DIER_MAX - l) : '');
      for (const o of Object.values(v.up)) o.setVisible(l > 0);
      v.up.t.setText(l >= DIER_MAX ? 'MAX' : '⬆ ' + upgradePrijs(l));
    }
    DIEREN.forEach((d, i) => this.radPlaatjes[i].setAlpha(PROFIEL.dieren[d.id] ? 0.35 : 1));
    const alles = this.nogTeWinnen().length === 0;
    this.draaiKnop.t.setText(alles ? 'Alle dieren!' : `🐾 Draai! (${dierPrijs()})`);
    const mee = DIEREN.find(d => d.id === PROFIEL.dier);
    this.info.setText(mee && PROFIEL.dieren[mee.id]
      ? `Mee: ${mee.naam} (niveau ${PROFIEL.dieren[mee.id]}) – ${mee.uitleg(PROFIEL.dieren[mee.id])}`
      : `Een dier kost ${dierPrijs()} flesjes. Je wint er een die je nog niet had.`);
  }

  nogTeWinnen() { return DIEREN.filter(d => !PROFIEL.dieren[d.id]); }

  draai() {
    if (this.draait || this.weg || this.scene.isPaused()) return;
    const kans = this.nogTeWinnen(), kost = dierPrijs();
    if (!kans.length || PROFIEL.flessen < kost) { Geluid.effect('nee'); this.tweens.add({ targets: this.draaiKnop.t, x: '+=6', yoyo: true, repeat: 2, duration: 50 }); return; }
    PROFIEL.flessen -= kost;
    const prijs = Phaser.Utils.Array.GetRandom(kans);
    PROFIEL.dieren[prijs.id] = 1;
    bewaarProfiel();
    this.flesTekst.setText('× ' + PROFIEL.flessen);
    this.draait = true;
    const i = DIEREN.indexOf(prijs);
    const midden = (i + 0.5) * this.stuk + Phaser.Math.FloatBetween(-0.3, 0.3) * this.stuk;
    let doel = -90 - midden;
    while (doel < this.rad.angle + 360 * 5) doel += 360;
    let vorige = Math.floor(this.rad.angle / this.stuk);
    this.tweens.add({
      targets: this.rad, angle: doel, duration: 4200, ease: 'Cubic.easeOut',
      onUpdate: () => { const v = Math.floor(this.rad.angle / this.stuk); if (v !== vorige) { vorige = v; Geluid.effect('draai'); } },
      onComplete: () => this.gewonnen(prijs),
    });
  }

  gewonnen(d) {
    this.draait = false;
    PROFIEL.dier = d.id;
    statTel('dieren');
    bewaarProfiel();
    Geluid.effect('prijs');
    this.vernieuw();
    const f = this.add.rectangle(0, 0, 960, 540, 0xf2c14e, 0.45).setOrigin(0).setDepth(50);
    this.tweens.add({ targets: f, alpha: 0, duration: 500, onComplete: () => f.destroy() });
    const img = this.add.image(480, 240, 'dier_groot_' + d.id).setDepth(60).setScale(0.2);
    const t = this.add.text(480, 330, `Nieuw huisdier: ${d.naam}!`, { fontFamily: FONT_TITEL, fontSize: '42px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 8 }).setOrigin(0.5).setDepth(60);
    this.tweens.add({ targets: img, scale: 1.6, duration: 400, ease: 'Back.easeOut' });
    this.tweens.add({ targets: [img, t], alpha: 0, delay: 2200, duration: 500, onComplete: () => { img.destroy(); t.destroy(); } });
    checkPrestaties(this);
  }

  neemMee(v) {
    if (this.draait) return;
    if (!PROFIEL.dieren[v.d.id]) { Geluid.effect('nee'); return; }
    PROFIEL.dier = PROFIEL.dier === v.d.id ? '' : v.d.id; // nog een keer tikken = thuislaten
    bewaarProfiel();
    Geluid.effect('koop');
    this.vernieuw();
  }

  upgrade(v) {
    if (this.draait) return;
    const l = PROFIEL.dieren[v.d.id] || 0, kost = upgradePrijs(l);
    if (!l || l >= DIER_MAX || PROFIEL.flessen < kost) { Geluid.effect('nee'); return; }
    PROFIEL.flessen -= kost;
    PROFIEL.dieren[v.d.id] = l + 1;
    statTel('dierUp');
    bewaarProfiel();
    Geluid.effect('flesVol');
    this.tweens.add({ targets: v.img, scale: 0.7, yoyo: true, duration: 150 });
    this.vernieuw();
    checkPrestaties(this);
  }

  terug() {
    if (this.draait || this.weg || this.scene.isPaused()) return;
    this.weg = true;
    this.scene.start(this.terugNaar, this.terugData);
  }
}
