// Alle gewone monsters: maken (per regio) en wat ze elk moment doen.
// Rivier: kruiper + dwaallicht. IJsvlakte: ijsklontje + pinguïn-ober.
// Bergen: rollend fust + hopvleermuis. Vulkaan: lavalager + brouwketel-golem.
// Overal (zeldzaam): het gouden flesje met pootjes.

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
}
voegToeAanSpel(MonsterDeel);
