// Effecten van de dure power-ups die een eigen stukje code nodig hebben:
// Reservevat (bijnaDood), Boerbom (boer) en Flesmaatje (maatjeUpdate).
// Kleinere effecten (schild, stamp, statiegeld, magneet...) staan op hun plek in spel.js.

class KrachtDeel {
  // Hartjes op: met een Reservevat krijg je nog 1 kans. Geeft true als je echt dood bent.
  bijnaDood() {
    if (this.reserve > 0) {
      this.reserve--;
      this.run.harten = 1;
      this.onkwetsbaar = 2.5; this.knipper = 2.5;
      this.popTekst('Reservevat! Nog één kans!');
      Geluid.effect('flesVol');
      this.cameras.main.flash(300, 242, 193, 78);
      return false;
    }
    this.gameOver();
    return true;
  }

  // Boerbom: een grote boer die monsters om je heen raakt
  boer() {
    const lvl = this.run.up.boer, sp = this.speler;
    const r = [0, 130, 180, 240][lvl], x = sp.x, y = sp.y - 30;
    Geluid.effect('boer');
    const ring = this.add.circle(x, y, r, 0x9ad86e, 0.35).setDepth(12).setScale(0.2);
    this.tweens.add({ targets: ring, scale: 1, alpha: 0, duration: 400, onComplete: () => ring.destroy() });
    this.vijanden.getChildren().slice().forEach(v => {
      if (v.active && v.soort !== 'goud' && Phaser.Math.Distance.Between(x, y, v.x, v.getCenter().y) < r + (v.soort === 'baas' ? 50 : 0)) {
        this.raakVijand(v, 1 + lvl, Math.sign(v.x - x) || 1);
      }
    });
    this.kogels.getChildren().slice().forEach(k => {
      if (Phaser.Math.Distance.Between(x, y, k.x, k.y) < r) k.destroy();
    });
  }

  // Flesmaatje: vliegt mee en schiet op het dichtstbijzijnde monster
  maatjeUpdate(dt) {
    const m = this.maatje, sp = this.speler;
    if (!m) return;
    const doelX = sp.x - this.kijk * 40, doelY = sp.y - 80 + Math.sin(this.tijd * 3) * 6;
    m.x += (doelX - m.x) * Math.min(1, dt * 6);
    m.y += (doelY - m.y) * Math.min(1, dt * 6);
    m.rotation = Math.sin(this.tijd * 4) * 0.15;
    this.maatjeCd -= dt;
    if (this.maatjeCd > 0 || this.dood) return;
    let doel = null, best = 460;
    this.vijanden.getChildren().forEach(v => {
      if (!v.active || v.soort === 'goud') return;
      const d = Phaser.Math.Distance.Between(m.x, m.y, v.x, v.getCenter().y);
      if (d < best) { best = d; doel = v; }
    });
    if (!doel) return;
    this.maatjeCd = [0, 1.8, 1.2, 0.7][this.run.up.maatje];
    const hoek = Phaser.Math.Angle.Between(m.x, m.y, doel.x, doel.getCenter().y);
    const p = this.pijlen.create(m.x, m.y, 'pijl').setDepth(11).setScale(0.8);
    p.body.setAllowGravity(false);
    p.body.setSize(14, 8);
    p.setVelocity(Math.cos(hoek) * 650, Math.sin(hoek) * 650);
    p.setRotation(hoek);
    p.leeft = 1; p.boem = false;
    Geluid.effect('schiet');
  }
}
voegToeAanSpel(KrachtDeel);
