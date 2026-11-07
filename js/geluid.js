// Geluid: goedkope 8-bit effectjes en hyperactieve polka met hardcore drums.
// Alles wordt live gemaakt met de Web Audio API, er zijn geen geluidsbestanden.

const Geluid = (() => {
  let ctx = null, master, sfx, muziek, drums, ruis;
  // instellingen: muziek en geluidjes apart aan/uit (worden bewaard)
  let muziekAan = true, effectenAan = true;
  try {
    muziekAan = localStorage.getItem('flesje_muziek') !== 'uit';
    effectenAan = localStorage.getItem('flesje_effecten') !== 'uit';
  } catch (e) { /* standaard aan */ }
  const bewaar = (k, v) => { try { localStorage.setItem(k, v ? 'aan' : 'uit'); } catch (e) { /* geeft niks */ } };
  const MUZIEK_VOL = 0.3;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.7; master.connect(ctx.destination);
    sfx = ctx.createGain(); sfx.gain.value = 0.45; sfx.connect(master);
    muziek = ctx.createGain(); muziek.gain.value = muziekAan ? MUZIEK_VOL : 0; muziek.connect(master);
    // vervorming voor de hardcore drums
    drums = ctx.createWaveShaper();
    const curve = new Float32Array(1024), k = 60;
    for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; curve[i] = (1 + k) * x / (1 + k * Math.abs(x)); }
    drums.curve = curve;
    const drumVol = ctx.createGain(); drumVol.gain.value = 0.4;
    drums.connect(drumVol); drumVol.connect(muziek);
    ruis = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = ruis.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  // browsers laten pas geluid toe na een tik of toets
  ['pointerdown', 'pointerup', 'touchend', 'keydown'].forEach(ev => window.addEventListener(ev, init, { capture: true, passive: true }));

  const hz = m => 440 * Math.pow(2, (m - 69) / 12);

  function toon(f1, f2, duur, type, vol, naar, t) {
    if (!ctx) return;
    t = t || ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(f1, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + duur);
    g.gain.setValueAtTime(vol || 0.3, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duur);
    o.connect(g); g.connect(naar || sfx);
    o.start(t); o.stop(t + duur + 0.02);
  }

  function ruisje(duur, filter, f1, f2, vol, naar, t) {
    if (!ctx) return;
    t = t || ctx.currentTime;
    const b = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    b.buffer = ruis;
    f.type = filter; f.frequency.setValueAtTime(f1, t);
    if (f2) f.frequency.exponentialRampToValueAtTime(f2, t + duur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duur);
    b.connect(f); f.connect(g); g.connect(naar || sfx);
    b.start(t, Math.random() * 0.5); b.stop(t + duur + 0.02);
  }

  function rijtje(noten, stap, type, vol) {
    if (!ctx) return;
    const t = ctx.currentTime;
    noten.forEach((f, i) => toon(f, null, stap * 1.3, type || 'square', vol || 0.22, sfx, t + i * stap));
  }

  // ---------- EFFECTJES ----------
  const EFFECTEN = {
    spring: () => toon(330, 760, 0.12, 'square', 0.22),
    dubbel: () => toon(520, 1150, 0.12, 'square', 0.22),
    muur: () => toon(400, 950, 0.1, 'square', 0.22),
    slash: () => { ruisje(0.09, 'bandpass', 3200, 700, 0.6); toon(900, 300, 0.06, 'square', 0.1); },
    schiet: () => toon(1300, 380, 0.09, 'square', 0.18),
    raak: () => toon(240, 110, 0.07, 'square', 0.25),
    weg: () => { toon(620, 70, 0.22, 'square', 0.22); ruisje(0.15, 'lowpass', 2500, 300, 0.3); },
    shotje: () => rijtje([988, 1319], 0.05, 'square', 0.15),
    flesVol: () => rijtje([523, 659, 784, 1047, 1319], 0.055, 'square', 0.2),
    au: () => toon(460, 80, 0.3, 'sawtooth', 0.28),
    dash: () => ruisje(0.16, 'highpass', 1200, 7000, 0.45),
    smash: () => { toon(170, 38, 0.32, 'square', 0.4); ruisje(0.3, 'lowpass', 1500, 100, 0.55); },
    boem: () => { ruisje(0.45, 'lowpass', 3500, 120, 0.75); toon(130, 30, 0.35, 'square', 0.3); },
    koop: () => rijtje([1047, 1568], 0.07, 'square', 0.22),
    // een lange, flubberige scheet en dan een raket-zoef omhoog
    scheet: () => {
      if (!ctx) return;
      const t = ctx.currentTime;
      for (let i = 0; i < 12; i++) toon(120 - i * 5 + Math.random() * 25, 60, 0.07, 'sawtooth', 0.4, sfx, t + i * 0.045);
      ruisje(0.55, 'lowpass', 700, 120, 0.6, sfx, t);
      toon(180, 1200, 0.45, 'square', 0.18, sfx, t + 0.4);
    },
    draai: () => toon(900, 700, 0.03, 'square', 0.12),
    lont: () => rijtje([1400, 1500, 1400, 1500, 1400, 1500, 1400, 1500], 0.09, 'square', 0.12),
    duik: () => toon(1200, 300, 0.25, 'sawtooth', 0.15),
    prijs: () => rijtje([523, 659, 784, 1047, 1319, 1568], 0.07, 'square', 0.24),
    nee: () => toon(110, 90, 0.18, 'square', 0.25),
    baasRaak: () => toon(160, 70, 0.1, 'sawtooth', 0.28),
    baasWeg: () => rijtje([392, 523, 659, 784, 1047, 784, 1047, 1319], 0.08, 'square', 0.25),
    gameOver: () => rijtje([523, 494, 466, 440, 415, 392, 370, 262], 0.11, 'sawtooth', 0.22),
    regio: () => rijtje([523, 659, 784, 1047, 784, 1047], 0.08, 'square', 0.22),
  };

  // ---------- MUZIEK ----------
  // Elk liedje is een AKKOORDENSCHEMA: één akkoord per maat, 8 tikjes per maat.
  // Bas, akkoorden én melodie worden uit dat akkoord gemaakt.
  // De melodie gebruikt alleen noten uit het akkoord van dat moment, zo klinkt alles samen mooi.

  // Akkoorden: grondtoon (midi-nummer) en de stapjes erboven
  const AK = {
    C: [48, [0, 4, 7]], Dm: [50, [0, 3, 7]], Em: [52, [0, 3, 7]], F: [53, [0, 4, 7]],
    G: [55, [0, 4, 7]], G7: [55, [0, 4, 7, 10]], Am: [57, [0, 3, 7]], E7: [52, [0, 4, 7, 10]],
    E: [52, [0, 4, 7]], Bb: [58, [0, 4, 7]], A7: [57, [0, 4, 7, 10]], A: [57, [0, 4, 7]], D7: [50, [0, 4, 7, 10]],
  };

  // Melodie-patronen: getal = welke akkoordnoot (0 = laagste melodienoot van het akkoord, 1 = de volgende, enz.),
  // null = rust (de vorige noot klinkt dan langer door).
  const P = {
    // vrolijke polka
    op: [0, 1, 2, 1, 0, 1, 2, 3], hoog: [3, null, 2, null, 1, 2, 3, null], golf: [2, 1, 0, 1, 2, null, 4, null],
    top: [4, 3, 2, 3, 4, null, 3, null], dans: [2, 3, 4, 3, 2, 1, 2, null], slot: [3, null, 2, null, 0, null, null, null],
    // stoere mars
    stap: [0, null, 0, 1, 2, null, 1, null], klim: [2, null, 3, null, 2, 1, 0, null], terug: [1, 2, 3, 2, 1, null, 0, null],
    roep: [3, null, null, 2, 3, null, 4, null], marsSlot: [0, null, -1, null, 0, null, null, null],
    // eindbaas
    ren: [0, 0, 1, 0, 2, 0, 1, 0], schreeuw: [3, 2, 1, 2, 3, null, 4, null], val: [4, 3, 2, 1, 0, null, 1, null],
    baasSlot: [2, null, 1, null, 0, 0, 0, null],
  };

  const LIEDJES = {
    // Liedje 1: Bierpolka (C majeur), voor de Rivier, de IJsvlakte en het titelscherm
    polka: {
      tempo: 176, stijl: 'polka', golf: 'square',
      schema: ['C', 'C', 'F', 'G7', 'C', 'Am', 'Dm', 'G7', //  couplet
        'F', 'G', 'Em', 'Am', 'Dm', 'G7', 'C', 'C'], //         refrein
      melodie: ['op', 'hoog', 'op', 'golf', 'op', 'hoog', 'golf', 'slot',
        'top', 'dans', 'top', 'dans', 'top', 'golf', 'op', 'slot'],
    },
    // Liedje 2: Bergmars (A mineur), voor de Bergen en de Vulkaan
    mars: {
      tempo: 150, stijl: 'mars', golf: 'sawtooth',
      schema: ['Am', 'Am', 'Dm', 'E7', 'Am', 'F', 'G', 'C', //  couplet
        'F', 'G', 'Em', 'Am', 'Dm', 'E7', 'Am', 'Am'], //          refrein
      melodie: ['stap', 'klim', 'stap', 'terug', 'stap', 'klim', 'roep', 'terug',
        'roep', 'klim', 'roep', 'terug', 'stap', 'roep', 'terug', 'marsSlot'],
    },
    // Liedje 3: Baaslied (D mineur, snel), voor de eindbazen
    baas: {
      tempo: 200, stijl: 'baas', golf: 'square',
      schema: ['Dm', 'Dm', 'Bb', 'A7', 'Dm', 'Bb', 'C', 'A7'],
      melodie: ['ren', 'schreeuw', 'ren', 'val', 'ren', 'schreeuw', 'val', 'baasSlot'],
    },
  };

  // Alle noten van een akkoord tussen laag en hoog, van laag naar hoog
  function akkoordNoten(naam, laag, hoog) {
    const [grond, stappen] = AK[naam], uit = [];
    for (let m = laag; m <= hoog; m++) if (stappen.some(st => (m - grond - st) % 12 === 0)) uit.push(m);
    return uit;
  }
  function basGrond(naam) { const g = AK[naam][0] % 12; return 36 + (g < 4 ? g + 12 : g); } // tussen E2 en Eb3
  function basKwint(naam) { return basGrond(naam) - 5; }

  let speelt = false, volgende = 0, stap = 0, timer = null, lied = LIEDJES.polka, tempo = 176;

  function noot(m, t, duur, type, vol) { toon(hz(m), null, duur, type, vol, muziek, t); }
  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(170, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(g); g.connect(drums); o.start(t); o.stop(t + 0.24);
  }
  const snare = (t, vol) => ruisje(0.1, 'bandpass', 1900, null, vol || 0.42, muziek, t);
  const hihat = t => ruisje(0.025, 'highpass', 8000, null, 0.12, muziek, t);

  function speelStap(s, t, d) {
    const maten = lied.schema.length;
    const maat = Math.floor(s / 8) % maten, pos = s % 8;
    const ak = lied.schema[maat];
    const laatste = maat === maten - 1;

    // melodie: noten uit het akkoord
    const patroon = P[lied.melodie[maat]];
    const i = patroon[pos];
    if (i !== null) {
      const noten = akkoordNoten(ak, 55, 96);
      const start = noten.findIndex(m => m >= 67);
      const m = noten[Phaser.Math.Clamp(start + i, 0, noten.length - 1)];
      let lengte = 1;
      while (pos + lengte < 8 && patroon[pos + lengte] === null) lengte++;
      noot(m, t, d * lengte * 0.92, lied.golf, lied.golf === 'sawtooth' ? 0.07 : 0.1);
    }

    // begeleiding: bas en akkoorden
    const g = basGrond(ak), k = basKwint(ak);
    const stoot = akkoordNoten(ak, 57, 69).slice(0, 3);
    if (lied.stijl === 'polka') {
      // hoem-pa hoem-pa
      if (pos === 0) noot(g, t, d * 1.8, 'triangle', 0.42);
      if (pos === 4) noot(k, t, d * 1.8, 'triangle', 0.42);
      if (pos === 2 || pos === 6) stoot.forEach(n => noot(n, t, d * 0.8, 'square', 0.04));
      if (pos === 0 || pos === 4) kick(t);
      if (pos === 2 || pos === 6) snare(t, 0.3);
      if (pos % 2 === 1) hihat(t);
    } else if (lied.stijl === 'mars') {
      // grondtoon - kwint - octaaf - kwint, akkoord lang eronder
      const basNoten = [g, k + 12, g + 12, k + 12];
      if (pos % 2 === 0) noot(basNoten[pos / 2], t, d * 1.8, 'triangle', 0.4);
      if (pos === 0) stoot.forEach(n => noot(n, t, d * 7, 'triangle', 0.05));
      if (pos === 0 || pos === 4) kick(t);
      if (pos === 4) snare(t);
      if (pos % 2 === 1) hihat(t);
    } else {
      // baas: stampende achtsten op de grondtoon
      if (pos % 2 === 0) noot(pos === 6 ? k + 12 : g, t, d * 1.6, 'sawtooth', 0.16);
      if (pos === 2 || pos === 6) stoot.forEach(n => noot(n, t, d * 0.8, 'square', 0.045));
      if (pos % 2 === 0) kick(t);
      if (pos === 4) snare(t);
      hihat(t);
    }
    // roffel aan het eind van het liedje
    if (laatste && pos >= 4) snare(t, 0.3);
  }

  function plan() {
    if (!ctx) return;
    const d = 60 / tempo / 4;
    while (volgende < ctx.currentTime + 0.12) {
      speelStap(stap, volgende, d);
      volgende += d;
      stap = (stap + 1) % (lied.schema.length * 8);
    }
  }

  return {
    init,
    effect(naam) { if (ctx && effectenAan && EFFECTEN[naam]) EFFECTEN[naam](); },
    muziekAan() {
      init();
      if (!ctx || speelt) return;
      speelt = true; volgende = ctx.currentTime + 0.06; stap = 0;
      timer = setInterval(plan, 25);
    },
    muziekUit() { speelt = false; clearInterval(timer); },
    // kies een liedje; 'sneller' maakt het tempo een beetje hoger (later in het spel)
    speelLied(naam, sneller) {
      const nieuw = LIEDJES[naam] || LIEDJES.polka;
      if (nieuw !== lied) { lied = nieuw; stap = 0; }
      tempo = lied.tempo + (sneller || 0);
    },
    liedjes: Object.keys(LIEDJES),
    muziekIsAan() { return muziekAan; },
    effectenIsAan() { return effectenAan; },
    wisselMuziek() {
      muziekAan = !muziekAan; bewaar('flesje_muziek', muziekAan);
      if (muziek) muziek.gain.value = muziekAan ? MUZIEK_VOL : 0;
      return muziekAan;
    },
    wisselEffecten() {
      effectenAan = !effectenAan; bewaar('flesje_effecten', effectenAan);
      return effectenAan;
    },
  };
})();
