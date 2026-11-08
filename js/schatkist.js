// De schatkist: je vindt hem soms in een level, en na elke eindbaas.
// Neem wat erin zit, of waag het aan het rad:
// 50% alles weg · 25% ×1,5 · 12,5% ×2 · 12,5% ×3  (gemiddeld krijg je precies je inzet terug)

const KIST_VAKJES = [0, 1.5, 0, 2, 0, 1.5, 0, 3];

class Schatkist extends Phaser.Scene {
  constructor() { super('Schatkist'); }

  // data: { inzet, baas, klaar(flesjes) }
  create(data) {
    this.inzet = data.inzet; this.klaar = data.klaar; this.draait = false; this.weg = false;
    this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.85).setOrigin(0).setInteractive();
    const g = this.add.graphics();
    g.fillStyle(0x3a2410, 1).fillRoundedRect(140, 50, 680, 440, 24).lineStyle(4, 0xf2c14e, 1).strokeRoundedRect(140, 50, 680, 440, 24);
    this.add.text(480, 66, data.baas ? '🏆 Baasbeloning!' : '💰 Schatkist!', { fontFamily: FONT_TITEL, fontSize: '38px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 7 }).setOrigin(0.5, 0);
    const kist = this.add.image(320, 240, 'schatkist').setScale(2.6);
    this.tweens.add({ targets: kist, y: 232, yoyo: true, repeat: -1, duration: 600, ease: 'Sine.easeInOut' });
    this.inhoud = this.add.text(320, 330, `${this.inzet} 🍺`, { fontFamily: FONT_TITEL, fontSize: '40px', color: '#fffaf0', stroke: '#0a1028', strokeThickness: 7 }).setOrigin(0.5);
    this.add.text(320, 372, 'zit erin', { fontFamily: FONT, fontSize: '17px', fontStyle: 'bold', color: '#f3ead6' }).setOrigin(0.5, 0);
    this.maakRad(640, 250, 110);
    this.add.text(640, 372, '50% alles weg · 25% ×1,5\n25% ×2 of ×3', { fontFamily: FONT, fontSize: '15px', fontStyle: 'bold', color: '#f3ead6', align: 'center' }).setOrigin(0.5, 0);
    this.neemKnop = knop(this, 180, 420, 280, 56, `💰 Neem ${this.inzet} 🍺`, 0x5fd38a, () => this.neem(), 22);
    this.waagKnop = knop(this, 500, 420, 280, 56, '🎡 Waag het!', 0xd1495b, () => this.draai(), 22);
  }

  maakRad(x, y, r) {
    const n = KIST_VAKJES.length, stuk = 360 / n;
    this.stuk = stuk;
    this.rad = this.add.container(x, y);
    const g = this.add.graphics();
    const kleur = v => v === 0 ? 0x2c4387 : v === 1.5 ? 0x3cc8bb : v === 2 ? 0x7a5cff : 0xf2c14e;
    KIST_VAKJES.forEach((v, i) => {
      const a0 = Phaser.Math.DegToRad(i * stuk), a1 = Phaser.Math.DegToRad((i + 1) * stuk);
      g.fillStyle(kleur(v), 1).slice(0, 0, r, a0, a1, false).fillPath();
      g.lineStyle(2, 0x0a1028, 1).slice(0, 0, r, a0, a1, false).strokePath();
    });
    g.lineStyle(5, 0xf2c14e, 1).strokeCircle(0, 0, r);
    this.rad.add(g);
    KIST_VAKJES.forEach((v, i) => {
      const a = Phaser.Math.DegToRad((i + 0.5) * stuk);
      this.rad.add(this.add.text(Math.cos(a) * r * 0.66, Math.sin(a) * r * 0.66, v ? '×' + v : '✗', {
        fontFamily: FONT, fontSize: v ? '17px' : '15px', fontStyle: 'bold', color: v ? '#0a1028' : '#7a8ab8',
      }).setOrigin(0.5).setRotation(a + Math.PI / 2));
    });
    const m = this.add.graphics(); m.fillStyle(0xf2c14e, 1).fillCircle(0, 0, 16).lineStyle(3, 0x0a1028, 1).strokeCircle(0, 0, 16);
    this.rad.add(m);
    const p = this.add.graphics(); p.fillStyle(0xd1495b, 1).lineStyle(3, 0x0a1028, 1);
    p.beginPath(); p.moveTo(x - 14, y - r - 18); p.lineTo(x + 14, y - r - 18); p.lineTo(x, y - r + 10); p.closePath(); p.fillPath(); p.strokePath();
  }

  neem() {
    if (this.draait || this.weg) return;
    Geluid.effect('koop');
    this.sluit(this.inzet);
  }

  // vak = welk vakje (voor tests), anders willekeurig
  draai(vak) {
    if (this.draait || this.weg) return;
    this.draait = true;
    for (const k of [this.neemKnop, this.waagKnop]) for (const o of Object.values(k)) o.setAlpha(0.4);
    const i = vak !== undefined ? vak : Phaser.Math.Between(0, KIST_VAKJES.length - 1);
    const midden = (i + 0.5) * this.stuk + Phaser.Math.FloatBetween(-0.3, 0.3) * this.stuk;
    let doel = -90 - midden;
    while (doel < this.rad.angle + 360 * 4) doel += 360;
    let vorige = Math.floor(this.rad.angle / this.stuk);
    this.tweens.add({
      targets: this.rad, angle: doel, duration: 3000, ease: 'Cubic.easeOut',
      onUpdate: () => { const v = Math.floor(this.rad.angle / this.stuk); if (v !== vorige) { vorige = v; Geluid.effect('draai'); } },
      onComplete: () => {
        const keer = KIST_VAKJES[i], winst = Math.round(this.inzet * keer);
        this.inhoud.setText(keer ? `${winst} 🍺!` : 'weg...').setColor(keer ? '#f2c14e' : '#ff8a8a');
        Geluid.effect(keer >= 2 ? 'prijs' : keer ? 'koop' : 'gameOver');
        if (keer) {
          const f = this.add.rectangle(0, 0, 960, 540, 0xf2c14e, 0.35).setOrigin(0);
          this.tweens.add({ targets: f, alpha: 0, duration: 500, onComplete: () => f.destroy() });
        }
        this.time.delayedCall(1500, () => this.sluit(winst));
      },
    });
  }

  sluit(flesjes) {
    if (this.weg) return;
    this.weg = true;
    PROFIEL.flessen += flesjes;
    if (flesjes) statTel('flessenTotaal', flesjes);
    statTel('kisten');
    bewaarProfiel();
    const klaar = this.klaar;
    this.scene.stop();
    if (klaar) klaar(flesjes);
  }
}

// een schatkist tekenen
function tekenSchatkist(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.fillStyle = '#8a5a2a'; rondRect(ctx, 3, 14, 38, 20, 3); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#a0682e'; ctx.beginPath(); ctx.moveTo(3, 16); ctx.quadraticCurveTo(22, 0, 41, 16); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f2c14e';
  for (const x of [10, 32]) { ctx.fillRect(x - 2, 5, 4, 29); ctx.strokeRect(x - 2, 5, 4, 29); }
  rondRect(ctx, 18, 16, 8, 9, 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INKT; ctx.beginPath(); ctx.arc(22, 20, 1.4, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,240,160,.8)'; ctx.beginPath(); ctx.arc(15, 9, 1.5, 0, TAU); ctx.arc(28, 7, 1.2, 0, TAU); ctx.fill();
  ctx.restore();
}
