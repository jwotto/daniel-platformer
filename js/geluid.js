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
    const drumVol = ctx.createGain(); drumVol.gain.value = 0.55;
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

  // ---------- MUZIEK: polka in 2/4 met gabber-drums ----------
  // 16 maten van elk 8 zestiende noten: eerst een couplet, dan een refrein. 0 = rust.
  // De melodie gebruikt vooral de noten van het akkoord eronder, zo klinkt het mooi samen.
  const MELODIE = [
    // couplet
    72, 76, 79, 76, 72, 76, 79, 84, //  C
    81, 76, 72, 76, 81, 0, 76, 0, //    Am
    74, 77, 81, 77, 74, 77, 81, 86, //  Dm
    83, 79, 77, 74, 79, 0, 71, 0, //    G7
    76, 77, 79, 81, 79, 77, 76, 74, //  C
    76, 80, 83, 80, 76, 0, 80, 0, //    E7
    81, 80, 81, 83, 84, 83, 81, 76, //  Am
    79, 77, 74, 71, 74, 0, 79, 0, //    G7
    // refrein
    77, 81, 84, 81, 77, 81, 84, 81, //  F
    79, 76, 72, 76, 79, 0, 84, 0, //    C
    83, 79, 74, 79, 83, 86, 83, 79, //  G
    81, 76, 72, 76, 81, 0, 76, 0, //    Am
    77, 76, 77, 81, 84, 81, 77, 76, //  F
    76, 74, 76, 79, 84, 79, 76, 72, //  C
    74, 77, 79, 83, 86, 83, 79, 77, //  G7
    76, 0, 79, 0, 72, 0, 0, 0, //       C
  ];
  // Elk akkoord: twee basnoten (hoempa!) en drie noten voor de stootjes ertussen
  const AK = {
    C: { bas: [48, 43], stoot: [60, 64, 67] },
    Am: { bas: [45, 40], stoot: [60, 64, 69] },
    Dm: { bas: [50, 45], stoot: [62, 65, 69] },
    E7: { bas: [40, 47], stoot: [59, 62, 68] },
    F: { bas: [41, 48], stoot: [60, 65, 69] },
    G: { bas: [43, 50], stoot: [59, 62, 67] },
    G7: { bas: [43, 50], stoot: [59, 65, 67] },
  };
  // het akkoordenschema, één akkoord per maat
  const SCHEMA = [
    'C', 'Am', 'Dm', 'G7', 'C', 'E7', 'Am', 'G7', // couplet
    'F', 'C', 'G', 'Am', 'F', 'C', 'G7', 'C', //    refrein
  ];
  const AKKOORDEN = SCHEMA.map(n => AK[n]);
  const STAPPEN = MELODIE.length;

  let speelt = false, volgende = 0, stap = 0, timer = null, tempo = 192, transpositie = 0, loop = 0;

  function noot(m, t, duur, type, vol) {
    toon(hz(m + transpositie), null, duur, type, vol, muziek, t);
  }
  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    g.gain.setValueAtTime(1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    o.connect(g); g.connect(drums); o.start(t); o.stop(t + 0.26);
    toon(1400, 300, 0.012, 'square', 0.25, drums, t);
  }
  const snare = (t, vol) => { ruisje(0.12, 'bandpass', 1900, null, vol || 0.5, muziek, t); toon(190, 140, 0.06, 'triangle', 0.25, muziek, t); };
  const hihat = t => ruisje(0.03, 'highpass', 8000, null, 0.18, muziek, t);

  function speelStap(s, t, d) {
    const maat = Math.floor(s / 8), pos = s % 8, ak = AKKOORDEN[maat];
    const m = MELODIE[s];
    if (m) noot(m, t, d * 0.9, 'square', 0.12);
    if (pos === 0) noot(ak.bas[0], t, d * 1.6, 'triangle', 0.4);
    if (pos === 4) noot(ak.bas[1], t, d * 1.6, 'triangle', 0.4);
    if (pos === 2 || pos === 6) ak.stoot.forEach(n => noot(n, t, d * 0.7, 'square', 0.045));
    if (pos === 0 || pos === 4) kick(t);
    if (pos === 4) snare(t);
    if (pos % 2 === 1) hihat(t);
    // roffel aan het eind van het couplet en het refrein
    if ((maat === 7 || maat === 15) && pos >= 4) snare(t, 0.35);
  }

  function plan() {
    if (!ctx) return;
    const d = 60 / tempo / 4;
    while (volgende < ctx.currentTime + 0.12) {
      speelStap(stap, volgende, d);
      volgende += d;
      stap = (stap + 1) % STAPPEN;
      if (stap === 0) { loop++; transpositie = loop % 4 === 2 ? 2 : loop % 4 === 3 ? 5 : 0; }
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
    zetTempo(t) { tempo = t; },
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
