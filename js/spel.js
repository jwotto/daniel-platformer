// Het level. De monsters staan in monsters.js, de eindbazen in bazen.js en de
// effecten van de dure power-ups in krachten.js. Die worden hier aan Spel toegevoegd.
// Twee soorten levels:
// - normaal: de regio loopt eindeloos door en wordt steeds moeilijker, het scherm schuift naar rechts
// - eindbaas: een arena met een vast scherm en een eindbaas die je moet verslaan

const LOOPSNELHEID = 240;
const SPRONG = -560;

// Hoe sterk is elke eindbaas, en welke aanvallen doet hij (om de beurt)

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
    // voor de prestaties
    this.potjeMonsters = 0; this.baasGeraakt = false; this.prestT = 1;
    // power-ups die per potje opladen
    const up0 = this.run.up;
    this.schilden = up0.schild || 0;
    this.reserve = up0.reserve || 0;
    this.verslagen = 0;
    this.maatjeCd = 1;
    // Phaser gebruikt dit level-object steeds opnieuw. Dingen van het vorige potje zijn al weg,
    // dus eerst leegmaken. Anders loopt het baasgevecht vast na een normaal potje (en andersom).
    this.baas = null; this.baasBalk = null; this.baasTekst = null;
    this.levelTekst = null; this.meterTekst = null;
    this.donker = null; this.splat = null; this.straalG = null; this.tong = null; this.bandVloer = null;
    this.achtergrond = maakAchtergrond(this, this.reg.id);

    this.platforms = this.physics.add.staticGroup();
    this.pilaren = this.physics.add.staticGroup();
    this.vijanden = this.physics.add.group();
    this.pijlen = this.physics.add.group({ allowGravity: false });
    this.shotjes = this.physics.add.group();
    this.kebabs = this.physics.add.group({ allowGravity: false });
    this.spikes = this.physics.add.staticGroup();
    this.pegels = this.physics.add.group({ allowGravity: false });
    // de zwaartekracht kan door de Lepelaar zijn uitgezet: altijd weer aanzetten
    this.physics.world.gravity.y = 1500;
    // op de maan is de zwaartekracht laag: je springt veel hoger
    if (this.reg.id === 'maan') this.physics.world.gravity.y = 760;
    // regio-trucjes: bierplassen (kroeg), lopende banden (fabriek), trampolines (speeltuin)
    this.plassen = this.physics.add.staticGroup();
    this.trampolines = this.physics.add.staticGroup();
    this.kisten = this.physics.add.group({ allowGravity: false });
    this.banden = [];
    this.bandNu = 0; this.glad = 0;
    // grot: een dicht plafond (je kunt niet boven het scherm uit)
    this.plafondY = this.reg.id === 'grot' ? 70 : (this.baasModus ? 6 : null);
    if (this.reg.id === 'grot') this.plafond = this.add.tileSprite(0, 0, 960, 90, 'plafond_grot').setOrigin(0).setScrollFactor(0).setDepth(7);
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
    // schuimschild: een bel om de speler
    this.schildBel = this.add.circle(0, 0, 38, 0xfffaf0, 0.18).setStrokeStyle(3, 0xfffaf0, 0.8).setDepth(11).setVisible(false);
    // flesmaatje: vliegt achter je aan
    this.maatje = this.run.up.maatje ? this.add.image(100, 380, 'fles_mini').setDepth(11).setScale(1.1) : null;
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
    this.physics.add.overlap(this.speler, this.plassen, () => { this.glad = 0.15; });
    this.physics.add.overlap(this.speler, this.trampolines, (sp, t) => this.opTrampoline(t));
    this.physics.add.overlap(this.speler, this.kisten, (sp, k) => this.openKist(k));
    this.physics.add.collider(this.speler, this.pilaren);
    this.physics.add.collider(this.vijanden, this.platforms, null, v => v.loopt || (v.soort === 'baas' && !v.vliegt));
    this.physics.add.collider(this.vijanden, this.pilaren, null, v => v.soort === 'baas' && !v.vliegt);
    this.physics.add.collider(this.shotjes, this.platforms);
    this.physics.add.collider(this.shotjes, this.pilaren);
    this.physics.add.overlap(this.speler, this.vijanden, (sp, v) => this.spelerRaakt(v));
    this.physics.add.overlap(this.speler, this.shotjes, (sp, s) => this.pakShotje(s));
    this.physics.add.overlap(this.speler, this.kebabs, (sp, k) => this.eetKebab(k));
    this.physics.add.overlap(this.speler, this.spikes, () => this.opSpikes());
    this.physics.add.overlap(this.speler, this.pegels, () => this.opSpikes());
    this.physics.add.overlap(this.pegels, this.platforms, (s) => { if (s.valt) { this.vonken.explode(8, s.x, s.y + 40); Geluid.effect('raak'); s.destroy(); } });
    this.physics.add.overlap(this.speler, this.kogels, (sp, k) => this.kogelRaakt(k));
    this.physics.add.overlap(this.pijlen, this.vijanden, (p, v) => this.pijlRaakt(p, v));
    this.physics.add.overlap(this.pijlen, this.pilaren, p => this.pijlStop(p));

    this.vonken = this.add.particles(0, 0, 'vonk', {
      speed: { min: 80, max: 260 }, lifespan: 450, scale: { start: 1.2, end: 0 },
      tint: [0xf2c14e, 0xffffff, 0x3cc8bb], emitting: false,
    }).setDepth(12);

    this.besturing = new Besturing(this);
    this.maakDier();
    // bonussen van sterren (prestige) en huisdieren
    this.shotBonus = (1 + 0.1 * PROFIEL.sterren + 0.05 * dierLvl('kuiken') + 0.06 * dierLvl('bierbeest')) * (this.run.dagbonus ? 2 : 1);
    if (this.run.dagbonus) this.time.delayedCall(2300, () => this.popTekst('Eerste potje van de dag: shotjes ×2!'));
    this.time.delayedCall(800, () => checkPrestaties(this));
    this.maakHud();

    Geluid.muziekAan();
    // liedje kiezen: Bierpolka voor Rivier en IJsvlakte, Bergmars voor Bergen en Vulkaan, Baaslied bij een eindbaas
    const lied = this.baasModus ? 'baas' : (['rivier', 'ijs', 'savanne', 'kroeg', 'speeltuin'].includes(this.reg.id) ? 'polka' : 'mars');
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
    // spikes op sommige platforms (niet helemaal aan het begin)
    if (w >= 200 && this.genX > 1400 && Math.random() < Math.min(0.3, 0.1 + 0.05 * L)) this.maakSpikes(x + w * 0.3, y, Math.min(90, w * 0.3));
    // heel soms een schatkist
    if (w >= 120 && this.genX > 1500 && Math.random() < 0.03) this.maakKist(x + w * 0.5, y);
    // kroeg: gladde bierplassen
    if (this.reg.id === 'kroeg' && w >= 160 && Math.random() < 0.45) this.maakPlas(x + Phaser.Math.Between(10, w - 90), y);
    // fabriek: lopende banden
    if (this.reg.id === 'fabriek' && Math.random() < 0.45) this.maakBand(p, Math.random() < 0.5 ? -1 : 1);
    // speeltuin: trampolines
    if (this.reg.id === 'speeltuin' && w >= 140 && Math.random() < 0.35) this.maakTrampoline(x + w * 0.65, y);
    // grot: stalactieten aan het plafond boven het platform
    if (this.reg.id === 'grot' && this.genX > 1000 && Math.random() < 0.45) this.maakPegel(x + Phaser.Math.Between(20, w - 20));
    // af en toe een kebabrol
    if (this.genX > 1200 && Math.random() < 0.07 * (1 + (this.run.up.kebabradar || 0) * 1.5)) this.maakKebab(x + w * 0.75, y - 40);
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

  maakKist(x, y) {
    const k = this.kisten.create(x, y - 18, 'schatkist').setDepth(8);
    k.body.setSize(40, 30);
    this.tweens.add({ targets: k, y: y - 24, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });
  }

  // schatkist gevonden: spel even op pauze, en kiezen: nemen of gokken
  openKist(k) {
    if (!k.active || this.dood || this.scene.isPaused()) return;
    k.destroy();
    const inzet = 3 + this.n * 3 + Phaser.Math.Between(0, 3);
    Geluid.effect('flesVol');
    this.scene.launch('Schatkist', { inzet, klaar: () => { this.scene.resume(); checkPrestaties(this); } });
    this.scene.pause();
  }

  // kroeg: een plas bier waar je op uitglijdt
  maakPlas(x, y) {
    const p = this.plassen.create(x, y + 4, 'plas').setOrigin(0, 1).setDepth(6);
    p.body.setSize(76, 10).setOffset(2, -6);
    p.refreshBody();
  }

  // fabriek: maak van een platform een lopende band
  maakBand(p, richting) {
    p.band = richting;
    const b = this.add.tileSprite(p.x + 6, p.y + 2, p.displayWidth - 12, 10, 'band').setOrigin(0, 0).setDepth(6);
    b.richting = richting; b.setFlipX(richting < 0);
    this.decor.add(b);
    this.banden.push(b);
  }

  // speeltuin: een trampoline op een platform
  maakTrampoline(x, y) {
    const t = this.trampolines.create(x, y + 1, 'trampoline').setOrigin(0.5, 1).setDepth(7);
    t.body.setSize(52, 10).setOffset(6, 0);
    t.refreshBody();
  }

  opTrampoline(t) {
    const b = this.speler.body;
    if (b.velocity.y < 0) return;
    b.setVelocityY(-980);
    this.extraSprongen = this.run.up.dubbel;
    Geluid.effect('boing');
    this.tweens.add({ targets: t, scaleY: 0.6, yoyo: true, duration: 90 });
  }

  // grot: een stalactiet aan het plafond
  maakPegel(x) {
    const s = this.pegels.create(x, 58, 'stalactiet').setOrigin(0.5, 0).setDepth(6);
    s.body.setSize(14, 48).setOffset(5, 4);
    s.valt = false; s.wiebel = 0;
  }

  // stalactieten vallen als je eronder loopt
  pegelsUpdate(dt) {
    const sp = this.speler;
    this.pegels.getChildren().slice().forEach(s => {
      if (!s.valt && s.wiebel <= 0 && Math.abs(sp.x - s.x) < 50 && sp.y > s.y) { s.wiebel = 0.3; Geluid.effect('tink'); }
      if (s.wiebel > 0) {
        s.wiebel -= dt;
        s.x += Math.sin(this.tijd * 60) * 0.8;
        if (s.wiebel <= 0) { s.valt = true; s.body.setAllowGravity(true); }
      }
      if (s.y > 640) s.destroy();
    });
  }

  // het plafond: in de grot (en in een baasarena) kun je niet boven het scherm uit
  plafondUpdate() {
    if (this.plafond) this.plafond.tilePositionX = this.camX;
    if (this.plafondY === null) return;
    const b = this.speler.body;
    if (b.top < this.plafondY) {
      this.speler.y += this.plafondY - b.top;
      if (b.velocity.y < 0) b.velocity.y = 0;
    }
  }

  // een rij scherpe spikes op een platform
  maakSpikes(x, y, w) {
    w = Math.round(w / 15) * 15;
    const s = this.spikes.create(x, y + 2, spikesTex(this, w)).setOrigin(0, 1).setDepth(6);
    s.body.setSize(w - 8, 10).setOffset(4, 6);
    s.refreshBody();
  }

  // op de spikes gestapt: au, en je stuitert omhoog
  opSpikes() {
    if (this.onkwetsbaar > 0 || this.dood || this.gewonnen) return;
    this.schade(-this.kijk);
    this.speler.body.setVelocityY(-480);
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
    this.spikes.getChildren().slice().forEach(o => { if (o.x + o.displayWidth < grens) o.destroy(); });
    this.pegels.getChildren().slice().forEach(o => { if (o.x < grens || o.y > 640) o.destroy(); });
    this.kisten.getChildren().slice().forEach(o => { if (o.x < grens) o.destroy(); });
    for (const grp of [this.plassen, this.trampolines]) grp.getChildren().slice().forEach(o => { if (o.x + o.displayWidth < grens) o.destroy(); });
    for (const grp of [this.vijanden, this.shotjes, this.kebabs]) {
      grp.getChildren().slice().forEach(o => { if (o.x < grens || o.y > 640) o.destroy(); });
    }
    this.decor.getChildren().slice().forEach(o => { if (o.x < grens) o.destroy(); });
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
    this.maatjeUpdate(dt);
    this.dierUpdate(dt);
    this.schildBel.setVisible(this.schilden > 0).setPosition(this.speler.x, this.speler.y - 30);
    this.schildBel.setScale(1 + Math.sin(this.tijd * 4) * 0.04);
    // lopende band: sta je erop, dan loop je vanzelf mee (dat telt op bij je loopsnelheid)
    this.bandV = 0;
    if (this.banden.length) {
      const sp = this.speler, b = sp.body;
      const p = (b.blocked.down || b.touching.down) && this.platforms.getChildren().find(p => p.band && sp.x >= p.x && sp.x <= p.x + p.displayWidth && Math.abs(b.bottom - p.y) < 6);
      if (p) this.bandV = p.band * 130;
    }
    this.spelerUpdate(dt, inp);
    this.plafondUpdate();
    // elke seconde: hoe ver ben je? (voor de meter-prestaties)
    this.prestT -= dt;
    if (this.prestT <= 0 && !this.baasModus) { this.prestT = 1; statMax('meters', this.meters()); checkPrestaties(this); }

    if (this.glad > 0) this.glad -= dt;
    this.banden = this.banden.filter(b => b.active);
    for (const b of this.banden) b.tilePositionX -= b.richting * 120 * dt;
    this.pegelsUpdate(dt);
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
        const grip = opGrond ? (this.th.id === 'ijs' || this.glad > 0 ? 0.08 : 0.4) : 0.18;
        b.velocity.x = Phaser.Math.Linear(b.velocity.x, inp.x * LOOPSNELHEID * this.mod.loop * (1 + 0.04 * dierLvl('vos') + 0.03 * (this.run.up.behendig || 0)) + (this.bandV || 0), grip);
        if (Math.abs(inp.x) > 0.2) this.kijk = Math.sign(inp.x);
      }
      // springen
      if (this.springBuffer > 0) {
        if (this.coyote > 0) {
          this.spring(SPRONG * this.mod.sprong * (1 + 0.03 * dierLvl('uil') + 0.02 * (this.run.up.behendig || 0)));
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
  // Boogkracht: elk niveau 15% meer pijlschade
  pijlSchade() { return 1 + 0.15 * (this.run.up.boogkracht || 0); }

  doeSlash() {
    const sp = this.speler, lvl = this.run.up.slash;
    const bereik = 58 + 12 * Math.min(5, lvl), schade = 1 + lvl;
    this.slashCd = 0.3; this.poseTimer = 0.16; this.poseVast = 'sp_slash';
    Geluid.effect('slash');
    const fx = this.add.image(sp.x + this.kijk * 6, sp.y - 30, 'slash')
      .setDepth(12).setOrigin(this.kijk > 0 ? 0.2 : 0.8, 0.5).setFlipX(this.kijk < 0).setScale(bereik / 50);
    this.tweens.add({ targets: fx, alpha: 0, scale: fx.scale * 1.15, duration: 170, onComplete: () => fx.destroy() });
    const rect = new Phaser.Geom.Rectangle(this.kijk > 0 ? sp.x - 6 : sp.x - bereik + 6, sp.y - 64, bereik, 70);
    this.vijanden.getChildren().slice().forEach(v => {
      if (v.active && Phaser.Geom.Intersects.RectangleToRectangle(rect, v.getBounds())) this.raakVijand(v, schade, this.kijk, 'slash');
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
    if (this.run.up.doorboor) {
      // doorboorpijl: elk monster maar 1 keer raken en dan doorvliegen
      p.geraakt = p.geraakt || new Set();
      if (p.geraakt.has(v)) return;
      p.geraakt.add(v);
      this.raakVijand(v, this.pijlSchade(), Math.sign(p.body.velocity.x) || 1, 'pijl');
      if (p.boem) this.ontplof(p.x, p.y);
      return;
    }
    this.raakVijand(v, this.pijlSchade(), Math.sign(p.body.velocity.x) || 1, 'pijl');
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
        this.raakVijand(v, schade, Math.sign(v.x - x) || 1, 'pijl');
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
        this.raakVijand(v, schade, Math.sign(v.x - sp.x) || 1, 'smash');
      }
    });
    this.onkwetsbaar = Math.max(this.onkwetsbaar, 0.2);
  }

  // bron: hoe je hem raakt ('slash', 'pijl', 'stamp', 'smash' of 'boer')
  raakVijand(v, schade, richting, bron) {
    if (!v.active || v.hp <= 0 || this.gewonnen) return;
    // de Brouwmachine kun je alleen raken als hij boven is
    if (v.soort === 'baas' && v.baas === 'machine' && v.status !== 'boven') {
      if ((v.ketsT || 0) < this.tijd) { v.ketsT = this.tijd + 1.5; this.popTekst('De machine zit in de grond!'); }
      return;
    }
    // sommige monsters kun je maar op één manier verslaan
    const zwak = ZWAK[v.soort];
    const telt = !zwak || bron === zwak || bron === 'boer' || (zwak === 'stamp' && bron === 'smash');
    if (!telt) { this.ketst(v, zwak); return; }
    // Kritieke klap: soms dubbele schade
    if (this.run.up.krit && Math.random() < kritKans(this.run.up.krit)) {
      schade *= 2;
      const t = this.add.text(v.x, v.getTopCenter().y - 10, 'KRIT!', { fontFamily: FONT_TITEL, fontSize: '22px', color: '#ffd24a', stroke: '#0a1028', strokeThickness: 5 }).setOrigin(0.5).setDepth(20).setScale(0.5);
      this.tweens.add({ targets: t, scale: 1.2, y: t.y - 30, alpha: 0, duration: 650, onComplete: () => t.destroy() });
      Geluid.effect('krit');
    }
    v.hp -= schade * this.mod.schade * (1 + 0.06 * dierLvl('bierbeest'));
    v.setTintFill(0xffffff);
    this.time.delayedCall(70, () => { if (v.active) { v.clearTint(); if (v.woedend) v.setTint(0xff9a9a); } });
    if (v.soort === 'baas') {
      Geluid.effect('baasRaak');
      if (v.hp <= 0) this.baasVerslagen(v);
      else if (v.baas === 'salamander') this.salamanderVlucht(v);
      return;
    }
    // de mol kun je alleen raken als hij boven de grond is
    if (v.onder) { this.ketst(v, 'boven'); return; }
    if (v.soort === 'goud') { this.vangGoud(v); return; }
    if (v.soort === 'golem' || v.soort === 'fust') { /* te zwaar om weg te duwen */ }
    else if (v.loopt) { v.body.setVelocity(richting * 180, -180); v.verdoofd = 0.3; }
    else v.x += richting * 14;
    if (v.hp <= 0) {
      const my = v.y - (v.loopt ? v.displayHeight / 2 : 0);
      this.vonken.explode(16, v.x, my);
      this.dropShotjes(v.x, my, v.shots + (this.run.up.statiegeld || 0));
      // tellen voor de prestaties
      statTel('monsters');
      // de eenhoorn: soms een heel flesje
      if (Math.random() < 0.04 * dierLvl('eenhoorn')) { PROFIEL.flessen++; statTel('flessenTotaal'); this.popTekst('Eenhoorn: +1 flesje!'); }
      this.potjeMonsters++; statMax('potjeMonsters', this.potjeMonsters);
      if (bron === 'slash' || bron === 'pijl') statTel(bron);
      if (bron === 'stamp' || bron === 'smash') statTel('stamp');
      checkPrestaties(this);
      // herstelslok: na genoeg verslagen monsters een hartje terug
      this.verslagen++;
      const nodig = [0, 20, 12][this.run.up.slok || 0];
      if (nodig && this.verslagen % nodig === 0 && this.run.harten < this.maxH) {
        this.run.harten++;
        this.popTekst('Herstelslok! +1 hartje');
        Geluid.effect('koop');
      }
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
    statTel('kebab'); checkPrestaties(this);
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
      if (s.magneet || d < [70, 190, 420][this.run.up.magneet || 0] + 40 * dierLvl('hond')) {
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
    this.shotRest += this.waarde * this.mod.shot * (this.shotBonus || 1);
    const heel = Math.floor(this.shotRest);
    this.shotRest -= heel;
    PROFIEL.shotjes += heel;
    if (PROFIEL.shotjes >= 10) {
      while (PROFIEL.shotjes >= 10) { PROFIEL.shotjes -= 10; PROFIEL.flessen++; statTel('flesVol'); statTel('flessenTotaal'); }
      checkPrestaties(this);
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
    if (v.onder) return; // mol onder de grond
    // bierbuik-stamp: van bovenop een monster springen
    const sp = this.speler;
    if ((this.run.up.stomp || ZWAK[v.soort] === 'stamp') && !this.smashing && sp.body.velocity.y > 60 && sp.y < v.getCenter().y) {
      this.raakVijand(v, Math.max(2, this.run.up.stomp * 2), this.kijk, 'stamp');
      sp.body.setVelocityY(-520);
      this.onkwetsbaar = Math.max(this.onkwetsbaar, 0.15);
      this.vonken.explode(10, sp.x, sp.y);
      Geluid.effect('dubbel');
      return;
    }
    if (this.smashing) {
      this.raakVijand(v, 1 + this.run.up.smash, this.kijk, 'smash');
      this.smashing = false;
      this.speler.body.setVelocity(0, -420);
      return;
    }
    if (this.onkwetsbaar > 0) return;
    this.schade(Math.sign(this.speler.x - v.x) || -this.kijk);
  }

  schade(richting) {
    const b = this.speler.body;
    if (this.baasModus) this.baasGeraakt = true;
    if (this.schilden > 0) {
      // de schuimbel vangt de klap op
      this.schilden--;
      this.onkwetsbaar = 1;
      this.vonken.explode(20, this.speler.x, this.speler.y - 30);
      Geluid.effect('raak');
      this.popTekst('Schuimschild!');
      b.setVelocity(richting * 200, -260);
      return;
    }
    this.run.harten -= 1;
    if (this.run.up.boer) this.boer();
    this.onkwetsbaar = 1.2; this.knipper = 1.2;
    this.cameras.main.shake(120, 0.008);
    this.cameras.main.flash(120, 209, 73, 91);
    Geluid.effect('au');
    this.dashTijd = 0; b.setAllowGravity(true); this.smashing = false;
    b.setVelocity(richting * 260, -320);
    this.muurLock = 0.25; this.springGeknipt = true;
    if (this.run.harten <= 0) this.bijnaDood();
  }

  valSchade() {
    if (this.dood) return;
    statTel('plons');
    this.run.harten -= 1;
    this.cameras.main.shake(150, 0.01);
    this.cameras.main.flash(120, 209, 73, 91);
    Geluid.effect('au');
    if (this.run.harten <= 0 && this.bijnaDood()) return;
    this.respawn();
  }

  // Na in het water vallen (of klem tegen de rand): altijd terug op een eigen, veilig platformpje,
  // hoog en midden in beeld. Zo kun je nooit meteen nog een hartje verliezen.
  respawn() {
    const sp = this.speler, b = sp.body;
    const x = this.camX + 380, y = this.reg.id === 'grot' ? 260 : 230;
    // vijanden en kogels vlak bij de veilige plek weghalen
    for (const grp of [this.vijanden, this.kogels, this.spikes, this.pegels]) {
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
    statTel('dood'); statMax('meters', meters);
    checkPrestaties(null);
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
    // meer dan 12 hartjes? dan een getal erachter
    this.hartTekst = vast(this.add.text(296, 26, '', { fontFamily: FONT, fontSize: '18px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 4 }).setOrigin(0, 0.5));
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
    // stopknop: potje stoppen (eerst komt de vraag of je het zeker weet)
    this.stopKnop = vast(this.add.image(932, 76, 'stopknop')).setDepth(210).setAlpha(0.85)
      .setInteractive({ useHandCursor: true }).on('pointerup', () => this.vraagStop());
  }

  vraagStop() {
    if (this.dood || this.gewonnen || this.scene.isPaused()) return;
    Geluid.effect('klik');
    this.scene.launch('StopVraag');
    this.scene.pause();
  }

  popTekst(t) {
    const tx = this.add.text(60, 130, t, {
      fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 5,
    }).setScrollFactor(0).setDepth(120);
    this.tweens.add({ targets: tx, y: 110, alpha: 0, delay: 600, duration: 500, onComplete: () => tx.destroy() });
  }

  updateHud() {
    const max = this.maxH;
    if (max > 12) {
      // veel hartjes: één hartje met een getal
      this.hartIcons.forEach((h, i) => { h.setVisible(i === 0); h.setTexture('hart'); });
      this.hartTekst.setX(46).setText('× ' + this.run.harten + ' / ' + max);
    } else {
      this.hartIcons.forEach((h, i) => { h.setVisible(i < max); h.setTexture(i < this.run.harten ? 'hart' : 'hart_leeg'); });
      this.hartTekst.setText('');
    }
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

// Voegt de methodes van een los "deel" (bijv. MonsterDeel) toe aan Spel,
// zodat we de code over meerdere bestanden kunnen verdelen.
function voegToeAanSpel(deel) {
  for (const naam of Object.getOwnPropertyNames(deel.prototype)) {
    if (naam !== 'constructor') Spel.prototype[naam] = deel.prototype[naam];
  }
}
