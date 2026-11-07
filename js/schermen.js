// Titelscherm, winkel en game over.

function probeerVolledigScherm(scene) {
  try {
    if (scene.sys.game.device.input.touch && !scene.scale.isFullscreen) scene.scale.startFullscreen();
  } catch (e) { /* lukt niet overal, geeft niks */ }
}

function leesBeste() { try { return Number(localStorage.getItem('flesje_beste')) || 0; } catch (e) { return 0; } }
function schrijfBeste(m) { try { localStorage.setItem('flesje_beste', String(m)); } catch (e) { /* geeft niks */ } }

class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    maakTexturen(this);
    if (location.hash === '#spel') this.scene.start('Spel', { run: nieuweRun() });
    else if (location.hash === '#test') {
      const r = nieuweRun();
      POWERUPS.forEach(p => { r.up[p.id] = Math.min(2, p.max); });
      r.harten = 99;
      this.scene.start('Spel', { run: r });
    }
    else if (location.hash === '#berg') { const r = nieuweRun(); r.level = 1; this.scene.start('Spel', { run: r }); }
    else if (location.hash === '#winkel') { const r = nieuweRun(); r.flessen = 20; this.scene.start('Winkel', { run: r }); }
    else this.scene.start('Titel');
  }
}

class Titel extends Phaser.Scene {
  constructor() { super('Titel'); }
  create() {
    this.achtergrond = maakAchtergrond(this, 'rivier');
    this.t = 0;
    this.add.text(480, 70, 'Flesje op Avontuur', {
      fontFamily: FONT_TITEL, fontSize: '64px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 10,
    }).setOrigin(0.5);
    this.add.text(480, 132, 'Yo niffow! Zullen we een game gaan spelen?', {
      fontFamily: FONT, fontSize: '24px', fontStyle: 'bold', color: '#3cc8bb', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(0.5);
    const held = this.add.image(480, 400, 'sp_stil').setOrigin(0.5, 1).setScale(3);
    this.tweens.add({ targets: held, y: 392, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });

    const touch = this.sys.game.device.input.touch;
    const start = this.add.text(480, 440, touch ? 'Tik om te beginnen' : 'Druk op spatie om te beginnen', {
      fontFamily: FONT, fontSize: '28px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 6,
    }).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets: start, alpha: 0.4, yoyo: true, repeat: -1, duration: 650 });
    this.add.text(480, 498, touch
      ? 'Links: duim = lopen en richten  ·  Rechts: SPRING, SLASH, PIJL  ·  Omlaag in de lucht = smash'
      : '← → lopen  ·  spatie springen  ·  X slash  ·  C pijl  ·  shift dash  ·  ↓ in de lucht smash', {
      fontFamily: FONT, fontSize: '17px', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(20);

    const begin = () => {
      if (this.gestart) return;
      this.gestart = true;
      probeerVolledigScherm(this);
      this.scene.start('Spel', { run: nieuweRun() });
    };
    this.input.on('pointerup', begin);
    this.input.keyboard.on('keydown-SPACE', begin);
    this.input.keyboard.on('keydown-ENTER', begin);
  }
  update(time, delta) {
    this.t += delta / 1000;
    this.achtergrond.update(this.t * 40, this.t);
  }
}

class Winkel extends Phaser.Scene {
  constructor() { super('Winkel'); }
  create(data) {
    this.run = data.run;
    const volgende = THEMAS[(this.run.level + 1) % THEMAS.length];
    this.add.image(0, 0, 'lucht_' + volgende.id).setOrigin(0);
    this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.6).setOrigin(0);
    this.add.text(480, 14, 'Power-ups kopen', {
      fontFamily: FONT_TITEL, fontSize: '36px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 6,
    }).setOrigin(0.5, 0);
    this.add.text(480, 58, 'Tik op een kaart om te kopen. Je betaalt met volle flesjes.', {
      fontFamily: FONT, fontSize: '16px', color: '#a9b6d8',
    }).setOrigin(0.5, 0);
    this.add.image(880, 18, 'fles_mini').setOrigin(0, 0);
    this.flesTekst = this.add.text(870, 24, '', {
      fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(1, 0);

    this.kaarten = POWERUPS.map((p, i) => this.maakKaart(p, 33 + (i % 3) * 302, 88 + Math.floor(i / 3) * 128));
    this.vernieuwAlles();

    const knop = this.add.graphics();
    knop.fillStyle(0x3cc8bb, 1).fillRoundedRect(360, 478, 240, 50, 25);
    knop.lineStyle(3, 0x0a1028, 1).strokeRoundedRect(360, 478, 240, 50, 25);
    this.add.text(480, 503, 'Verder →', {
      fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: '#08201e',
    }).setOrigin(0.5);
    this.add.zone(360, 478, 240, 50).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerup', () => this.verder());
    this.input.keyboard.on('keydown-ENTER', () => this.verder());
    this.input.keyboard.on('keydown-SPACE', () => this.verder());
  }

  maakKaart(p, x, y) {
    const w = 290, h = 118;
    const kaart = {
      p, x, y, w, h,
      g: this.add.graphics(),
      naam: this.add.text(x + 14, y + 10, p.naam, { fontFamily: FONT_TITEL, fontSize: '22px', color: '#f3ead6' }),
      uitleg: this.add.text(x + 14, y + 40, '', { fontFamily: FONT, fontSize: '15px', color: '#a9b6d8', wordWrap: { width: w - 28 } }),
      prijsT: this.add.text(x + w - 30, y + h - 10, '', { fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: '#f2c14e' }).setOrigin(1, 1),
      icoon: this.add.image(x + w - 10, y + h - 8, 'fles_mini').setOrigin(1, 1).setScale(0.7),
    };
    this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerup', () => this.koop(kaart));
    return kaart;
  }

  vernieuwAlles() {
    this.flesTekst.setText('× ' + this.run.flessen);
    this.kaarten.forEach(k => this.vernieuw(k));
  }

  vernieuw(k) {
    const lvl = this.run.up[k.p.id], vol = lvl >= k.p.max, kost = prijs(k.p, lvl);
    const kan = !vol && this.run.flessen >= kost;
    k.g.clear();
    k.g.fillStyle(0x16244f, 0.95).fillRoundedRect(k.x, k.y, k.w, k.h, 14);
    k.g.lineStyle(kan ? 3 : 2, kan ? 0xf2c14e : 0x2c4387, 1).strokeRoundedRect(k.x, k.y, k.w, k.h, 14);
    for (let i = 0; i < k.p.max; i++) {
      k.g.fillStyle(i < lvl ? 0x3cc8bb : 0x2c4387, 1).fillCircle(k.x + 22 + i * 18, k.y + k.h - 20, 6);
    }
    k.uitleg.setText(vol ? 'Helemaal vol!' : k.p.uitleg[Math.min(lvl, k.p.uitleg.length - 1)]);
    k.prijsT.setText(vol ? 'MAX' : String(kost)).setColor(kan ? '#f2c14e' : '#5a6a9a');
    k.prijsT.setX(vol ? k.x + k.w - 14 : k.x + k.w - 30);
    k.icoon.setVisible(!vol).setAlpha(kan ? 1 : 0.4);
  }

  koop(k) {
    const lvl = this.run.up[k.p.id], kost = prijs(k.p, lvl);
    if (lvl >= k.p.max || this.run.flessen < kost) {
      this.tweens.add({ targets: [k.naam, k.uitleg], x: '+=6', yoyo: true, repeat: 2, duration: 50 });
      return;
    }
    this.run.flessen -= kost;
    this.run.up[k.p.id]++;
    if (k.p.id === 'hart') this.run.harten++;
    this.vernieuwAlles();
    const flits = this.add.rectangle(k.x, k.y, k.w, k.h, 0xf2c14e, 0.5).setOrigin(0);
    this.tweens.add({ targets: flits, alpha: 0, duration: 300, onComplete: () => flits.destroy() });
  }

  verder() {
    if (this.weg) return;
    this.weg = true;
    this.run.level++;
    this.scene.start('Spel', { run: this.run });
  }
}

class GameOver extends Phaser.Scene {
  constructor() { super('GameOver'); }
  create(data) {
    const meters = data.meters || 0;
    const beste = Math.max(leesBeste(), meters);
    schrijfBeste(beste);
    this.add.image(0, 0, 'lucht_berg').setOrigin(0);
    this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.55).setOrigin(0);
    this.add.text(480, 130, 'Game over', {
      fontFamily: FONT_TITEL, fontSize: '72px', color: '#d1495b', stroke: '#0a1028', strokeThickness: 10,
    }).setOrigin(0.5);
    const stijl = { fontFamily: FONT, fontSize: '30px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 6 };
    this.add.text(480, 240, `Je kwam ${meters} m ver`, stijl).setOrigin(0.5);
    this.add.text(480, 290, `Beste: ${beste} m`, { ...stijl, fontSize: '24px', color: '#f2c14e' }).setOrigin(0.5);
    const opnieuw = this.add.text(480, 400, this.sys.game.device.input.touch ? 'Tik om opnieuw te beginnen' : 'Druk op spatie om opnieuw te beginnen', {
      ...stijl, fontSize: '26px', color: '#3cc8bb',
    }).setOrigin(0.5);
    this.tweens.add({ targets: opnieuw, alpha: 0.4, yoyo: true, repeat: -1, duration: 650 });
    const begin = () => { if (!this.weg) { this.weg = true; this.scene.start('Spel', { run: nieuweRun() }); } };
    this.time.delayedCall(500, () => {
      this.input.on('pointerup', begin);
      this.input.keyboard.on('keydown-SPACE', begin);
      this.input.keyboard.on('keydown-ENTER', begin);
    });
  }
}
