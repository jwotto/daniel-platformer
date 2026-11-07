// De shop: draai aan het rad en win een nieuwe skin.
// De eerste keer draaien kost 5 flesjes, daarna elke keer 5 meer.
// Je wint altijd een skin die je nog niet had.

function draaiPrijs() { return 5 + PROFIEL.draaien * 5; }
// de skins die je kunt winnen (de gewone heb je al)
// de skins die je aan het rad kunt winnen (de gewone heb je al, baas-skins win je door een baas te verslaan)
const RAD_SKINS = SKINS.filter(k => k.id !== 'standaard' && !k.baas);

class Shop extends Phaser.Scene {
  constructor() { super('Shop'); }

  create(data) {
    // waar ga je heen met "Terug"? Normaal naar het titelscherm, maar vanuit de winkel terug naar de winkel
    this.terugNaar = (data && data.terugNaar) || 'Titel';
    this.winkelData = data && data.winkelData;
    this.draait = false;
    this.weg = false;
    this.add.image(0, 0, 'lucht_rivier').setOrigin(0);
    this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.55).setOrigin(0);
    this.add.text(480, 10, 'Shop', {
      fontFamily: FONT_TITEL, fontSize: '40px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 7,
    }).setOrigin(0.5, 0);
    this.add.image(918, 12, 'fles_mini').setOrigin(0, 0);
    this.flesTekst = this.add.text(910, 16, '', {
      fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(1, 0);

    this.maakRad(250, 290, 170);
    this.maakKast();

    knop(this, 500, 466, 200, 54, '← Terug', 0x3cc8bb, () => this.terug());
    this.draaiKnop = knop(this, 720, 466, 220, 54, '', 0xf2c14e, () => this.draai());
    this.input.keyboard.on('keydown-ESC', () => this.terug());
    this.input.keyboard.on('keydown-SPACE', () => this.draai());
    this.vernieuw();
  }

  // ---------- HET RAD ----------
  maakRad(x, y, r) {
    const n = RAD_SKINS.length, stuk = 360 / n;
    this.stuk = stuk;
    this.rad = this.add.container(x, y);
    const g = this.add.graphics();
    RAD_SKINS.forEach((k, i) => {
      const a0 = Phaser.Math.DegToRad(i * stuk), a1 = Phaser.Math.DegToRad((i + 1) * stuk);
      g.fillStyle(Phaser.Display.Color.HexStringToColor(k.tuniek[i % 2]).color, 1);
      g.slice(0, 0, r, a0, a1, false).fillPath();
      g.lineStyle(3, 0x0a1028, 1);
      g.slice(0, 0, r, a0, a1, false).strokePath();
    });
    g.lineStyle(6, 0xf2c14e, 1).strokeCircle(0, 0, r);
    this.rad.add(g);
    this.radPlaatjes = RAD_SKINS.map((k, i) => {
      const a = Phaser.Math.DegToRad((i + 0.5) * stuk);
      const img = this.add.image(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62, 'skin_' + k.id)
        .setScale(0.27).setRotation(a + Math.PI / 2);
      this.rad.add(img);
      return img;
    });
    // knopje in het midden
    const m = this.add.graphics();
    m.fillStyle(0xf2c14e, 1).fillCircle(0, 0, 22);
    m.lineStyle(3, 0x0a1028, 1).strokeCircle(0, 0, 22);
    this.rad.add(m);
    // het pijltje bovenaan wijst je prijs aan
    const p = this.add.graphics();
    p.fillStyle(0xd1495b, 1).lineStyle(3, 0x0a1028, 1);
    p.beginPath(); p.moveTo(x - 18, y - r - 22); p.lineTo(x + 18, y - r - 22); p.lineTo(x, y - r + 12); p.closePath();
    p.fillPath(); p.strokePath();
  }

  // ---------- JOUW SKINS ----------
  maakKast() {
    this.add.text(715, 66, 'Jouw skins  ·  tik om aan te trekken', {
      fontFamily: FONT, fontSize: '17px', fontStyle: 'bold', color: '#f3ead6',
    }).setOrigin(0.5, 0);
    this.vakjes = SKINS.map((k, i) => {
      // 6 per rij, 2 rijen
      const x = 492 + (i % 6) * 75, y = 92 + Math.floor(i / 6) * 152, w = 70, h = 144;
      const v = {
        k, x, y, w, h,
        g: this.add.graphics(),
        img: this.add.image(x + w / 2, y + 108, 'skin_' + k.id).setOrigin(0.5, 1).setScale(0.3),
        naam: this.add.text(x + w / 2, y + h - 6, k.naam, { fontFamily: FONT, fontSize: '12px', fontStyle: 'bold', color: '#f3ead6', align: 'center', wordWrap: { width: w - 4 }, lineSpacing: -3 }).setOrigin(0.5, 1),
        kroon: k.baas ? this.add.text(x + w - 4, y + 4, '♛', { fontFamily: FONT, fontSize: '16px', color: '#f2c14e' }).setOrigin(1, 0) : null,
        slot: this.add.text(x + w / 2, y + 58, '?', { fontFamily: FONT_TITEL, fontSize: '40px', color: '#5a6a9a' }).setOrigin(0.5),
      };
      this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerup', () => this.trekAan(v));
      return v;
    });
    this.info = this.add.text(715, 400, '', {
      fontFamily: FONT, fontSize: '17px', fontStyle: 'bold', color: '#f2c14e', align: 'center', wordWrap: { width: 430 },
    }).setOrigin(0.5);
  }

  vernieuw() {
    this.flesTekst.setText('× ' + PROFIEL.flessen);
    for (const v of this.vakjes) {
      const heb = PROFIEL.skins.includes(v.k.id), aan = PROFIEL.skin === v.k.id;
      v.g.clear();
      v.g.fillStyle(0x16244f, 0.95).fillRoundedRect(v.x, v.y, v.w, v.h, 12);
      v.g.lineStyle(aan ? 4 : 2, aan ? 0xf2c14e : 0x2c4387, 1).strokeRoundedRect(v.x, v.y, v.w, v.h, 12);
      v.img.setVisible(heb);
      v.slot.setVisible(!heb);
      v.naam.setColor(heb ? '#f3ead6' : '#5a6a9a').setText(heb ? v.k.naam : v.k.baas ? 'Versla de baas' : '???');
    }
    RAD_SKINS.forEach((k, i) => this.radPlaatjes[i].setAlpha(PROFIEL.skins.includes(k.id) ? 0.35 : 1));
    const alles = this.nogTeWinnen().length === 0;
    const kost = draaiPrijs();
    this.draaiKnop.t.setText(alles ? 'Alles verzameld!' : `🎡 Draai! (${kost})`);
    this.info.setText(alles
      ? 'Je hebt alle skins! Wat een verzamelaar.'
      : `Draaien kost ${kost} flesjes. Daarna wordt het elke keer 5 duurder.`);
  }

  nogTeWinnen() { return RAD_SKINS.filter(k => !PROFIEL.skins.includes(k.id)); }

  schud() {
    Geluid.effect('nee');
    this.tweens.add({ targets: this.draaiKnop.t, x: '+=6', yoyo: true, repeat: 2, duration: 50 });
  }

  draai() {
    if (this.draait || this.weg || this.scene.isPaused()) return;
    const kans = this.nogTeWinnen();
    const kost = draaiPrijs();
    if (kans.length === 0 || PROFIEL.flessen < kost) { this.schud(); return; }
    PROFIEL.flessen -= kost;
    PROFIEL.draaien++;
    const prijs = Phaser.Utils.Array.GetRandom(kans);
    // direct bewaren, zodat je je prijs niet kwijtraakt als je de pagina sluit
    PROFIEL.skins.push(prijs.id);
    bewaarProfiel();
    this.flesTekst.setText('× ' + PROFIEL.flessen);
    this.draait = true;

    // uitrekenen hoe ver het rad moet draaien zodat het pijltje (bovenaan, -90°) op de prijs uitkomt
    const i = RAD_SKINS.indexOf(prijs);
    const midden = (i + 0.5) * this.stuk + Phaser.Math.FloatBetween(-0.3, 0.3) * this.stuk;
    const nu = this.rad.angle;
    let doel = -90 - midden;
    while (doel < nu + 360 * 5) doel += 360;
    let vorige = Math.floor(nu / this.stuk);
    this.tweens.add({
      targets: this.rad, angle: doel, duration: 4200, ease: 'Cubic.easeOut',
      onUpdate: () => {
        const vak = Math.floor(this.rad.angle / this.stuk);
        if (vak !== vorige) { vorige = vak; Geluid.effect('draai'); }
      },
      onComplete: () => this.gewonnen(prijs),
    });
  }

  gewonnen(prijs) {
    this.draait = false;
    PROFIEL.skin = prijs.id;
    bewaarProfiel();
    maakSpelerTexturen(this);
    Geluid.effect('prijs');
    this.vernieuw();
    const flits = this.add.rectangle(0, 0, 960, 540, 0xf2c14e, 0.45).setOrigin(0).setDepth(50);
    this.tweens.add({ targets: flits, alpha: 0, duration: 500, onComplete: () => flits.destroy() });
    const t = this.add.text(480, 270, `Nieuwe skin:\n${prijs.naam}!`, {
      fontFamily: FONT_TITEL, fontSize: '52px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 9, align: 'center',
    }).setOrigin(0.5).setDepth(60).setScale(0.3);
    this.tweens.add({ targets: t, scale: 1, duration: 350, ease: 'Back.easeOut' });
    this.tweens.add({ targets: t, alpha: 0, delay: 2000, duration: 500, onComplete: () => t.destroy() });
  }

  trekAan(v) {
    if (this.draait || !PROFIEL.skins.includes(v.k.id)) { if (!this.draait) Geluid.effect('nee'); return; }
    PROFIEL.skin = v.k.id;
    bewaarProfiel();
    maakSpelerTexturen(this);
    Geluid.effect('koop');
    this.vernieuw();
  }

  terug() {
    if (this.draait || this.weg || this.scene.isPaused()) return;
    this.weg = true;
    this.scene.start(this.terugNaar, this.winkelData);
  }
}
