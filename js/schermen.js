// Titelscherm, instellingen en winkel (de winkel komt na elke game over).

function kanVolledigScherm(scene) { return scene.scale.fullscreen && scene.scale.fullscreen.available; }

function naarVolledigScherm(scene) {
  if (!kanVolledigScherm(scene) || scene.scale.isFullscreen) return;
  try {
    scene.scale.startFullscreen();
    if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
  } catch (e) { /* lukt niet overal, geeft niks */ }
}

function wisselVolledigScherm(scene) {
  if (scene.scale.isFullscreen) scene.scale.stopFullscreen();
  else naarVolledigScherm(scene);
}

// Knopje om volledig scherm aan/uit te zetten
function maakVolledigSchermKnop(scene, x, y) {
  if (!kanVolledigScherm(scene)) return null;
  return scene.add.image(x, y, 'volscherm').setScrollFactor(0).setDepth(210).setAlpha(0.85)
    .setInteractive({ useHandCursor: true })
    .on('pointerup', () => wisselVolledigScherm(scene));
}

// Tandwiel: opent het instellingen-menu en zet het spel even op pauze
function maakInstellingenKnop(scene, x, y) {
  const open = () => {
    if (scene.scene.isPaused()) return;
    scene.scene.launch('Instellingen', { terug: scene.scene.key });
    scene.scene.pause();
  };
  scene.input.keyboard.on('keydown-ESC', open);
  return scene.add.image(x, y, 'tandwiel').setScrollFactor(0).setDepth(210).setAlpha(0.85)
    .setInteractive({ useHandCursor: true })
    .on('pointerup', open);
}

function knop(scene, x, y, w, h, tekst, kleur, actie, grootte) {
  const g = scene.add.graphics();
  g.fillStyle(kleur, 1).fillRoundedRect(x, y, w, h, h / 2);
  g.lineStyle(3, 0x0a1028, 1).strokeRoundedRect(x, y, w, h, h / 2);
  const t = scene.add.text(x + w / 2, y + h / 2, tekst, {
    fontFamily: FONT, fontSize: (grootte || 24) + 'px', fontStyle: 'bold', color: '#0a1028',
  }).setOrigin(0.5);
  const z = scene.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerup', actie);
  return { g, t, z };
}

class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    maakTexturen(this);
    const h = location.hash;
    const regios = { '#ijs': 1, '#berg': 2, '#vulkaan': 3 };
    if (h === '#spel') {
      this.scene.start('Spel', { run: nieuweRun() });
    } else if (h === '#test') {
      POWERUPS.forEach(p => { PROFIEL.up[p.id] = Math.min(2, p.max); });
      this.scene.start('Spel', { run: { level: 2, up: PROFIEL.up, harten: 99, baas: false } });
    } else if (h.startsWith('#baas')) {
      // #baas0 = pad, #baas1 = beer, #baas2 = geit, #baas3 = draak
      POWERUPS.forEach(p => { PROFIEL.up[p.id] = Math.min(2, p.max); });
      PROFIEL.regio = Number(h.slice(5)) || 0;
      this.scene.start('Spel', { run: { level: PROFIEL.regio, up: PROFIEL.up, harten: 99, baas: true } });
    } else if (regios[h] !== undefined) {
      this.scene.start('Spel', { run: { level: regios[h], up: PROFIEL.up, harten: maxHarten(), baas: false } });
    } else if (h === '#shop') {
      PROFIEL.flessen = 200;
      this.scene.start('Shop');
    } else if (h === '#kebab') {
      // meteen een kebabrol voor je neus
      this.scene.start('Spel', { run: { level: 0, up: PROFIEL.up, harten: 99, baas: false, kebab: true } });
    } else if (h === '#winkel') {
      PROFIEL.flessen = 60; PROFIEL.regio = 1;
      this.scene.start('Winkel', { meters: 123, regio: 0, baas: false });
    } else this.scene.start('Titel');
  }
}

class Instellingen extends Phaser.Scene {
  constructor() { super('Instellingen'); }
  create(data) {
    this.terug = data.terug;
    this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.75).setOrigin(0).setInteractive();
    const g = this.add.graphics();
    g.fillStyle(0x16244f, 1).fillRoundedRect(260, 70, 440, 400, 20);
    g.lineStyle(3, 0xf2c14e, 1).strokeRoundedRect(260, 70, 440, 400, 20);
    this.add.text(480, 90, 'Instellingen', { fontFamily: FONT_TITEL, fontSize: '34px', color: '#f2c14e' }).setOrigin(0.5, 0);

    const rijen = [
      { naam: 'Muziek', aan: () => Geluid.muziekIsAan(), wissel: () => Geluid.wisselMuziek() },
      { naam: 'Geluidjes', aan: () => Geluid.effectenIsAan(), wissel: () => Geluid.wisselEffecten() },
    ];
    if (kanVolledigScherm(this)) {
      rijen.push({ naam: 'Volledig scherm', aan: () => this.scale.isFullscreen, wissel: () => wisselVolledigScherm(this) });
    }
    rijen.forEach((r, i) => {
      const y = 160 + i * 70;
      this.add.text(300, y + 22, r.naam, { fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: '#f3ead6' }).setOrigin(0, 0.5);
      const sg = this.add.graphics();
      const teken = () => {
        const aan = r.aan();
        sg.clear();
        sg.fillStyle(aan ? 0x3cc8bb : 0x2c4387, 1).fillRoundedRect(560, y + 4, 100, 36, 18);
        sg.fillStyle(0xf3ead6, 1).fillCircle(aan ? 642 : 578, y + 22, 14);
      };
      teken();
      this.add.zone(540, y - 4, 140, 52).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerup', () => {
        r.wissel();
        // volledig scherm gaat pas een tikje later aan
        this.time.delayedCall(150, teken);
        teken();
      });
    });
    knop(this, 360, 395, 240, 52, 'Verder spelen', 0x3cc8bb, () => this.sluit());
    this.input.keyboard.on('keydown-ESC', () => this.sluit());
  }
  sluit() {
    this.scene.resume(this.terug);
    this.scene.stop();
  }
}

class Titel extends Phaser.Scene {
  constructor() { super('Titel'); }
  create() {
    this.gestart = false;
    this.achtergrond = maakAchtergrond(this, regioVan(Math.min(PROFIEL.startRegio, PROFIEL.regio)).id);
    this.t = 0;
    // opstijgende bierbelletjes
    this.add.particles(0, 0, 'bel', {
      x: { min: 0, max: 960 }, y: 560, speedY: { min: -90, max: -40 }, speedX: { min: -12, max: 12 },
      lifespan: 9000, frequency: 160, scale: { min: 0.6, max: 1.6 }, alpha: { start: 0.9, end: 0 },
    }).setDepth(2);
    // het titelbord: een glas bier, met BVO erop
    const bord = this.add.image(480, 92, 'titelbord').setDepth(5);
    this.tweens.add({ targets: bord, angle: { from: -1.5, to: 1.5 }, yoyo: true, repeat: -1, duration: 1800, ease: 'Sine.easeInOut' });
    ['B', 'V', 'O'].forEach((l, i) => {
      const t = this.add.text(400 + i * 80, 110, l, {
        fontFamily: FONT_TITEL, fontSize: '92px', color: '#fffaf0', stroke: '#0a1028', strokeThickness: 12,
      }).setOrigin(0.5).setDepth(6);
      // de letters springen om de beurt
      this.tweens.add({ targets: t, y: 96, yoyo: true, repeat: -1, duration: 420, delay: i * 140, ease: 'Sine.easeInOut', repeatDelay: 900 });
    });
    this.add.text(480, 186, 'Een game gemaakt door Daniel en Jantje Willie', {
      fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: '#3cc8bb', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(6);
    // links en rechts staan monsters te wachten (symmetrisch)
    const monster = (key, x, flip, schaal, vertraging) => {
      const m = this.add.image(x, 404, key).setOrigin(0.5, 1).setScale(schaal).setFlipX(flip).setDepth(4);
      this.tweens.add({ targets: m, y: 396, scaleY: schaal * 1.05, yoyo: true, repeat: -1, duration: 500 + vertraging, ease: 'Sine.easeInOut' });
      return m;
    };
    monster('pinguin', 110, true, 1.3, 0);
    monster('fust', 210, true, 1.3, 120);
    monster('lavalager', 750, false, 1.3, 60);
    monster('golem', 860, false, 1.2, 180);
    // het gouden flesje rent heen en weer onder het bord
    const goud = this.add.image(250, 268, 'goudfles').setDepth(4);
    this.tweens.add({ targets: goud, x: 710, yoyo: true, repeat: -1, duration: 3200, ease: 'Sine.easeInOut',
      onYoyo: () => goud.setFlipX(true), onRepeat: () => goud.setFlipX(false) });
    this.tweens.add({ targets: goud, y: 260, yoyo: true, repeat: -1, duration: 160 });
    const held = this.add.image(480, 404, 'sp_groot').setOrigin(0.5, 1).setScale(0.62).setDepth(5);
    this.tweens.add({ targets: held, y: 396, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });

    const touch = this.sys.game.device.input.touch;
    let hulp = touch
      ? 'Links: duim = lopen en richten  ·  Rechts: SPRING, SLASH, PIJL  ·  Omlaag in de lucht = smash'
      : '← → lopen  ·  spatie springen  ·  X slash  ·  C pijl  ·  shift dash  ·  ↓ in de lucht smash  ·  Esc instellingen';
    if (touch && !kanVolledigScherm(this)) hulp = 'iPhone: tik op Deel → "Zet op beginscherm" en open hem daar voor volledig scherm';
    this.add.text(480, 498, hulp, {
      fontFamily: FONT, fontSize: '17px', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(20);
    if (PROFIEL.flessen > 0 || PROFIEL.beste > 0) {
      this.add.text(20, 14, `Beste: ${PROFIEL.beste} m   ·   ${PROFIEL.flessen} flesjes`, {
        fontFamily: FONT, fontSize: '18px', fontStyle: 'bold', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 5,
      }).setDepth(20);
    }
    const tandwiel = maakInstellingenKnop(this, 932, 28);
    maakVolledigSchermKnop(this, 884, 28);

    const begin = () => {
      if (this.gestart || this.scene.isPaused()) return;
      this.gestart = true;
      naarVolledigScherm(this);
      this.scene.start('Spel', { run: nieuweRun() });
    };
    // de Start-knop: klik erop (of druk op spatie/Enter) om te beginnen
    const startKnop = knop(this, 270, 414, 200, 56, '▶  Start', 0xf2c14e, begin);
    for (const o of Object.values(startKnop)) o.setDepth(20);
    // de Shop-knop: naar het draairad met skins
    const shopKnop = knop(this, 490, 414, 200, 56, '🎡  Shop', 0x3cc8bb, () => {
      if (this.gestart || this.scene.isPaused()) return;
      this.gestart = true;
      this.scene.start('Shop');
    });
    for (const o of Object.values(shopKnop)) o.setDepth(20);
    // de knop zachtjes laten kloppen, zodat je ziet dat je erop moet drukken
    this.tweens.add({ targets: [startKnop.g, startKnop.t], alpha: 0.75, yoyo: true, repeat: -1, duration: 650 });
    this.input.keyboard.on('keydown-SPACE', () => begin());
    this.input.keyboard.on('keydown-ENTER', () => begin());
    void tandwiel;
  }
  update(time, delta) {
    this.t += delta / 1000;
    this.achtergrond.update(this.t * 40, this.t);
  }
}

class Winkel extends Phaser.Scene {
  constructor() { super('Winkel'); }
  create(data) {
    // elke keer opnieuw op nul, anders blijft "verder" de tweede keer hangen
    this.weg = false;
    this.data0 = data;
    // wat je bij dit winkelbezoek gekocht hebt (om ongedaan te kunnen maken)
    this.gekocht = data.gekocht || [];
    const regio = data.regio || 0;
    this.add.image(0, 0, 'lucht_' + regioVan(regio).id).setOrigin(0);
    this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.62).setOrigin(0);

    this.add.text(480, 8, 'Game over', {
      fontFamily: FONT_TITEL, fontSize: '36px', color: '#d1495b', stroke: '#0a1028', strokeThickness: 7,
    }).setOrigin(0.5, 0);
    const sub = data.baas
      ? `${regioVan(regio).baasNaam} was te sterk! Word sterker en probeer opnieuw.`
      : `Je kwam ${data.meters} m ver in ${levelNaam(regio)}  ·  beste: ${PROFIEL.beste} m`;
    this.subTekst = sub;
    this.sub = this.add.text(480, 52, sub, { fontFamily: FONT, fontSize: '16px', fontStyle: 'bold', color: '#f3ead6' }).setOrigin(0.5, 0);
    this.add.image(918, 12, 'fles_mini').setOrigin(0, 0);
    this.flesTekst = this.add.text(910, 16, '', {
      fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(1, 0);
    this.shotTekst = this.add.text(940, 54, '', { fontFamily: FONT, fontSize: '14px', color: '#f2c14e' }).setOrigin(1, 0);
    maakInstellingenKnop(this, 30, 28);
    // kleine knoppen linksboven: aankoop ongedaan maken en naar de shop met skins
    this.ongedaanKnop = knop(this, 60, 9, 140, 38, '↶ Ongedaan', 0xa9c4ee, () => this.ongedaan(), 18);
    knop(this, 210, 9, 120, 38, '🎡 Shop', 0x3cc8bb, () => this.naarShop(), 18);

    this.kaarten = POWERUPS.map((p, i) => this.maakKaart(p, 15 + (i % 5) * 188, 80 + Math.floor(i / 5) * 186));
    this.baasKaart = this.maakKaart(null, 15 + 4 * 188, 80 + 186);

    // onderaan: startregio kiezen, spelen, en vechten tegen de eindbaas
    this.regioTekst = this.add.text(160, 497, '', { fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: '#f3ead6', align: 'center' }).setOrigin(0.5);
    this.pijlL = this.add.text(30, 497, '◀', { fontFamily: FONT, fontSize: '30px', color: '#f2c14e' }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true }).on('pointerup', () => this.kiesRegio(-1));
    this.pijlR = this.add.text(290, 497, '▶', { fontFamily: FONT, fontSize: '30px', color: '#f2c14e' }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true }).on('pointerup', () => this.kiesRegio(1));
    knop(this, 340, 470, 280, 54, 'Spelen →', 0x3cc8bb, () => this.spelen());
    this.vechtKnop = knop(this, 650, 470, 290, 54, '⚔ Vecht tegen de baas!', 0xd1495b, () => this.vechten());
    this.input.keyboard.on('keydown-ENTER', () => this.spelen());
    this.input.keyboard.on('keydown-SPACE', () => this.spelen());
    this.vernieuwAlles();
    // terug uit de shop? dan heb je al gekozen
    if (data.keuzeGedaan) {
      this.kiest = false;
      const k = keuzeVan(PROFIEL.keuze);
      if (k.id) this.sub.setText(this.subTekst + '   ·   Volgende potje: ✦ ' + k.naam);
    } else this.toonKeuzes();
  }

  // Eerst kiezen: 1 van 3 upgrades voor je volgende potje
  toonKeuzes() {
    this.kiest = true;
    const laag = [];
    const vast = o => { laag.push(o); return o.setDepth(300); };
    vast(this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.94).setOrigin(0).setInteractive());
    vast(this.add.text(480, 40, 'Kies een upgrade', {
      fontFamily: FONT_TITEL, fontSize: '40px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 7,
    }).setOrigin(0.5, 0));
    vast(this.add.text(480, 96, 'Hij geldt alleen voor je volgende potje. Elke upgrade heeft een plus én een min!', {
      fontFamily: FONT, fontSize: '17px', fontStyle: 'bold', color: '#f3ead6',
    }).setOrigin(0.5, 0));
    drieKeuzes().forEach((k, i) => {
      const w = 270, h = 250, x = 30 + i * (w + 30), y = 150;
      const g = vast(this.add.graphics());
      const teken = (licht) => {
        g.clear();
        g.fillStyle(licht ? 0x22336a : 0x16244f, 1).fillRoundedRect(x, y, w, h, 16);
        g.lineStyle(licht ? 4 : 3, 0xf2c14e, 1).strokeRoundedRect(x, y, w, h, 16);
      };
      teken(false);
      vast(this.add.text(x + w / 2, y + 14, k.naam, { fontFamily: FONT_TITEL, fontSize: '26px', color: '#f2c14e' }).setOrigin(0.5, 0));
      vast(this.add.image(x + w / 2, y + 82, 'icoon_' + k.id).setScale(0.66));
      vast(this.add.text(x + 20, y + 122, '+  ' + k.plus, {
        fontFamily: FONT, fontSize: '19px', fontStyle: 'bold', color: '#5fd38a', wordWrap: { width: w - 40 },
      }));
      vast(this.add.text(x + 20, y + 182, '−  ' + k.min, {
        fontFamily: FONT, fontSize: '19px', fontStyle: 'bold', color: '#ff7a8a', wordWrap: { width: w - 40 },
      }));
      vast(this.add.text(x + w / 2, y + h + 14, String(i + 1), {
        fontFamily: FONT, fontSize: '18px', fontStyle: 'bold', color: '#5a6a9a',
      }).setOrigin(0.5, 0));
      vast(this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true }))
        .on('pointerover', () => teken(true)).on('pointerout', () => teken(false))
        .on('pointerup', () => kies(k));
      this.input.keyboard.once('keydown-' + ['ONE', 'TWO', 'THREE'][i], () => kies(k));
    });
    const kies = (k) => {
      if (!this.kiest || this.scene.isPaused()) return;
      this.kiest = false;
      PROFIEL.keuze = k.id;
      bewaarProfiel();
      Geluid.effect('koop');
      laag.forEach(o => o.destroy());
      this.sub.setText(this.subTekst + '   ·   Volgende potje: ✦ ' + k.naam);
    };
  }

  maakKaart(p, x, y) {
    const w = 178, h = 176;
    const kaart = {
      p, x, y, w, h,
      g: this.add.graphics(),
      naam: this.add.text(x + 12, y + 10, p ? p.naam : 'Eindbaas', { fontFamily: FONT_TITEL, fontSize: '18px', color: p ? '#f3ead6' : '#ff8a8a', wordWrap: { width: p ? w - 58 : w - 20 }, lineSpacing: -4 }),
      plaatje: p ? this.add.image(x + w - 24, y + 24, 'icoon_' + p.id).setScale(0.38) : null,
      uitleg: this.add.text(x + 12, y + 60, '', { fontFamily: FONT, fontSize: '14px', color: '#a9b6d8', wordWrap: { width: w - 22 } }),
      prijsT: this.add.text(x + w - 28, y + h - 8, '', { fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: '#f2c14e' }).setOrigin(1, 1),
      icoon: this.add.image(x + w - 8, y + h - 8, 'fles_mini').setOrigin(1, 1).setScale(0.7),
    };
    this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerup', () => this.koop(kaart));
    return kaart;
  }

  vernieuwAlles() {
    this.flesTekst.setText('× ' + PROFIEL.flessen);
    this.shotTekst.setText(PROFIEL.shotjes + '/10 shotjes in je flesje');
    this.kaarten.forEach(k => this.vernieuw(k));
    this.vernieuwBaas();
    PROFIEL.startRegio = Math.min(PROFIEL.startRegio, PROFIEL.regio);
    this.regioTekst.setText('Start in\n' + levelNaam(PROFIEL.startRegio));
    this.pijlL.setVisible(PROFIEL.startRegio > 0);
    this.pijlR.setVisible(PROFIEL.startRegio < PROFIEL.regio);
    for (const o of Object.values(this.vechtKnop)) o.setVisible(PROFIEL.ticket);
    if (this.ongedaanKnop) for (const o of [this.ongedaanKnop.g, this.ongedaanKnop.t]) o.setAlpha(this.gekocht.length ? 1 : 0.4);
  }

  vernieuw(k) {
    const lvl = PROFIEL.up[k.p.id], vol = lvl >= k.p.max, kost = prijs(k.p, lvl);
    const kan = !vol && PROFIEL.flessen >= kost;
    k.g.clear();
    k.g.fillStyle(0x16244f, 0.95).fillRoundedRect(k.x, k.y, k.w, k.h, 14);
    k.g.lineStyle(kan ? 3 : 2, kan ? 0xf2c14e : 0x2c4387, 1).strokeRoundedRect(k.x, k.y, k.w, k.h, 14);
    for (let i = 0; i < k.p.max; i++) {
      k.g.fillStyle(i < lvl ? 0x3cc8bb : 0x2c4387, 1).fillCircle(k.x + 18 + i * 15, k.y + k.h - 20, 5);
    }
    k.uitleg.setText(vol ? 'Helemaal vol!' : uitlegVan(k.p, lvl));
    k.prijsT.setText(vol ? 'MAX' : String(kost)).setColor(kan ? '#f2c14e' : '#5a6a9a');
    k.prijsT.setX(vol ? k.x + k.w - 12 : k.x + k.w - 28);
    k.icoon.setVisible(!vol).setAlpha(kan ? 1 : 0.4);
  }

  vernieuwBaas() {
    const k = this.baasKaart, n = PROFIEL.regio, kost = baasPrijs(n);
    const kan = !PROFIEL.ticket && PROFIEL.flessen >= kost;
    k.g.clear();
    k.g.fillStyle(0x3a1228, 0.95).fillRoundedRect(k.x, k.y, k.w, k.h, 14);
    k.g.lineStyle(PROFIEL.ticket || kan ? 3 : 2, PROFIEL.ticket ? 0x3cc8bb : kan ? 0xf2c14e : 0x7a3048, 1).strokeRoundedRect(k.x, k.y, k.w, k.h, 14);
    k.naam.setText(regioVan(n).baasNaam);
    k.uitleg.setText(PROFIEL.ticket
      ? 'Gekocht! Druk op "Vecht tegen de baas" om te vechten.'
      : `Koop een gevecht. Win je, dan ga je door naar ${levelNaam(n + 1)}!`);
    k.prijsT.setText(PROFIEL.ticket ? '✔' : String(kost)).setColor(PROFIEL.ticket ? '#3cc8bb' : kan ? '#f2c14e' : '#5a6a9a');
    k.prijsT.setX(PROFIEL.ticket ? k.x + k.w - 12 : k.x + k.w - 28);
    k.icoon.setVisible(!PROFIEL.ticket).setAlpha(kan ? 1 : 0.4);
  }

  schud(k) {
    Geluid.effect('nee');
    this.tweens.add({ targets: [k.naam, k.uitleg], x: '+=6', yoyo: true, repeat: 2, duration: 50 });
  }

  flits(k) {
    Geluid.effect('koop');
    const f = this.add.rectangle(k.x, k.y, k.w, k.h, 0xf2c14e, 0.5).setOrigin(0);
    this.tweens.add({ targets: f, alpha: 0, duration: 300, onComplete: () => f.destroy() });
  }

  koop(k) {
    if (this.kiest) return;
    if (!k.p) {
      const kost = baasPrijs(PROFIEL.regio);
      if (PROFIEL.ticket) { this.vechten(); return; }
      if (PROFIEL.flessen < kost) { this.schud(k); return; }
      PROFIEL.flessen -= kost; PROFIEL.ticket = true;
      this.gekocht.push({ baas: true, kost });
    } else {
      const lvl = PROFIEL.up[k.p.id], kost = prijs(k.p, lvl);
      if (lvl >= k.p.max || PROFIEL.flessen < kost) { this.schud(k); return; }
      PROFIEL.flessen -= kost; PROFIEL.up[k.p.id]++;
      this.gekocht.push({ id: k.p.id, kost });
    }
    bewaarProfiel();
    this.vernieuwAlles();
    this.flits(k);
  }

  // de laatste aankoop van dit bezoek terugdraaien: je krijgt je flesjes terug
  ongedaan() {
    if (this.kiest || this.weg || this.scene.isPaused()) return;
    const laatste = this.gekocht.pop();
    if (!laatste) { Geluid.effect('nee'); return; }
    if (laatste.baas) PROFIEL.ticket = false;
    else PROFIEL.up[laatste.id] = Math.max(0, PROFIEL.up[laatste.id] - 1);
    PROFIEL.flessen += laatste.kost;
    bewaarProfiel();
    this.vernieuwAlles();
    Geluid.effect('draai');
    const k = laatste.baas ? this.baasKaart : this.kaarten.find(x => x.p.id === laatste.id);
    const f = this.add.rectangle(k.x, k.y, k.w, k.h, 0xa9c4ee, 0.5).setOrigin(0);
    this.tweens.add({ targets: f, alpha: 0, duration: 300, onComplete: () => f.destroy() });
  }

  naarShop() {
    if (this.kiest || this.weg || this.scene.isPaused()) return;
    this.weg = true;
    const terug = Object.assign({}, this.data0, { keuzeGedaan: true, gekocht: this.gekocht });
    this.scene.start('Shop', { terugNaar: 'Winkel', winkelData: terug });
  }

  kiesRegio(r) {
    if (this.kiest) return;
    PROFIEL.startRegio = Phaser.Math.Clamp(PROFIEL.startRegio + r, 0, PROFIEL.regio);
    bewaarProfiel();
    this.vernieuwAlles();
  }

  spelen() {
    if (this.weg || this.kiest || this.scene.isPaused()) return;
    this.weg = true;
    this.scene.start('Spel', { run: nieuweRun(false) });
  }

  vechten() {
    if (this.weg || this.kiest || !PROFIEL.ticket || this.scene.isPaused()) return;
    this.weg = true;
    this.scene.start('Spel', { run: nieuweRun(true) });
  }
}
