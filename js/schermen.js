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

// Een knop die je voelt: hij licht op als je erboven bent, veert in als je drukt (met een klikje)
// en springt terug als je loslaat.
function knop(scene, x, y, w, h, tekst, kleur, actie, grootte) {
  const cx = x + w / 2, cy = y + h / 2;
  const g = scene.add.graphics({ x: cx, y: cy });
  const teken = (licht) => {
    g.clear();
    g.fillStyle(0x0a1028, 0.35).fillRoundedRect(-w / 2 + 2, -h / 2 + 5, w, h, h / 2); // schaduw
    const c = Phaser.Display.Color.IntegerToColor(kleur);
    if (licht) c.lighten(12);
    g.fillStyle(c.color, 1).fillRoundedRect(-w / 2, -h / 2, w, h, h / 2);
    g.fillStyle(0xffffff, 0.22).fillRoundedRect(-w / 2 + 8, -h / 2 + 4, w - 16, h * 0.32, h * 0.16); // glans
    g.lineStyle(3, 0x0a1028, 1).strokeRoundedRect(-w / 2, -h / 2, w, h, h / 2);
  };
  teken(false);
  const t = scene.add.text(cx, cy, tekst, {
    fontFamily: FONT, fontSize: (grootte || 24) + 'px', fontStyle: 'bold', color: '#0a1028',
  }).setOrigin(0.5);
  const veer = (s, duur, ease) => scene.tweens.add({ targets: [g, t], scaleX: s, scaleY: s, duration: duur, ease: ease || 'Quad.easeOut' });
  let ingedrukt = false;
  const z = scene.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true })
    .on('pointerover', () => { teken(true); if (!ingedrukt) veer(1.04, 90); })
    .on('pointerout', () => { teken(false); ingedrukt = false; veer(1, 120); })
    .on('pointerdown', () => { ingedrukt = true; veer(0.9, 60); Geluid.effect('klik'); })
    .on('pointerup', (...a) => {
      ingedrukt = false;
      veer(1, 260, 'Back.easeOut');
      actie(...a);
    });
  return { g, t, z };
}

class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    maakTexturen(this);
    const h = location.hash;
    const regios = { '#ijs': 1, '#berg': 2, '#vulkaan': 3, '#grot': 4, '#savanne': 5, '#kroeg': 6, '#fabriek': 7, '#speeltuin': 8, '#maan': 9 };
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
    } else if (h === '#dieren') {
      PROFIEL.flessen = 1000;
      this.scene.start('Dieren');
    } else if (h === '#gokkast') {
      PROFIEL.flessen = 100;
      this.scene.start('Gokkast');
    } else if (h === '#levels') {
      PROFIEL.regio = 6; PROFIEL.flessen = 60;
      this.scene.start('Winkel', { meters: 0, regio: 0, baas: false });
      this.time.delayedCall(300, () => { const w = this.scene.get('Winkel'); if (w.kiest !== undefined) { w.children.list.filter(o => o.depth === 300).forEach(o => o.destroy()); w.kiest = false; w.openLevels(); } });
    } else if (h === '#prestaties') {
      this.scene.start('Prestaties');
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
    // onderaan: verder spelen, of terug naar het hoofdscherm
    if (this.terug === 'Spel') {
      // tijdens het spelen: verder, of stoppen (dan ga je naar het Game over-menu)
      knop(this, 280, 395, 190, 52, 'Verder spelen', 0x3cc8bb, () => this.sluit(), 22);
      knop(this, 490, 395, 190, 52, '■ Stop potje', 0xd1495b, () => this.stopPotje(), 22);
    } else knop(this, 385, 395, 190, 52, 'Klaar', 0x3cc8bb, () => this.sluit(), 22);
    this.input.keyboard.on('keydown-ESC', () => this.sluit());
  }
  // eerst vragen of je het zeker weet
  stopPotje() {
    this.scene.stop();
    this.scene.launch('StopVraag');
  }
  sluit() {
    this.scene.resume(this.terug);
    this.scene.stop();
  }
}

// "Weet je het zeker?" voordat je een potje stopt. Je flesjes houd je gewoon.
class StopVraag extends Phaser.Scene {
  constructor() { super('StopVraag'); }
  create() {
    this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.8).setOrigin(0).setInteractive();
    const g = this.add.graphics();
    g.fillStyle(0x16244f, 1).fillRoundedRect(250, 140, 460, 250, 20);
    g.lineStyle(3, 0xd1495b, 1).strokeRoundedRect(250, 140, 460, 250, 20);
    this.add.text(480, 166, 'Potje stoppen?', { fontFamily: FONT_TITEL, fontSize: '36px', color: '#ff8a8a' }).setOrigin(0.5, 0);
    this.add.text(480, 230, 'Je houdt al je flesjes en shotjes.', { fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: '#f3ead6' }).setOrigin(0.5, 0);
    knop(this, 280, 300, 190, 56, 'Ja, stoppen', 0xd1495b, () => this.ja(), 22);
    knop(this, 490, 300, 190, 56, 'Nee, verder', 0x3cc8bb, () => this.nee(), 22);
    this.input.keyboard.on('keydown-ESC', () => this.nee());
  }
  ja() {
    const sp = this.scene.get('Spel');
    this.scene.resume('Spel');
    this.scene.stop();
    if (sp && !sp.dood) sp.gameOver();
  }
  nee() {
    this.scene.resume('Spel');
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
    // overal bier: glazen en flesjes zweven rond
    for (let i = 0; i < 14; i++) {
      const fles = i % 3 === 0, links = i % 2 === 0;
      const x = links ? Phaser.Math.Between(20, 330) : Phaser.Math.Between(630, 940), y = Phaser.Math.Between(230, 400);
      const b = this.add.image(x, y, fles ? 'flesbom' : 'bierglas').setScale(fles ? 1.6 : 2.2).setDepth(3).setAngle(Phaser.Math.Between(-20, 20)).setAlpha(0.9);
      this.tweens.add({ targets: b, y: y - Phaser.Math.Between(10, 30), angle: b.angle + Phaser.Math.Between(-25, 25), yoyo: true, repeat: -1, duration: Phaser.Math.Between(1200, 2400), ease: 'Sine.easeInOut', delay: i * 90 });
    }
    // het gouden flesje rent heen en weer onder het bord
    const goud = this.add.image(250, 268, 'goudfles').setDepth(4);
    this.tweens.add({ targets: goud, x: 710, yoyo: true, repeat: -1, duration: 3200, ease: 'Sine.easeInOut',
      onYoyo: () => goud.setFlipX(true), onRepeat: () => goud.setFlipX(false) });
    this.tweens.add({ targets: goud, y: 260, yoyo: true, repeat: -1, duration: 160 });
    // het poppetje drinkt een biertje
    const held = this.add.image(480, 404, 'sp_drinkt').setOrigin(0.5, 1).setScale(0.62).setDepth(5);
    this.time.addEvent({ delay: 2600, loop: true, callback: () => {
      this.tweens.add({ targets: held, angle: -8, yoyo: true, duration: 500, hold: 600, ease: 'Sine.easeInOut' });
      const g = this.add.text(530, 250, 'glug glug', { fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 5 }).setDepth(6);
      this.tweens.add({ targets: g, y: 220, alpha: 0, duration: 1300, onComplete: () => g.destroy() });
    } });

    const touch = this.sys.game.device.input.touch;
    let hulp = touch
      ? 'Links: duim = lopen en richten  ·  Rechts: SPRING, SLASH, PIJL  ·  Omlaag in de lucht = smash'
      : '← → lopen  ·  spatie springen  ·  X slash  ·  C pijl  ·  shift dash  ·  ↓ in de lucht smash  ·  Esc instellingen';
    if (touch && !kanVolledigScherm(this)) hulp = 'iPhone: tik op Deel → "Zet op beginscherm" en open hem daar voor volledig scherm';
    this.add.text(480, 498, hulp, {
      fontFamily: FONT, fontSize: '17px', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(20);
    if (PROFIEL.flessen > 0 || PROFIEL.beste > 0) {
      this.add.text(20, 14, `Beste: ${PROFIEL.beste} m   ·   ${PROFIEL.flessen} flesjes` + (PROFIEL.bazen ? `   ·   🏆 ${PROFIEL.bazen} bazen` : '') + (PROFIEL.sterren ? `   ·   ⭐ ${PROFIEL.sterren}` : ''), {
        fontFamily: FONT, fontSize: '18px', fontStyle: 'bold', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 5,
      }).setDepth(20);
    }
    const tandwiel = maakInstellingenKnop(this, 932, 28);
    maakVolledigSchermKnop(this, 884, 28);

    // De Start-knop rent 3 keer weg ("haha noob!"). De 4e keer mag je echt spelen.
    this.gepest = 0;
    const W = 300, H = 64;
    let plek = { x: 480, y: 442 };
    const begin = () => {
      if (this.gestart || this.scene.isPaused() || this.rent) return;
      if (this.gepest < 3) { this.renWeg(); return; }
      this.gestart = true;
      naarVolledigScherm(this);
      this.scene.start('Spel', { run: nieuweRun() });
    };
    const startKnop = this.startKnop = knop(this, plek.x - W / 2, plek.y - H / 2, W, H, '▶  Start', 0xf2c14e, begin, 30);
    for (const o of Object.values(startKnop)) o.setDepth(20);
    // pootjes onder de knop (zie je alleen als hij wegrent)
    const poot = (dx) => this.add.ellipse(0, 0, 26, 12, 0x4a2a12).setStrokeStyle(2, 0x0a1028).setDepth(19).setVisible(false);
    this.pootjes = [poot(-60), poot(60)];
    this.renWeg = () => {
      this.gepest++;
      this.rent = true;
      const oud = { ...plek };
      // een plek ver weg van waar hij nu is
      do { plek = { x: Phaser.Math.Between(170, 790), y: Phaser.Math.Between(240, 450) }; } while (Math.abs(plek.x - oud.x) < 250);
      const noob = this.add.text(oud.x, oud.y - 40, ['haha noob!', 'NOOB!', 'haha, nog steeds een noob!'][this.gepest - 1], {
        fontFamily: FONT_TITEL, fontSize: '34px', color: '#ff8a8a', stroke: '#0a1028', strokeThickness: 7,
      }).setOrigin(0.5).setDepth(30).setScale(0.3);
      this.tweens.add({ targets: noob, scale: 1, duration: 200, ease: 'Back.easeOut' });
      this.tweens.add({ targets: noob, y: oud.y - 90, alpha: 0, delay: 900, duration: 500, onComplete: () => noob.destroy() });
      Geluid.effect('noob');
      this.pootjes.forEach(p => p.setVisible(true));
      const duur = 650, delen = [startKnop.g, startKnop.t];
      this.tweens.addCounter({ from: 0, to: 1, duration: duur, ease: 'Sine.easeInOut',
        onUpdate: (tw) => {
          // rennen met huppeltjes: 5 sprongetjes onderweg
          const f = tw.getValue(), x = oud.x + (plek.x - oud.x) * f;
          const y = oud.y + (plek.y - oud.y) * f - Math.abs(Math.sin(f * Math.PI * 5)) * 16;
          for (const d of delen) { d.x = x; d.y = y; }
          startKnop.z.setPosition(x - W / 2, y - H / 2);
          this.pootjes.forEach((p, i) => p.setPosition(x + (i ? 50 : -50) + Math.sin(f * 30 + i * Math.PI) * 12, y + H / 2 + 6));
          if (Math.random() < 0.3) this.vonkje(x, y + H / 2);
        },
        onComplete: () => {
          for (const d of delen) { d.x = plek.x; d.y = plek.y; }
          startKnop.z.setPosition(plek.x - W / 2, plek.y - H / 2);
          this.pootjes.forEach(p => p.setVisible(false));
          this.rent = false;
          if (this.gepest === 3) {
            const ok = this.add.text(plek.x, plek.y - 56, 'oké oké, nu mag je spelen 😇', { fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: '#5fd38a', stroke: '#0a1028', strokeThickness: 5 }).setOrigin(0.5).setDepth(30);
            this.tweens.add({ targets: ok, alpha: 0, delay: 1600, duration: 500, onComplete: () => ok.destroy() });
          }
        },
      });
    };
    this.vonkje = (x, y) => {
      const s = this.add.circle(x + Phaser.Math.Between(-60, 60), y, Phaser.Math.Between(3, 6), 0xc8b08a, 0.8).setDepth(18);
      this.tweens.add({ targets: s, y: y - 14, alpha: 0, scale: 2, duration: 400, onComplete: () => s.destroy() });
    };
    // alle bazen verslagen? Dan kun je opnieuw brouwen (prestige)
    if (PROFIEL.regio >= REGIOS.length) {
      const pk = knop(this, 20, 46, 230, 40, '⭐ Opnieuw brouwen', 0xf2c14e, () => this.vraagOpnieuw(), 18);
      for (const o of Object.values(pk)) o.setDepth(20);
      this.tweens.add({ targets: [pk.g, pk.t], alpha: 0.7, yoyo: true, repeat: -1, duration: 700 });
    }
    this.input.keyboard.on('keydown-SPACE', () => begin());
    this.input.keyboard.on('keydown-ENTER', () => begin());
    void tandwiel;
  }
  // Opnieuw brouwen: alles opnieuw, maar je krijgt een ster (+10% shotjes voor altijd)
  vraagOpnieuw() {
    if (this.gestart || this.vraag) return;
    const laag = [];
    const vast = o => { laag.push(o); return o.setDepth(300); };
    vast(this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.9).setOrigin(0).setInteractive());
    vast(this.add.text(480, 110, '⭐ Opnieuw brouwen?', { fontFamily: FONT_TITEL, fontSize: '40px', color: '#f2c14e' }).setOrigin(0.5));
    vast(this.add.text(480, 220, [
      'Je begint weer bij de Rivier, zonder flesjes en zonder power-ups.',
      'Je skins, huisdieren en prestaties houd je.',
      `Je krijgt ster nummer ${PROFIEL.sterren + 1}: shotjes zijn voor altijd ${10 * (PROFIEL.sterren + 1)}% meer waard!`,
    ].join('\n'), { fontFamily: FONT, fontSize: '19px', fontStyle: 'bold', color: '#f3ead6', align: 'center', lineSpacing: 8 }).setOrigin(0.5));
    const ja = knop(this, 270, 320, 200, 56, 'Ja, brouwen!', 0xf2c14e, () => this.opnieuwBrouwen(), 22);
    const nee = knop(this, 490, 320, 200, 56, 'Nee', 0xa9c4ee, () => { laag.forEach(o => o.destroy()); this.vraag = false; });
    for (const k of [ja, nee]) for (const o of Object.values(k)) laag.push(o.setDepth(301));
    this.vraag = true;
  }

  opnieuwBrouwen() {
    PROFIEL.sterren++;
    PROFIEL.regio = 0; PROFIEL.startRegio = 0; PROFIEL.flessen = 0; PROFIEL.shotjes = 0;
    PROFIEL.ticket = false; PROFIEL.keuze = ''; PROFIEL.aan = {};
    POWERUPS.forEach(p => { PROFIEL.up[p.id] = 0; });
    statTel('prestige');
    bewaarProfiel();
    Geluid.effect('baasWeg');
    this.scene.restart();
  }

  update(time, delta) {
    this.t += delta / 1000;
    this.achtergrond.update(this.t * 40, this.t);
  }
}

// het stuk van de winkel waar de kaarten staan (daartussen kun je scrollen)
const WINKEL_BOVEN = 74, WINKEL_ONDER = 458;

class Winkel extends Phaser.Scene {
  constructor() { super('Winkel'); }

  // Het menu na het doodgaan: grote tegels naar alle schermen, en onderaan Spelen.
  create(data) {
    this.weg = false;
    this.data0 = data;
    this.gekocht = data.gekocht || [];
    const regio = data.regio || 0;
    this.add.image(0, 0, 'lucht_' + regioVan(regio).id).setOrigin(0);
    this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.6).setOrigin(0);
    this.add.text(480, 6, 'Game over', {
      fontFamily: FONT_TITEL, fontSize: '36px', color: '#d1495b', stroke: '#0a1028', strokeThickness: 7,
    }).setOrigin(0.5, 0);
    const sub = data.baas
      ? `${regioVan(regio).baasNaam} was te sterk! Word sterker en probeer opnieuw.`
      : `Je kwam ${data.meters} m ver in ${levelNaam(regio)}  ·  beste: ${PROFIEL.beste} m`;
    this.subTekst = sub;
    this.sub = this.add.text(480, 50, sub, { fontFamily: FONT, fontSize: '16px', fontStyle: 'bold', color: '#f3ead6' }).setOrigin(0.5, 0);
    this.add.image(918, 12, 'fles_mini').setOrigin(0, 0);
    this.flesTekst = this.add.text(910, 16, '', {
      fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(1, 0);
    maakInstellingenKnop(this, 30, 28);

    // de tegels: 4 naast elkaar, 2 rijen
    const T = [
      { naam: 'Power-ups', kleur: 0x3cc8bb, actie: () => this.naar('PowerUps') },
      { naam: 'Skins', kleur: 0xff8ac8, actie: () => this.naar('Shop') },
      { naam: 'Dieren', kleur: 0x5fd38a, actie: () => this.naarOpSlot('Dieren', DIEREN_VANAF) },
      { naam: 'Gokkast', kleur: 0xd1495b, actie: () => this.naarOpSlot('Gokkast', GOKKAST_VANAF) },
      { naam: 'Level', kleur: 0x7a5cff, actie: () => this.openLevels() },
      { naam: 'Eindbaas', kleur: 0xc8501c, actie: () => this.toonBaas() },
      { naam: 'Prestaties', kleur: 0xf2c14e, actie: () => this.naar('Prestaties') },
      { naam: 'Instellingen', kleur: 0xa9c4ee, actie: () => this.openInstellingen() },
    ];
    this.tegels = {};
    T.forEach((t, i) => { this.tegels[t.naam] = this.maakTegel(t, 36 + (i % 4) * 226, 84 + Math.floor(i / 4) * 180); });

    this.speelKnop = knop(this, 270, 456, 420, 62, '', 0xf2c14e, () => this.spelen(), 26);
    this.input.keyboard.on('keydown-ENTER', () => this.spelen());
    this.input.keyboard.on('keydown-SPACE', () => this.spelen());
    this.vernieuwAlles();
    // terug uit een ander scherm? dan heb je al gekozen
    if (data.keuzeGedaan) {
      this.kiest = false;
      const k = keuzeVan(PROFIEL.keuze);
      if (k.id) this.sub.setText(this.subTekst + '   ·   Volgende potje: ✦ ' + k.naam);
    } else this.toonKeuzes();
    meldOpenPrestaties(this);
  }

  // een grote tegel met een plaatje, een naam en een hintje eronder
  maakTegel(t, x, y) {
    const w = 210, h = 164;
    const c = this.add.container(x + w / 2, y + h / 2);
    const g = this.add.graphics();
    const teken = (licht) => {
      g.clear();
      g.fillStyle(0x0a1028, 0.4).fillRoundedRect(-w / 2 + 3, -h / 2 + 6, w, h, 18);
      g.fillStyle(licht ? 0x2c4387 : 0x16244f, 1).fillRoundedRect(-w / 2, -h / 2, w, h, 18);
      g.fillStyle(t.kleur, 1).fillRoundedRect(-w / 2, -h / 2, w, 10, { tl: 18, tr: 18, bl: 0, br: 0 });
      g.lineStyle(licht ? 4 : 3, licht ? 0xf2c14e : t.kleur, 1).strokeRoundedRect(-w / 2, -h / 2, w, h, 18);
    };
    teken(false);
    const naam = this.add.text(0, 22, t.naam, { fontFamily: FONT_TITEL, fontSize: '24px', color: '#f3ead6' }).setOrigin(0.5);
    const hint = this.add.text(0, 52, '', { fontFamily: FONT, fontSize: '15px', fontStyle: 'bold', color: '#a9b6d8', align: 'center' }).setOrigin(0.5);
    c.add([g, naam, hint]);
    const tegel = { t, c, g, naam, hint, plaatje: null, x, y, w, h };
    const z = this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true })
      .on('pointerover', () => { teken(true); this.tweens.add({ targets: c, scale: 1.04, duration: 90 }); })
      .on('pointerout', () => { teken(false); this.tweens.add({ targets: c, scale: 1, duration: 120 }); })
      .on('pointerdown', () => { this.tweens.add({ targets: c, scale: 0.92, duration: 60 }); Geluid.effect('klik'); })
      .on('pointerup', () => { this.tweens.add({ targets: c, scale: 1, duration: 220, ease: 'Back.easeOut' }); if (!this.kiest) t.actie(); });
    tegel.z = z;
    return tegel;
  }

  // plaatje op een tegel zetten (een textuur, of een emoji)
  zetPlaatje(tegel, key, schaal, emoji) {
    if (tegel.plaatje) tegel.plaatje.destroy();
    tegel.plaatje = emoji
      ? this.add.text(0, -30, emoji, { fontFamily: FONT, fontSize: '50px' }).setOrigin(0.5)
      : this.add.image(0, -30, key).setScale(schaal);
    if (!emoji && tegel.plaatje.displayHeight > 84) tegel.plaatje.setScale(tegel.plaatje.scale * 84 / tegel.plaatje.displayHeight);
    if (!emoji && tegel.plaatje.displayWidth > 180) tegel.plaatje.setScale(tegel.plaatje.scale * 180 / tegel.plaatje.displayWidth);
    tegel.c.add(tegel.plaatje);
  }

  // de hintjes onder de tegels bijwerken
  vernieuwAlles() {
    this.flesTekst.setText('× ' + PROFIEL.flessen);
    PROFIEL.startRegio = Math.min(PROFIEL.startRegio, PROFIEL.regio);
    const T = this.tegels, n = this.baasN();
    const teKoop = POWERUPS.filter(p => powerupOpen(p) && PROFIEL.up[p.id] < p.max && PROFIEL.flessen >= prijs(p, PROFIEL.up[p.id])).length;
    this.zetPlaatje(T['Power-ups'], 'icoon_dash', 1.1);
    T['Power-ups'].hint.setText(teKoop ? `${teKoop} te koop!` : 'nog even sparen').setColor(teKoop ? '#5fd38a' : '#a9b6d8');
    this.zetPlaatje(T.Skins, 'skin_' + PROFIEL.skin, 0.32);
    const radOver = RAD_SKINS.some(k => !PROFIEL.skins.includes(k.id));
    T.Skins.hint.setText(radOver ? `draaien: ${draaiPrijs()} 🍺` : 'alles verzameld!');
    const dier = DIEREN.find(d => d.id === PROFIEL.dier && PROFIEL.dieren[d.id]);
    this.zetPlaatje(T.Dieren, 'dier_groot_' + (dier ? dier.id : 'kuiken'), 0.55);
    T.Dieren.plaatje.setAlpha(dier ? 1 : 0.4);
    T.Dieren.hint.setText(PROFIEL.regio < DIEREN_VANAF ? '🔒 ' + vanafNaam(DIEREN_VANAF) : `${Object.keys(PROFIEL.dieren).length} van ${DIEREN.length}` + (dier ? ` · ${dier.naam} mee` : ''));
    this.zetPlaatje(T.Gokkast, null, 1, '🎰');
    T.Gokkast.hint.setText(PROFIEL.regio < GOKKAST_VANAF ? '🔒 ' + vanafNaam(GOKKAST_VANAF) : '×2, ×3 of ×5... of niks!');
    T.Gokkast.c.setAlpha(PROFIEL.regio < GOKKAST_VANAF ? 0.55 : 1);
    T.Dieren.c.setAlpha(PROFIEL.regio < DIEREN_VANAF ? 0.55 : 1);
    this.zetPlaatje(T.Level, 'mini_' + regioVan(PROFIEL.startRegio).id, 1);
    T.Level.hint.setText(levelNaam(PROFIEL.startRegio) + (PROFIEL.startRegio < PROFIEL.regio ? ' ✔' : '') + '  ·  wisselen');
    this.levelHint = T.Level.hint;
    this.zetPlaatje(T.Eindbaas, 'baas_' + regioVan(n).baas, 0.5);
    T.Eindbaas.hint.setText(PROFIEL.ticket === n ? 'Gekocht! ⚔ Vechten' : `${baasPrijs(n)} → ${baasBeloning(n)} 🍺` + (n < PROFIEL.regio ? '  ✔' : ''));
    this.zetPlaatje(T.Prestaties, null, 1, '🏆');
    T.Prestaties.hint.setText(`${PROFIEL.prestaties.length} van ${PRESTATIES.length}`);
    this.zetPlaatje(T.Instellingen, null, 1, '⚙');
    T.Instellingen.hint.setText('muziek en geluid');
    this.speelKnop.t.setText('▶  Spelen in ' + levelNaam(PROFIEL.startRegio));
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

  // de baas van het level waar je start (kies een eerder level om een verslagen baas nog eens te doen)
  baasN() { return Math.min(PROFIEL.startRegio, PROFIEL.regio); }

  // het venster van de eindbaas: kopen en vechten
  toonBaas() {
    if (this.kiest || this.weg || this.baasLaag) return;
    const n = this.baasN(), r = regioVan(n), kost = baasPrijs(n), gekocht = PROFIEL.ticket === n;
    const laag = this.baasLaag = [];
    const vast = o => { laag.push(o); return o.setDepth(300); };
    const sluit = () => { laag.forEach(o => o.destroy()); this.baasLaag = null; };
    vast(this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.85).setOrigin(0).setInteractive());
    const g = vast(this.add.graphics());
    g.fillStyle(0x3a1228, 1).fillRoundedRect(200, 60, 560, 420, 22).lineStyle(4, 0xc8501c, 1).strokeRoundedRect(200, 60, 560, 420, 22);
    vast(this.add.text(480, 80, r.baasNaam, { fontFamily: FONT_TITEL, fontSize: '36px', color: '#ff8a8a' }).setOrigin(0.5, 0));
    const img = vast(this.add.image(480, 250, 'baas_' + r.baas));
    if (img.displayHeight > 150) img.setScale(150 / img.displayHeight);
    if (img.displayWidth > 300) img.setScale(img.scale * 300 / img.displayWidth);
    this.tweens.add({ targets: img, y: 244, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });
    vast(this.add.text(480, 342, (n < PROFIEL.regio ? '✔ Al verslagen! ' : '') + `Gevecht kost ${kost} 🍺  ·  beloning ${baasBeloning(n)} 🍺` + (n >= PROFIEL.regio ? `\nWin je, dan ga je door naar ${levelNaam(n + 1)}!` : ''), {
      fontFamily: FONT, fontSize: '18px', fontStyle: 'bold', color: '#f3ead6', align: 'center',
    }).setOrigin(0.5, 0));
    const kan = gekocht || PROFIEL.flessen >= kost;
    const a = knop(this, 250, 408, 240, 56, gekocht ? '⚔ Vecht!' : `⚔ Koop & vecht (${kost})`, kan ? 0xd1495b : 0x5a6a9a, () => {
      if (!this.koopBaas()) { Geluid.effect('nee'); return; }
      this.vechten();
    }, 20);
    const b = knop(this, 510, 408, 200, 56, 'Sluiten', 0xa9c4ee, sluit, 22);
    for (const k of [a, b]) for (const o of Object.values(k)) laag.push(o.setDepth(301));
  }

  // een gevecht kopen voor de baas van het gekozen level (true als het lukt of al gekocht was)
  koopBaas() {
    const n = this.baasN(), kost = baasPrijs(n);
    if (PROFIEL.ticket === n) return true;
    if (PROFIEL.flessen < kost) return false;
    PROFIEL.flessen -= kost; PROFIEL.ticket = n;
    this.gekocht.push({ baas: true, kost });
    bewaarProfiel();
    this.vernieuwAlles();
    return true;
  }

  // naar een ander scherm, en daarna weer terug naar dit menu
  naar(scene) {
    if (this.kiest || this.weg || this.scene.isPaused()) return;
    this.weg = true;
    const terug = Object.assign({}, this.data0, { keuzeGedaan: true, gekocht: this.gekocht });
    if (scene === 'Shop') this.scene.start('Shop', { terugNaar: 'Winkel', winkelData: terug });
    else this.scene.start(scene, { terugNaar: 'Winkel', terugData: terug });
  }

  // naar een scherm dat pas later open gaat
  naarOpSlot(scene, vanaf) {
    if (PROFIEL.regio < vanaf) {
      Geluid.effect('nee');
      const t = this.tegels[scene], tekst = this.add.text(t.x + t.w / 2, t.y - 4, '🔒 ' + vanafNaam(vanaf), { fontFamily: FONT, fontSize: '18px', fontStyle: 'bold', color: '#ff8a8a', stroke: '#0a1028', strokeThickness: 5 }).setOrigin(0.5).setDepth(50);
      this.tweens.add({ targets: tekst, y: tekst.y - 26, alpha: 0, duration: 1100, onComplete: () => tekst.destroy() });
      return;
    }
    this.naar(scene);
  }

  openInstellingen() {
    if (this.kiest || this.weg || this.scene.isPaused()) return;
    this.scene.launch('Instellingen', { terug: 'Winkel' });
    this.scene.pause();
  }

  // het levelkeuzescherm openen (dit menu wacht even)
  openLevels() {
    if (this.kiest || this.weg || this.scene.isPaused()) return;
    this.scene.launch('LevelKeuze', { terug: 'Winkel' });
    this.scene.pause();
  }

  kiesRegio(r) {
    if (this.kiest) return;
    PROFIEL.startRegio = Phaser.Math.Clamp(PROFIEL.startRegio + r, 0, PROFIEL.regio);
    bewaarProfiel();
    this.vernieuwAlles();
  }

  spelen() {
    if (this.weg || this.kiest || this.baasLaag || this.scene.isPaused()) return;
    this.weg = true;
    this.scene.start('Spel', { run: nieuweRun(false) });
  }

  vechten() {
    if (this.weg || this.kiest || PROFIEL.ticket === false || this.scene.isPaused()) return;
    this.weg = true;
    const n = PROFIEL.ticket;
    // je ticket is nu op: verlies je, dan moet je opnieuw betalen
    PROFIEL.ticket = false;
    bewaarProfiel();
    this.scene.start('Spel', { run: nieuweRun(true, n) });
  }
}

class PowerUps extends Phaser.Scene {
  constructor() { super('PowerUps'); }
  create(data) {
    this.weg = false; this.kiest = false;
    this.terugData = data.terugData || {};
    // wat je bij dit bezoek gekocht hebt (om ongedaan te kunnen maken)
    this.gekocht = this.terugData.gekocht || [];
    this.add.image(0, 0, 'lucht_' + regioVan(this.terugData.regio || 0).id).setOrigin(0);
    this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.62).setOrigin(0);
    this.add.text(480, 8, '⚡ Power-ups', {
      fontFamily: FONT_TITEL, fontSize: '36px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 7,
    }).setOrigin(0.5, 0);
    this.add.text(480, 52, 'Tik op een kaart om te kopen  ·  ◀ ▶ zet een power-up lager of hoger', { fontFamily: FONT, fontSize: '15px', fontStyle: 'bold', color: '#f3ead6' }).setOrigin(0.5, 0);
    this.add.image(918, 12, 'fles_mini').setOrigin(0, 0);
    this.flesTekst = this.add.text(910, 16, '', {
      fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(1, 0);
    this.shotTekst = this.add.text(940, 54, '', { fontFamily: FONT, fontSize: '14px', color: '#f2c14e' }).setOrigin(1, 0);
    maakInstellingenKnop(this, 30, 28);

    // alle kaarten zitten in een lijst die je kunt scrollen (muiswiel, pijltjes of slepen met je vinger)
    this.lijst = this.add.container(0, 0);
    const vak = this.make.graphics({ add: false }).fillRect(0, WINKEL_BOVEN, 960, WINKEL_ONDER - WINKEL_BOVEN);
    this.lijst.setMask(vak.createGeometryMask());
    this.kaarten = POWERUPS.map((p, i) => this.maakKaart(p, 15 + (i % 5) * 188, 80 + Math.floor(i / 5) * 186));
    this.maakScroll(Math.ceil(POWERUPS.length / 5) * 186 + 80 - 10);

    // onderaan: aankoop ongedaan maken, terug naar het menu, of meteen spelen
    this.ongedaanKnop = knop(this, 90, 470, 220, 54, '↶ Ongedaan', 0xa9c4ee, () => this.ongedaan(), 22);
    knop(this, 370, 470, 220, 54, '← Terug', 0x3cc8bb, () => this.terug());
    knop(this, 650, 470, 220, 54, '▶ Spelen', 0xf2c14e, () => this.spelen());
    this.input.keyboard.on('keydown-ESC', () => this.terug());
    this.vernieuwAlles();
  }

  maakKaart(p, x, y) {
    const w = 178, h = 176;
    const kaart = {
      p, x, y, w, h,
      g: this.add.graphics(),
      naam: this.add.text(x + 12, y + 10, p ? p.naam : 'Eindbaas', { fontFamily: FONT_TITEL, fontSize: p && p.naam.length > 13 && !p.naam.includes(' ') ? '15px' : '18px', color: p ? '#f3ead6' : '#ff8a8a', wordWrap: { width: p ? w - 58 : w - 20 }, lineSpacing: -4 }),
      plaatje: p ? this.add.image(x + w - 24, y + 24, 'icoon_' + p.id).setScale(0.38) : null,
      uitleg: this.add.text(x + 12, y + (p ? 70 : 60), '', { fontFamily: FONT, fontSize: '14px', color: '#a9b6d8', wordWrap: { width: w - 22 } }),
      // links: welk niveau AAN staat (met pijltjes), rechts: wat je HEBT
      aanT: p ? this.add.text(x + 36, y + 52, '', { fontFamily: FONT, fontSize: '14px', fontStyle: 'bold', color: '#3cc8bb' }).setOrigin(0.5) : null,
      hebT: p ? this.add.text(x + w - 12, y + 52, '', { fontFamily: FONT, fontSize: '14px', fontStyle: 'bold', color: '#f2c14e' }).setOrigin(1, 0.5) : null,
      prijsT: this.add.text(x + w - 28, y + h - 8, '', { fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: '#f2c14e' }).setOrigin(1, 1),
      icoon: this.add.image(x + w - 8, y + h - 8, 'fles_mini').setOrigin(1, 1).setScale(0.7),
    };
    const zone = this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerup', (ptr) => {
      // niet kopen als je aan het scrollen was, of als de kaart buiten beeld zit
      if (this.gesleept || ptr.y - this.cameras.main.y < WINKEL_BOVEN || ptr.y - this.cameras.main.y > WINKEL_ONDER) return;
      this.koop(kaart);
    });
    this.lijst.add([kaart.g, kaart.naam, kaart.uitleg, kaart.prijsT, kaart.icoon, zone]);
    if (kaart.plaatje) this.lijst.add(kaart.plaatje);
    if (p) {
      this.lijst.add([kaart.aanT, kaart.hebT]);
      // pijltjes om het niveau dat aan staat lager of hoger te zetten
      const pijl = (dx, r) => {
        const t = this.add.text(x + dx, y + 52, r < 0 ? '◀' : '▶', { fontFamily: FONT, fontSize: '16px', color: '#3cc8bb' }).setOrigin(0.5);
        const z = this.add.zone(x + dx, y + 52, 26, 26).setInteractive({ useHandCursor: true }).on('pointerup', (ptr) => {
          if (this.gesleept || this.kiest || ptr.y - this.cameras.main.y < WINKEL_BOVEN || ptr.y - this.cameras.main.y > WINKEL_ONDER) return;
          this.zetAan(kaart, r);
        });
        this.lijst.add([t, z]);
        return t;
      };
      kaart.pijlL = pijl(12, -1); kaart.pijlR = pijl(60, 1);
    }
    return kaart;
  }

  // Scrollen door de kaarten
  maakScroll(onderkant) {
    this.scroll = 0;
    this.maxScroll = Math.max(0, onderkant - WINKEL_ONDER + 4);
    if (!this.maxScroll) return;
    const balk = this.add.graphics();
    this.pijlOmlaag = this.add.text(480, WINKEL_ONDER - 2, '▼ scroll voor meer ▼', {
      fontFamily: FONT, fontSize: '15px', fontStyle: 'bold', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 4,
    }).setOrigin(0.5, 1).setDepth(5);
    this.tweens.add({ targets: this.pijlOmlaag, y: WINKEL_ONDER + 2, yoyo: true, repeat: -1, duration: 500 });
    const zet = (y) => {
      this.scroll = Phaser.Math.Clamp(y, 0, this.maxScroll);
      this.lijst.y = -this.scroll;
      const hoog = WINKEL_ONDER - WINKEL_BOVEN, lengte = hoog * hoog / (hoog + this.maxScroll);
      balk.clear();
      balk.fillStyle(0x0a1028, 0.6).fillRoundedRect(951, WINKEL_BOVEN, 6, hoog, 3);
      balk.fillStyle(0xf2c14e, 1).fillRoundedRect(951, WINKEL_BOVEN + (hoog - lengte) * this.scroll / this.maxScroll, 6, lengte, 3);
      this.pijlOmlaag.setVisible(this.scroll < this.maxScroll - 5);
    };
    zet(0);
    this.input.on('wheel', (p, o, dx, dy) => { if (!this.kiest) zet(this.scroll + dy * 0.6); });
    this.input.keyboard.on('keydown-DOWN', () => zet(this.scroll + 90));
    this.input.keyboard.on('keydown-UP', () => zet(this.scroll - 90));
    // slepen met je vinger (of de muis)
    let start = null;
    this.input.on('pointerdown', p => { const y = p.y - this.cameras.main.y; this.gesleept = false; start = (y >= WINKEL_BOVEN && y <= WINKEL_ONDER) ? { y: p.y, s: this.scroll } : null; });
    this.input.on('pointermove', p => {
      if (!start || !p.isDown || this.kiest) return;
      if (Math.abs(p.y - start.y) > 8) this.gesleept = true;
      if (this.gesleept) zet(start.s - (p.y - start.y));
    });
    this.input.on('pointerup', () => { start = null; });
  }

  vernieuwAlles() {
    this.flesTekst.setText('× ' + PROFIEL.flessen);
    this.shotTekst.setText(PROFIEL.shotjes + '/10 shotjes in je flesje');
    this.kaarten.forEach(k => this.vernieuw(k));
    for (const o of [this.ongedaanKnop.g, this.ongedaanKnop.t]) o.setAlpha(this.gekocht.some(g => !g.baas) ? 1 : 0.4);
  }

  vernieuw(k) {
    const lvl = PROFIEL.up[k.p.id], oneindg = oneindig(k.p), vol = !oneindg && lvl >= k.p.max, kost = prijs(k.p, lvl);
    const open = powerupOpen(k.p), kan = open && !vol && PROFIEL.flessen >= kost;
    k.g.clear();
    k.g.fillStyle(open ? 0x16244f : 0x0e1630, 0.95).fillRoundedRect(k.x, k.y, k.w, k.h, 14);
    k.g.lineStyle(kan ? 3 : 2, kan ? 0xf2c14e : open ? 0x2c4387 : 0x1e2a50, 1).strokeRoundedRect(k.x, k.y, k.w, k.h, 14);
    if (!oneindg) for (let i = 0; i < k.p.max; i++) k.g.fillStyle(i < lvl ? 0x3cc8bb : 0x2c4387, 1).fillCircle(k.x + 18 + i * 15, k.y + k.h - 20, 5);
    if (!k.oneindigT) { k.oneindigT = this.add.text(k.x + 12, k.y + k.h - 20, '', { fontFamily: FONT, fontSize: '15px', fontStyle: 'bold', color: '#3cc8bb' }).setOrigin(0, 0.5); this.lijst.add(k.oneindigT); }
    k.oneindigT.setText(oneindg ? '∞  niveau ' + lvl : '');
    k.naam.setAlpha(open ? 1 : 0.45); if (k.plaatje) k.plaatje.setAlpha(open ? 1 : 0.35);
    k.uitleg.setText(!open ? '🔒 ' + vanafNaam(k.p.vanaf) : vol ? 'Helemaal vol!' : uitlegVan(k.p, lvl)).setColor(open ? '#a9b6d8' : '#7a8ab8');
    const aan = aanNiveau(k.p.id);
    for (const o of [k.aanT, k.hebT, k.pijlL, k.pijlR]) o.setVisible(lvl > 0);
    k.aanT.setText(aan === 0 ? 'uit' : 'aan ' + aan);
    k.hebT.setText('heb ' + (vol ? 'MAX' : lvl));
    k.pijlL.setAlpha(aan > 0 ? 1 : 0.25); k.pijlR.setAlpha(aan < lvl ? 1 : 0.25);
    k.prijsT.setText(!open ? '🔒' : vol ? 'MAX' : String(kost)).setColor(kan ? '#f2c14e' : '#5a6a9a');
    k.prijsT.setX(vol || !open ? k.x + k.w - 12 : k.x + k.w - 28);
    k.icoon.setVisible(open && !vol).setAlpha(kan ? 1 : 0.4);
  }


  // een power-up lager (of weer hoger) zetten, zonder iets te verliezen
  zetAan(k, r) {
    const heb = PROFIEL.up[k.p.id], nieuw = Phaser.Math.Clamp(aanNiveau(k.p.id) + r, 0, heb);
    if (nieuw === aanNiveau(k.p.id)) { Geluid.effect('nee'); return; }
    PROFIEL.aan[k.p.id] = nieuw;
    bewaarProfiel();
    Geluid.effect('draai');
    this.vernieuw(k);
  }

  schud(k) {
    Geluid.effect('nee');
    this.tweens.add({ targets: [k.naam, k.uitleg], x: '+=6', yoyo: true, repeat: 2, duration: 50 });
  }

  flits(k) {
    Geluid.effect('koop');
    const f = this.add.rectangle(k.x, k.y, k.w, k.h, 0xf2c14e, 0.5).setOrigin(0);
    this.lijst.add(f);
    this.tweens.add({ targets: f, alpha: 0, duration: 300, onComplete: () => f.destroy() });
  }

  koop(k) {
    const lvl = PROFIEL.up[k.p.id], kost = prijs(k.p, lvl);
    if (!powerupOpen(k.p) || lvl >= k.p.max || PROFIEL.flessen < kost) { this.schud(k); return; }
    PROFIEL.flessen -= kost; PROFIEL.up[k.p.id]++;
    delete PROFIEL.aan[k.p.id]; // wat je net koopt staat meteen aan
    statTel('koop');
    this.gekocht.push({ id: k.p.id, kost });
    bewaarProfiel();
    this.vernieuwAlles();
    this.flits(k);
    checkPrestaties(this);
  }

  // de laatste power-up van dit bezoek terugdraaien: je krijgt je flesjes terug
  ongedaan() {
    if (this.weg || this.scene.isPaused()) return;
    const i = this.gekocht.map(g => !g.baas).lastIndexOf(true);
    if (i < 0) { Geluid.effect('nee'); return; }
    const laatste = this.gekocht.splice(i, 1)[0];
    PROFIEL.up[laatste.id] = Math.max(0, PROFIEL.up[laatste.id] - 1);
    PROFIEL.flessen += laatste.kost;
    bewaarProfiel();
    this.vernieuwAlles();
    Geluid.effect('draai');
    const k = this.kaarten.find(x => x.p.id === laatste.id);
    const f = this.add.rectangle(k.x, k.y, k.w, k.h, 0xa9c4ee, 0.5).setOrigin(0);
    this.lijst.add(f);
    this.tweens.add({ targets: f, alpha: 0, duration: 300, onComplete: () => f.destroy() });
  }

  terug() {
    if (this.weg || this.scene.isPaused()) return;
    this.weg = true;
    this.scene.start('Winkel', Object.assign({}, this.terugData, { keuzeGedaan: true, gekocht: this.gekocht }));
  }

  spelen() {
    if (this.weg || this.scene.isPaused()) return;
    this.weg = true;
    this.scene.start('Spel', { run: nieuweRun(false) });
  }
}

// ---------- LEVEL KIEZEN ----------
// Alle regio's als kaarten met een plaatje. ✔ = baas verslagen, 🔒 = nog dicht.
class LevelKeuze extends Phaser.Scene {
  constructor() { super('LevelKeuze'); }

  create(data) {
    this.terug = data.terug || 'Winkel';
    this.weg = false;
    this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.9).setOrigin(0).setInteractive();
    this.add.text(480, 18, 'Kies je level', {
      fontFamily: FONT_TITEL, fontSize: '38px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 7,
    }).setOrigin(0.5, 0);
    this.kaarten = REGIOS.map((r, n) => this.maakKaart(r, n, 22 + (n % 5) * 186, 82 + Math.floor(n / 5) * 186));
    knop(this, 380, 470, 200, 52, '✕ Sluiten', 0x3cc8bb, () => this.sluit(), 22);
    this.input.keyboard.on('keydown-ESC', () => this.sluit());
  }

  maakKaart(r, n, x, y) {
    const w = 172, h = 172, open = n <= PROFIEL.regio, verslagen = n < PROFIEL.regio, gekozen = n === Math.min(PROFIEL.startRegio, PROFIEL.regio);
    const c = this.add.container(x + w / 2, y + h / 2);
    const g = this.add.graphics();
    const teken = (licht) => {
      g.clear();
      g.fillStyle(0x0a1028, 0.4).fillRoundedRect(-w / 2 + 3, -h / 2 + 6, w, h, 14);
      g.fillStyle(licht ? 0x2c4387 : 0x16244f, 1).fillRoundedRect(-w / 2, -h / 2, w, h, 14);
      g.lineStyle(gekozen ? 5 : 2, gekozen ? 0xf2c14e : licht ? 0x3cc8bb : 0x2c4387, 1).strokeRoundedRect(-w / 2, -h / 2, w, h, 14);
    };
    teken(false);
    const plaatje = this.add.image(0, -32, 'mini_' + r.id).setScale(0.98).setAlpha(open ? 1 : 0.35);
    const rand = this.add.graphics().lineStyle(2, 0x0a1028, 1).strokeRect(-79, -76, 158, 89);
    const baas = this.add.image(54, -8, 'baas_' + r.baas).setScale(0.3).setAlpha(open ? 1 : 0.35);
    if (baas.displayHeight > 48) baas.setScale(baas.scale * 48 / baas.displayHeight);
    const naam = this.add.text(0, 30, levelNaam(n), { fontFamily: FONT_TITEL, fontSize: '20px', color: open ? '#f3ead6' : '#5a6a9a' }).setOrigin(0.5);
    const sub = this.add.text(0, 54, open ? r.baasNaam : 'Versla eerst ' + REGIOS[Math.max(0, n - 1)].baasNaam, {
      fontFamily: FONT, fontSize: '12px', color: open ? '#a9b6d8' : '#5a6a9a', align: 'center', wordWrap: { width: w - 16 },
    }).setOrigin(0.5, 0);
    c.add([g, plaatje, rand, baas, naam, sub]);
    if (verslagen) c.add(this.add.text(w / 2 - 6, -h / 2 + 2, '✔', { fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: '#5fd38a', stroke: '#0a1028', strokeThickness: 5 }).setOrigin(1, 0));
    if (!open) c.add(this.add.text(0, -32, '🔒', { fontFamily: FONT, fontSize: '36px' }).setOrigin(0.5));
    if (gekozen) this.tweens.add({ targets: c, scale: 1.04, yoyo: true, repeat: -1, duration: 600, ease: 'Sine.easeInOut' });
    const z = this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true })
      .on('pointerover', () => { teken(true); this.tweens.add({ targets: c, y: y + h / 2 - 5, duration: 100 }); })
      .on('pointerout', () => { teken(false); this.tweens.add({ targets: c, y: y + h / 2, scaleX: 1, scaleY: 1, duration: 120 }); })
      .on('pointerdown', () => { this.tweens.add({ targets: c, scaleX: 0.92, scaleY: 0.92, duration: 60 }); Geluid.effect('klik'); })
      .on('pointerup', () => this.kies(n, c));
    return { n, c, z, naam };
  }

  kies(n, c) {
    if (this.weg) return;
    if (n > PROFIEL.regio) {
      // nog dicht: schudden
      Geluid.effect('nee');
      this.tweens.add({ targets: c, x: c.x + 8, yoyo: true, repeat: 3, duration: 45, onComplete: () => c.setScale(1) });
      return;
    }
    this.weg = true;
    PROFIEL.startRegio = n;
    bewaarProfiel();
    Geluid.levelMelodie(n);
    this.tweens.add({ targets: c, scaleX: 1.15, scaleY: 1.15, duration: 160, yoyo: true, ease: 'Back.easeOut' });
    const f = this.add.rectangle(c.x, c.y, 172, 172, 0xf2c14e, 0.6);
    this.tweens.add({ targets: f, alpha: 0, scale: 1.3, duration: 400 });
    this.time.delayedCall(450, () => this.sluit());
  }

  sluit() {
    const s = this.scene.get(this.terug);
    this.scene.resume(this.terug);
    if (s && s.vernieuwAlles) s.vernieuwAlles();
    this.scene.stop();
  }
}
