// Besturing: toetsenbord én touch (mobiel).
// Touch: linkerkant van het scherm = joystick (duim neerzetten en schuiven),
// rechts staan de knoppen SPRING, SLASH, PIJL en DASH.

class Besturing {
  constructor(scene) {
    this.scene = scene;
    this.keys = scene.input.keyboard.addKeys('LEFT,RIGHT,UP,DOWN,W,A,S,D,SPACE,Z,X,C,J,K,L,SHIFT');
    this.touch = !!scene.sys.game.device.input.touch;
    scene.input.on('pointerdown', p => { if (p.wasTouch) this.touch = true; });
    this.nu = { x: 0, y: 0, spring: false, slash: false, schiet: false, dash: false };
    this.knoppen = [
      { id: 'spring', x: 870, y: 452, r: 54, label: 'SPRING' },
      { id: 'slash', x: 752, y: 482, r: 42, label: 'SLASH' },
      { id: 'schiet', x: 772, y: 378, r: 40, label: 'PIJL' },
      { id: 'dash', x: 888, y: 330, r: 36, label: 'DASH' },
    ];
    this.g = scene.add.graphics().setScrollFactor(0).setDepth(200);
    this.teksten = this.knoppen.map(k => scene.add.text(k.x, k.y, k.label, {
      fontFamily: FONT, fontSize: '15px', fontStyle: 'bold', color: '#f3ead6', stroke: '#0a1028', strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201));
  }

  update(dashVrij) {
    const k = this.keys;
    let x = ((k.RIGHT.isDown || k.D.isDown) ? 1 : 0) - ((k.LEFT.isDown || k.A.isDown) ? 1 : 0);
    let y = ((k.DOWN.isDown || k.S.isDown) ? 1 : 0) - ((k.UP.isDown || k.W.isDown) ? 1 : 0);
    let spring = k.SPACE.isDown || k.Z.isDown;
    let slash = k.X.isDown || k.J.isDown;
    let schiet = k.C.isDown || k.K.isDown;
    let dash = k.SHIFT.isDown || k.L.isDown;
    const ingedrukt = {};
    this.stick = null;

    if (this.touch) {
      for (const p of this.scene.input.manager.pointers) {
        if (!p.isDown) continue;
        if (p.downX < 480) {
          const dx = p.x - p.downX, dy = p.y - p.downY;
          this.stick = { bx: p.downX, by: p.downY, dx, dy };
          x = Math.abs(dx) < 10 ? 0 : Phaser.Math.Clamp(dx / 45, -1, 1);
          y = Math.abs(dy) < 10 ? 0 : Phaser.Math.Clamp(dy / 45, -1, 1);
        } else {
          for (const kn of this.knoppen) {
            if (kn.id === 'dash' && !dashVrij) continue;
            if (Math.hypot(p.x - kn.x, p.y - kn.y) < kn.r + 14) ingedrukt[kn.id] = true;
          }
        }
      }
      spring = spring || !!ingedrukt.spring;
      slash = slash || !!ingedrukt.slash;
      schiet = schiet || !!ingedrukt.schiet;
      dash = dash || !!ingedrukt.dash;
    }

    if (location.hash === '#test' || location.hash.startsWith('#baas')) {
      // testrit: de computer speelt zelf
      const t = this.scene.time.now / 1000;
      x = 1; y = (t % 3) > 2.6 ? 1 : 0;
      spring = (t % 0.9) < 0.45; slash = (t % 0.5) < 0.25; schiet = (t % 0.7) < 0.3; dash = (t % 2.3) < 0.1;
    }

    const v = this.nu;
    this.nu = {
      x, y, spring, slash, schiet, dash,
      springNet: spring && !v.spring,
      slashNet: slash && !v.slash,
      schietNet: schiet && !v.schiet,
      dashNet: dash && !v.dash,
      omlaagNet: y > 0.6 && !(v.y > 0.6),
    };
    this.teken(ingedrukt, dashVrij);
    return this.nu;
  }

  teken(ingedrukt, dashVrij) {
    const g = this.g;
    g.clear();
    this.teksten.forEach((t, i) => t.setVisible(this.touch && (this.knoppen[i].id !== 'dash' || dashVrij)));
    if (!this.touch) return;
    for (const kn of this.knoppen) {
      if (kn.id === 'dash' && !dashVrij) continue;
      g.fillStyle(0xffffff, ingedrukt[kn.id] ? 0.35 : 0.12);
      g.fillCircle(kn.x, kn.y, kn.r);
      g.lineStyle(3, 0xf2c14e, 0.8);
      g.strokeCircle(kn.x, kn.y, kn.r);
    }
    const s = this.stick;
    const bx = s ? s.bx : 130, by = s ? s.by : 440;
    g.fillStyle(0xffffff, s ? 0.14 : 0.07);
    g.fillCircle(bx, by, 62);
    g.lineStyle(2, 0xf3ead6, s ? 0.5 : 0.25);
    g.strokeCircle(bx, by, 62);
    let kx = 0, ky = 0;
    if (s) {
      const len = Math.hypot(s.dx, s.dy), max = 48;
      const f = len > max ? max / len : 1;
      kx = s.dx * f; ky = s.dy * f;
    }
    g.fillStyle(0xf3ead6, s ? 0.55 : 0.2);
    g.fillCircle(bx + kx, by + ky, 26);
  }
}
