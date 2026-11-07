// Het level. Twee soorten:
// - normaal: de regio loopt eindeloos door en wordt steeds moeilijker, het scherm schuift naar rechts
// - eindbaas: een arena met een vast scherm en een eindbaas die je moet verslaan

const LOOPSNELHEID = 240;
const SPRONG = -560;

// Hoe sterk is elke eindbaas, en welke aanvallen doet hij (om de beurt)
const BAZEN = {
  pad: { hp: 40, aanvallen: ['sprong', 'bubbels', 'sprong', 'bubbels', 'sprong'] },
  beer: { hp: 55, aanvallen: ['ren', 'pegels', 'blokjes', 'ren'] },
  geit: { hp: 70, aanvallen: ['ren', 'vaten', 'sprong', 'vaten'] },
  draak: { hp: 85, aanvallen: ['vuur', 'lava', 'duik', 'vuur'] },
};

class Spel extends Phaser.Scene {
  constructor() { super('Spel'); }

  create(data) {
    this.run = data.run;
    this.n = this.run.level;
    this.reg = regioVan(this.n);
    this.th = { id: this.reg.id };
    this.ronde = rondeVan(this.n);
    this.baasModus = !!this.run.baas;
    this.waarde = shotWaarde(this.n);
    // je gekozen upgrade voor dit potje (plus én min)
    this.mod = keuzeVan(this.run.keuze);
    this.maxH = hartenMet(this.run.keuze);
    this.shotRest = 0;
    // Phaser gebruikt dit level-object steeds opnieuw. Dingen van het vorige potje zijn al weg,
    // dus eerst leegmaken. Anders loopt het baasgevecht vast na een normaal potje (en andersom).
    this.baas = null; this.baasBalk = null; this.baasTekst = null;
    this.levelTekst = null; this.meterTekst = null;
    this.achtergrond = maakAchtergrond(this, this.reg.id);

    this.platforms = this.physics.add.staticGroup();
    this.pilaren = this.physics.add.staticGroup();
    this.vijanden = this.physics.add.group();
    this.pijlen = this.physics.add.group({ allowGravity: false });
    this.shotjes = this.physics.add.group();
    this.kebabs = this.physics.add.group({ allowGravity: false });
    this.kogels = this.physics.add.group();
    this.decor = this.add.group();

    // toestand
    this.tijd = 0;
    this.camX = 0;
    this.genX = 0; this.genY = 420;
    this.dood = false; this.gewonnen = false;
    this.startVertraging = 1.6;
    this.kijk = 1;
    this.coyote = 0; this.springBuffer = 0; this.springGeknipt = true;
    this.extraSprongen = 0; this.dashLading = 0; this.dashTijd = 0; this.dashCd = 0; this.dashSpoor = 0;
    this.smashing = false; this.zweeft = false;
    this.slashCd = 0; this.schietCd = 0; this.poseTimer = 0; this.poseVast = 'sp_stil';
    this.muurLock = 0; this.muurTijd = 0; this.muurKant = 1;
    this.onkwetsbaar = 0; this.knipper = 0; this.loopT = 0;

    this.speler = this.physics.add.sprite(150, 418, 'sp_stil').setOrigin(0.5, 1).setDepth(10);
    this.speler.body.setSize(20, 40).setOffset(18, 47);
    this.speler.body.setMaxVelocity(900, 1000);
    // zwaartekracht anders? (de wereld trekt al met 1500)
    if (this.mod.zwaarte !== 1) this.speler.body.setGravityY(1500 * (this.mod.zwaarte - 1));

    if (this.baasModus) this.maakArena();
    else {
      const start = this.maakPlatform(-40, 420, 560);
      this.genX = start.x + start.displayWidth;
      this.genereer(1500);
      if (this.run.kebab) this.maakKebab(320, 380); // test: #kebab
    }

    // wie botst met wie
    this.physics.add.collider(this.speler, this.platforms);
    this.physics.add.collider(this.speler, this.pilaren);
    this.physics.add.collider(this.vijanden, this.platforms, null, v => v.loopt || (v.soort === 'baas' && !v.vliegt));
    this.physics.add.collider(this.vijanden, this.pilaren, null, v => v.soort === 'baas' && !v.vliegt);
    this.physics.add.collider(this.shotjes, this.platforms);
    this.physics.add.collider(this.shotjes, this.pilaren);
    this.physics.add.overlap(this.speler, this.vijanden, (sp, v) => this.spelerRaakt(v));
    this.physics.add.overlap(this.speler, this.shotjes, (sp, s) => this.pakShotje(s));
    this.physics.add.overlap(this.speler, this.kebabs, (sp, k) => this.eetKebab(k));
    this.physics.add.overlap(this.speler, this.kogels, (sp, k) => this.kogelRaakt(k));
    this.physics.add.overlap(this.pijlen, this.vijanden, (p, v) => this.pijlRaakt(p, v));
    this.physics.add.overlap(this.pijlen, this.pilaren, p => this.pijlStop(p));

    this.vonken = this.add.particles(0, 0, 'vonk', {
      speed: { min: 80, max: 260 }, lifespan: 450, scale: { start: 1.2, end: 0 },
      tint: [0xf2c14e, 0xffffff, 0x3cc8bb], emitting: false,
    }).setDepth(12);

    this.besturing = new Besturing(this);
    this.maakHud();

    Geluid.muziekAan();
    // liedje kiezen: Bierpolka voor Rivier en IJsvlakte, Bergmars voor Bergen en Vulkaan, Baaslied bij een eindbaas
    const lied = this.baasModus ? 'baas' : (this.reg.id === 'rivier' || this.reg.id === 'ijs' ? 'polka' : 'mars');
    Geluid.speelLied(lied, Math.min(30, rondeVan(this.n) * 10));

    const titel = this.baasModus ? this.reg.baasNaam : levelNaam(this.n);
    const onder = this.baasModus ? 'Versla hem om verder te mogen!' : (this.waarde > 1 ? `Shotjes zijn hier ${this.waarde}× waard!` : 'Hoe ver kom jij?');
    const t1 = this.add.text(480, 200, titel, {
      fontFamily: FONT_TITEL, fontSize: '54px', color: this.baasModus ? '#d1495b' : '#f2c14e', stroke: '#0a1028', strokeThickness: 8,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(150);
    const t2 = this.add.text(480, 252, onder, {
      fontFamily: FONT, fontSize: '24px', fontStyle: 'bold', color: '#3cc8bb', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(150);
    this.tweens.add({ targets: [t1, t2], alpha: 0, delay: 1600, duration: 600, onComplete: () => { t1.destroy(); t2.destroy(); } });
  }

  // Moeilijkheid: hoger in latere regio's en hoe verder je komt
  moeilijkheid(x) { return this.n + x / 7000; }

  // ---------- LEVEL MAKEN ----------
  maakPlatform(x, y, w, massief) {
    w = Math.max(60, Math.round(w / 10) * 10);
    const p = this.platforms.create(x, y, platTex(this, this.th.id, w)).setOrigin(0, 0).refreshBody().setDepth(5);
    if (!massief) {
      // je kunt er van onderen doorheen springen
      p.body.checkCollision.down = false;
      p.body.checkCollision.left = false;
      p.body.checkCollision.right = false;
    }
    return p;
  }

  maakPilaar(x, topY) {
    const h = Math.round((600 - topY) / 10) * 10;
    return this.pilaren.create(x, topY, pilaarTex(this, this.th.id, h)).setOrigin(0, 0).refreshBody().setDepth(5);
  }

  maakKruiper(x, y, minX, maxX) {
    const L = this.moeilijkheid(x);
    const v = this.vijanden.create(x, y - 2, 'kruiper_' + this.th.id).setOrigin(0.5, 1).setDepth(9);
    v.body.setSize(44, 26).setOffset(13, 22);
    v.soort = 'kruiper'; v.loopt = true;
    v.hp = 2 + Math.floor(L * 0.8);
    v.minX = minX + 24; v.maxX = maxX - 24;
    v.richting = Math.random() < 0.5 ? -1 : 1;
    v.snelheid = 45 + Math.random() * 30 + Math.min(60, L * 10);
    v.verdoofd = 0; v.shots = 2;
  }

  maakDwaallicht(x, y) {
    const L = this.moeilijkheid(x);
    const v = this.vijanden.create(x, y, 'licht_' + this.th.id).setOrigin(0.5).setDepth(9);
    v.body.setAllowGravity(false);
    v.body.setSize(30, 40).setOffset(15, 12);
    v.soort = 'licht';
    v.hp = 1 + Math.floor(L * 0.6);
    v.basisY = y; v.fase = Math.random() * 6; v.shots = 3;
    v.jaagSnelheid = 48 + Math.min(50, L * 8);
  }

  // ---------- MONSTERS PER REGIO ----------
  // Rivier: kruiper + dwaallicht. IJsvlakte: ijsklontje + pinguïn-ober.
  // Bergen: rollend fust + hopvleermuis. Vulkaan: lavalager + brouwketel-golem.
  maakGrondVijand(x, y, w) {
    const id = this.reg.id, r = Math.random();
    if (id === 'ijs') {
      if (r < 0.5) this.maakKlont(x + w / 2, y, x, x + w, false);
      else this.maakPinguin(x + w / 2, y, x, x + w);
    } else if (id === 'berg') {
      this.maakFust(x + w - 30, y);
    } else if (id === 'vulkaan') {
      if (w >= 200 && r < 0.4) this.maakGolem(x + w / 2, y, x, x + w);
      else this.maakLava(x + w / 2, y, x, x + w);
    } else {
      this.maakKruiper(x + w / 2, y, x, x + w);
    }
  }

  maakLuchtVijand(x, y, w) {
    if (this.reg.id === 'berg') {
      // de hopvleermuis hangt ondersteboven onder een platform
      if (y <= 400) this.maakVleermuis(x + w / 2, y + 48);
    } else {
      this.maakDwaallicht(x + w / 2, Phaser.Math.Between(110, Math.max(130, y - 110)));
    }
  }

  // een monster dat over een platform loopt
  maakLoper(key, soort, x, y, minX, maxX, bw, bh) {
    const v = this.vijanden.create(x, y - 2, key).setOrigin(0.5, 1).setDepth(9);
    v.body.setSize(bw, bh).setOffset((v.width - bw) / 2, v.height - bh);
    v.soort = soort; v.loopt = true;
    v.minX = minX + 24; v.maxX = maxX - 24;
    v.richting = Math.random() < 0.5 ? -1 : 1;
    v.verdoofd = 0;
    return v;
  }

  maakKlont(x, y, minX, maxX, klein) {
    const L = this.moeilijkheid(x);
    const v = klein
      ? this.maakLoper('ijsklont_klein', 'klontje', x, y, minX, maxX, 20, 18)
      : this.maakLoper('ijsklont', 'klont', x, y, minX, maxX, 38, 34);
    v.hp = klein ? 1 : 2 + Math.floor(L * 0.6);
    v.snelheid = (klein ? 110 : 80) + Math.random() * 30 + Math.min(60, L * 10);
    v.shots = klein ? 1 : 2;
    return v;
  }

  maakPinguin(x, y, minX, maxX) {
    const L = this.moeilijkheid(x);
    const v = this.maakLoper('pinguin', 'pinguin', x, y, minX, maxX, 28, 46);
    v.hp = 2 + Math.floor(L * 0.7);
    v.snelheid = 40 + Math.min(40, L * 6);
    v.gooiT = 1 + Math.random(); v.stilT = 0; v.shots = 3;
  }

  maakFust(x, y) {
    const L = this.moeilijkheid(x);
    const v = this.maakLoper('fust', 'fust', x, y, -1e9, 1e9, 36, 36);
    v.hp = 2 + Math.floor(L * 0.5);
    v.snelheid = 150 + Math.min(90, L * 15);
    v.rolt = false; v.shots = 2;
  }

  maakLava(x, y, minX, maxX) {
    const L = this.moeilijkheid(x);
    const v = this.maakLoper('lavalager', 'lava', x, y, minX, maxX, 26, 34);
    v.hp = 1 + Math.floor(L * 0.4);
    v.snelheid = 45 + Math.min(40, L * 6);
    v.lont = 0; v.shots = 3;
  }

  maakGolem(x, y, minX, maxX) {
    const L = this.moeilijkheid(x);
    const v = this.maakLoper('golem', 'golem', x, y, minX, maxX, 60, 66);
    v.hp = 6 + Math.floor(L * 1.5);
    v.snelheid = 32;
    v.stampT = 1.5 + Math.random(); v.stampt = false; v.shots = 7;
  }

  maakVleermuis(x, y) {
    const L = this.moeilijkheid(x);
    const v = this.vijanden.create(x, y, 'vleermuis').setOrigin(0.5).setDepth(9).setFlipY(true);
    v.body.setAllowGravity(false);
    v.body.setSize(36, 26);
    v.soort = 'vleermuis'; v.modus = 'hang';
    v.hp = 1 + Math.floor(L * 0.5);
    v.basisY = y; v.fase = Math.random() * 6; v.shots = 3;
    v.jaagSnelheid = 55 + Math.min(50, L * 8);
  }

  maakGoud(x, y, minX, maxX) {
    const v = this.maakLoper('goudfles', 'goud', x, y, minX, maxX, 22, 40);
    v.hp = 1; v.snelheid = 40; v.shots = 0;
  }

  // het gouden flesje gevangen: een heel flesje erbij!
  vangGoud(v) {
    if (!v.active) return;
    this.vonken.explode(24, v.x, v.y - 25);
    v.destroy();
    PROFIEL.flessen++;
    bewaarProfiel();
    this.popTekst('Gouden flesje! +1 flesje');
    Geluid.effect('flesVol');
    this.tweens.add({ targets: [this.flesGlas, this.flesBier, this.flesRand], scale: 1.25, yoyo: true, duration: 150 });
  }

  // het lavalager ontploft
  ontplof(v) {
    if (!v.active) return;
    const x = v.x, y = v.y - 22;
    v.destroy();
    this.vonken.explode(30, x, y);
    const ring = this.add.circle(x, y, 20, 0xff6a2c, 0.6).setDepth(11);
    this.tweens.add({ targets: ring, scale: 4.5, alpha: 0, duration: 350, onComplete: () => ring.destroy() });
    this.cameras.main.shake(150, 0.008);
    Geluid.effect('boem');
    const sp = this.speler;
    if (Phaser.Math.Distance.Between(x, y, sp.x, sp.y - 20) < 95 && this.onkwetsbaar <= 0 && !this.dood) {
      this.schade(Math.sign(sp.x - x) || -this.kijk);
    }
  }

  rijShotjes(cx, y, n) {
    for (let i = 0; i < n; i++) {
      const s = this.shotjes.create(cx + (i - (n - 1) / 2) * 26, y, 'shotje').setDepth(8);
      s.body.setAllowGravity(false);
      s.body.setSize(14, 18);
      s.zweeft = true; s.basisY = y; s.fase = i * 0.7;
    }
  }

  genereer(tot) {
    while (this.genX < tot) {
      const L = this.moeilijkheid(this.genX);
      const m = Math.min(1, 0.15 * this.n + this.genX / 9000);
      const kansMuur = L >= 0.5 ? Math.min(0.28, 0.06 + 0.06 * L) : 0;
      const kansGat = L >= 1.2 ? Math.min(0.22, 0.05 + 0.05 * (L - 1)) : 0;
      const r = Math.random();
      if (this.genX < 900) this.segPlatform(m, L);
      else if (r < kansMuur) this.segMuur(L);
      else if (r < kansMuur + kansGat) this.segGrootGat();
      else if (r < kansMuur + kansGat + 0.14) this.segPilaar(m);
      else this.segPlatform(m, L);
    }
  }

  gatVoor(y, m) {
    const omhoog = this.genY - y;
    const max = omhoog > 30 ? 105 : 150;
    return Phaser.Math.Between(55, Math.round(70 + (max - 70) * (0.4 + 0.6 * m)));
  }

  segPlatform(m, L) {
    const y = Phaser.Math.Clamp(this.genY + Phaser.Math.Between(-80, 90), 230, 440);
    const x = this.genX + this.gatVoor(y, m);
    const p = this.maakPlatform(x, y, Phaser.Math.Between(140, 300 - Math.round(80 * m)));
    const w = p.displayWidth;
    const vijandKans = Math.min(0.85, 0.3 + 0.12 * L);
    if (w >= 170 && Math.random() < vijandKans) this.maakGrondVijand(x, y, w);
    if (Math.random() < Math.min(0.7, 0.2 + 0.1 * L)) this.maakLuchtVijand(x, y, w);
    // heel soms: een gouden flesje met pootjes
    if (w >= 150 && this.genX > 1200 && Math.random() < 0.035) this.maakGoud(x + w * 0.3, y, x, x + w);
    // af en toe een kebabrol
    if (this.genX > 1200 && Math.random() < 0.07) this.maakKebab(x + w * 0.75, y - 40);
    if (Math.random() < 0.3) this.rijShotjes(x + w / 2, y - 34, Phaser.Math.Between(2, 4));
    else if (Math.random() < 0.25 && y > 330) {
      // hoog bonusplatform: alleen te halen met dubbele sprong
      this.maakPlatform(x + w / 2 - 45, y - 175, 90);
      this.rijShotjes(x + w / 2, y - 205, 4);
    }
    this.genX = x + w; this.genY = y;
  }

  segPilaar(m) {
    // een zuil uit het water: bovenop kun je staan, aan de zijkant kun je wall jumpen
    const y = Phaser.Math.Clamp(this.genY + Phaser.Math.Between(-60, 40), 260, 430);
    const x = this.genX + this.gatVoor(y, m);
    this.maakPilaar(x, y);
    this.rijShotjes(x + 24, y - 30, 1);
    if (Math.random() < 0.5) {
      this.maakPlatform(x - 21, y - 175, 90);
      this.rijShotjes(x + 24, y - 205, 3);
    }
    this.genX = x + 48; this.genY = y;
  }

  bordje(x, y, tekst) {
    this.decor.add(this.add.text(x, y, tekst, {
      fontFamily: FONT, fontSize: '15px', fontStyle: 'bold', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 4,
      align: 'center', backgroundColor: 'rgba(10,16,40,.6)', padding: { x: 6, y: 3 },
    }).setOrigin(0.5, 1).setDepth(6));
  }

  segMuur(L) {
    // een hoge muur: klimmen met wall jump, of eroverheen met dubbele sprong
    const hoog = L >= 2.5 && Math.random() < 0.5;
    const hoogte = hoog ? Phaser.Math.Between(200, 250) : Phaser.Math.Between(140, 175);
    const aanloopY = Phaser.Math.Clamp(Math.max(this.genY, hoogte + 140), 230, 440);
    const ax = this.genX + Phaser.Math.Between(55, 100);
    const aanloop = this.maakPlatform(ax, aanloopY, 180);
    const mx = ax + aanloop.displayWidth + 20;
    const top = aanloopY - hoogte;
    this.maakPilaar(mx, top);
    this.rijShotjes(mx + 24, top - 30, 2);
    const up = this.run.up;
    if (!up.muur && (hoog || !up.dubbel)) this.bordje(ax + 90, aanloopY - 50, hoog ? '↑ Wall jump nodig' : '↑ Wall jump of\ndubbele sprong');
    this.genX = mx + 48; this.genY = top;
  }

  segGrootGat() {
    // een groot gat: alleen te halen met dash of dubbele sprong
    const y = Phaser.Math.Clamp(this.genY + Phaser.Math.Between(-20, 30), 260, 440);
    const ax = this.genX + Phaser.Math.Between(55, 90);
    const aanloop = this.maakPlatform(ax, y, 170);
    const x = ax + aanloop.displayWidth + Phaser.Math.Between(220, 265);
    const p = this.maakPlatform(x, y + Phaser.Math.Between(-10, 20), 200);
    this.rijShotjes(x - 120, y - 70, 3);
    const up = this.run.up;
    if (!up.dash && !up.dubbel) this.bordje(ax + 85, y - 50, '→ Dash of\ndubbele sprong');
    this.genX = x + p.displayWidth; this.genY = p.y;
  }

  opruimen() {
    const grens = this.camX - 250;
    for (const grp of [this.platforms, this.pilaren]) {
      grp.getChildren().slice().forEach(o => { if (o.x + o.displayWidth < grens) o.destroy(); });
    }
    for (const grp of [this.vijanden, this.shotjes, this.kebabs]) {
      grp.getChildren().slice().forEach(o => { if (o.x < grens || o.y > 640) o.destroy(); });
    }
    this.decor.getChildren().slice().forEach(o => { if (o.x < grens) o.destroy(); });
  }

  // ---------- EINDBAAS-ARENA ----------
  maakArena() {
    // de vloer van de arena ligt vóór het water
    this.maakPlatform(0, 470, 960, true).setDepth(8);
    this.maakPilaar(-36, 0);
    this.maakPilaar(948, 0);
    this.maakPlatform(130, 340, 190);
    this.maakPlatform(640, 340, 190);
    this.maakPlatform(385, 225, 190);
    this.speler.setPosition(150, 468);

    const soort = this.reg.baas, info = BAZEN[soort];
    const vliegt = soort === 'draak';
    const b = this.vijanden.create(vliegt ? 720 : 760, vliegt ? 150 : 468, 'baas_' + soort).setDepth(9);
    b.setOrigin(0.5, vliegt ? 0.5 : 1);
    const w = b.width, h = b.height;
    b.body.setSize(w * 0.62, h * 0.66).setOffset(w * 0.19, h * (vliegt ? 0.2 : 0.32));
    b.soort = 'baas'; b.baas = soort; b.vliegt = vliegt;
    b.hp = b.maxHp = Math.round(info.hp * (1 + this.ronde * 0.6));
    b.aanvallen = info.aanvallen; b.beurt = 0;
    b.status = 'wacht'; b.timer = 2.2; b.t = 0; b.shots = 0;
    if (vliegt) { b.body.setAllowGravity(false); b.body.setImmovable(true); }
    this.baas = b;

    const vast = o => o.setScrollFactor(0).setDepth(100);
    this.baasBalk = vast(this.add.graphics());
    this.baasTekst = vast(this.add.text(480, 34, this.reg.baasNaam, {
      fontFamily: FONT_TITEL, fontSize: '20px', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(0.5, 0));
  }

  kogel(key, x, y, vx, vy, zwaarte) {
    const k = this.kogels.create(x, y, key).setDepth(11);
    k.body.setAllowGravity(!!zwaarte);
    if (zwaarte) k.body.setGravityY(zwaarte - 1500);
    k.setVelocity(vx, vy);
    k.body.setSize(k.width * 0.7, k.height * 0.7);
    k.leeft = 6;
    return k;
  }

  waarschuwing(x, wachten, fn) {
    const s = this.add.image(x, 470, 'schaduw').setDepth(6);
    this.tweens.add({ targets: s, alpha: 0.3, yoyo: true, repeat: 3, duration: wachten * 125 });
    this.time.delayedCall(wachten * 1000, () => { s.destroy(); if (!this.dood && !this.gewonnen) fn(); });
  }

  baasUpdate(dt) {
    const b = this.baas;
    if (!b || !b.active) return;
    const sp = this.speler;
    const woede = 1 + this.ronde * 0.25 + (1 - b.hp / b.maxHp) * 0.5;
    const naar = Math.sign(sp.x - b.x) || -1;
    b.t += dt;
    b.timer -= dt * woede;

    if (b.vliegt) {
      if (b.status !== 'duik') {
        b.x = 480 + Math.sin(b.t * 0.6) * 300;
        b.y = 140 + Math.sin(b.t * 1.4) * 40;
      }
      b.setFlipX(naar > 0);
    } else if (b.status === 'wacht') {
      b.setFlipX(naar > 0);
      b.body.velocity.x *= 0.85;
    }

    const opGrond = b.body && (b.body.blocked.down || b.body.touching.down);
    if (b.status === 'springt' && b.t > 0.25 && opGrond) {
      this.schokgolf(b.x);
      b.status = 'wacht'; b.timer = 1.1;
    }
    if (b.status === 'rent') {
      if (b.body.blocked.left || b.body.blocked.right || b.t > 2.4) {
        this.cameras.main.shake(160, 0.008);
        Geluid.effect('smash');
        b.status = 'wacht'; b.timer = 1.0; b.body.setVelocityX(0);
      }
    }
    if (b.status !== 'wacht' || b.timer > 0) return;

    const aanval = b.aanvallen[b.beurt % b.aanvallen.length];
    b.beurt++;
    b.t = 0;
    b.status = 'bezig';
    const klaar = (s) => this.time.delayedCall(s * 1000, () => { if (b.active && b.status === 'bezig') { b.status = 'wacht'; b.timer = 0.9; } });

    if (aanval === 'sprong') {
      b.status = 'springt';
      b.setFlipX(naar > 0);
      b.body.setVelocity(Phaser.Math.Clamp((sp.x - b.x) * 1.1, -420, 420), -720);
      Geluid.effect('spring');
    } else if (aanval === 'ren') {
      b.status = 'rent';
      b.setFlipX(naar > 0);
      b.body.setVelocityX(naar * 430 * Math.min(1.5, woede));
      Geluid.effect('dash');
    } else if (aanval === 'bubbels') {
      for (let i = 0; i < 4; i++) this.time.delayedCall(i * 260, () => {
        if (!b.active) return;
        const vx = Phaser.Math.Clamp((sp.x - b.x) * 0.9, -380, 380) + Phaser.Math.Between(-60, 60);
        this.kogel('bubbel', b.x - b.flipX * 0 + naar * 40, b.y - 90, vx, -480, 900);
        Geluid.effect('schiet');
      });
      klaar(1.4);
    } else if (aanval === 'pegels') {
      for (let i = 0; i < 6; i++) {
        const x = i === 0 ? sp.x : Phaser.Math.Between(40, 920);
        this.time.delayedCall(i * 150, () => this.waarschuwing(x, 0.7, () => this.kogel('ijspegel', x, -30, 0, 200, 1500)));
      }
      klaar(2.0);
    } else if (aanval === 'blokjes') {
      for (let i = 0; i < 5; i++) {
        const hoek = -0.9 + i * 0.22;
        this.kogel('ijsblok', b.x + naar * 50, b.y - 80, naar * Math.cos(hoek) * 420, Math.sin(hoek) * 420 - 150, 900);
      }
      Geluid.effect('schiet');
      klaar(1.3);
    } else if (aanval === 'vaten') {
      for (let i = 0; i < 3; i++) this.time.delayedCall(i * 650, () => {
        if (!b.active) return;
        const v = this.kogel('vat', b.x + naar * 50, 448, naar * 300, 0, 0);
        v.rolt = true;
        Geluid.effect('raak');
      });
      klaar(2.2);
    } else if (aanval === 'vuur') {
      for (let i = 0; i < 6; i++) {
        const hoek = Math.atan2(sp.y - 30 - b.y, sp.x - b.x) + (i - 2.5) * 0.15;
        this.time.delayedCall(i * 90, () => {
          if (!b.active) return;
          this.kogel('vuurbal', b.x + naar * 70, b.y - 10, Math.cos(hoek) * 330, Math.sin(hoek) * 330, 0);
          Geluid.effect('schiet');
        });
      }
      klaar(1.6);
    } else if (aanval === 'lava') {
      for (let i = 0; i < 7; i++) {
        const x = i === 0 ? sp.x : Phaser.Math.Between(40, 920);
        this.time.delayedCall(i * 130, () => this.waarschuwing(x, 0.7, () => this.kogel('vuurbal', x, -30, 0, 220, 1300)));
      }
      klaar(2.0);
    } else if (aanval === 'duik') {
      b.status = 'duik';
      const doelX = sp.x;
      Geluid.effect('dash');
      this.tweens.add({
        targets: b, x: doelX, y: 400, duration: 600, ease: 'Quad.easeIn', yoyo: true, hold: 250,
        onComplete: () => { if (b.active) { b.status = 'wacht'; b.timer = 1.0; b.t = Math.asin(Phaser.Math.Clamp((b.x - 480) / 300, -1, 1)) / 0.6; } },
      });
    }
  }

  schokgolf(x) {
    this.cameras.main.shake(180, 0.012);
    Geluid.effect('smash');
    this.vonken.explode(16, x, 468);
    for (const r of [-1, 1]) {
      const g = this.kogel('golf', x + r * 40, 456, r * 360, 0, 0);
      g.setFlipX(r < 0); g.leeft = 2.6; g.golf = true;
    }
  }

  kogelsUpdate(dt) {
    this.kogels.getChildren().slice().forEach(k => {
      k.leeft -= dt;
      if (k.rolt) k.rotation += k.body.velocity.x * dt / 20;
      const opGrond = this.baasModus && k.y > 456 && !k.golf && !k.rolt;
      const links = this.baasModus ? -60 : this.camX - 150, rechts = this.baasModus ? 1020 : this.camX + 1150;
      if (k.leeft <= 0 || k.x < links || k.x > rechts || k.y > 620 || opGrond) {
        if (opGrond) this.vonken.explode(6, k.x, 466);
        k.destroy();
      }
    });
  }

  kogelRaakt(k) {
    if (!k.active || this.onkwetsbaar > 0 || this.dood || this.gewonnen) return;
    if (!k.golf && !k.rolt) k.destroy();
    this.schade(Math.sign(this.speler.x - k.x) || -this.kijk);
  }

  baasVerslagen(b) {
    this.gewonnen = true;
    Geluid.effect('baasWeg');
    this.cameras.main.shake(500, 0.015);
    for (let i = 0; i < 6; i++) this.time.delayedCall(i * 120, () => this.vonken.explode(20, b.x + Phaser.Math.Between(-60, 60), b.y - Phaser.Math.Between(20, 100)));
    this.kogels.getChildren().slice().forEach(k => k.destroy());
    this.dropShotjes(b.x, b.y - 60, 20);
    b.destroy();
    PROFIEL.regio = Math.max(PROFIEL.regio, this.n + 1);
    PROFIEL.startRegio = this.n + 1;
    PROFIEL.ticket = false;
    bewaarProfiel();
    const t = this.add.text(480, 200, `Gewonnen!\nOp naar ${levelNaam(this.n + 1)}!`, {
      fontFamily: FONT_TITEL, fontSize: '48px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 8, align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(150);
    this.time.delayedCall(4000, () => {
      Geluid.effect('regio');
      // je upgrade blijft, want het is nog hetzelfde potje
      this.scene.start('Spel', { run: { level: this.n + 1, up: PROFIEL.up, harten: hartenMet(this.run.keuze), baas: false, keuze: this.run.keuze } });
    });
  }

  // ---------- ELK MOMENT ----------
  update(time, delta) {
    const dt = Math.min(delta, 50) / 1000;
    this.tijd += dt;
    const inp = this.besturing.update(this.run.up.dash > 0);
    if (this.dood) { this.achtergrond.update(this.camX, this.tijd); return; }

    if (!this.baasModus) {
      const snelheid = Math.min(125, 48 + this.n * 8 + this.speler.x / 400);
      if (this.startVertraging > 0) this.startVertraging -= dt;
      else this.camX += snelheid * dt;
      this.camX = Math.max(this.camX, this.speler.x - 960 * 0.55);
      this.cameras.main.scrollX = this.camX;
      this.genereer(this.camX + 960 + 400);
      this.opruimen();
    }
    this.pijlenUpdate(dt);
    this.spelerUpdate(dt, inp);
    this.vijandenUpdate(dt);
    if (this.baasModus) this.baasUpdate(dt);
    this.kogelsUpdate(dt);
    this.shotjesUpdate();
    this.updateHud();
    this.achtergrond.update(this.camX, this.tijd);
  }

  pijlenUpdate(dt) {
    this.pijlen.getChildren().slice().forEach(p => {
      p.leeft -= dt;
      if (p.leeft <= 0 || p.x < this.camX - 100 || p.x > this.camX + 1100) p.destroy();
    });
  }

  spelerUpdate(dt, inp) {
    const sp = this.speler, b = sp.body, up = this.run.up;
    const opGrond = b.blocked.down || b.touching.down;
    this.slashCd -= dt; this.schietCd -= dt; this.dashCd -= dt; this.poseTimer -= dt; this.muurLock -= dt;
    if (this.onkwetsbaar > 0) this.onkwetsbaar -= dt;
    if (this.knipper > 0) this.knipper -= dt;

    if (opGrond) {
      this.coyote = 0.1;
      this.extraSprongen = up.dubbel;
      this.dashLading = [0, 1, 1, 2, 2, 3][up.dash];
      if (this.smashing) this.smashLanding();
    } else {
      this.coyote -= dt;
    }
    this.springBuffer = inp.springNet ? 0.13 : this.springBuffer - dt;

    const muurL = b.blocked.left, muurR = b.blocked.right;
    const aanMuur = up.muur > 0 && !opGrond && (muurL || muurR) && this.dashTijd <= 0;
    // even onthouden dat je net aan een muur hing, dan mag je nog springen
    if (aanMuur) { this.muurTijd = 0.12; this.muurKant = muurL ? -1 : 1; } else this.muurTijd -= dt;
    const muurKant = this.muurKant;
    this.zweeft = false;

    if (this.dashTijd > 0) {
      this.dashTijd -= dt;
      this.dashSpoor -= dt;
      if (this.dashSpoor <= 0) { this.spook(0x3cc8bb); this.dashSpoor = 0.03; }
      if (this.dashTijd <= 0) { b.setAllowGravity(true); b.velocity.x *= 0.45; b.velocity.y *= 0.35; }
    } else if (this.smashing) {
      b.setVelocity(0, 950);
      this.dashSpoor -= dt;
      if (this.dashSpoor <= 0) { this.spook(0xf2c14e); this.dashSpoor = 0.04; }
    } else {
      // lopen (op ijs glij je een beetje)
      if (this.muurLock <= 0) {
        const grip = opGrond ? (this.th.id === 'ijs' ? 0.1 : 0.4) : 0.18;
        b.velocity.x = Phaser.Math.Linear(b.velocity.x, inp.x * LOOPSNELHEID * this.mod.loop, grip);
        if (Math.abs(inp.x) > 0.2) this.kijk = Math.sign(inp.x);
      }
      // springen
      if (this.springBuffer > 0) {
        if (this.coyote > 0) {
          this.spring(SPRONG * this.mod.sprong);
          Geluid.effect('spring');
        } else if (this.muurTijd > 0 && !opGrond) {
          this.spring(-540 * this.mod.sprong);
          this.muurTijd = 0;
          if (Math.sign(inp.x) === muurKant) {
            // je duwt tegen de muur: spring vooral omhoog, zo klim je
            b.velocity.x = -muurKant * 130;
            this.muurLock = 0.09;
          } else {
            // geen richting of van de muur af: spring weg van de muur
            b.velocity.x = -muurKant * 320;
            this.muurLock = 0.18;
            this.kijk = -muurKant;
          }
          this.vonken.explode(6, sp.x + muurKant * 10, sp.y - 20);
          Geluid.effect('muur');
        } else if (this.extraSprongen > 0) {
          this.extraSprongen--;
          this.spring(-500 * this.mod.sprong);
          this.vonken.explode(8, sp.x, sp.y);
          Geluid.effect('dubbel');
        }
      }
      // kort tikken = lage sprong, lang vasthouden = hoge sprong (zoals Mario)
      if (!inp.spring && b.velocity.y < -120 && !this.springGeknipt) { b.velocity.y *= 0.45; this.springGeknipt = true; }
      if (aanMuur && b.velocity.y > 0) b.velocity.y = Math.min(b.velocity.y, up.muur >= 2 ? 60 : 130);
      if (up.zweef > 0 && inp.spring && !opGrond && b.velocity.y > 0 && !aanMuur) {
        b.velocity.y = Math.min(b.velocity.y, [0, 130, 90, 60][up.zweef]);
        this.zweeft = true;
      }
      if (inp.dashNet && up.dash > 0 && this.dashLading > 0 && this.dashCd <= 0) this.startDash(inp);
      else if (inp.omlaagNet && up.smash > 0 && !opGrond) { this.smashing = true; this.dashSpoor = 0; }
    }

    if (inp.slashNet && this.slashCd <= 0) this.doeSlash();
    if (inp.schietNet && this.schietCd <= 0) this.schiet();

    if (!this.baasModus) {
      // de linkerkant van het scherm duwt je vooruit
      if (sp.x < this.camX + 14) {
        if (muurR) { this.valSchade(); return; }
        sp.x = this.camX + 14;
        if (b.velocity.x < 0) b.velocity.x = 0;
      }
      if (sp.y > 600) { this.valSchade(); return; }
    }

    const key = this.kiesPose(opGrond, aanMuur, dt);
    if (sp.texture.key !== key) sp.setTexture(key);
    sp.setFlipX(this.kijk < 0);
    sp.setAlpha(this.knipper > 0 && Math.floor(this.knipper * 16) % 2 ? 0.35 : 1);
  }

  kiesPose(opGrond, aanMuur, dt) {
    const b = this.speler.body;
    if (this.poseTimer > 0) return this.poseVast;
    if (this.dashTijd > 0) return 'sp_dash';
    if (this.smashing) return 'sp_smash';
    if (aanMuur) return 'sp_muur';
    if (!opGrond) {
      if (this.zweeft) return 'sp_zweef';
      return b.velocity.y < 0 ? 'sp_spring' : 'sp_val';
    }
    if (Math.abs(b.velocity.x) > 20) {
      this.loopT += dt * Math.abs(b.velocity.x) / 28;
      return 'sp_loop' + (Math.floor(this.loopT) % 4);
    }
    return 'sp_stil';
  }

  spring(v) {
    this.speler.body.velocity.y = v;
    this.coyote = 0; this.springBuffer = 0; this.springGeknipt = false;
  }

  spook(kleur) {
    const sp = this.speler;
    const s = this.add.image(sp.x, sp.y, sp.texture.key).setOrigin(0.5, 1).setFlipX(sp.flipX).setDepth(9).setTintFill(kleur).setAlpha(0.5);
    this.tweens.add({ targets: s, alpha: 0, duration: 220, onComplete: () => s.destroy() });
  }

  startDash(inp) {
    const b = this.speler.body, lvl = this.run.up.dash;
    let dx = Math.abs(inp.x) > 0.35 ? Math.sign(inp.x) : 0;
    let dy = Math.abs(inp.y) > 0.35 ? Math.sign(inp.y) : 0;
    if (!dx && !dy) dx = this.kijk;
    const len = Math.hypot(dx, dy), v = 600 + 45 * (lvl - 1);
    b.setAllowGravity(false);
    b.setVelocity(dx / len * v, dy / len * v);
    this.dashTijd = 0.15 + 0.015 * (lvl - 1);
    this.dashLading--; this.dashCd = 0.22; this.dashSpoor = 0;
    this.onkwetsbaar = Math.max(this.onkwetsbaar, this.dashTijd + 0.08);
    if (dx) this.kijk = dx;
    this.smashing = false;
    Geluid.effect('dash');
  }

  // ---------- AANVALLEN ----------
  doeSlash() {
    const sp = this.speler, lvl = this.run.up.slash;
    const bereik = 58 + 12 * lvl, schade = 1 + lvl;
    this.slashCd = 0.3; this.poseTimer = 0.16; this.poseVast = 'sp_slash';
    Geluid.effect('slash');
    const fx = this.add.image(sp.x + this.kijk * 6, sp.y - 30, 'slash')
      .setDepth(12).setOrigin(this.kijk > 0 ? 0.2 : 0.8, 0.5).setFlipX(this.kijk < 0).setScale(bereik / 50);
    this.tweens.add({ targets: fx, alpha: 0, scale: fx.scale * 1.15, duration: 170, onComplete: () => fx.destroy() });
    const rect = new Phaser.Geom.Rectangle(this.kijk > 0 ? sp.x - 6 : sp.x - bereik + 6, sp.y - 64, bereik, 70);
    this.vijanden.getChildren().slice().forEach(v => {
      if (v.active && Phaser.Geom.Intersects.RectangleToRectangle(rect, v.getBounds())) this.raakVijand(v, schade, this.kijk);
    });
    // met je slash kun je bubbels, ijsblokjes en vuurballen kapotslaan
    this.kogels.getChildren().slice().forEach(k => {
      if (!k.golf && Phaser.Geom.Intersects.RectangleToRectangle(rect, k.getBounds())) { this.vonken.explode(6, k.x, k.y); k.destroy(); }
    });
  }

  schiet() {
    const sp = this.speler, n = 1 + this.run.up.pijlen, boem = this.run.up.boem > 0;
    this.schietCd = 0.42; this.poseTimer = 0.16; this.poseVast = 'sp_schiet';
    Geluid.effect('schiet');
    for (let i = 0; i < n; i++) {
      const hoek = (i - (n - 1) / 2) * 0.13;
      const vx = Math.cos(hoek) * 760 * this.kijk, vy = Math.sin(hoek) * 760;
      const p = this.pijlen.create(sp.x + this.kijk * 18, sp.y - 34, boem ? 'pijl_boem' : 'pijl').setDepth(11);
      p.body.setAllowGravity(false);
      p.body.setSize(14, 8);
      p.setVelocity(vx, vy);
      p.setRotation(Math.atan2(vy, vx));
      p.leeft = 1.1; p.boem = boem;
    }
  }

  pijlRaakt(p, v) {
    if (!p.active || !v.active) return;
    this.raakVijand(v, 1, Math.sign(p.body.velocity.x) || 1);
    if (p.boem) this.ontplof(p.x, p.y);
    p.destroy();
  }

  pijlStop(p) {
    if (!p.active) return;
    if (p.boem) this.ontplof(p.x, p.y); else this.vonken.explode(4, p.x, p.y);
    p.destroy();
  }

  ontplof(x, y) {
    const lvl = this.run.up.boem, r = 38 + 16 * lvl, schade = lvl;
    const c = this.add.circle(x, y, r, 0xf2c14e, 0.55).setDepth(12).setScale(0.3);
    this.tweens.add({ targets: c, scale: 1, alpha: 0, duration: 260, onComplete: () => c.destroy() });
    this.vonken.explode(14, x, y);
    this.cameras.main.shake(90, 0.005);
    Geluid.effect('boem');
    this.vijanden.getChildren().slice().forEach(v => {
      if (v.active && Phaser.Math.Distance.Between(x, y, v.x, v.getCenter().y) < r + 20 + (v.soort === 'baas' ? 50 : 0)) {
        this.raakVijand(v, schade, Math.sign(v.x - x) || 1);
      }
    });
  }

  smashLanding() {
    this.smashing = false;
    const sp = this.speler, lvl = this.run.up.smash;
    const r = 70 + 25 * lvl, schade = 1 + lvl;
    this.cameras.main.shake(140, 0.01);
    Geluid.effect('smash');
    const ring = this.add.ellipse(sp.x, sp.y, r * 2, r * 0.6).setStrokeStyle(4, 0xf3ead6).setDepth(12).setScale(0.2);
    this.tweens.add({ targets: ring, scale: 1, alpha: 0, duration: 280, onComplete: () => ring.destroy() });
    this.vonken.explode(18, sp.x, sp.y);
    this.vijanden.getChildren().slice().forEach(v => {
      if (v.active && Math.abs(v.x - sp.x) < r + (v.soort === 'baas' ? 60 : 0) && Math.abs(v.y - sp.y) < 80) {
        this.raakVijand(v, schade, Math.sign(v.x - sp.x) || 1);
      }
    });
    this.onkwetsbaar = Math.max(this.onkwetsbaar, 0.2);
  }

  raakVijand(v, schade, richting) {
    if (!v.active || v.hp <= 0 || this.gewonnen) return;
    v.hp -= schade * this.mod.schade;
    v.setTintFill(0xffffff);
    this.time.delayedCall(70, () => { if (v.active) v.clearTint(); });
    if (v.soort === 'baas') {
      Geluid.effect('baasRaak');
      if (v.hp <= 0) this.baasVerslagen(v);
      return;
    }
    if (v.soort === 'goud') { this.vangGoud(v); return; }
    if (v.soort === 'golem' || v.soort === 'fust') { /* te zwaar om weg te duwen */ }
    else if (v.loopt) { v.body.setVelocity(richting * 180, -180); v.verdoofd = 0.3; }
    else v.x += richting * 14;
    if (v.hp <= 0) {
      const my = v.y - (v.loopt ? v.displayHeight / 2 : 0);
      this.vonken.explode(16, v.x, my);
      this.dropShotjes(v.x, my, v.shots);
      // een groot ijsklontje breekt in 3 kleintjes
      if (v.soort === 'klont') {
        for (const r of [-1, 0, 1]) {
          const k = this.maakKlont(v.x + r * 14, v.y, v.minX - 24, v.maxX + 24, true);
          k.body.setVelocity(r * 160, -260); k.verdoofd = 0.35; k.richting = r || 1;
        }
      }
      Geluid.effect('weg');
      v.destroy();
    } else {
      Geluid.effect('raak');
    }
  }

  dropShotjes(x, y, n) {
    for (let i = 0; i < n; i++) {
      const s = this.shotjes.create(x, y, 'shotje').setDepth(8);
      s.body.setSize(14, 18);
      s.setBounce(0.45);
      s.setDragX(90);
      s.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-460, -250));
    }
  }

  // ---------- VIJANDEN EN SHOTJES ----------
  vijandenUpdate(dt) {
    const sp = this.speler;
    // heen en weer lopen over het platform
    const patrouille = (v, factor) => {
      if (v.x < v.minX) v.richting = 1; else if (v.x > v.maxX) v.richting = -1;
      v.body.velocity.x = v.richting * v.snelheid * factor;
      v.setFlipX(v.richting > 0);
    };
    this.vijanden.getChildren().slice().forEach(v => {
      if (!v.active || v.soort === 'baas') return;
      const dx = sp.x - v.x, dy = (sp.y - 30) - v.y;
      const inBeeld = v.x > this.camX - 40 && v.x < this.camX + 1000;
      if (v.loopt) {
        if (v.verdoofd > 0) { v.verdoofd -= dt; return; }
        if (v.soort === 'pinguin') {
          // blijft even staan en gooit dan een glas bier naar je
          v.gooiT -= dt;
          if (v.stilT > 0) { v.stilT -= dt; v.body.velocity.x = 0; return; }
          if (v.gooiT <= 0 && inBeeld && Math.abs(dx) < 450) {
            v.gooiT = Math.max(1.4, 2.8 - this.moeilijkheid(v.x) * 0.15);
            v.stilT = 0.45;
            v.setFlipX(dx > 0);
            const k = this.kogel('bierglas', v.x + Math.sign(dx) * 14, v.y - 40, Phaser.Math.Clamp(dx * 1.1, -380, 380), -380, 900);
            k.rolt = false; k.leeft = 3;
            this.tweens.add({ targets: k, angle: 360 * Math.sign(dx || 1), duration: 600, repeat: -1 });
            Geluid.effect('schiet');
            return;
          }
          patrouille(v, 1);
        } else if (v.soort === 'fust') {
          // wacht tot je dichtbij bent en rolt dan op je af
          if (!v.rolt) {
            v.body.velocity.x = 0;
            if (inBeeld && Math.abs(dx) < 560) { v.rolt = true; v.richting = Math.sign(dx) || -1; }
          } else {
            if (v.body.blocked.left) v.richting = 1; else if (v.body.blocked.right) v.richting = -1;
            v.body.velocity.x = v.richting * v.snelheid;
            v.rotation += v.body.velocity.x * dt / 21;
          }
        } else if (v.soort === 'lava') {
          // te dichtbij? dan gaat de lont branden... en BOEM
          if (v.lont > 0) {
            v.lont -= dt;
            v.body.velocity.x = 0;
            if (Math.floor(v.lont * 12) % 2) v.setTintFill(0xffffff); else v.clearTint();
            v.setScale(1 + (0.8 - v.lont) * 0.3);
            if (v.lont <= 0) this.ontplof(v);
            return;
          }
          if (Math.hypot(dx, dy) < 95) { v.lont = 0.8; Geluid.effect('lont'); return; }
          patrouille(v, 1);
        } else if (v.soort === 'golem') {
          // loopt langzaam en stampt schokgolven over het platform
          v.stampT -= dt;
          const opGrond = v.body.blocked.down || v.body.touching.down;
          if (v.stampt) {
            if (opGrond && v.body.velocity.y >= 0) {
              v.stampt = false;
              for (const r of [-1, 1]) {
                const k = this.kogel('golf', v.x + r * 34, v.y - 14, r * 240, 0);
                k.golf = true; k.leeft = 1.3; k.setFlipX(r < 0);
              }
              this.cameras.main.shake(120, 0.006);
              Geluid.effect('smash');
            }
            return;
          }
          if (v.stampT <= 0 && opGrond && inBeeld && Math.abs(dx) < 500) {
            v.stampT = 3.2; v.stampt = true;
            v.body.setVelocity(0, -300);
            return;
          }
          patrouille(v, 1);
        } else if (v.soort === 'goud') {
          // rent weg als je dichtbij komt
          if (Math.abs(dx) < 260) { v.richting = -Math.sign(dx) || 1; patrouille(v, 4.5); }
          else patrouille(v, 1);
        } else {
          patrouille(v, 1); // kruiper, ijsklontjes
        }
      } else if (v.soort === 'vleermuis' && v.modus === 'hang') {
        // hangt stil tot je eronder loopt
        v.y = v.basisY + Math.sin(this.tijd * 2 + v.fase) * 2;
        if (Math.abs(dx) < 170 && sp.y > v.y - 10) {
          v.modus = 'duik'; v.setFlipY(false);
          const d = Math.hypot(dx, dy) || 1;
          v.vx = dx / d * 300; v.vy = dy / d * 300; v.duikT = 0.9;
          Geluid.effect('duik');
        }
      } else if (v.soort === 'vleermuis' && v.modus === 'duik') {
        v.x += v.vx * dt; v.y += v.vy * dt; v.duikT -= dt;
        v.setFlipX(v.vx > 0);
        v.scaleY = 1 + Math.sin(this.tijd * 30) * 0.2;
        if (v.duikT <= 0) { v.modus = 'vlieg'; v.basisY = v.y; v.scaleY = 1; }
      } else {
        // dwaallicht (en vleermuis na zijn duik): zweeft en zit je achterna
        v.fase += dt;
        const ddy = (sp.y - 40) - v.basisY;
        if (Math.abs(dx) < 340) {
          v.x += Math.sign(dx) * v.jaagSnelheid * dt;
          v.basisY += Math.sign(ddy) * Math.min(Math.abs(ddy), 30 * dt);
        }
        v.y = v.basisY + Math.sin(v.fase * 2.2) * 16;
        v.setFlipX(dx > 0);
        if (v.soort === 'vleermuis') v.scaleY = 1 + Math.sin(this.tijd * 22) * 0.15;
      }
    });
  }

  maakKebab(x, y) {
    const k = this.kebabs.create(x, y, 'kebab').setDepth(8);
    k.body.setSize(36, 24);
    k.basisY = y;
  }

  // Kebab op: scheet laten en heel hoog de lucht in!
  eetKebab(k) {
    if (!k.active || this.dood) return;
    k.destroy();
    const sp = this.speler;
    Geluid.effect('scheet');
    this.popTekst('PRRRRT!');
    // even harder omhoog mogen dan normaal
    sp.body.maxVelocity.y = 1300;
    sp.body.setVelocityY(-1250);
    this.smashing = false; this.zweeft = false;
    this.extraSprongen = this.run.up.dubbel;
    this.time.delayedCall(1200, () => { if (sp.body) sp.body.maxVelocity.y = 1000; });
    // scheetwolkjes onder je billen
    for (let i = 0; i < 7; i++) {
      const w = this.add.image(sp.x + Phaser.Math.Between(-10, 10), sp.y - 8, 'wolkje').setDepth(9).setScale(0.6);
      this.tweens.add({
        targets: w, x: w.x + Phaser.Math.Between(-45, 45), y: w.y + Phaser.Math.Between(10, 40),
        scale: Phaser.Math.FloatBetween(1.4, 2.2), alpha: 0, duration: 900 + i * 60, onComplete: () => w.destroy(),
      });
    }
  }

  shotjesUpdate() {
    const sp = this.speler;
    this.kebabs.getChildren().forEach(k => { k.y = k.basisY + Math.sin(this.tijd * 2.5 + k.x) * 5; k.rotation = Math.sin(this.tijd * 2 + k.x) * 0.15; });
    this.shotjes.getChildren().forEach(s => {
      if (!s.active) return;
      const dx = sp.x - s.x, dy = (sp.y - 30) - s.y, d = Math.hypot(dx, dy);
      if (s.magneet || d < 70) {
        s.magneet = true; s.zweeft = false;
        s.body.setAllowGravity(false);
        if (d > 1) s.body.setVelocity(dx / d * 400, dy / d * 400);
      } else if (s.zweeft) {
        s.y = s.basisY + Math.sin(this.tijd * 3 + s.fase) * 4;
      }
    });
  }

  pakShotje(s) {
    if (!s.active) return;
    s.destroy();
    // met een upgrade kan een shotje meer (of minder) waard zijn; kommagetallen sparen we op
    this.shotRest += this.waarde * this.mod.shot;
    const heel = Math.floor(this.shotRest);
    this.shotRest -= heel;
    PROFIEL.shotjes += heel;
    if (PROFIEL.shotjes >= 10) {
      while (PROFIEL.shotjes >= 10) { PROFIEL.shotjes -= 10; PROFIEL.flessen++; }
      this.popTekst('Flesje vol!');
      Geluid.effect('flesVol');
      this.tweens.add({ targets: [this.flesGlas, this.flesBier, this.flesRand], scale: 1.25, yoyo: true, duration: 150 });
      bewaarProfiel();
    } else {
      Geluid.effect('shotje');
    }
  }

  // ---------- SCHADE ----------
  spelerRaakt(v) {
    if (!v.active || this.dood || this.gewonnen) return;
    if (v.soort === 'goud') { this.vangGoud(v); return; }
    if (this.smashing) {
      this.raakVijand(v, 1 + this.run.up.smash, this.kijk);
      this.smashing = false;
      this.speler.body.setVelocity(0, -420);
      return;
    }
    if (this.onkwetsbaar > 0) return;
    this.schade(Math.sign(this.speler.x - v.x) || -this.kijk);
  }

  schade(richting) {
    const b = this.speler.body;
    this.run.harten -= 1;
    this.onkwetsbaar = 1.2; this.knipper = 1.2;
    this.cameras.main.shake(120, 0.008);
    this.cameras.main.flash(120, 209, 73, 91);
    Geluid.effect('au');
    this.dashTijd = 0; b.setAllowGravity(true); this.smashing = false;
    b.setVelocity(richting * 260, -320);
    this.muurLock = 0.25; this.springGeknipt = true;
    if (this.run.harten <= 0) this.gameOver();
  }

  valSchade() {
    if (this.dood) return;
    this.run.harten -= 1;
    this.cameras.main.shake(150, 0.01);
    this.cameras.main.flash(120, 209, 73, 91);
    Geluid.effect('au');
    if (this.run.harten <= 0) { this.gameOver(); return; }
    this.respawn();
  }

  // Na in het water vallen (of klem tegen de rand): altijd terug op een eigen, veilig platformpje,
  // hoog en midden in beeld. Zo kun je nooit meteen nog een hartje verliezen.
  respawn() {
    const sp = this.speler, b = sp.body;
    const x = this.camX + 380, y = 230;
    // vijanden en kogels vlak bij de veilige plek weghalen
    for (const grp of [this.vijanden, this.kogels]) {
      grp.getChildren().slice().forEach(v => {
        if (v.active && v.soort !== 'baas' && Math.abs(v.x - x) < 220 && Math.abs(v.y - y) < 220) v.destroy();
      });
    }
    const p = this.maakPlatform(x - 90, y, 180, true).setDepth(7);
    // het veilige platformpje gloeit even, zodat je ziet waar je bent
    p.setTint(0xfff2a0);
    this.time.delayedCall(2500, () => { if (p.active) p.clearTint(); });
    // reset (niet alleen verplaatsen): anders denkt het spel dat je van onderen tegen het platform
    // aan springt, en duwt het je er onderdoor
    b.reset(x, y - 2);
    b.setVelocity(0, 0);
    b.setAllowGravity(true);
    this.dashTijd = 0; this.smashing = false;
    this.onkwetsbaar = 2.5; this.knipper = 2.5;
    // het scherm wacht even, zodat je rustig verder kunt
    this.startVertraging = 2.5;
  }

  meters() { return this.baasModus ? 0 : Math.max(0, Math.floor(this.speler.x / 20)); }

  gameOver() {
    this.dood = true;
    this.physics.pause();
    this.speler.setTint(0x555577);
    Geluid.effect('gameOver');
    const meters = this.meters();
    PROFIEL.beste = Math.max(PROFIEL.beste, meters);
    bewaarProfiel();
    this.add.text(480, 230, 'Oei!', {
      fontFamily: FONT_TITEL, fontSize: '64px', color: '#d1495b', stroke: '#0a1028', strokeThickness: 8,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(150);
    this.time.delayedCall(1300, () => this.scene.start('Winkel', { meters, regio: this.n, baas: this.baasModus }));
  }

  // ---------- HUD (hartjes, flesje, meters) ----------
  maakHud() {
    const vast = o => o.setScrollFactor(0).setDepth(100);
    this.hartIcons = [];
    // veel hartjes? dan kleiner en dichter op elkaar
    const veel = this.maxH > 8;
    for (let i = 0; i < 12; i++) this.hartIcons.push(vast(this.add.image(28 + i * (veel ? 22 : 28), 26, 'hart').setScale(veel ? 0.8 : 1)));
    this.flesGlas = vast(this.add.image(30, 84, 'fles_glas'));
    this.flesBier = vast(this.add.image(30, 84, 'fles_bier'));
    this.flesRand = vast(this.add.image(30, 84, 'fles_rand'));
    const stijl = { fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 5 };
    this.flesTekst = vast(this.add.text(52, 66, '', stijl));
    this.shotTekst = vast(this.add.text(52, 94, '', { ...stijl, fontSize: '15px', color: '#f2c14e' }));
    this.dashG = vast(this.add.graphics());
    if (this.mod.id) this.add.text(14, 136, '✦ ' + this.mod.naam, { ...stijl, fontSize: '15px', color: '#3cc8bb' }).setScrollFactor(0).setDepth(100);
    const rechts = kanVolledigScherm(this) ? 840 : 890;
    if (!this.baasModus) {
      this.levelTekst = vast(this.add.text(rechts, 12, levelNaam(this.n), { ...stijl, fontFamily: FONT_TITEL, fontSize: '26px', color: '#f2c14e' }).setOrigin(1, 0));
      this.meterTekst = vast(this.add.text(rechts, 46, '', stijl).setOrigin(1, 0));
    }
    maakInstellingenKnop(this, 932, 28);
    maakVolledigSchermKnop(this, 884, 28);
  }

  popTekst(t) {
    const tx = this.add.text(60, 130, t, {
      fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 5,
    }).setScrollFactor(0).setDepth(120);
    this.tweens.add({ targets: tx, y: 110, alpha: 0, delay: 600, duration: 500, onComplete: () => tx.destroy() });
  }

  updateHud() {
    const max = this.maxH;
    this.hartIcons.forEach((h, i) => { h.setVisible(i < max); h.setTexture(i < this.run.harten ? 'hart' : 'hart_leeg'); });
    const vul = Math.round(70 * PROFIEL.shotjes / 10);
    this.flesBier.setCrop(0, 74 - vul, 32, vul);
    this.flesBier.setVisible(vul > 0);
    this.flesTekst.setText('× ' + PROFIEL.flessen);
    this.shotTekst.setText(PROFIEL.shotjes + '/10 shotjes' + (this.waarde > 1 ? `  (×${this.waarde})` : ''));
    if (this.meterTekst) this.meterTekst.setText(this.meters() + ' m');
    this.dashG.clear();
    const maxDash = [0, 1, 1, 2, 2, 3][this.run.up.dash];
    for (let i = 0; i < maxDash; i++) {
      this.dashG.fillStyle(0x3cc8bb, i < this.dashLading ? 1 : 0.2);
      this.dashG.fillCircle(58 + i * 16, 124, 5);
    }
    if (this.baasBalk) {
      const g = this.baasBalk, b = this.baas;
      const f = b && b.active ? Math.max(0, b.hp / b.maxHp) : 0;
      g.clear();
      g.fillStyle(0x0a1028, 0.8).fillRoundedRect(276, 10, 408, 22, 11);
      g.fillStyle(0xd1495b, 1).fillRoundedRect(280, 14, 400 * f, 14, 7);
      g.lineStyle(2, 0xf2c14e, 1).strokeRoundedRect(276, 10, 408, 22, 11);
    }
  }
}
