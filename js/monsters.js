// Alle gewone monsters: maken (per regio) en wat ze elk moment doen.
// Rivier: kruiper + dwaallicht. IJsvlakte: ijsklontje + pinguïn-ober.
// Bergen: rollend fust + hopvleermuis. Vulkaan: lavalager + brouwketel-golem.
// Overal (zeldzaam): het gouden flesje met pootjes.

// Hoe versla je hem? Staat er niks, dan kan alles.
// 'slash' = alleen slaan, 'pijl' = alleen schieten, 'stamp' = alleen erbovenop springen
const ZWAK = {
  klont: 'slash', klontje: 'slash', pinguin: 'pijl', vriesvlok: 'pijl', vliegpinguin: 'pijl',
  fust: 'stamp', vleermuis: 'slash', adelaar: 'slash',
  lava: 'pijl', golem: 'stamp', vuurmot: 'slash', ptero: 'stamp',
  neushoorn: 'pijl',
  darter: 'slash', uitsmijter: 'stamp', bierpul: 'pijl',
  robot: 'slash', stoomketel: 'stamp', drone: 'pijl',
  wipkip: 'stamp', zandmonster: 'slash', ballon: 'pijl',
  alien: 'slash', kraterkruiper: 'stamp', ufo: 'pijl',
};
const ZWAK_TEKST = { slash: 'Alleen slaan! ⚔', pijl: 'Alleen schieten! ➶', stamp: 'Spring erop! ⤓', boven: 'Wacht tot hij boven is!' };

class MonsterDeel {
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
    } else if (id === 'grot') {
      this.maakMol(x + w / 2, y, x, x + w);
    } else if (id === 'savanne') {
      this.maakNeushoorn(x + w / 2, y, x, x + w);
    } else if (NIEUW_GROND[id]) {
      // kroeg, fabriek, speeltuin, maan: kies een van de twee grondmonsters
      const [a, b] = NIEUW_GROND[id];
      this.maakNieuwLoper(r < 0.5 ? a : b, x + w / 2, y, x, x + w);
    } else {
      this.maakKruiper(x + w / 2, y, x, x + w);
    }
  }

  maakLuchtVijand(x, y, w) {
    const id = this.reg.id, hoog = Phaser.Math.Between(110, Math.max(130, y - 110));
    // elke regio heeft zijn eigen vliegende monster
    if (id === 'ijs') this.maakVlieger('vliegpinguin', 'vliegpinguin', x + w / 2, hoog);
    else if (id === 'berg') this.maakVlieger('adelaar', 'adelaar', x + w / 2, Phaser.Math.Between(80, 140));
    else if (id === 'vulkaan') this.maakVlieger('ptero', 'ptero', x + w / 2, hoog);
    else if (id === 'grot') { if (y <= 420) this.maakVleermuis(x + w / 2, y + 48); }
    else if (NIEUW_LUCHT[id]) this.maakVlieger(NIEUW_LUCHT[id], NIEUW_LUCHT[id], x + w / 2, hoog);
    else if (id === 'savanne') {
      // gieren komen in groepjes, maar minder vaak (een groep telt als 4 gewone vliegers)
      if (Math.random() < 0.25) {
        const n = Phaser.Math.Between(2, 3);
        for (let i = 0; i < n; i++) {
          const g = this.maakVlieger('gier', 'gier', x + w / 2 + i * 50, hoog - i * 30);
          g.jaagSnelheid *= 2.5;
        }
      }
    }
    else this.maakVlieger('vliegvis', 'vliegvis', x + w / 2, hoog);
  }

  // Monsters van de kroeg, fabriek, speeltuin en maan (lopen over een platform)
  maakNieuwLoper(soort, x, y, minX, maxX) {
    const L = this.moeilijkheid(x), inf = NIEUW_INFO[soort];
    const v = this.maakLoper(soort, soort, x, y, minX, maxX, inf.bw, inf.bh);
    v.hp = inf.hp + Math.floor(L * inf.erbij);
    v.snelheid = inf.snel + Math.min(40, L * 6);
    v.shots = inf.shots;
    v.actieT = 1 + Math.random() * 1.5;
    if (soort === 'zandmonster') { v.verstopt = true; v.setAlpha(0.5).setScale(1, 0.5); }
    return v;
  }

  // Grot: een mol met een mijnlamp. Graaft onder de grond en komt dan boven.
  maakMol(x, y, minX, maxX) {
    const L = this.moeilijkheid(x);
    const v = this.maakLoper('mol', 'mol', x, y, minX, maxX, 34, 34);
    v.hp = 2 + Math.floor(L * 0.6);
    v.snelheid = 90 + Math.min(50, L * 8);
    v.onder = true; v.molT = 1 + Math.random(); v.shots = 3;
    v.setAlpha(0.35).setScale(1, 0.4);
  }

  // Savanne: een neushoorn die op je af stormt
  maakNeushoorn(x, y, minX, maxX) {
    const L = this.moeilijkheid(x);
    const v = this.maakLoper('neushoorn', 'neushoorn', x, y, minX, maxX, 54, 38);
    v.hp = 3 + Math.floor(L * 0.8);
    v.snelheid = 40; v.storm = 0; v.rust = 0; v.shots = 4;
  }

  // een vliegend monster (zonder zwaartekracht)
  maakVlieger(key, soort, x, y) {
    const L = this.moeilijkheid(x);
    const v = this.vijanden.create(x, y, key).setOrigin(0.5).setDepth(9);
    v.body.setAllowGravity(false);
    v.body.setSize(v.width * 0.7, v.height * 0.7);
    v.soort = soort;
    v.hp = 1 + Math.floor(L * 0.5);
    v.basisY = y; v.fase = Math.random() * 6; v.shots = 3;
    v.jaagSnelheid = 50 + Math.min(50, L * 8);
    v.schietT = 2 + Math.random();
    return v;
  }

  // je raakt hem op de verkeerde manier: ketst af
  ketst(v, zwak) {
    this.vonken.explode(4, v.x, v.getCenter().y);
    Geluid.effect('tink');
    if ((v.ketsT || 0) > this.tijd) return;
    v.ketsT = this.tijd + 1.2;
    const t = this.add.text(v.x, v.getTopCenter().y - 26, ZWAK_TEKST[zwak], {
      fontFamily: FONT, fontSize: '16px', fontStyle: 'bold', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets: t, y: t.y - 24, alpha: 0, delay: 500, duration: 500, onComplete: () => t.destroy() });
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
    statTel('goud'); statTel('flessenTotaal');
    bewaarProfiel();
    checkPrestaties(this);
    this.popTekst('Gouden flesje! +1 flesje');
    Geluid.effect('flesVol');
    this.tweens.add({ targets: [this.flesGlas, this.flesBier, this.flesRand], scale: 1.25, yoyo: true, duration: 150 });
  }

  // het lavalager ontploft
  lavaBoem(v) {
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
      // teken boven het monster: zo zie je hoe je hem verslaat
      const zwak = ZWAK[v.soort];
      if (zwak && !v.badge) {
        v.badge = this.add.image(v.x, v.y, 'zwak_' + zwak).setDepth(13);
        v.once('destroy', () => v.badge.destroy());
      }
      if (v.badge) v.badge.setPosition(v.x, v.getTopCenter().y - 14);
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
            if (v.lont <= 0) this.lavaBoem(v);
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
        } else if (v.soort === 'mol') {
          // onder de grond naar je toe graven, dan boven komen (alleen dan kun je hem raken)
          v.molT -= dt;
          if (v.onder) {
            if (Math.abs(dx) > 8) v.richting = Math.sign(dx);
            patrouille(v, 1);
            if (v.molT <= 0) {
              v.onder = false; v.molT = 1.4; v.body.velocity.x = 0;
              v.setAlpha(1); this.tweens.add({ targets: v, scaleY: 1, duration: 150, ease: 'Back.easeOut' });
              this.vonken.explode(8, v.x, v.y - 4); Geluid.effect('raak');
            }
          } else {
            v.body.velocity.x = 0; v.setFlipX(dx > 0);
            if (v.molT <= 0) { v.onder = true; v.molT = 1.8; v.setAlpha(0.35); this.tweens.add({ targets: v, scaleY: 0.4, duration: 150 }); }
          }
        } else if (v.soort === 'neushoorn') {
          // ziet hij je? Dan stormt hij op je af tot de rand van het platform
          if (v.storm > 0) {
            v.storm -= dt;
            v.body.velocity.x = v.richting * 280;
            if (v.x < v.minX || v.x > v.maxX) { v.storm = 0; v.x = Phaser.Math.Clamp(v.x, v.minX, v.maxX); }
            if (v.storm <= 0) { v.rust = 1.2; v.body.velocity.x = 0; }
          } else if (v.rust > 0) {
            v.rust -= dt; v.body.velocity.x = 0;
          } else if (inBeeld && Math.abs(dx) < 380 && Math.abs(dy) < 60) {
            v.richting = Math.sign(dx) || 1; v.setFlipX(v.richting > 0);
            v.storm = 1.5; Geluid.effect('dash');
            this.vonken.explode(5, v.x, v.y);
          } else patrouille(v, 1);
        } else if (NIEUW_INFO[v.soort]) {
          this.nieuwLoperUpdate(v, dt, dx, dy, inBeeld, patrouille);
        } else if (v.soort === 'goud') {
          // rent weg als je dichtbij komt
          if (Math.abs(dx) < 260) { v.richting = -Math.sign(dx) || 1; patrouille(v, 4.5); }
          else patrouille(v, 1);
        } else {
          patrouille(v, 1); // kruiper, ijsklontjes
        }
      } else if (v.soort === 'bierpul' || v.soort === 'drone' || v.soort === 'ufo' || v.soort === 'ballon') {
        this.nieuwVliegerUpdate(v, dt, dx, dy, inBeeld);
      } else if (v.soort === 'gier') {
        // vliegt als een raket op je af (draait langzaam bij)
        if (!inBeeld && !v.vx) return;
        const d = Math.hypot(dx, dy) || 1, sn = v.jaagSnelheid;
        if (!v.vx) { v.vx = dx / d * sn; v.vy = dy / d * sn; Geluid.effect('duik'); }
        v.vx += (dx / d * sn - v.vx) * Math.min(1, dt * 1.6);
        v.vy += (dy / d * sn - v.vy) * Math.min(1, dt * 1.6);
        v.x += v.vx * dt; v.y += v.vy * dt;
        v.setFlipX(v.vx > 0);
        v.rotation = Math.atan2(v.vy, Math.abs(v.vx)) * (v.vx > 0 ? 1 : -1) * 0.6;
        v.scaleY = 1 + Math.sin(this.tijd * 16) * 0.15;
      } else if (v.soort === 'vliegpinguin') {
        // zweeft op afstand en schiet dan als een torpedo op je af
        v.schietT -= dt;
        if (v.torpedo > 0) {
          v.torpedo -= dt;
          v.x += v.vx * dt; v.y += v.vy * dt;
          v.rotation = Math.atan2(v.vy, Math.abs(v.vx)) * (v.vx < 0 ? -1 : 1);
          if (v.torpedo <= 0) { v.basisY = Phaser.Math.Clamp(v.y, 90, 380); v.rotation = 0; }
        } else {
          v.fase += dt;
          if (Math.abs(dx) > 220) v.x += Math.sign(dx) * v.jaagSnelheid * dt;
          v.y = v.basisY + Math.sin(v.fase * 3) * 10;
          v.setFlipX(dx > 0);
          v.rotation = Math.sin(this.tijd * 12) * 0.12; // spartelen in de lucht
          if (v.schietT <= 0 && inBeeld && Math.abs(dx) < 420) {
            const d = Math.hypot(dx, dy) || 1;
            v.vx = dx / d * 420; v.vy = dy / d * 420; v.torpedo = 0.9; v.schietT = 2.6;
            Geluid.effect('duik');
          }
        }
      } else if (v.soort === 'adelaar') {
        // cirkelt hoog en duikt recht naar beneden als hij boven je is
        if (v.duik) {
          v.y += v.duik * dt;
          if (v.duik > 0 && (v.y > sp.y - 10 || v.y > 470)) v.duik = -260;
          if (v.duik < 0 && v.y <= v.basisY) { v.duik = 0; v.y = v.basisY; v.schietT = 1.6; }
        } else {
          v.fase += dt;
          v.x += Math.sign(dx || 1) * Math.min(Math.abs(dx), v.jaagSnelheid * 1.3 * dt);
          v.y = v.basisY + Math.sin(v.fase * 2) * 8;
          v.setFlipX(dx > 0);
          v.schietT -= dt;
          if (v.schietT <= 0 && inBeeld && Math.abs(dx) < 50 && sp.y > v.y + 60) { v.duik = 520; Geluid.effect('duik'); }
        }
        v.scaleY = v.duik > 0 ? 0.8 : 1 + Math.sin(this.tijd * 10) * 0.18;
      } else if (v.soort === 'ptero') {
        // scheert laag heen en weer door het beeld
        if (!v.richting) v.richting = -1;
        v.x += v.richting * (v.jaagSnelheid * 2.4) * dt;
        v.basisY += Math.sign((sp.y - 70) - v.basisY) * Math.min(Math.abs((sp.y - 70) - v.basisY), 40 * dt);
        v.y = v.basisY + Math.sin(this.tijd * 3 + v.fase) * 10;
        if (v.x < this.camX + 40) v.richting = 1; else if (v.x > this.camX + 920) v.richting = -1;
        v.setFlipX(v.richting > 0);
        v.scaleY = 1 + Math.sin(this.tijd * 8 + v.fase) * 0.2;
      } else if (v.soort === 'vriesvlok') {
        // zweeft zigzag boven je en laat ijsscherfjes vallen
        v.fase += dt;
        if (Math.abs(dx) < 420) v.x += Math.sign(dx) * v.jaagSnelheid * 0.8 * dt;
        v.x += Math.cos(v.fase * 3) * 60 * dt;
        v.y = v.basisY + Math.sin(v.fase * 1.5) * 20;
        v.rotation += dt * 1.5;
        v.schietT -= dt;
        if (v.schietT <= 0 && inBeeld && Math.abs(dx) < 120 && sp.y > v.y) {
          v.schietT = 2.2;
          this.kogel('ijsscherf', v.x, v.y + 16, 0, 160, 900).leeft = 3;
        }
      } else if (v.soort === 'vuurmot') {
        // vliegt in rondjes om je heen als je dichtbij bent
        v.fase += dt * 2.2;
        if (Math.abs(dx) < 380 && inBeeld) {
          const dX = sp.x + Math.cos(v.fase) * 95, dY = sp.y - 50 + Math.sin(v.fase) * 55;
          v.x += (dX - v.x) * Math.min(1, dt * 1.6);
          v.y += (dY - v.y) * Math.min(1, dt * 1.6);
        } else v.y = v.basisY + Math.sin(v.fase) * 12;
        v.setFlipX(Math.cos(v.fase) < 0);
        v.scaleY = 1 + Math.sin(this.tijd * 26) * 0.15;
      } else if (v.soort === 'vleermuis' && v.modus === 'hang') {
        // hangt stil tot je eronder loopt
        v.y = v.basisY + Math.sin(this.tijd * 2 + v.fase) * 2;
        // kom je binnen zijn straal? Dan laat hij los en gaat hij op je af
        if (Math.hypot(dx, dy) < 230) {
          v.modus = 'duik'; v.setFlipY(false);
          const d = Math.hypot(dx, dy) || 1;
          v.vx = dx / d * 240; v.vy = dy / d * 240;
          Geluid.effect('duik');
        }
      } else if (v.soort === 'vleermuis' && v.modus === 'duik') {
        // blijft je achtervolgen
        const d = Math.hypot(dx, dy) || 1, sn = 150 + v.jaagSnelheid;
        v.vx += (dx / d * sn - v.vx) * Math.min(1, dt * 2.2);
        v.vy += (dy / d * sn - v.vy) * Math.min(1, dt * 2.2);
        v.x += v.vx * dt; v.y += v.vy * dt;
        v.setFlipX(v.vx > 0);
        v.scaleY = 1 + Math.sin(this.tijd * 30) * 0.2;
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
        if (v.soort === 'vliegvis') { v.scaleY = 1 + Math.sin(this.tijd * 14) * 0.12; v.rotation = Math.sin(v.fase * 2.2) * 0.25; }
      }
    });
  }
}

// ---------- KROEG, FABRIEK, SPEELTUIN, MAAN ----------
const NIEUW_GROND = { kroeg: ['darter', 'uitsmijter'], fabriek: ['robot', 'stoomketel'], speeltuin: ['wipkip', 'zandmonster'], maan: ['alien', 'kraterkruiper'] };
const NIEUW_LUCHT = { kroeg: 'bierpul', fabriek: 'drone', speeltuin: 'ballon', maan: 'ufo' };
// bw/bh = grootte van zijn lijf, hp + erbij×moeilijkheid, snel = loopsnelheid
const NIEUW_INFO = {
  darter: { bw: 26, bh: 44, hp: 2, erbij: 0.6, snel: 50, shots: 3 },
  uitsmijter: { bw: 40, bh: 60, hp: 4, erbij: 0.8, snel: 35, shots: 5 },
  robot: { bw: 30, bh: 42, hp: 2, erbij: 0.6, snel: 55, shots: 3 },
  stoomketel: { bw: 40, bh: 40, hp: 3, erbij: 0.6, snel: 0, shots: 4 },
  wipkip: { bw: 32, bh: 36, hp: 2, erbij: 0.6, snel: 0, shots: 3 },
  zandmonster: { bw: 36, bh: 30, hp: 2, erbij: 0.6, snel: 30, shots: 3 },
  alien: { bw: 26, bh: 44, hp: 2, erbij: 0.7, snel: 50, shots: 4 },
  kraterkruiper: { bw: 44, bh: 30, hp: 3, erbij: 0.7, snel: 35, shots: 4 },
};

MonsterDeel.prototype.nieuwLoperUpdate = function (v, dt, dx, dy, inBeeld, patrouille) {
  v.actieT -= dt;
  const dichtbij = inBeeld && Math.abs(dx) < 420;
  if (v.soort === 'darter') {
    // gooit een dartpijltje met een boogje naar je
    if (v.actieT <= 0 && dichtbij) {
      v.actieT = 2.4; v.setFlipX(dx > 0);
      this.kogel('dart', v.x, v.y - 34, Phaser.Math.Clamp(dx * 1.2, -360, 360), -260, 900).setRotation(dx > 0 ? 0 : Math.PI);
      Geluid.effect('schiet');
    } else patrouille(v, 1);
  } else if (v.soort === 'uitsmijter') {
    // loopt op je af als je in de buurt bent: "Jij komt er niet in!"
    if (dichtbij && Math.abs(dy) < 80) { v.richting = Math.sign(dx) || 1; patrouille(v, 2.2); }
    else patrouille(v, 1);
  } else if (v.soort === 'robot') {
    // schiet kroonkurken recht vooruit
    if (v.actieT <= 0 && dichtbij && Math.abs(dy) < 60) {
      v.actieT = 2; v.setFlipX(dx > 0); v.body.velocity.x = 0;
      this.kogel('kurkje', v.x + Math.sign(dx) * 18, v.y - 26, Math.sign(dx) * 340, 0, 0);
      Geluid.effect('tink');
    } else patrouille(v, 1);
  } else if (v.soort === 'stoomketel') {
    // staat stil en blaast af en toe een stoomwolk omhoog (niet boven hem staan!)
    v.body.velocity.x = 0;
    if (v.actieT <= 0 && inBeeld) {
      v.actieT = 2.6;
      for (let i = 0; i < 3; i++) this.time.delayedCall(i * 120, () => {
        if (!v.active) return;
        const k = this.kogel('stoom', v.x, v.y - 42, 0, -260, 0); k.leeft = 0.9; k.golf = true;
        this.tweens.add({ targets: k, scale: 1.8, alpha: 0.4, duration: 900 });
      });
      Geluid.effect('dash');
      this.tweens.add({ targets: v, scaleY: 0.85, yoyo: true, duration: 120 });
    }
  } else if (v.soort === 'wipkip') {
    // hopt in boogjes naar je toe
    const opGrond = v.body.blocked.down || v.body.touching.down;
    if (opGrond) {
      v.body.velocity.x = 0;
      if (v.actieT <= 0 && dichtbij) {
        v.actieT = 1.1; v.setFlipX(dx > 0);
        v.body.setVelocity(Phaser.Math.Clamp(dx, -170, 170), -430);
        Geluid.effect('boing');
      }
    }
  } else if (v.soort === 'zandmonster') {
    // verstopt in de zandbak; komt tevoorschijn en gooit een zandbal
    if (v.verstopt) {
      patrouille(v, 1);
      if (v.actieT <= 0 && dichtbij) {
        v.verstopt = false; v.actieT = 1.6; v.body.velocity.x = 0;
        v.setAlpha(1); this.tweens.add({ targets: v, scaleY: 1, duration: 150, ease: 'Back.easeOut' });
        this.time.delayedCall(350, () => { if (v.active) this.kogel('zandbal', v.x, v.y - 30, Phaser.Math.Clamp(dx * 1.1, -340, 340), -320, 900); });
      }
    } else {
      v.body.velocity.x = 0; v.setFlipX(dx > 0);
      if (v.actieT <= 0) { v.verstopt = true; v.actieT = 2; v.setAlpha(0.5); this.tweens.add({ targets: v, scaleY: 0.5, duration: 150 }); }
    }
  } else if (v.soort === 'alien') {
    // schiet een laserstraal
    if (v.actieT <= 0 && dichtbij && Math.abs(dy) < 70) {
      v.actieT = 2.3; v.setFlipX(dx > 0); v.body.velocity.x = 0;
      const k = this.kogel('laser', v.x + Math.sign(dx) * 16, v.y - 30, Math.sign(dx) * 460, 0, 0);
      k.setFlipX(dx < 0);
      Geluid.effect('laser');
    } else patrouille(v, 1);
  } else if (v.soort === 'kraterkruiper') {
    // trekt zich in zijn schild als je dichtbij komt
    const ver = Math.abs(dx) > 140;
    v.setScale(1, ver ? 1 : 0.8);
    patrouille(v, ver ? 1 : 0);
  }
};

MonsterDeel.prototype.nieuwVliegerUpdate = function (v, dt, dx, dy, inBeeld) {
  const sp = this.speler;
  v.fase += dt;
  v.schietT -= dt;
  if (v.soort === 'ballon') {
    // dobbert langzaam op je af en op en neer
    if (Math.abs(dx) < 500) v.x += Math.sign(dx) * v.jaagSnelheid * 0.5 * dt;
    v.y = v.basisY + Math.sin(v.fase * 1.4) * 22;
    v.rotation = Math.sin(v.fase * 2) * 0.12;
    return;
  }
  // bierpul, drone en ufo zweven boven je
  const doelX = sp.x, doelY = Math.max(90, sp.y - 190);
  if (Math.abs(dx) < 500) {
    v.x += Phaser.Math.Clamp(doelX - v.x, -1, 1) * Math.min(Math.abs(doelX - v.x), v.jaagSnelheid * 1.2 * dt) * (Math.abs(doelX - v.x) > 1 ? 1 : 0);
    v.basisY += Phaser.Math.Clamp(doelY - v.basisY, -40 * dt, 40 * dt);
  }
  v.y = v.basisY + Math.sin(v.fase * 3) * 8;
  v.setFlipX(dx > 0);
  if (v.soort === 'ufo') {
    // trekstraal: sta je eronder, dan word je omhoog getrokken
    if (!v.straal) {
      v.straal = this.add.triangle(0, 0, 0, 0, -50, 230, 50, 230, 0x7aff8a, 0.25).setOrigin(0.5, 0).setDepth(5).setVisible(false);
      v.once('destroy', () => v.straal.destroy());
    }
    const aan = (v.fase % 4) > 2.4 && inBeeld;
    v.straal.setVisible(aan).setPosition(v.x, v.y + 10);
    if (aan && Math.abs(dx) < 45 && sp.y > v.y && sp.y < v.y + 260) sp.body.setVelocityY(Math.max(sp.body.velocity.y - 60, -260));
    v.rotation = Math.sin(v.fase * 4) * 0.08;
    return;
  }
  if (v.schietT <= 0 && inBeeld && Math.abs(dx) < 60) {
    v.schietT = 2.2;
    if (v.soort === 'bierpul') this.kogel('schuimdruppel', v.x, v.y + 20, 0, 120, 900);
    else this.kogel('flesbom', v.x, v.y + 16, 0, 80, 1200);
    Geluid.effect('plop');
  }
  if (v.soort === 'bierpul') v.rotation = Math.sin(v.fase * 5) * 0.2;
};

voegToeAanSpel(MonsterDeel);
