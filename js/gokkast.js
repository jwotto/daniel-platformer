// De gokkast: zet flesjes in, draai aan het rad en kijk of je ze verdubbelt (of meer).
// Let op: je verliest veel vaker dan je wint! Gemiddeld krijg je 75% van je inzet terug.

// 16 vakjes: 12× niks, 2× dubbel, 1× drie keer, 1× vijf keer
const GOK_VAKJES = [0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 0, 5, 0, 0, 0, 0];
const GOK_INZET = [1, 5, 10, 25];

class Gokkast extends Phaser.Scene {
  constructor() { super('Gokkast'); }

  create(data) {
    this.terugNaar = (data && data.terugNaar) || 'Shop';
    this.terugData = data && data.terugData;
    this.draait = false; this.weg = false;
    this.inzetStap = 1;
    this.add.image(0, 0, 'lucht_kroeg').setOrigin(0);
    this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.45).setOrigin(0);
    this.add.text(480, 8, '🎰 Gokkast', {
      fontFamily: FONT_TITEL, fontSize: '40px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 7,
    }).setOrigin(0.5, 0);
    this.add.image(918, 12, 'fles_mini').setOrigin(0, 0);
    this.flesTekst = this.add.text(910, 16, '', {
      fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(1, 0);

    this.maakRad(270, 290, 175);

    // rechts: inzet kiezen en uitleg
    const px = 520;
    const paneel = this.add.graphics();
    paneel.fillStyle(0x16244f, 0.95).fillRoundedRect(px, 76, 420, 370, 18);
    paneel.lineStyle(3, 0xf2c14e, 1).strokeRoundedRect(px, 76, 420, 370, 18);
    this.add.text(px + 210, 92, 'Hoeveel flesjes zet je in?', { fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: '#f3ead6' }).setOrigin(0.5, 0);
    knop(this, px + 30, 130, 70, 60, '−', 0xa9c4ee, () => this.zetInzet(-1), 34);
    knop(this, px + 320, 130, 70, 60, '+', 0xa9c4ee, () => this.zetInzet(1), 34);
    this.inzetTekst = this.add.text(px + 210, 160, '', { fontFamily: FONT_TITEL, fontSize: '40px', color: '#f2c14e' }).setOrigin(0.5);
    knop(this, px + 130, 204, 160, 40, 'Alles!', 0xd1495b, () => this.allesInzetten(), 20);
    this.add.text(px + 210, 262, 'Wat kun je winnen?', { fontFamily: FONT, fontSize: '17px', fontStyle: 'bold', color: '#f3ead6' }).setOrigin(0.5, 0);
    this.add.text(px + 30, 290, [
      '×5  jackpot!   kans 1 op 16',
      '×3  drie keer  kans 1 op 16',
      '×2  dubbel     kans 2 op 16',
      'Niks: weg!     kans 12 op 16',
    ].join('\n'), { fontFamily: 'monospace', fontSize: '16px', color: '#a9b6d8', lineSpacing: 6 });
    this.add.text(px + 210, 402, 'Je verliest veel vaker dan je wint.\nGemiddeld krijg je maar 75% terug!', {
      fontFamily: FONT, fontSize: '15px', fontStyle: 'bold', color: '#ff8a8a', align: 'center',
    }).setOrigin(0.5, 0);

    knop(this, 520, 466, 190, 54, '← Terug', 0x3cc8bb, () => this.terug());
    this.draaiKnop = knop(this, 730, 466, 210, 54, '🎰 Draai!', 0xf2c14e, () => this.draai());
    this.input.keyboard.on('keydown-ESC', () => this.terug());
    this.input.keyboard.on('keydown-SPACE', () => this.draai());
    this.vernieuw();
  }

  maakRad(x, y, r) {
    const n = GOK_VAKJES.length, stuk = 360 / n;
    this.stuk = stuk;
    this.rad = this.add.container(x, y);
    const g = this.add.graphics();
    const kleur = { 0: [0x2c4387, 0x1b2f6b], 2: [0x3cc8bb], 3: [0x7a5cff], 5: [0xf2c14e] };
    GOK_VAKJES.forEach((v, i) => {
      const a0 = Phaser.Math.DegToRad(i * stuk), a1 = Phaser.Math.DegToRad((i + 1) * stuk);
      const k = kleur[v];
      g.fillStyle(k[i % k.length], 1).slice(0, 0, r, a0, a1, false).fillPath();
      g.lineStyle(2, 0x0a1028, 1).slice(0, 0, r, a0, a1, false).strokePath();
    });
    g.lineStyle(7, 0xf2c14e, 1).strokeCircle(0, 0, r);
    this.rad.add(g);
    GOK_VAKJES.forEach((v, i) => {
      const a = Phaser.Math.DegToRad((i + 0.5) * stuk);
      const t = this.add.text(Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.7, v ? '×' + v : '✗', {
        fontFamily: FONT, fontSize: v ? '22px' : '16px', fontStyle: 'bold', color: v ? '#0a1028' : '#5a6a9a',
      }).setOrigin(0.5).setRotation(a + Math.PI / 2);
      this.rad.add(t);
    });
    // lampjes rond het rad
    this.lampjes = [];
    for (let i = 0; i < 20; i++) {
      const a = i * TAU / 20;
      this.lampjes.push(this.add.circle(x + Math.cos(a) * (r + 14), y + Math.sin(a) * (r + 14), 5, 0xf2c14e));
    }
    const m = this.add.graphics();
    m.fillStyle(0xf2c14e, 1).fillCircle(0, 0, 24).lineStyle(3, 0x0a1028, 1).strokeCircle(0, 0, 24);
    this.rad.add(m);
    const p = this.add.graphics();
    p.fillStyle(0xd1495b, 1).lineStyle(3, 0x0a1028, 1);
    p.beginPath(); p.moveTo(x - 18, y - r - 24); p.lineTo(x + 18, y - r - 24); p.lineTo(x, y - r + 12); p.closePath();
    p.fillPath(); p.strokePath();
  }

  inzet() { return Math.min(GOK_INZET[this.inzetStap], PROFIEL.flessen); }

  zetInzet(r) {
    if (this.draait) return;
    this.alles = false;
    this.inzetStap = Phaser.Math.Clamp(this.inzetStap + r, 0, GOK_INZET.length - 1);
    this.vernieuw();
  }

  allesInzetten() {
    if (this.draait) return;
    this.alles = true;
    this.vernieuw();
  }

  vernieuw() {
    this.flesTekst.setText('× ' + PROFIEL.flessen);
    const inzet = this.alles ? PROFIEL.flessen : this.inzet();
    this.inzetTekst.setText(inzet + ' 🍺');
    this.draaiKnop.t.setText(PROFIEL.flessen > 0 ? '🎰 Draai!' : 'Geen flesjes');
  }

  draai(uitkomstVast) {
    if (this.draait || this.weg || this.scene.isPaused()) return;
    const inzet = this.alles ? PROFIEL.flessen : this.inzet();
    if (inzet < 1) { Geluid.effect('nee'); return; }
    PROFIEL.flessen -= inzet;
    bewaarProfiel();
    this.draait = true;
    this.vernieuw();
    this.inzetTekst.setText(inzet + ' 🍺');
    const vak = uitkomstVast !== undefined ? uitkomstVast : Phaser.Math.Between(0, GOK_VAKJES.length - 1);
    const midden = (vak + 0.5) * this.stuk + Phaser.Math.FloatBetween(-0.35, 0.35) * this.stuk;
    let doel = -90 - midden;
    while (doel < this.rad.angle + 360 * 5) doel += 360;
    let vorige = Math.floor(this.rad.angle / this.stuk);
    this.lampT = this.time.addEvent({ delay: 90, loop: true, callback: () => this.lampjes.forEach((l, i) => l.setFillStyle((i + Math.floor(this.time.now / 90)) % 2 ? 0xf2c14e : 0xd1495b)) });
    this.tweens.add({
      targets: this.rad, angle: doel, duration: 3800, ease: 'Cubic.easeOut',
      onUpdate: () => { const v = Math.floor(this.rad.angle / this.stuk); if (v !== vorige) { vorige = v; Geluid.effect('draai'); } },
      onComplete: () => this.uitslag(GOK_VAKJES[vak], inzet),
    });
  }

  uitslag(keer, inzet) {
    this.draait = false;
    this.lampT.remove();
    this.lampjes.forEach(l => l.setFillStyle(0xf2c14e));
    const winst = inzet * keer;
    PROFIEL.flessen += winst;
    if (winst) statTel('flessenTotaal', winst - inzet > 0 ? winst - inzet : 0);
    statTel('gokken');
    bewaarProfiel();
    this.laatste = { keer, inzet, winst };
    this.vernieuw();
    const t = this.add.text(270, 290, keer ? `×${keer}!\n+${winst} 🍺` : 'Helaas...\nweg!', {
      fontFamily: FONT_TITEL, fontSize: keer ? '48px' : '40px', color: keer ? '#f2c14e' : '#ff8a8a', stroke: '#0a1028', strokeThickness: 8, align: 'center',
    }).setOrigin(0.5).setDepth(50).setScale(0.3);
    this.tweens.add({ targets: t, scale: 1, duration: 300, ease: 'Back.easeOut' });
    this.tweens.add({ targets: t, alpha: 0, delay: 1700, duration: 400, onComplete: () => t.destroy() });
    if (keer) {
      Geluid.effect(keer >= 5 ? 'baasWeg' : 'prijs');
      const f = this.add.rectangle(0, 0, 960, 540, 0xf2c14e, keer >= 5 ? 0.5 : 0.25).setOrigin(0).setDepth(40);
      this.tweens.add({ targets: f, alpha: 0, duration: 500, onComplete: () => f.destroy() });
      for (let i = 0; i < keer * 8; i++) {
        const c = this.add.image(Phaser.Math.Between(60, 480), -20, 'shotje').setDepth(45);
        this.tweens.add({ targets: c, y: 560, angle: 360, delay: Phaser.Math.Between(0, 800), duration: 1400, onComplete: () => c.destroy() });
      }
    } else Geluid.effect('gameOver');
    checkPrestaties(this);
  }

  terug() {
    if (this.draait || this.weg || this.scene.isPaused()) return;
    this.weg = true;
    this.scene.start(this.terugNaar, this.terugData);
  }
}
