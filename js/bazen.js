// De eindbazen: hun arena, aanvallen, ritme en kogels.

// Elke baas heeft een eigen speciale aanval en een eigen RITME: de pauzes tussen zijn aanvallen.
const BAZEN = {
  // kort, kort, lang
// kracht: hoe snel en fel hij is (elke baas is sterker dan de vorige).
// woest: zijn speciale aanval, die hij vaker doet als hij woedend is (onder de helft van zijn hartjes).
  pad: { hp: 40, kracht: 1, woest: 'tong', aanvallen: ['hophop', 'tong', 'bubbels', 'tong'], ritme: [0.5, 0.5, 1.8] },
  // traag, traag, snel
  beer: { hp: 65, kracht: 1.15, woest: 'glijden', aanvallen: ['glijden', 'pegels', 'blokjes', 'glijden'], ritme: [1.4, 1.4, 0.4] },
  // snel-snel-snel, lange pauze
  geit: { hp: 90, kracht: 1.3, woest: 'bergsprong', aanvallen: ['ren', 'vaten', 'bergsprong', 'ren', 'vaten'], ritme: [0.4, 0.4, 0.4, 2.2] },
  // steeds sneller
  // snel, snel, snel, snel... en dan even wachten
  salamander: { hp: 150, kracht: 1.6, woest: 'tong', aanvallen: ['kruip', 'tong', 'kruip', 'kruip', 'tong'], ritme: [0.3, 0.6, 0.3, 0.3, 1.2] },
  // elke 5 seconden geen zwaartekracht (dat regelt hij zelf); daartussen pikken en veren gooien
  lepelaar: { hp: 170, kracht: 1.7, woest: 'veren', aanvallen: ['pik', 'veren', 'pik'], ritme: [0.6, 0.6, 1.0] },
  draak: { hp: 120, kracht: 1.45, woest: 'spiraal', aanvallen: ['vuur', 'spiraal', 'duik', 'lava', 'spiraal'], ritme: [1.4, 1.2, 1.0, 0.8, 0.6] },
};

class BaasDeel {
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
    const vliegt = soort === 'draak' || soort === 'salamander';
    const b = this.vijanden.create(vliegt ? 720 : 760, vliegt ? 150 : 468, 'baas_' + soort).setDepth(9);
    b.setOrigin(0.5, vliegt ? 0.5 : 1);
    const w = b.width, h = b.height;
    b.body.setSize(w * 0.62, h * 0.66).setOffset(w * 0.19, h * (vliegt ? 0.2 : 0.32));
    b.soort = 'baas'; b.baas = soort; b.vliegt = vliegt;
    b.hp = b.maxHp = Math.round(info.hp * (1 + this.ronde * 0.6));
    b.aanvallen = info.aanvallen.slice(); b.ritme = info.ritme; b.beurt = 0;
    b.kracht = info.kracht; b.woest = info.woest; b.woedend = false;
    b.status = 'wacht'; b.timer = 2.2; b.t = 0; b.shots = 0;
    if (vliegt) { b.body.setAllowGravity(false); b.body.setImmovable(true); }
    if (soort === 'salamander') { b.setOrigin(0.5); b.rand = 0; b.doelRand = 0.5; b.loopRichting = 1; b.status = 'kruip'; }
    if (soort === 'lepelaar') b.zwaarteT = 5;
    this.baas = b;

    const vast = o => o.setScrollFactor(0).setDepth(100);
    this.baasBalk = vast(this.add.graphics());
    this.tongG = this.add.graphics().setDepth(10);
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
    // woedefase: onder de helft van zijn hartjes wordt hij boos en doet hij zijn speciale aanval vaker
    if (!b.woedend && b.hp < b.maxHp / 2) {
      b.woedend = true;
      b.aanvallen.splice(1, 0, b.woest);
      this.baasRoep('Hij wordt WOEDEND!');
      this.cameras.main.shake(300, 0.012);
      Geluid.effect('baasWeg');
      b.setTint(0xff9a9a);
    }
    const woede = (b.kracht + this.ronde * 0.25 + (1 - b.hp / b.maxHp) * 0.5) * (b.woedend ? 1.25 : 1);
    const naar = Math.sign(sp.x - b.x) || -1;
    b.t += dt;
    b.timer -= dt * woede;

    // de tong van de pad: een roze lijn van zijn mond naar het puntje
    this.tongG.clear();
    if (this.tong && this.tong.active) {
      const m = b.baas === 'salamander' ? this.salamanderMond(b) : { x: b.x + (b.flipX ? 40 : -40), y: b.y - 62 };
      this.tongG.lineStyle(9, 0x0a1028, 1).lineBetween(m.x, m.y, this.tong.x, this.tong.y);
      this.tongG.lineStyle(5, 0xff7aa8, 1).lineBetween(m.x, m.y, this.tong.x, this.tong.y);
    }
    if (b.baas === 'salamander') { this.salamanderUpdate(b, dt, woede); return; }
    if (b.baas === 'lepelaar' && this.lepelaarZwaarte(b, dt)) return;

    if (b.vliegt) {
      if (b.status !== 'duik' && b.status !== 'spiraal') {
        b.x = 480 + Math.sin(b.t * 0.6) * 300;
        b.y = 140 + Math.sin(b.t * 1.4) * 40;
      }
      b.setFlipX(naar > 0);
    } else if (b.status === 'wacht') {
      b.setFlipX(naar > 0);
      b.body.velocity.x *= 0.85;
    }

    const opGrond = b.body && b.body.enable && (b.body.blocked.down || b.body.touching.down);
    if (b.status === 'springt' && b.t > 0.25 && opGrond) {
      this.schokgolf(b.x);
      b.status = 'wacht'; b.timer = this.pauze(b);
    }
    // Hop-hop-HOP: twee kleine sprongetjes, dan een grote met een schokgolf
    if (b.status === 'hophop' && b.t > 0.2 && opGrond) {
      b.hops--;
      b.t = 0;
      if (b.hops > 0) {
        const groot = b.hops === 1;
        b.setFlipX(naar > 0);
        b.body.setVelocity(Phaser.Math.Clamp((sp.x - b.x) * (groot ? 1.1 : 0.6), -420, 420), groot ? -760 : -380);
        this.vonken.explode(6, b.x, 468);
        Geluid.effect(groot ? 'dubbel' : 'spring');
      } else {
        this.schokgolf(b.x);
        b.status = 'wacht'; b.timer = this.pauze(b);
      }
    }
    if (b.status === 'rent') {
      if (b.body.blocked.left || b.body.blocked.right || b.t > 2.4) {
        this.cameras.main.shake(160, 0.008);
        Geluid.effect('smash');
        b.status = 'wacht'; b.timer = this.pauze(b); b.body.setVelocityX(0);
      }
    }
    // Buikglijden: stuitert 3 keer tegen de muren
    if (b.status === 'glijdt') {
      b.body.setVelocityX(b.richting * b.glijSnelheid);
      if ((b.body.blocked.left && b.richting < 0) || (b.body.blocked.right && b.richting > 0)) {
        b.richting *= -1; b.muren++;
        b.setFlipX(b.richting > 0);
        this.cameras.main.shake(120, 0.008);
        Geluid.effect('smash');
        this.vonken.explode(10, b.x + b.richting * -60, 440);
      }
      if (b.muren >= 3 || b.t > 5) {
        b.setScale(1); b.body.setVelocityX(0);
        b.status = 'wacht'; b.timer = this.pauze(b);
      }
    }
    if (b.status !== 'wacht' || b.timer > 0) return;

    const aanval = b.aanvallen[b.beurt % b.aanvallen.length];
    b.beurt++;
    b.t = 0;
    b.status = 'bezig';
    const klaar = (s) => this.time.delayedCall(s * 1000, () => { if (b.active && b.status === 'bezig') { b.status = 'wacht'; b.timer = this.pauze(b); } });

    if (aanval === 'hophop') {
      this.baasRoep('Hop-hop-HOP!');
      b.status = 'hophop'; b.hops = 3;
      b.setFlipX(naar > 0);
      b.body.setVelocity(Phaser.Math.Clamp((sp.x - b.x) * 0.6, -420, 420), -380);
      Geluid.effect('spring');
    } else if (aanval === 'tong') {
      // Tongslurp: de tong schiet naar je uit en komt weer terug
      this.baasRoep('Tongslurp!');
      b.setFlipX(naar > 0);
      const k = this.kogel('tong', b.x + naar * 40, b.y - 62, naar * 950, 0, 0);
      k.tong = true; k.leeft = 0.75; k.golf = true; // blijft heel als hij je raakt
      this.tong = k;
      Geluid.effect('duik');
      this.time.delayedCall(330, () => { if (k.active) k.setVelocityX(-naar * 950); });
      klaar(1.0);
    } else if (aanval === 'glijden') {
      this.baasRoep('Buikglijden!');
      b.status = 'glijdt'; b.muren = 0; b.richting = naar;
      b.glijSnelheid = 520 * Math.min(1.4, woede);
      b.setFlipX(naar > 0).setScale(1.25, 0.6);
      Geluid.effect('dash');
    } else if (aanval === 'bergsprong') {
      // Bergsprong: weg uit beeld, schaduw waar jij staat, en dan BOEM naar beneden
      this.baasRoep('Bergsprong!');
      b.status = 'berg';
      b.body.enable = false;
      Geluid.effect('dubbel');
      this.tweens.add({
        targets: b, y: -180, duration: 450, ease: 'Quad.easeOut',
        onComplete: () => {
          if (!b.active) return;
          const x = Phaser.Math.Clamp(this.speler.x, 90, 870);
          b.x = x; b.setFlipX(false);
          this.waarschuwing(x, 0.8, () => {
            this.tweens.add({
              targets: b, y: 468, duration: 260, ease: 'Quad.easeIn',
              onComplete: () => {
                if (!b.active) return;
                b.body.enable = true; b.body.reset(b.x, b.y);
                this.schokgolf(b.x);
                b.status = 'wacht'; b.timer = this.pauze(b);
              },
            });
          });
        },
      });
    } else if (aanval === 'spiraal') {
      // Vuurspiraal: naar het midden vliegen en vuurballen in een rondje schieten
      this.baasRoep('Vuurspiraal!');
      b.status = 'spiraal';
      this.tweens.add({ targets: b, x: 480, y: 150, duration: 450, ease: 'Sine.easeInOut' });
      for (let golf = 0; golf < 2; golf++) {
        for (let i = 0; i < 12; i++) {
          this.time.delayedCall(500 + golf * 700 + i * 45, () => {
            if (!b.active || this.gewonnen) return;
            const hoek = i * TAU / 12 + golf * 0.26;
            this.kogel('vuurbal', b.x, b.y, Math.cos(hoek) * 250, Math.sin(hoek) * 250, 0);
            if (i % 3 === 0) Geluid.effect('schiet');
          });
        }
      }
      this.time.delayedCall(2100, () => {
        if (b.active && b.status === 'spiraal') { b.status = 'wacht'; b.timer = this.pauze(b); b.t = Math.asin(Phaser.Math.Clamp((b.x - 480) / 300, -1, 1)) / 0.6; }
      });
    } else if (aanval === 'pik') {
      // de lepelaar rent op je af en pikt met zijn lepelsnavel
      this.baasRoep('Lepelpik!');
      b.status = 'rent';
      b.setFlipX(naar > 0);
      b.body.setVelocity(naar * 480 * Math.min(1.5, woede), -200);
      Geluid.effect('dash');
    } else if (aanval === 'veren') {
      // een waaier van scherpe veren
      for (let i = 0; i < 7; i++) {
        const hoek = -Math.PI / 2 + (i - 3) * 0.32;
        this.kogel('veer', b.x, b.y - 100, Math.cos(hoek) * 300, Math.sin(hoek) * 300, 600).setRotation(hoek);
      }
      Geluid.effect('schiet');
      klaar(1.0);
    } else if (aanval === 'sprong') {
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
        onComplete: () => { if (b.active) { b.status = 'wacht'; b.timer = this.pauze(b); b.t = Math.asin(Phaser.Math.Clamp((b.x - 480) / 300, -1, 1)) / 0.6; } },
      });
    }
  }

  // pauze na een aanval, volgens het ritme van deze baas
  pauze(b) { return b.ritme[(b.beurt - 1 + b.ritme.length) % b.ritme.length]; }

  // naam van de speciale aanval groot in beeld
  baasRoep(tekst) {
    const t = this.add.text(480, 78, tekst, {
      fontFamily: FONT_TITEL, fontSize: '34px', color: '#ff8a8a', stroke: '#0a1028', strokeThickness: 7,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(150).setScale(0.4);
    this.tweens.add({ targets: t, scale: 1, duration: 200, ease: 'Back.easeOut' });
    this.tweens.add({ targets: t, alpha: 0, delay: 900, duration: 300, onComplete: () => t.destroy() });
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
    if (k.tong && this.baas) {
      // de tong trekt je naar de baas toe
      const b = this.baas, sp = this.speler;
      this.schade(Math.sign(b.x - sp.x) || 1);
      const d = Math.hypot(b.x - sp.x, b.y - sp.y) || 1;
      sp.body.setVelocity((b.x - sp.x) / d * 520, (b.y - sp.y) / d * 520 - 120);
      k.destroy();
      if (b.baas === 'salamander') {
        // ...en dan bijt de salamander
        this.time.delayedCall(420, () => {
          if (!b.active || this.dood || this.gewonnen) return;
          if (Phaser.Math.Distance.Between(b.x, b.y, sp.x, sp.y - 20) < 170) {
            this.onkwetsbaar = 0;
            this.schade(Math.sign(sp.x - b.x) || 1);
            this.popTekst('HAP!');
            Geluid.effect('baasRaak');
          }
        });
      }
      return;
    }
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
    // de beloning: flink wat flesjes, en de eerste keer een baas-skin met een kroon
    const flesjes = baasBeloning(this.n);
    PROFIEL.flessen += flesjes;
    PROFIEL.bazen = (PROFIEL.bazen || 0) + 1;
    const skin = SKINS.find(k => k.baas === b.baas);
    const nieuweSkin = skin && !PROFIEL.skins.includes(skin.id);
    if (nieuweSkin) PROFIEL.skins.push(skin.id);
    bewaarProfiel();
    this.toonBeloning(flesjes, nieuweSkin ? skin : null);
    this.time.delayedCall(5500, () => {
      Geluid.effect('regio');
      // je upgrade blijft, want het is nog hetzelfde potje
      this.scene.start('Spel', { run: { level: this.n + 1, up: PROFIEL.up, harten: hartenMet(this.run.keuze), baas: false, keuze: this.run.keuze } });
    });
  }
}
// Het beloningsscherm na het verslaan van een eindbaas
BaasDeel.prototype.toonBeloning = function (flesjes, skin) {
  const vast = o => o.setScrollFactor(0).setDepth(160);
  const bord = vast(this.add.graphics());
  bord.fillStyle(0x0a1028, 0.88).fillRoundedRect(250, 90, 460, 330, 24);
  bord.lineStyle(5, 0xf2c14e, 1).strokeRoundedRect(250, 90, 460, 330, 24);
  const delen = [bord];
  delen.push(vast(this.add.text(480, 112, 'Baas verslagen!', {
    fontFamily: FONT_TITEL, fontSize: '44px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 8,
  }).setOrigin(0.5, 0)));
  const fles = vast(this.add.text(480, 180, '+' + flesjes + ' flesjes!', {
    fontFamily: FONT, fontSize: '34px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 6,
  }).setOrigin(0.5, 0).setScale(0.2));
  delen.push(fles);
  this.tweens.add({ targets: fles, scale: 1, delay: 300, duration: 400, ease: 'Back.easeOut' });
  if (skin) {
    const img = vast(this.add.image(480, 372, 'skin_' + skin.id).setOrigin(0.5, 1).setScale(0.55).setAlpha(0));
    const t = vast(this.add.text(480, 380, 'Nieuwe skin: ' + skin.naam + ' ♛', {
      fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: '#3cc8bb', stroke: '#0a1028', strokeThickness: 5,
    }).setOrigin(0.5, 0).setAlpha(0));
    delen.push(img, t);
    this.tweens.add({ targets: [img, t], alpha: 1, delay: 900, duration: 400 });
    this.tweens.add({ targets: img, y: 362, yoyo: true, repeat: -1, delay: 1300, duration: 500, ease: 'Sine.easeInOut' });
  } else {
    delen.push(vast(this.add.text(480, 270, 'Op naar ' + levelNaam(this.n + 1) + '!', {
      fontFamily: FONT_TITEL, fontSize: '32px', color: '#3cc8bb', stroke: '#0a1028', strokeThickness: 6,
    }).setOrigin(0.5)));
  }
  // confetti van shotjes en vonken
  for (let i = 0; i < 40; i++) {
    const c = vast(this.add.image(Phaser.Math.Between(80, 880), -20, i % 3 ? 'vonk' : 'shotje').setScale(i % 3 ? 2 : 1));
    this.tweens.add({ targets: c, y: 560, angle: Phaser.Math.Between(-360, 360), delay: Phaser.Math.Between(0, 1500), duration: Phaser.Math.Between(1500, 2600), onComplete: () => c.destroy() });
  }
  this.time.delayedCall(1500, () => Geluid.effect('prijs'));
};
// ---------- DE SALAMANDER ----------
// Kruipt rond over de vloer, de muren en het plafond van de arena.
// rand = plek op de rand (0 tot 1, met de klok mee: plafond, rechtermuur, vloer, linkermuur)
const SAL = { L: 44, R: 916, T: 104, B: 440 };
function salamanderPlek(p) {
  const W = SAL.R - SAL.L, H = SAL.B - SAL.T, P = 2 * (W + H);
  let d = ((p % 1) + 1) % 1 * P;
  if (d < W) return { x: SAL.L + d, y: SAL.T, hoek: 0 };
  d -= W; if (d < H) return { x: SAL.R, y: SAL.T + d, hoek: Math.PI / 2 };
  d -= H; if (d < W) return { x: SAL.R - d, y: SAL.B, hoek: Math.PI };
  d -= W; return { x: SAL.L, y: SAL.B - d, hoek: -Math.PI / 2 };
}
function salamanderRand(x, y) {
  // de dichtstbijzijnde plek op de rand bij (x, y)
  let best = 0, bestD = Infinity;
  for (let i = 0; i < 200; i++) { const p = salamanderPlek(i / 200), d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bestD) { bestD = d; best = i / 200; } }
  return best;
}
BaasDeel.prototype.salamanderMond = function (b) {
  const hoek = b.rotation + (b.flipX ? 0 : Math.PI);
  return { x: b.x + Math.cos(hoek) * 80, y: b.y + Math.sin(hoek) * 80 };
};
BaasDeel.prototype.salamanderVlucht = function (b) {
  if (b.status === 'vlucht') return;
  // geraakt: vlucht naar de andere kant van de arena
  b.status = 'vlucht';
  b.doelRand = b.rand + 0.5;
  Geluid.effect('dash');
};
BaasDeel.prototype.salamanderUpdate = function (b, dt, woede) {
  const sp = this.speler;
  b.timer -= dt * woede;
  if (b.status === 'kruip' || b.status === 'vlucht') {
    // naar het doel kruipen langs de rand, de kortste kant op
    let verschil = b.doelRand - b.rand;
    if (b.status !== 'vlucht') verschil = ((verschil + 0.5) % 1 + 1) % 1 - 0.5;
    const stap = (b.status === 'vlucht' ? 0.55 : 0.28) * woede * dt;
    if (Math.abs(verschil) <= stap) {
      const wasVlucht = b.status === 'vlucht';
      b.rand = ((b.doelRand % 1) + 1) % 1;
      b.status = 'wacht'; b.timer = wasVlucht ? 0.2 : this.pauze(b);
    } else {
      b.loopRichting = Math.sign(verschil);
      b.rand += b.loopRichting * stap;
    }
  }
  const p = salamanderPlek(b.rand);
  b.setPosition(p.x, p.y);
  b.setRotation(p.hoek + Math.PI);
  b.setFlipX(b.loopRichting < 0);
  b.body.reset(p.x, p.y);
  if (b.status !== 'wacht' || b.timer > 0) return;

  const aanval = b.aanvallen[b.beurt % b.aanvallen.length];
  b.beurt++;
  if (aanval === 'kruip') {
    // snel naar een andere plek
    b.status = 'kruip';
    b.doelRand = Math.random() < 0.5 ? salamanderRand(sp.x, sp.y) + Phaser.Math.FloatBetween(-0.15, 0.15) : Math.random();
  } else if (aanval === 'tong') {
    this.baasRoep('Tongslurp!');
    const m = this.salamanderMond(b);
    const d = Math.hypot(sp.x - m.x, sp.y - 30 - m.y) || 1;
    const vx = (sp.x - m.x) / d * 900, vy = (sp.y - 30 - m.y) / d * 900;
    const k = this.kogel('tong', m.x, m.y, vx, vy, 0);
    k.tong = true; k.leeft = 0.8; k.golf = true;
    this.tong = k;
    Geluid.effect('duik');
    this.time.delayedCall(360, () => { if (k.active) k.setVelocity(-vx, -vy); });
    b.status = 'bezig';
    this.time.delayedCall(900, () => { if (b.active && b.status === 'bezig') { b.status = 'wacht'; b.timer = this.pauze(b); } });
  }
};

// ---------- DE LEPELAAR ----------
// Elke 5 seconden haalt hij 3 seconden de zwaartekracht weg en stuitert hij als een flipperbal rond.
// Geeft true terug als hij aan het flipperen is (dan doet hij verder niks).
BaasDeel.prototype.lepelaarZwaarte = function (b, dt) {
  if (b.flipper > 0) {
    b.flipper -= dt;
    const v = b.body.velocity;
    if ((b.x < 80 && v.x < 0) || (b.x > 880 && v.x > 0)) { v.x *= -1; this.cameras.main.shake(80, 0.005); }
    if ((b.y < 170 && v.y < 0) || (b.y > 468 && v.y > 0)) { v.y *= -1; this.cameras.main.shake(80, 0.005); }
    b.angle += dt * 720;
    if (b.flipper <= 0) {
      this.physics.world.gravity.y = 1500;
      b.body.setAllowGravity(true); b.angle = 0;
      b.status = 'wacht'; b.timer = 0.8; b.zwaarteT = 5;
      this.baasRoep('Zwaartekracht terug!');
    }
    return true;
  }
  b.zwaarteT -= dt;
  if (b.zwaarteT <= 0 && b.status === 'wacht') {
    b.flipper = 3;
    b.status = 'flipper';
    this.physics.world.gravity.y = 0;
    b.body.setAllowGravity(false);
    const r = Math.random() < 0.5 ? -1 : 1;
    b.body.setVelocity(r * 520, -460);
    this.speler.body.setVelocityY(Math.min(this.speler.body.velocity.y, -120));
    this.baasRoep('Geen zwaartekracht!');
    Geluid.effect('duik');
    return true;
  }
  return false;
};

voegToeAanSpel(BaasDeel);
