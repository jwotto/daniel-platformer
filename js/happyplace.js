// Het allerallerlaatste, ultra-ultramoeilijke level: Jantje Willie Happy Place.
// Een veel te vrolijk regenboogland, en juist daardoor eng.
// Monsters: hele dikke, depressieve beertjes met een kaboutermuts (allemaal andere kleuren) die meppen
// met reuzenregenbooglolly's, en vliegende roze varkens die diarree uit hun kont op je schieten.
// Overal ligt gevaarlijk snoepgoed. De eindbaas is de Grote Roze Worst: rode pet, en twee roze
// harige gehaktballen als benen. Hij schiet gele druppels, roept drollengolven op en heeft
// kleine poepmonstertjes die meevechten.

// ---------- TEKENINGEN ----------
const BEER_KLEUREN = [
  { lijf: ['#ffb0d8', '#d0609a'], muts: '#d1495b' },
  { lijf: ['#a8f0d0', '#4ab890'], muts: '#7a5cff' },
  { lijf: ['#d0b8ff', '#8a6ad8'], muts: '#f2a33a' },
  { lijf: ['#fff0a0', '#d8b040'], muts: '#3a8ad8' },
];

function tekenBeertje(ctx, k) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.4;
  const g = ctx.createLinearGradient(0, 30, 0, 78); g.addColorStop(0, k.lijf[0]); g.addColorStop(1, k.lijf[1]);
  ctx.fillStyle = g;
  // dikke pootjes
  for (const x of [22, 46]) { ctx.beginPath(); ctx.ellipse(x, 74, 9, 6, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
  // heel dik lijf
  ctx.beginPath(); ctx.ellipse(34, 56, 27, 22, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(34, 60, 15, 13, 0, 0, TAU); ctx.fill();
  // kop met oortjes
  ctx.fillStyle = g;
  for (const x of [18, 50]) { ctx.beginPath(); ctx.arc(x, 20, 7, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(34, 28, 17, 0, TAU); ctx.fill(); ctx.stroke();
  // verdrietig: hangende oogjes met wallen, een traan en een sip mondje
  ctx.fillStyle = INKT; ctx.beginPath(); ctx.arc(28, 27, 2.4, 0, TAU); ctx.arc(40, 27, 2.4, 0, TAU); ctx.fill();
  ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(23, 22); ctx.lineTo(31, 24); ctx.moveTo(45, 22); ctx.lineTo(37, 24); ctx.stroke();
  ctx.strokeStyle = 'rgba(90,60,120,.6)'; ctx.beginPath(); ctx.arc(28, 31, 3, 0.1 * Math.PI, 0.9 * Math.PI); ctx.arc(40, 31, 3, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
  ctx.strokeStyle = INKT; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(34, 41, 5, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke();
  ctx.fillStyle = 'rgba(80,150,255,.85)'; ctx.beginPath(); ctx.ellipse(41, 34, 2, 3.5, 0, 0, TAU); ctx.fill();
  // kaboutermuts
  ctx.fillStyle = k.muts; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(18, 17); ctx.quadraticCurveTo(36, -6, 58, 2); ctx.quadraticCurveTo(44, 8, 50, 17); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.arc(58, 3, 4, 0, TAU); ctx.fill(); ctx.stroke();
  rondRect(ctx, 16, 14, 36, 6, 3); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function tekenRegenboogLolly(ctx) {
  ctx.fillStyle = '#fffaf0'; ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  ctx.fillRect(20, 40, 6, 52); ctx.strokeRect(20, 40, 6, 52);
  const kl = ['#ff4a6a', '#ff9a3c', '#ffe04a', '#6ad86a', '#4ab8ff', '#9a6aff'];
  kl.forEach((k, i) => { ctx.fillStyle = k; ctx.beginPath(); ctx.arc(23, 22, 21 - i * 3.3, 0, TAU); ctx.fill(); });
  ctx.beginPath(); ctx.arc(23, 22, 21, 0, TAU); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(23, 22, 13, 0, Math.PI * 1.4); ctx.stroke();
}

function tekenVliegvarken(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  // vleugeltjes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(34, 10, 12, 7, -0.5, 0, TAU); ctx.fill(); ctx.stroke();
  // krulstaartje (achter, rechts)
  ctx.strokeStyle = '#e070a0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(64, 22, 4, 0, Math.PI * 1.6); ctx.stroke();
  ctx.strokeStyle = INKT; ctx.lineWidth = 2.2;
  ctx.fillStyle = '#ffb0d0';
  for (const x of [22, 30, 44, 52]) { ctx.fillRect(x - 3, 30, 6, 10); ctx.strokeRect(x - 3, 30, 6, 10); }
  ctx.beginPath(); ctx.ellipse(38, 24, 24, 15, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // kont (rechts): een bruin vlekje...
  ctx.fillStyle = 'rgba(120,70,20,.6)'; ctx.beginPath(); ctx.arc(60, 28, 3, 0, TAU); ctx.fill();
  // kop met snuit, links
  ctx.fillStyle = '#ffb0d0'; ctx.beginPath(); ctx.arc(16, 20, 12, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, 9); ctx.lineTo(13, 2); ctx.lineTo(18, 9); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ff8ab8'; ctx.beginPath(); ctx.ellipse(6, 23, 5, 6, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INKT; ctx.beginPath(); ctx.arc(5, 21, 1.2, 0, TAU); ctx.arc(7.5, 25, 1.2, 0, TAU); ctx.fill();
  // blije (enge) oogjes
  ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(16, 16, 3, 1.1 * Math.PI, 1.9 * Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.arc(16, 25, 5, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
  ctx.restore();
}

function tekenWorst(ctx) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 4;
  // twee roze harige gehaktballen als benen
  for (const x of [56, 114]) {
    ctx.fillStyle = '#e88ab0'; ctx.beginPath(); ctx.arc(x, 172, 26, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#b0507a'; ctx.lineWidth = 2;
    for (let i = 0; i < 22; i++) { const a = i * TAU / 22; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 24, 172 + Math.sin(a) * 24); ctx.lineTo(x + Math.cos(a) * 31, 172 + Math.sin(a) * 31); ctx.stroke(); }
    ctx.fillStyle = 'rgba(140,60,90,.45)'; for (const [dx, dy] of [[-8, -6], [6, 4], [-2, 10], [10, -10]]) { ctx.beginPath(); ctx.arc(x + dx, 172 + dy, 3, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = INKT; ctx.lineWidth = 4;
  }
  // de grote roze worst
  const g = ctx.createLinearGradient(30, 0, 140, 0); g.addColorStop(0, '#d0608a'); g.addColorStop(0.45, '#ffa8c8'); g.addColorStop(1, '#c0507a');
  ctx.fillStyle = g; rondRect(ctx, 36, 34, 98, 130, 48); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(58, 62); ctx.lineTo(58, 130); ctx.stroke();
  ctx.strokeStyle = 'rgba(150,40,80,.4)'; ctx.lineWidth = 2;
  for (const y of [120, 140]) { ctx.beginPath(); ctx.moveTo(44, y); ctx.quadraticCurveTo(85, y + 8, 126, y); ctx.stroke(); }
  // gezicht: grote blije ogen en een veel te brede glimlach
  ctx.strokeStyle = INKT; ctx.lineWidth = 3;
  for (const x of [68, 102]) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, 76, 11, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = INKT; ctx.beginPath(); ctx.arc(x + 2, 78, 5, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#7a1a3a'; ctx.beginPath(); ctx.moveTo(56, 96); ctx.quadraticCurveTo(85, 128, 114, 96); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; for (let x = 64; x < 108; x += 9) ctx.fillRect(x, 97, 6, 6);
  ctx.fillStyle = 'rgba(255,90,120,.6)'; ctx.beginPath(); ctx.arc(54, 92, 6, 0, TAU); ctx.arc(116, 92, 6, 0, TAU); ctx.fill();
  // rode pet (klep naar links)
  ctx.fillStyle = '#d1302b'; ctx.strokeStyle = INKT; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(85, 40, 44, 26, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(46, 38); ctx.quadraticCurveTo(14, 38, 8, 48); ctx.lineTo(50, 46); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(85, 16, 4, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function tekenPoepje(ctx, soort) {
  ctx.save(); ctx.strokeStyle = INKT; ctx.lineWidth = 2;
  const kleur = soort === 1 ? ['#8ab84a', '#4a6a1a'] : soort === 3 ? ['#a87a5a', '#5a3a1a'] : ['#9a5a2a', '#4a2a0a'];
  const g = ctx.createLinearGradient(0, 6, 0, 32); g.addColorStop(0, kleur[0]); g.addColorStop(1, kleur[1]);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(17, 28, 15, 6, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(17, 20, 11, 6, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(17, 13, 7, 5, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(14, 9); ctx.quadraticCurveTo(18, 2, 22, 4); ctx.quadraticCurveTo(19, 7, 20, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(13, 20, 3.4, 0, TAU); ctx.arc(21, 20, 3.4, 0, TAU); ctx.fill();
  ctx.fillStyle = INKT; ctx.beginPath(); ctx.arc(13.5, 20.5, 1.6, 0, TAU); ctx.arc(21.5, 20.5, 1.6, 0, TAU); ctx.fill();
  if (soort === 0) { ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(17, 26, 3, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke(); }
  if (soort === 1) { ctx.fillStyle = INKT; for (const [x, y] of [[4, 6], [30, 8], [27, 2]]) { ctx.beginPath(); ctx.arc(x, y, 1.6, 0, TAU); ctx.fill(); } }
  if (soort === 2) { ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(9, 15); ctx.lineTo(15, 17); ctx.moveTo(25, 15); ctx.lineTo(19, 17); ctx.stroke(); ctx.beginPath(); ctx.arc(17, 29, 3, 1.1 * Math.PI, 1.9 * Math.PI); ctx.stroke(); }
  if (soort === 3) { ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.moveTo(10, 8); ctx.lineTo(12, 1); ctx.lineTo(15, 5); ctx.lineTo(17, 0); ctx.lineTo(19, 5); ctx.lineTo(22, 1); ctx.lineTo(24, 8); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}

function maakHappyTexturen(scene) {
  BEER_KLEUREN.forEach((k, i) => tekenTextuur(scene, 'beertje_' + i, 68, 82, ctx => tekenBeertje(ctx, k)));
  tekenTextuur(scene, 'beertje', 68, 82, ctx => tekenBeertje(ctx, BEER_KLEUREN[0]));
  tekenTextuur(scene, 'regenbooglolly', 46, 94, tekenRegenboogLolly);
  tekenTextuur(scene, 'vliegvarken', 70, 44, tekenVliegvarken);
  tekenTextuur(scene, 'baas_worst', 170, 202, tekenWorst);
  for (let i = 0; i < 4; i++) tekenTextuur(scene, 'poepje_' + i, 34, 36, ctx => tekenPoepje(ctx, i));
  tekenTextuur(scene, 'poepje', 34, 36, ctx => tekenPoepje(ctx, 0));
  tekenTextuur(scene, 'diarree', 16, 16, ctx => { ctx.fillStyle = '#8a5a1a'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(8, 1); ctx.quadraticCurveTo(15, 10, 8, 15); ctx.quadraticCurveTo(1, 10, 8, 1); ctx.fill(); ctx.stroke(); });
  tekenTextuur(scene, 'geledruppel', 16, 22, ctx => { ctx.fillStyle = '#ffe04a'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(8, 1); ctx.quadraticCurveTo(15, 13, 8, 21); ctx.quadraticCurveTo(1, 13, 8, 1); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(6, 13, 2, 0, TAU); ctx.fill(); });
  tekenTextuur(scene, 'drol', 40, 34, ctx => { ctx.translate(3, 0); tekenPoepje(ctx, 2); });
  // gevaarlijk snoepgoed
  tekenTextuur(scene, 'lollyrij', 90, 40, ctx => {
    const kl = ['#ff4a6a', '#4ab8ff', '#ffe04a'];
    for (let i = 0; i < 3; i++) {
      const x = 15 + i * 30;
      ctx.fillStyle = '#fffaf0'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6; ctx.fillRect(x - 2, 18, 4, 22); ctx.strokeRect(x - 2, 18, 4, 22);
      ctx.fillStyle = kl[i]; ctx.beginPath(); ctx.moveTo(x - 11, 18); ctx.lineTo(x, 0); ctx.lineTo(x + 11, 18); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  });
  tekenTextuur(scene, 'zuurtje', 34, 22, ctx => {
    ctx.fillStyle = '#ff4a6a'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(2, 4); ctx.lineTo(9, 11); ctx.lineTo(2, 18); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(32, 4); ctx.lineTo(25, 11); ctx.lineTo(32, 18); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(17, 11, 9, 8, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(14, 8, 2, 0, TAU); ctx.fill();
    ctx.fillStyle = INKT; ctx.beginPath(); ctx.arc(14, 12, 1.2, 0, TAU); ctx.arc(20, 12, 1.2, 0, TAU); ctx.fill();
  });
  tekenTextuur(scene, 'kauwgom', 80, 12, ctx => {
    ctx.fillStyle = '#ff7ac8'; ctx.strokeStyle = INKT; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(40, 7, 38, 4.5, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(28, 4, 5, Math.PI, 0); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(52, 6, 7, 1.5, 0, 0, TAU); ctx.fill();
  });
  tekenTextuur(scene, 'dropveter', 14, 160, ctx => {
    ctx.fillStyle = '#1a1a22'; ctx.strokeStyle = '#5a2a3a'; ctx.lineWidth = 1;
    rondRect(ctx, 3, 0, 8, 160, 4); ctx.fill();
    for (let y = 6; y < 160; y += 10) { ctx.beginPath(); ctx.moveTo(3, y); ctx.lineTo(11, y + 5); ctx.stroke(); }
    ctx.fillStyle = '#ff4a6a'; ctx.beginPath(); ctx.arc(7, 154, 6, 0, TAU); ctx.fill();
  });
}

// ---------- MONSTERS EN SNOEPGOED ----------
class HappyDeel {
  // een dik, depressief beertje met een kaboutermuts en een reuzenregenbooglolly
  maakBeertje(x, y, minX, maxX) {
    const v = this.maakNieuwLoper('beertje', x, y, minX, maxX);
    v.setTexture('beertje_' + Phaser.Math.Between(0, BEER_KLEUREN.length - 1));
    v.actieT = 1 + Math.random();
    v.lolly = this.add.image(v.x, v.y, 'regenbooglolly').setOrigin(0.5, 0.95).setDepth(10);
    v.once('destroy', () => v.lolly.destroy());
    return v;
  }

  beertjeUpdate(v, dt, dx, dy, dichtbij, patrouille) {
    const r = v.flipX ? 1 : -1;
    if (!v.mept) v.lolly.setAngle(r * 25 + Math.sin(this.tijd * 2 + v.x) * 4);
    v.lolly.setPosition(v.x + r * 24, v.y - 30);
    v.scaleX = 1 + Math.sin(this.tijd * 3 + v.x) * 0.03;
    if (v.mept) { v.body.velocity.x = 0; return; }
    if (v.actieT <= 0 && Math.abs(dx) < 140 && Math.abs(dy) < 90) {
      // MEP! eerst even uithalen, dan met de lolly naar beneden
      v.mept = true; v.actieT = 2.2; v.setFlipX(dx > 0);
      const kant = dx > 0 ? 1 : -1;
      this.tweens.add({ targets: v.lolly, angle: -kant * 50, duration: 350, onComplete: () => {
        if (!v.active) return;
        this.tweens.add({ targets: v.lolly, angle: kant * 115, duration: 140, onComplete: () => {
          if (!v.active) return;
          const sp = this.speler;
          if (Math.abs(sp.x - (v.x + kant * 70)) < 80 && Math.abs(sp.y - v.y) < 110 && this.onkwetsbaar <= 0) this.schade(kant);
          this.vonken.explode(10, v.x + kant * 80, v.y - 10); Geluid.effect('smash');
          this.time.delayedCall(350, () => { if (v.active) v.mept = false; });
        } });
      } });
      return;
    }
    if (dichtbij) v.richting = Math.sign(dx) || 1;
    patrouille(v, 0.8);
  }

  // een vliegend roze varken dat diarree uit zijn kont op je schiet
  maakVliegvarken(x, y) {
    const L = this.moeilijkheid(x);
    const v = this.maakVlieger('vliegvarken', 'vliegvarken', x, y);
    v.hp = 8 + Math.floor(L * 1.4); v.shots = 9; v.schietT = 1.5 + Math.random();
    v.jaagSnelheid = 110 + Math.min(70, L * 10);
    return v;
  }

  vliegvarkenUpdate(v, dt, dx, dy, inBeeld) {
    const sp = this.speler;
    v.fase += dt;
    if (Math.abs(dx) < 700) {
      const doelX = sp.x + (v.x > sp.x ? 120 : -120), doelY = Math.max(100, sp.y - 190);
      v.x += Phaser.Math.Clamp(doelX - v.x, -v.jaagSnelheid * dt, v.jaagSnelheid * dt);
      v.basisY += Phaser.Math.Clamp(doelY - v.basisY, -80 * dt, 80 * dt);
    }
    v.y = v.basisY + Math.sin(v.fase * 4) * 9;
    // de kont (rechts in het plaatje) wijst naar jou
    v.setFlipX(dx < 0);
    v.scaleY = 1 + Math.sin(v.fase * 18) * 0.06;
    v.schietT -= dt;
    if (v.schietT <= 0 && inBeeld && Math.abs(dx) < 500) {
      v.schietT = 2;
      const kont = v.x + (dx < 0 ? -28 : 28);
      for (let i = 0; i < 4; i++) this.time.delayedCall(i * 90, () => {
        if (!v.active) return;
        this.kogel('diarree', kont, v.y + 6, Math.sign(dx) * Phaser.Math.Between(60, 200) + dx * 0.4, Phaser.Math.Between(-60, 40), 900);
      });
      Geluid.effect('pfrrt');
    }
  }

  // kleine poepmonstertjes van de worst: hoppen op je af
  poepjeUpdate(v, dt, dx, dichtbij, patrouille) {
    const opGrond = v.body.blocked.down || v.body.touching.down;
    if (!opGrond) return;
    if (v.actieT <= 0 && dichtbij) {
      v.actieT = 0.8 + Math.random() * 0.5; v.setFlipX(dx > 0);
      v.body.setVelocity(Math.sign(dx) * Phaser.Math.Between(140, 220), -Phaser.Math.Between(320, 460));
    } else if (!dichtbij) patrouille(v, 1);
    else v.body.velocity.x = 0;
  }

  // gevaarlijk snoepgoed op een platform
  maakSnoep(x, y, w) {
    const r = Math.random();
    if (r < 0.2 && w >= 160) {
      // lollyspikes
      const s = this.spikes.create(x + w * 0.45, y + 2, 'lollyrij').setOrigin(0, 1).setDepth(6);
      s.body.setSize(80, 14).setOffset(5, 26); s.refreshBody();
    } else if (r < 0.42) {
      // exploderend zuurtje
      const s = this.add.image(x + Phaser.Math.Between(30, Math.max(31, w - 30)), y - 10, 'zuurtje').setDepth(7);
      s.snoep = 'zuurtje'; this.snoepjes.push(s);
      this.tweens.add({ targets: s, y: s.y - 4, yoyo: true, repeat: -1, duration: 500 });
    } else if (r < 0.6 && w >= 120) {
      // kauwgom: je blijft even plakken
      const s = this.add.image(x + Phaser.Math.Between(10, w - 90), y + 1, 'kauwgom').setOrigin(0, 1).setDepth(6);
      s.snoep = 'kauwgom'; this.snoepjes.push(s);
    } else if (r < 0.78) {
      // dropveter die als een zweep heen en weer zwiept
      const s = this.add.image(x + w / 2, Math.max(0, y - 250), 'dropveter').setOrigin(0.5, 0).setDepth(7);
      s.snoep = 'veter'; s.fase = Math.random() * 6; this.snoepjes.push(s);
    }
  }

  snoepUpdate(dt) {
    const sp = this.speler;
    this.snoepjes = this.snoepjes.filter(s => s.active && s.x > this.camX - 300);
    this.plakMeld = (this.plakMeld || 0) - dt;
    for (const s of this.snoepjes) {
      if (s.snoep === 'zuurtje') {
        if (s.af === undefined && Phaser.Math.Distance.Between(s.x, s.y, sp.x, sp.y - 30) < 85) {
          s.af = 0.6; this.tweens.add({ targets: s, scale: 1.6, duration: 600 });
          s.setTintFill(0xffffff); this.time.delayedCall(150, () => s.active && s.clearTint());
        }
        if (s.af !== undefined) {
          s.af -= dt;
          if (s.af <= 0) {
            this.vonken.explode(24, s.x, s.y); Geluid.effect('smash'); this.cameras.main.shake(120, 0.01);
            if (Phaser.Math.Distance.Between(s.x, s.y, sp.x, sp.y - 30) < 105 && this.onkwetsbaar <= 0) this.schade(Math.sign(sp.x - s.x) || 1);
            s.destroy();
          }
        }
      } else if (s.snoep === 'kauwgom') {
        if (Math.abs(sp.x - (s.x + 40)) < 40 && Math.abs(sp.y - s.y) < 8) {
          sp.body.velocity.x *= 0.12;
          if (this.plakMeld <= 0) { this.plakMeld = 1.5; this.popTekst('Kauwgom! Je plakt vast!'); }
        }
      } else if (s.snoep === 'veter') {
        s.fase += dt;
        s.setAngle(Math.sin(s.fase * 2.2) * 60);
        const a = Phaser.Math.DegToRad(s.angle);
        for (const f of [0.75, 1]) {
          const px = s.x - Math.sin(a) * 160 * f, py = s.y + Math.cos(a) * 160 * f;
          if (Phaser.Math.Distance.Between(px, py, sp.x, sp.y - 30) < 26 && this.onkwetsbaar <= 0) { this.schade(Math.sign(sp.x - px) || 1); break; }
        }
      }
    }
  }

  // ---------- DE EINDBAAS: DE GROTE ROZE WORST ----------
  worstStart(b) {
    b.status = 'loopt'; b.timer = 2.4; b.beurt = 0; b.t = 0;
    this.time.delayedCall(900, () => this.baasRoep('Hoi vriendje! Kom knuffelen!'));
  }

  worstUpdate(b, dt, woede) {
    const sp = this.speler, dx = sp.x - b.x;
    b.t += dt;
    b.setScale(1 + Math.sin(b.t * 6) * 0.03, 1 - Math.sin(b.t * 6) * 0.03);
    const opGrond = b.body.blocked.down || b.body.touching.down;
    if (b.status === 'loopt') {
      b.setFlipX(dx > 0);
      b.body.setVelocityX(Math.abs(dx) > 60 ? Math.sign(dx) * 75 * woede : 0);
      b.timer -= dt * woede * 0.8;
      if (b.timer <= 0) this.worstAanval(b);
    } else if (b.status === 'springt') {
      if (opGrond && b.t > 0.35) { b.body.setVelocityX(0); this.schokgolf(b.x); b.status = 'loopt'; b.timer = 1; }
    } else b.body.setVelocityX(0);
  }

  worstKlaar(b, ms) {
    b.status = 'bezig';
    this.time.delayedCall(ms, () => { if (b.active && b.status === 'bezig') { b.status = 'loopt'; b.timer = b.woedend ? 0.6 : 1.2; } });
  }

  worstDruppels(b, n) {
    for (let i = 0; i < n; i++) this.time.delayedCall(i * 70, () => {
      if (!b.active || this.gewonnen) return;
      const k = this.kogel('geledruppel', b.x, b.y - 180, Phaser.Math.Between(-340, 340), -Phaser.Math.Between(650, 950), 1200);
      k.setScale(1.4);
    });
    Geluid.effect('plop');
  }

  worstGolf(b, vanaf) {
    const r = Math.sign(this.speler.x - vanaf) || 1;
    for (let i = 0; i < 5; i++) this.time.delayedCall(i * 280, () => {
      if (!b.active || this.gewonnen) return;
      const k = this.kogel('drol', vanaf + r * 40, 450, r * 330, 0, 0);
      k.rolt = true; k.leeft = 4; k.setScale(1.3);
    });
    Geluid.effect('pfrrt');
  }

  worstAanval(b) {
    const lijst = ['druppels', 'drollengolf', 'poepjes', 'sprong', 'druppels', 'drollengolf', 'regen'];
    const a = lijst[b.beurt % lijst.length]; b.beurt++;
    const sp = this.speler;
    if (a === 'druppels') {
      this.baasRoep('Gele druppels!');
      this.worstDruppels(b, 12);
      this.worstKlaar(b, 1300);
    } else if (a === 'drollengolf') {
      this.baasRoep('PFRRT! Drollengolf!');
      this.worstGolf(b, b.x);
      if (b.woedend) this.time.delayedCall(700, () => b.active && this.worstGolf(b, sp.x < 480 ? 940 : 20));
      this.worstKlaar(b, 1800);
    } else if (a === 'poepjes') {
      this.baasRoep('Kom maar, kleine poepjes!');
      const er = this.vijanden.getChildren().filter(v => v.active && v.soort === 'poepje').length;
      for (let i = 0; i < Math.min(4, 8 - er); i++) {
        const v = this.maakNieuwLoper('poepje', Phaser.Math.Clamp(b.x + (i - 1.5) * 50, 60, 900), 440, 40, 920);
        v.setTexture('poepje_' + (i % 4)); v.actieT = 0.5 + i * 0.2;
        v.body.setVelocity((i - 1.5) * 120, -400);
      }
      Geluid.effect('pfrrt');
      this.worstKlaar(b, 1200);
    } else if (a === 'sprong') {
      this.baasRoep('Worstensprong!');
      b.status = 'springt'; b.t = 0;
      b.body.setVelocity(Phaser.Math.Clamp((sp.x - b.x) * 1.2, -520, 520), -950);
      Geluid.effect('dubbel');
    } else if (a === 'regen') {
      this.baasRoep('Snoepregen van ellende!');
      this.worstDruppels(b, 20);
      this.time.delayedCall(500, () => b.active && this.worstGolf(b, b.x));
      this.worstKlaar(b, 2200);
    }
  }
}

voegToeAanSpel(HappyDeel);
