// Power-ups, regio's, eindbazen en opslaan.

// Je betaalt met volle flesjes (10 shotjes = 1 flesje).
// Drie soorten:
// - gewoon (met een MAX): elk niveau 1,6× duurder
// - oneindig (geen MAX): je kunt blijven kopen, maar elk niveau is 1,35× duurder
// - heel duur: hoge basisprijs
// vanaf = vanaf welke regio je hem kunt kopen (0 = meteen, 10 = als je de Maan hebt verslagen)
const ONEINDIG = 999;
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
  { id: 'hart', naam: 'Extra hartje', basis: 1, max: ONEINDIG, uitleg: [
    'Eén hartje erbij. Blijf kopen voor nog meer!'] },
  { id: 'zweef', naam: 'Zweven', basis: 1, max: 3, uitleg: [
    'Houd springen vast in de lucht om te zweven.',
    'Langzamer zweven.',
    'Nog langzamer zweven.'] },
  { id: 'slash', naam: 'Sterkere slash', basis: 1, max: ONEINDIG, uitleg: [
    'Meer schade met je slash (en verder, tot niveau 5).'] },
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
  { id: 'behendig', naam: 'Behendigheid', basis: 2, max: 10, uitleg: [
    'Elk niveau: 3% sneller lopen en 2% hoger springen (max 10, anders ben je té snel).'] },
  { id: 'boogkracht', naam: 'Boogkracht', basis: 2, max: ONEINDIG, uitleg: [
    'Elk niveau: je pijlen doen 15% meer schade.'] },
  { id: 'krit', naam: 'Kritieke klap', basis: 3, max: ONEINDIG, vanaf: 2, uitleg: [
    'Kans dat een klap dubbel zo hard aankomt (KRIT!). Groeit per niveau, nooit meer dan 50%.'] },
  // ---- de dure, gekke power-ups ----
  { id: 'schild', naam: 'Schuimschild', basis: 6, max: 2, vanaf: 2, uitleg: [
    'Een bel van bierschuim om je heen. Vangt 1 klap per potje op.',
    'Twee schuimbellen: 2 klappen per potje.'] },
  { id: 'maatje', naam: 'Flesmaatje', basis: 30, max: 3, vanaf: 6, uitleg: [
    'Een klein flesje vliegt met je mee en schiet zelf op monsters.',
    'Je maatje schiet sneller.',
    'Je maatje schiet als een gek!'] },
  { id: 'stomp', naam: 'Bierbuik-stamp', basis: 5, max: 2, vanaf: 2, uitleg: [
    'Spring bovenop een monster: AU! en je stuitert omhoog.',
    'Harder stampen: dubbele schade.'] },
  { id: 'reserve', naam: 'Reservevat', basis: 100, max: 1, vanaf: 10, uitleg: [
    'Ga je dood? Dan krijg je 1 keer per potje een tweede kans.'] },
  { id: 'boer', naam: 'Boerbom', basis: 20, max: 3, vanaf: 6, uitleg: [
    'Word je geraakt? Dan laat je een enorme boer die monsters wegblaast.',
    'Grotere boer.',
    'MEGA-BOER!'] },
  { id: 'magneet', naam: 'Magneetkurk', basis: 4, max: 2, vanaf: 2, uitleg: [
    'Shotjes vliegen van ver naar je toe.',
    'Shotjes van het hele scherm vliegen naar je toe.'] },
  { id: 'statiegeld', naam: 'Statiegeld', basis: 4, max: ONEINDIG, vanaf: 4, uitleg: [
    'Elk niveau: elk verslagen monster laat 1 shotje extra vallen.'] },
  { id: 'doorboor', naam: 'Doorboorpijlen', basis: 40, max: 1, vanaf: 6, uitleg: [
    'Je pijlen gaan dwars door alle monsters heen.'] },
  { id: 'slok', naam: 'Herstelslok', basis: 8, max: 2, vanaf: 4, uitleg: [
    'Na elke 20 verslagen monsters krijg je een hartje terug.',
    'Al na elke 12 monsters een hartje terug.'] },
  { id: 'kebabradar', naam: 'Kebabradar', basis: 4, max: 2, vanaf: 4, uitleg: [
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
  // het allerlaatste level: pas open als je alle andere levels hebt gehaald
  { id: 'alexgrot', naam: 'Terminatorgrot', baas: 'alexander', baasNaam: 'Alexander de Terminator' },
  // en dan het allerallerlaatste, ultra-ultramoeilijke level: pas open na Alexander
  { id: 'happy', naam: 'Jantje Willie Happy Place', baas: 'worst', baasNaam: 'De Grote Roze Worst' },
];

function regioVan(n) { return REGIOS[n % REGIOS.length]; }
function rondeVan(n) { return Math.floor(n / REGIOS.length); }
function levelNaam(n) { const r = rondeVan(n); return regioVan(n).naam + (r > 0 ? ' ' + (r + 1) : ''); }
// Hoe verder je bent, hoe meer een shotje waard is
function shotWaarde(n) { return 1 + n; }
// Een gevecht met de eindbaas is duur!
// (in Jantje Willie Happy Place is alles duurder: het gevecht kost 3×)
function baasPrijs(n) { const p = 15 + n * 12; return regioVan(n).id === 'happy' ? p * 3 : p; }
// Wat je krijgt als je hem verslaat: altijd meer dan je betaalt
// een baas die je al verslagen hebt nog eens doen levert iets minder op (maar nog steeds meer dan de prijs)
function baasBeloning(n) { return baasPrijs(n) + (n < PROFIEL.regio ? 5 + n * 2 : 10 + n * 5); }

function oneindig(p) { return p.max === ONEINDIG; }
// Kritieke klap: kans op dubbele schade. Groeit steeds minder snel en komt nooit boven de 50%.
function kritKans(niveau) { return 0.5 * (1 - Math.pow(0.9, niveau || 0)); }
function prijs(p, niveau) { return Math.round(p.basis * 3 * Math.pow(oneindig(p) ? 1.35 : 1.6, niveau)); }
// kun je hem al kopen? (sommige power-ups gaan pas open in latere regio's)
function powerupOpen(p) { return PROFIEL.regio >= (p.vanaf || 0); }
function vanafNaam(n) { return n >= 10 ? 'na de Maan' : 'vanaf ' + REGIOS[n].naam; }
const GOKKAST_VANAF = 2, DIEREN_VANAF = 10;
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
  // de schildpad geeft extra hartjes
  return Math.max(1, maxHarten() + k.harten + Math.ceil(dierLvl('schildpad') / 2));
}

// ---------- OPSLAAN ----------
// Je flesjes, power-ups en regio's worden in de browser bewaard, ook als je doodgaat.
// Nieuwe naam = iedereen begint opnieuw (de oude voortgang wordt niet meer gelezen).
// v3: reset op 8 november 2026, na de grote balans-update.
const OPSLAG = 'flesje_profiel_v3';
try { localStorage.removeItem('flesje_profiel_v2'); } catch (e) { /* geeft niks */ }
const TESTMODUS = ['#test', '#winkel', '#shop', '#kebab', '#baas', '#ijs', '#berg', '#vulkaan', '#grot', '#savanne', '#kroeg', '#fabriek', '#speeltuin', '#maan', '#prestaties', '#gokkast', '#levels', '#dieren', '#kist', '#spel'].some(h => location.hash.startsWith(h));

function laadProfiel() {
  const p = { up: {}, flessen: 0, shotjes: 0, beste: 0, regio: 0, startRegio: 0, ticket: false, skin: 'standaard', skins: ['standaard'], draaien: 0, keuze: '', bazen: 0, aan: {}, stats: {}, prestaties: [], dier: '', dieren: {}, sterren: 0 };
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
      if (typeof d.dier === 'string') p.dier = d.dier;
      if (d.dieren && typeof d.dieren === 'object') for (const [k, w] of Object.entries(d.dieren)) if (typeof w === 'number') p.dieren[k] = Math.min(5, w);
      p.sterren = Number(d.sterren) || 0;
      if (typeof d.laatsteDag === 'string') p.laatsteDag = d.laatsteDag;
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
  // het eerste potje van de dag: shotjes ×2
  const vandaag = new Date().toDateString();
  const dagbonus = PROFIEL.laatsteDag !== vandaag;
  PROFIEL.laatsteDag = vandaag;
  bewaarProfiel();
  return { level, up: actieveUp(), harten: hartenMet(keuze), baas: !!baas, keuze, dagbonus };
}
