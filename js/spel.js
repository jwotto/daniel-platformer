// Het level: wordt door de computer gemaakt terwijl je speelt.
// Het scherm schuift vanzelf langzaam naar rechts.

const LOOPSNELHEID = 240;
const SPRONG = -560;

class Spel extends Phaser.Scene {
  constructor() { super('Spel'); }

  create(data) {
    this.run = data.run;
    this.th = THEMAS[this.run.level % THEMAS.length];
    this.ronde = Math.floor(this.run.level / THEMAS.length);
    this.achtergrond = maakAchtergrond(this, this.th.id);

    this.platforms = this.physics.add.staticGroup();
    this.pilaren = this.physics.add.staticGroup();
    this.vijanden = this.physics.add.group();
    this.pijlen = this.physics.add.group({ allowGravity: false });
    this.shotjes = this.physics.add.group();

    // toestand
    this.tijd = 0;
    this.levelLengte = 6000 + this.run.level * 600;
    this.scrollSnelheid = 48 + this.run.level * 7;
    this.startVertraging = 1.6;
    this.camX = 0;
    this.genX = 0; this.genY = 420;
    this.eindeGemaakt = false; this.eindX = Infinity;
    this.klaar = false; this.dood = false;
    this.kijk = 1;
    this.coyote = 0; this.springBuffer = 0; this.springGeknipt = true;
    this.extraSprongen = 0; this.dashLading = 0; this.dashTijd = 0; this.dashCd = 0; this.dashSpoor = 0;
    this.smashing = false; this.zweeft = false;
    this.slashCd = 0; this.schietCd = 0; this.poseTimer = 0; this.poseVast = 'sp_stil';
    this.muurLock = 0; this.onkwetsbaar = 0; this.knipper = 0; this.loopT = 0;

    // startplatform en speler
    const start = this.maakPlatform(-40, 420, 560);
    this.genX = start.x + start.displayWidth;
    this.speler = this.physics.add.sprite(150, 418, 'sp_stil').setOrigin(0.5, 1).setDepth(10);
    this.speler.body.setSize(20, 40).setOffset(18, 31);
    this.speler.body.setMaxVelocity(900, 1000);

    // wie botst met wie
    this.physics.add.collider(this.speler, this.platforms);
    this.physics.add.collider(this.speler, this.pilaren);
    this.physics.add.collider(this.vijanden, this.platforms, null, v => v.soort === 'kruiper');
    this.physics.add.collider(this.shotjes, this.platforms);
    this.physics.add.collider(this.shotjes, this.pilaren);
    this.physics.add.overlap(this.speler, this.vijanden, (sp, v) => this.spelerRaakt(v));
    this.physics.add.overlap(this.speler, this.shotjes, (sp, s) => this.pakShotje(s));
    this.physics.add.overlap(this.pijlen, this.vijanden, (p, v) => this.pijlRaakt(p, v));
    this.physics.add.overlap(this.pijlen, this.pilaren, p => this.pijlStop(p));

    this.vonken = this.add.particles(0, 0, 'vonk', {
      speed: { min: 80, max: 260 }, lifespan: 450, scale: { start: 1.2, end: 0 },
      tint: [0xf2c14e, 0xffffff, 0x3cc8bb], emitting: false,
    }).setDepth(12);

    this.besturing = new Besturing(this);
    this.maakHud();
    this.genereer(1500);

    const naam = this.th.naam + (this.ronde > 0 ? ' ' + (this.ronde + 1) : '');
    const intro = this.add.text(480, 210, naam, {
      fontFamily: FONT_TITEL, fontSize: '56px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 8,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(150);
    this.tweens.add({ targets: intro, alpha: 0, y: 180, delay: 1300, duration: 600, onComplete: () => intro.destroy() });
  }

  // ---------- LEVEL MAKEN ----------
  maakPlatform(x, y, w) {
    w = Math.max(60, Math.round(w / 10) * 10);
    const p = this.platforms.create(x, y, platTex(this, this.th.id, w)).setOrigin(0, 0).refreshBody().setDepth(5);
    // je kunt er van onderen doorheen springen
    p.body.checkCollision.down = false;
    p.body.checkCollision.left = false;
    p.body.checkCollision.right = false;
    return p;
  }

  maakPilaar(x, topY) {
    const h = Math.round((600 - topY) / 10) * 10;
    return this.pilaren.create(x, topY, pilaarTex(this, this.th.id, h)).setOrigin(0, 0).refreshBody().setDepth(5);
  }

  maakKruiper(x, y, minX, maxX) {
    const v = this.vijanden.create(x, y - 2, 'kruiper_' + this.th.id).setOrigin(0.5, 1).setDepth(9);
    v.body.setSize(44, 26).setOffset(13, 22);
    v.soort = 'kruiper';
    v.hp = 2 + this.ronde + (this.th.id === 'berg' ? 1 : 0);
    v.minX = minX + 24; v.maxX = maxX - 24;
    v.richting = Math.random() < 0.5 ? -1 : 1;
    v.snelheid = 45 + Math.random() * 30 + this.ronde * 10;
    v.verdoofd = 0; v.shots = 2;
  }

  maakDwaallicht(x, y) {
    const v = this.vijanden.create(x, y, 'licht_' + this.th.id).setOrigin(0.5).setDepth(9);
    v.body.setAllowGravity(false);
    v.body.setSize(30, 40).setOffset(15, 12);
    v.soort = 'licht';
    v.hp = 1 + this.ronde + (this.th.id === 'berg' ? 1 : 0);
    v.basisY = y; v.fase = Math.random() * 6; v.shots = 3;
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
    while (!this.eindeGemaakt && this.genX < tot) {
      if (this.genX > this.levelLengte) { this.maakEinde(); break; }
      const voortgang = this.genX / this.levelLengte;
      const m = Math.min(1, voortgang * 0.7 + this.ronde * 0.15 + (this.th.id === 'berg' ? 0.15 : 0));
      if (Math.random() < 0.16 && this.genX > 900) this.segPilaar(m);
      else this.segPlatform(m);
    }
  }

  gatVoor(y, m) {
    const omhoog = this.genY - y;
    const max = omhoog > 30 ? 105 : 150;
    return Phaser.Math.Between(55, Math.round(70 + (max - 70) * (0.4 + 0.6 * m)));
  }

  segPlatform(m) {
    const y = Phaser.Math.Clamp(this.genY + Phaser.Math.Between(-80, 90), 230, 440);
    const x = this.genX + this.gatVoor(y, m);
    const p = this.maakPlatform(x, y, Phaser.Math.Between(140, 300 - Math.round(80 * m)));
    const w = p.displayWidth;
    if (w >= 170 && Math.random() < 0.35 + 0.35 * m) this.maakKruiper(x + w / 2, y, x, x + w);
    if (Math.random() < 0.22 + 0.3 * m) this.maakDwaallicht(x + w / 2, Phaser.Math.Between(110, Math.max(130, y - 110)));
    if (Math.random() < 0.3) this.rijShotjes(x + w / 2, y - 34, Phaser.Math.Between(2, 4));
    else if (Math.random() < 0.25 && y > 330) {
      // hoog bonusplatform: alleen te halen met dubbele sprong
      this.maakPlatform(x + w / 2 - 45, y - 175, 90);
      this.rijShotjes(x + w / 2, y - 205, 4);
    }
    this.genX = x + w; this.genY = y;
  }

  segPilaar(m) {
    // een zuil die uit het water steekt: bovenop kun je staan, aan de zijkant kun je wall jumpen
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

  maakEinde() {
    const y = Phaser.Math.Clamp(this.genY, 300, 420);
    const x = this.genX + 90;
    this.maakPlatform(x, y, 560);
    this.poort = this.physics.add.staticImage(x + 400, y + 2, 'poort').setOrigin(0.5, 1).setDepth(4);
    this.poort.refreshBody();
    this.poort.body.setSize(40, 170);
    this.physics.add.overlap(this.speler, this.poort, () => this.levelKlaar());
    this.eindX = x + 560;
    this.genX = this.eindX;
    this.eindeGemaakt = true;
  }

  opruimen() {
    const grens = this.camX - 250;
    for (const grp of [this.platforms, this.pilaren]) {
      grp.getChildren().slice().forEach(o => { if (o.x + o.displayWidth < grens) o.destroy(); });
    }
    for (const grp of [this.vijanden, this.shotjes]) {
      grp.getChildren().slice().forEach(o => { if (o.x < grens || o.y > 640) o.destroy(); });
    }
    this.pijlen.getChildren().slice().forEach(p => {
      p.leeft -= this.game.loop.delta / 1000;
      if (p.leeft <= 0 || p.x < grens || p.x > this.camX + 1100) p.destroy();
    });
  }

  // ---------- ELK MOMENT ----------
  update(time, delta) {
    const dt = Math.min(delta, 50) / 1000;
    this.tijd += dt;
    const inp = this.besturing.update(this.run.up.dash > 0);
    if (this.klaar || this.dood) { this.achtergrond.update(this.camX, this.tijd); return; }

    if (this.startVertraging > 0) this.startVertraging -= dt;
    else this.camX += (this.scrollSnelheid + 12 * (this.speler.x / this.levelLengte)) * dt;
    this.camX = Math.max(this.camX, this.speler.x - 960 * 0.55);
    this.camX = Math.min(this.camX, this.eindX - 900);
    this.cameras.main.scrollX = this.camX;

    this.genereer(this.camX + 960 + 400);
    this.opruimen();
    this.spelerUpdate(dt, inp);
    this.vijandenUpdate(dt);
    this.shotjesUpdate();
    this.updateHud();
    this.achtergrond.update(this.camX, this.tijd);
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
    const muurKant = muurL ? -1 : 1;
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
      // lopen
      if (this.muurLock <= 0) {
        b.velocity.x = Phaser.Math.Linear(b.velocity.x, inp.x * LOOPSNELHEID, opGrond ? 0.4 : 0.18);
        if (Math.abs(inp.x) > 0.2) this.kijk = Math.sign(inp.x);
      }
      // springen
      if (this.springBuffer > 0) {
        if (this.coyote > 0) {
          this.spring(SPRONG);
        } else if (aanMuur) {
          this.spring(-520);
          b.velocity.x = -muurKant * 320;
          this.muurLock = 0.18;
          this.kijk = -muurKant;
          this.vonken.explode(6, sp.x + muurKant * 10, sp.y - 20);
        } else if (this.extraSprongen > 0) {
          this.extraSprongen--;
          this.spring(-500);
          this.vonken.explode(8, sp.x, sp.y);
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

    // de linkerkant van het scherm duwt je vooruit
    if (sp.x < this.camX + 14) {
      if (muurR) { this.valSchade(); return; }
      sp.x = this.camX + 14;
      if (b.velocity.x < 0) b.velocity.x = 0;
    }
    if (sp.y > 600) { this.valSchade(); return; }

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
  }

  // ---------- AANVALLEN ----------
  doeSlash() {
    const sp = this.speler, lvl = this.run.up.slash;
    const bereik = 58 + 12 * lvl, schade = 1 + lvl;
    this.slashCd = 0.3; this.poseTimer = 0.16; this.poseVast = 'sp_slash';
    const fx = this.add.image(sp.x + this.kijk * 6, sp.y - 30, 'slash')
      .setDepth(12).setOrigin(this.kijk > 0 ? 0.2 : 0.8, 0.5).setFlipX(this.kijk < 0).setScale(bereik / 50);
    this.tweens.add({ targets: fx, alpha: 0, scale: fx.scale * 1.15, duration: 170, onComplete: () => fx.destroy() });
    const rect = new Phaser.Geom.Rectangle(this.kijk > 0 ? sp.x - 6 : sp.x - bereik + 6, sp.y - 64, bereik, 70);
    this.vijanden.getChildren().slice().forEach(v => {
      if (v.active && Phaser.Geom.Intersects.RectangleToRectangle(rect, v.getBounds())) this.raakVijand(v, schade, this.kijk);
    });
  }

  schiet() {
    const sp = this.speler, n = 1 + this.run.up.pijlen, boem = this.run.up.boem > 0;
    this.schietCd = 0.42; this.poseTimer = 0.16; this.poseVast = 'sp_schiet';
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
    this.vijanden.getChildren().slice().forEach(v => {
      if (v.active && Phaser.Math.Distance.Between(x, y, v.x, v.y - v.displayHeight / 2) < r + 20) {
        this.raakVijand(v, schade, Math.sign(v.x - x) || 1);
      }
    });
  }

  smashLanding() {
    this.smashing = false;
    const sp = this.speler, lvl = this.run.up.smash;
    const r = 70 + 25 * lvl, schade = 1 + lvl;
    this.cameras.main.shake(140, 0.01);
    const ring = this.add.ellipse(sp.x, sp.y, r * 2, r * 0.6).setStrokeStyle(4, 0xf3ead6).setDepth(12).setScale(0.2);
    this.tweens.add({ targets: ring, scale: 1, alpha: 0, duration: 280, onComplete: () => ring.destroy() });
    this.vonken.explode(18, sp.x, sp.y);
    this.vijanden.getChildren().slice().forEach(v => {
      if (v.active && Math.abs(v.x - sp.x) < r && Math.abs(v.y - sp.y) < 80) this.raakVijand(v, schade, Math.sign(v.x - sp.x) || 1);
    });
    this.onkwetsbaar = Math.max(this.onkwetsbaar, 0.2);
  }

  raakVijand(v, schade, richting) {
    if (!v.active || v.hp <= 0) return;
    v.hp -= schade;
    v.setTintFill(0xffffff);
    this.time.delayedCall(70, () => { if (v.active) v.clearTint(); });
    if (v.soort === 'kruiper') { v.body.setVelocity(richting * 180, -180); v.verdoofd = 0.3; }
    else v.x += richting * 14;
    if (v.hp <= 0) {
      const my = v.y - (v.soort === 'kruiper' ? 20 : 0);
      this.vonken.explode(16, v.x, my);
      this.dropShotjes(v.x, my, v.shots);
      v.destroy();
    }
  }

  dropShotjes(x, y, n) {
    for (let i = 0; i < n; i++) {
      const s = this.shotjes.create(x, y, 'shotje').setDepth(8);
      s.body.setSize(14, 18);
      s.setBounce(0.45);
      s.setDragX(90);
      s.setVelocity(Phaser.Math.Between(-130, 130), Phaser.Math.Between(-420, -250));
    }
  }

  // ---------- VIJANDEN EN SHOTJES ----------
  vijandenUpdate(dt) {
    const sp = this.speler;
    this.vijanden.getChildren().forEach(v => {
      if (!v.active) return;
      if (v.soort === 'kruiper') {
        if (v.verdoofd > 0) { v.verdoofd -= dt; return; }
        if (v.x < v.minX) v.richting = 1; else if (v.x > v.maxX) v.richting = -1;
        v.body.velocity.x = v.richting * v.snelheid;
        v.setFlipX(v.richting > 0);
      } else {
        v.fase += dt;
        const dx = sp.x - v.x, dy = (sp.y - 40) - v.basisY;
        if (Math.abs(dx) < 340) {
          v.x += Math.sign(dx) * 48 * dt;
          v.basisY += Math.sign(dy) * Math.min(Math.abs(dy), 30 * dt);
        }
        v.y = v.basisY + Math.sin(v.fase * 2.2) * 16;
        v.setFlipX(dx > 0);
      }
    });
  }

  shotjesUpdate() {
    const sp = this.speler;
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
    this.run.shotjes++;
    if (this.run.shotjes >= 10) {
      this.run.shotjes -= 10;
      this.run.flessen++;
      this.popTekst('Flesje vol!');
      this.tweens.add({ targets: [this.flesGlas, this.flesBier, this.flesRand], scale: 1.25, yoyo: true, duration: 150 });
    }
  }

  // ---------- SCHADE ----------
  spelerRaakt(v) {
    if (!v.active || this.dood || this.klaar) return;
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
    if (this.run.harten <= 0) { this.gameOver(); return; }
    this.respawn();
  }

  respawn() {
    const sp = this.speler, b = sp.body;
    let beste = null, besteAfstand = Infinity;
    this.platforms.getChildren().forEach(p => {
      const l = p.x, r = p.x + p.displayWidth;
      if (r < this.camX + 140 || l > this.camX + 720) return;
      const afstand = Math.abs((l + r) / 2 - (this.camX + 320));
      if (afstand < besteAfstand) { beste = p; besteAfstand = afstand; }
    });
    if (beste) sp.setPosition(Phaser.Math.Clamp(this.camX + 320, beste.x + 20, beste.x + beste.displayWidth - 20), beste.y - 2);
    else sp.setPosition(this.camX + 320, 100);
    b.setVelocity(0, 0);
    b.setAllowGravity(true);
    this.dashTijd = 0; this.smashing = false;
    this.onkwetsbaar = 1.6; this.knipper = 1.6;
  }

  meters() { return this.run.meters + Math.max(0, Math.floor(this.speler.x / 20)); }

  gameOver() {
    this.dood = true;
    this.physics.pause();
    this.speler.setTint(0x555577);
    const meters = this.meters();
    this.add.text(480, 230, 'Oei!', {
      fontFamily: FONT_TITEL, fontSize: '64px', color: '#d1495b', stroke: '#0a1028', strokeThickness: 8,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(150);
    this.time.delayedCall(1100, () => this.scene.start('GameOver', { meters }));
  }

  levelKlaar() {
    if (this.klaar || this.dood) return;
    this.klaar = true;
    this.physics.pause();
    this.run.meters += Math.floor(this.levelLengte / 20);
    this.run.harten = Math.min(maxHarten(this.run), this.run.harten + 1);
    this.add.text(480, 220, 'Level gehaald!', {
      fontFamily: FONT_TITEL, fontSize: '56px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 8,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(150);
    this.time.delayedCall(1300, () => this.scene.start('Winkel', { run: this.run }));
  }

  // ---------- HUD (hartjes, flesje, meters) ----------
  maakHud() {
    const vast = o => o.setScrollFactor(0).setDepth(100);
    this.hartIcons = [];
    for (let i = 0; i < 8; i++) this.hartIcons.push(vast(this.add.image(28 + i * 28, 26, 'hart')));
    this.flesGlas = vast(this.add.image(30, 84, 'fles_glas'));
    this.flesBier = vast(this.add.image(30, 84, 'fles_bier'));
    this.flesRand = vast(this.add.image(30, 84, 'fles_rand'));
    const stijl = { fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 5 };
    this.flesTekst = vast(this.add.text(52, 66, '', stijl));
    this.shotTekst = vast(this.add.text(52, 94, '', { ...stijl, fontSize: '15px', color: '#f2c14e' }));
    this.dashG = vast(this.add.graphics());
    this.levelTekst = vast(this.add.text(940, 12, this.th.naam, { ...stijl, fontFamily: FONT_TITEL, fontSize: '26px', color: '#f2c14e' }).setOrigin(1, 0));
    this.meterTekst = vast(this.add.text(940, 46, '', stijl).setOrigin(1, 0));
  }

  popTekst(t) {
    const tx = this.add.text(60, 130, t, {
      fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 5,
    }).setScrollFactor(0).setDepth(120);
    this.tweens.add({ targets: tx, y: 110, alpha: 0, delay: 600, duration: 500, onComplete: () => tx.destroy() });
  }

  updateHud() {
    const max = maxHarten(this.run);
    this.hartIcons.forEach((h, i) => { h.setVisible(i < max); h.setTexture(i < this.run.harten ? 'hart' : 'hart_leeg'); });
    const vul = Math.round(70 * this.run.shotjes / 10);
    this.flesBier.setCrop(0, 74 - vul, 32, vul);
    this.flesBier.setVisible(vul > 0);
    this.flesTekst.setText('× ' + this.run.flessen);
    this.shotTekst.setText(this.run.shotjes + '/10 shotjes');
    this.meterTekst.setText(this.meters() + ' m');
    this.dashG.clear();
    const maxDash = [0, 1, 1, 2, 2, 3][this.run.up.dash];
    for (let i = 0; i < maxDash; i++) {
      this.dashG.fillStyle(0x3cc8bb, i < this.dashLading ? 1 : 0.2);
      this.dashG.fillCircle(58 + i * 16, 124, 5);
    }
  }
}
