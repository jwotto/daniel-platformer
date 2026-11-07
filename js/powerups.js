// Power-ups, regio's, eindbazen en opslaan.

// Je betaalt met volle flesjes (10 shotjes = 1 flesje).
// Prijs = basis × 3 × (niveau + 1). Elke keer dat je hem koopt wordt hij duurder.
const POWERUPS = [
  { id: 'dash', naam: 'Dash', basis: 2, max: 5, uitleg: [
    'Zoef alle kanten op. Shift of DASH-knop.',
    'Verder en sneller dashen.',
    '2 dashes voordat je moet landen.',
    'Nog verder dashen.',
    '3 dashes voordat je moet landen.'] },
  { id: 'dubbel', naam: 'Dubbele sprong', basis: 2, max: 3, uitleg: [
    'Spring nog een keer in de lucht.',
    'Driedubbele sprong!',
    'Vier sprongen achter elkaar!'] },
  { id: 'muur', naam: 'Wall jump', basis: 2, max: 2, uitleg: [
    'Klim tegen muren op: duw tegen de muur en druk steeds op springen.',
    'Langzamer langs muren glijden.'] },
  { id: 'hart', naam: 'Extra hartje', basis: 1, max: 5, uitleg: [
    'Eén hartje erbij.'] },
  { id: 'zweef', naam: 'Zweven', basis: 1, max: 3, uitleg: [
    'Houd springen vast in de lucht om te zweven.',
    'Langzamer zweven.',
    'Nog langzamer zweven.'] },
  { id: 'slash', naam: 'Sterkere slash', basis: 1, max: 5, uitleg: [
    'Meer schade en je raakt verder.'] },
  { id: 'pijlen', naam: 'Dubbele pijlen', basis: 2, max: 4, uitleg: [
    'Schiet 2 pijlen tegelijk.',
    'Schiet 3 pijlen tegelijk.',
    'Schiet 4 pijlen tegelijk.',
    'Schiet 5 pijlen tegelijk!'] },
  { id: 'boem', naam: 'Ontploffende pijlen', basis: 3, max: 4, uitleg: [
    'Je pijlen ontploffen!',
    'Grotere ontploffing.'] },
  { id: 'smash', naam: 'Smash', basis: 2, max: 4, uitleg: [
    'In de lucht omlaag: knal naar beneden!',
    'Grotere en hardere klap.'] },
  // ---- de dure, gekke power-ups ----
  { id: 'schild', naam: 'Schuimschild', basis: 5, max: 2, uitleg: [
    'Een bel van bierschuim om je heen. Vangt 1 klap per potje op.',
    'Twee schuimbellen: 2 klappen per potje.'] },
  { id: 'maatje', naam: 'Flesmaatje', basis: 6, max: 3, uitleg: [
    'Een klein flesje vliegt met je mee en schiet zelf op monsters.',
    'Je maatje schiet sneller.',
    'Je maatje schiet als een gek!'] },
  { id: 'stomp', naam: 'Bierbuik-stamp', basis: 4, max: 2, uitleg: [
    'Spring bovenop een monster: AU! en je stuitert omhoog.',
    'Harder stampen: dubbele schade.'] },
  { id: 'reserve', naam: 'Reservevat', basis: 10, max: 1, uitleg: [
    'Ga je dood? Dan krijg je 1 keer per potje een tweede kans.'] },
  { id: 'boer', naam: 'Boerbom', basis: 4, max: 3, uitleg: [
    'Word je geraakt? Dan laat je een enorme boer die monsters wegblaast.',
    'Grotere boer.',
    'MEGA-BOER!'] },
  { id: 'magneet', naam: 'Magneetkurk', basis: 3, max: 2, uitleg: [
    'Shotjes vliegen van ver naar je toe.',
    'Shotjes van het hele scherm vliegen naar je toe.'] },
  { id: 'statiegeld', naam: 'Statiegeld', basis: 4, max: 3, uitleg: [
    'Elk verslagen monster laat 1 shotje extra vallen.',
    '2 shotjes extra per monster.',
    '3 shotjes extra per monster.'] },
  { id: 'doorboor', naam: 'Doorboorpijlen', basis: 6, max: 1, uitleg: [
    'Je pijlen gaan dwars door alle monsters heen.'] },
  { id: 'slok', naam: 'Herstelslok', basis: 5, max: 2, uitleg: [
    'Na elke 20 verslagen monsters krijg je een hartje terug.',
    'Al na elke 12 monsters een hartje terug.'] },
  { id: 'kebabradar', naam: 'Kebabradar', basis: 3, max: 2, uitleg: [
    'Veel vaker kebabrollen (PRRRT!).',
    'Kebab overal!'] },
];

// De regio's. Elke regio loopt eindeloos door. Versla de eindbaas om verder te mogen.
const REGIOS = [
  { id: 'rivier', naam: 'Rivier', baas: 'pad', baasNaam: 'Koning Bierpad' },
  { id: 'ijs', naam: 'IJsvlakte', baas: 'beer', baasNaam: 'De IJsbierbeer' },
  { id: 'berg', naam: 'Bergen', baas: 'geit', baasNaam: 'De Bokbiergeit' },
  { id: 'vulkaan', naam: 'Vulkaan', baas: 'draak', baasNaam: 'De Brouwdraak' },
  { id: 'grot', naam: 'Grot', baas: 'salamander', baasNaam: 'De Salamander' },
  { id: 'savanne', naam: 'Savanne', baas: 'lepelaar', baasNaam: 'De Lepelaar' },
  { id: 'kroeg', naam: 'Kroeg', baas: 'kroegbaas', baasNaam: 'De Kroegbaas' },
  { id: 'fabriek', naam: 'Fabriek', baas: 'machine', baasNaam: 'De Brouwmachine' },
  { id: 'speeltuin', naam: 'Speeltuin', baas: 'clown', baasNaam: 'De Eenwielerclown' },
  { id: 'maan', naam: 'Maan', baas: 'moederschip', baasNaam: 'Het Moederschip' },
];

function regioVan(n) { return REGIOS[n % REGIOS.length]; }
function rondeVan(n) { return Math.floor(n / REGIOS.length); }
function levelNaam(n) { const r = rondeVan(n); return regioVan(n).naam + (r > 0 ? ' ' + (r + 1) : ''); }
// Hoe verder je bent, hoe meer een shotje waard is
function shotWaarde(n) { return 1 + n; }
// Een gevecht met de eindbaas is duur!
function baasPrijs(n) { return 15 + n * 12; }
// Wat je krijgt als je hem verslaat: altijd meer dan je betaalt
function baasBeloning(n) { return baasPrijs(n) + 10 + n * 5; }

function prijs(p, niveau) { return p.basis * 3 * (niveau + 1); }
function uitlegVan(p, niveau) { return p.uitleg[Math.min(niveau, p.uitleg.length - 1)]; }

// ---------- KEUZES NA DOODGAAN ----------
// Na elke keer doodgaan kies je 1 van 3 upgrades voor je volgende potje.
// Elke upgrade heeft iets goeds (plus) en iets slechts (min).
// loop/sprong/shot/schade/zwaarte zijn keer-getallen, harten telt erbij op (of 'hartenVast' zet hem vast).
const KEUZES = [
  { id: 'springveer', naam: 'Springveer', plus: '1.2× zo hoog springen', min: '0.8× zo snel lopen', sprong: 1.2, loop: 0.8 },
  { id: 'gulzig', naam: 'Gulzig', plus: '1.5× zoveel shotjes', min: 'maar 1 hartje', shot: 1.5, hartenVast: 1 },
  { id: 'renner', naam: 'Renner', plus: '1.3× zo snel lopen', min: '0.9× zo hoog springen', loop: 1.3, sprong: 0.9 },
  { id: 'tank', naam: 'Tank', plus: '2 hartjes extra', min: '0.85× zo snel lopen', harten: 2, loop: 0.85 },
  { id: 'kanon', naam: 'Glazen kanon', plus: '2× zoveel schade', min: '2 hartjes minder', schade: 2, harten: -2 },
  { id: 'maan', naam: 'Maanmannetje', plus: 'zweven als op de maan', min: '0.7× zoveel shotjes', zwaarte: 0.7, shot: 0.7 },
  { id: 'kracht', naam: 'Krachtpatser', plus: '1.5× zoveel schade', min: '0.9× zo hoog springen', schade: 1.5, sprong: 0.9 },
  { id: 'spaarvarken', naam: 'Spaarvarken', plus: '2× zoveel shotjes', min: '0.6× zoveel schade', shot: 2, schade: 0.6 },
  { id: 'raket', naam: 'Raket', plus: '1.2× lopen en 1.15× springen', min: '1 hartje minder', loop: 1.2, sprong: 1.15, harten: -1 },
  { id: 'zwaar', naam: 'Zware jongen', plus: '3 hartjes extra', min: 'zwaarder: je valt sneller', harten: 3, zwaarte: 1.2 },
];
const GEEN_KEUZE = { id: '', naam: '', loop: 1, sprong: 1, shot: 1, schade: 1, zwaarte: 1, harten: 0 };
function keuzeVan(id) { return Object.assign({}, GEEN_KEUZE, KEUZES.find(k => k.id === id) || {}); }
function drieKeuzes() { return Phaser.Utils.Array.Shuffle(KEUZES.slice()).slice(0, 3); }
// hoeveel hartjes je hebt met een keuze erbij (altijd minstens 1)
function hartenMet(id) {
  const k = keuzeVan(id);
  if (k.hartenVast) return k.hartenVast;
  return Math.max(1, maxHarten() + k.harten);
}

// ---------- OPSLAAN ----------
// Je flesjes, power-ups en regio's worden in de browser bewaard, ook als je doodgaat.
const OPSLAG = 'flesje_profiel_v2';
const TESTMODUS = ['#test', '#winkel', '#shop', '#kebab', '#baas', '#ijs', '#berg', '#vulkaan', '#grot', '#savanne', '#kroeg', '#fabriek', '#speeltuin', '#maan', '#prestaties', '#spel'].some(h => location.hash.startsWith(h));

function laadProfiel() {
  const p = { up: {}, flessen: 0, shotjes: 0, beste: 0, regio: 0, startRegio: 0, ticket: false, skin: 'standaard', skins: ['standaard'], draaien: 0, keuze: '', bazen: 0, aan: {}, stats: {}, prestaties: [] };
  POWERUPS.forEach(x => { p.up[x.id] = 0; });
  if (TESTMODUS) return p;
  try {
    const d = JSON.parse(localStorage.getItem(OPSLAG));
    if (d) {
      Object.keys(p.up).forEach(k => { p.up[k] = Number(d.up && d.up[k]) || 0; });
      for (const k of ['flessen', 'shotjes', 'beste', 'regio', 'startRegio']) p[k] = Number(d[k]) || 0;
      // ticket = voor welke baas je een gevecht hebt gekocht (of false)
      p.ticket = d.ticket === true ? p.regio : (typeof d.ticket === 'number' ? d.ticket : false);
      if (typeof d.skin === 'string') p.skin = d.skin;
      if (Array.isArray(d.skins)) p.skins = d.skins.filter(x => typeof x === 'string');
      if (!p.skins.includes('standaard')) p.skins.unshift('standaard');
      if (!p.skins.includes(p.skin)) p.skin = 'standaard';
      p.draaien = Number(d.draaien) || 0;
      p.bazen = Number(d.bazen) || 0;
      if (d.stats && typeof d.stats === 'object') for (const [k, w] of Object.entries(d.stats)) if (typeof w === 'number') p.stats[k] = w;
      if (Array.isArray(d.prestaties)) p.prestaties = d.prestaties.filter(x => typeof x === 'string');
      if (d.aan && typeof d.aan === 'object') for (const k of Object.keys(p.up)) if (typeof d.aan[k] === 'number') p.aan[k] = d.aan[k];
      if (typeof d.keuze === 'string') p.keuze = d.keuze;
    }
  } catch (e) { /* niks bewaard */ }
  return p;
}
const PROFIEL = laadProfiel();

function bewaarProfiel() {
  if (TESTMODUS) return;
  try { localStorage.setItem(OPSLAG, JSON.stringify(PROFIEL)); } catch (e) { /* lukt niet in privé-venster */ }
}

// Het niveau dat AAN staat (je kunt een power-up lager zetten dan wat je gekocht hebt)
function aanNiveau(id) {
  const heb = PROFIEL.up[id] || 0, aan = PROFIEL.aan[id];
  return aan === undefined ? heb : Math.min(aan, heb);
}
function actieveUp() {
  const up = {};
  POWERUPS.forEach(p => { up[p.id] = aanNiveau(p.id); });
  return up;
}
function maxHarten() { return 3 + aanNiveau('hart'); }

// Een nieuw potje. Je gekozen upgrade geldt alleen voor dit potje, daarna is hij op.
function nieuweRun(baas, baasRegio) {
  const level = baas ? (baasRegio !== undefined ? baasRegio : PROFIEL.regio) : Math.min(PROFIEL.startRegio, PROFIEL.regio);
  const keuze = PROFIEL.keuze || '';
  PROFIEL.keuze = '';
  statTel('potjes');
  bewaarProfiel();
  return { level, up: actieveUp(), harten: hartenMet(keuze), baas: !!baas, keuze };
}
