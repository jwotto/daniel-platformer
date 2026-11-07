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
];

// De regio's. Elke regio loopt eindeloos door. Versla de eindbaas om verder te mogen.
const REGIOS = [
  { id: 'rivier', naam: 'Rivier', baas: 'pad', baasNaam: 'Koning Bierpad' },
  { id: 'ijs', naam: 'IJsvlakte', baas: 'beer', baasNaam: 'De IJsbierbeer' },
  { id: 'berg', naam: 'Bergen', baas: 'geit', baasNaam: 'De Bokbiergeit' },
  { id: 'vulkaan', naam: 'Vulkaan', baas: 'draak', baasNaam: 'De Brouwdraak' },
];

function regioVan(n) { return REGIOS[n % REGIOS.length]; }
function rondeVan(n) { return Math.floor(n / REGIOS.length); }
function levelNaam(n) { const r = rondeVan(n); return regioVan(n).naam + (r > 0 ? ' ' + (r + 1) : ''); }
// Hoe verder je bent, hoe meer een shotje waard is
function shotWaarde(n) { return 1 + n; }
// Een gevecht met de eindbaas is duur!
function baasPrijs(n) { return 15 + n * 12; }

function prijs(p, niveau) { return p.basis * 3 * (niveau + 1); }
function uitlegVan(p, niveau) { return p.uitleg[Math.min(niveau, p.uitleg.length - 1)]; }

// ---------- OPSLAAN ----------
// Je flesjes, power-ups en regio's worden in de browser bewaard, ook als je doodgaat.
const OPSLAG = 'flesje_profiel_v2';
const TESTMODUS = ['#test', '#winkel', '#shop', '#kebab', '#baas', '#ijs', '#berg', '#vulkaan', '#spel'].some(h => location.hash.startsWith(h));

function laadProfiel() {
  const p = { up: {}, flessen: 0, shotjes: 0, beste: 0, regio: 0, startRegio: 0, ticket: false, skin: 'standaard', skins: ['standaard'], draaien: 0 };
  POWERUPS.forEach(x => { p.up[x.id] = 0; });
  if (TESTMODUS) return p;
  try {
    const d = JSON.parse(localStorage.getItem(OPSLAG));
    if (d) {
      Object.keys(p.up).forEach(k => { p.up[k] = Number(d.up && d.up[k]) || 0; });
      for (const k of ['flessen', 'shotjes', 'beste', 'regio', 'startRegio']) p[k] = Number(d[k]) || 0;
      p.ticket = !!d.ticket;
      if (typeof d.skin === 'string') p.skin = d.skin;
      if (Array.isArray(d.skins)) p.skins = d.skins.filter(x => typeof x === 'string');
      if (!p.skins.includes('standaard')) p.skins.unshift('standaard');
      if (!p.skins.includes(p.skin)) p.skin = 'standaard';
      p.draaien = Number(d.draaien) || 0;
    }
  } catch (e) { /* niks bewaard */ }
  return p;
}
const PROFIEL = laadProfiel();

function bewaarProfiel() {
  if (TESTMODUS) return;
  try { localStorage.setItem(OPSLAG, JSON.stringify(PROFIEL)); } catch (e) { /* lukt niet in privé-venster */ }
}

function maxHarten() { return 3 + PROFIEL.up.hart; }

function nieuweRun(baas) {
  const level = baas ? PROFIEL.regio : Math.min(PROFIEL.startRegio, PROFIEL.regio);
  return { level, up: PROFIEL.up, harten: maxHarten(), baas: !!baas };
}
