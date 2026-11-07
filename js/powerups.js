// Alle power-ups. Je betaalt met volle flesjes (10 shotjes = 1 flesje).
// basis = prijs van de eerste keer, daarna wordt het elke keer 1 flesje duurder.
const POWERUPS = [
  { id: 'dash', naam: 'Dash', basis: 2, max: 5, uitleg: [
    'Zoef alle kanten op. Shift of de DASH-knop.',
    'Verder en sneller dashen.',
    '2 dashes voordat je moet landen.',
    'Nog verder dashen.',
    '3 dashes voordat je moet landen.'] },
  { id: 'dubbel', naam: 'Dubbele sprong', basis: 2, max: 3, uitleg: [
    'Spring nog een keer in de lucht.',
    'Driedubbele sprong!',
    'Vier sprongen achter elkaar!'] },
  { id: 'hart', naam: 'Extra hartje', basis: 1, max: 5, uitleg: [
    'Eén hartje erbij. Je kunt een klap meer hebben.'] },
  { id: 'pijlen', naam: 'Dubbele pijlen', basis: 2, max: 4, uitleg: [
    'Schiet 2 pijlen tegelijk.',
    'Schiet 3 pijlen tegelijk.',
    'Schiet 4 pijlen tegelijk.',
    'Schiet 5 pijlen tegelijk!'] },
  { id: 'slash', naam: 'Sterkere slash', basis: 1, max: 5, uitleg: [
    'Je slash doet meer schade en raakt verder.'] },
  { id: 'zweef', naam: 'Zweven', basis: 1, max: 3, uitleg: [
    'Houd springen vast in de lucht om te zweven.',
    'Langzamer zweven.',
    'Nog langzamer zweven.'] },
  { id: 'muur', naam: 'Wall jump', basis: 2, max: 2, uitleg: [
    'Spring tegen muren omhoog.',
    'Langzamer langs muren glijden.'] },
  { id: 'smash', naam: 'Smash', basis: 2, max: 4, uitleg: [
    'In de lucht omlaag: knal naar beneden!',
    'Grotere en hardere klap.'] },
  { id: 'boem', naam: 'Ontploffende pijlen', basis: 3, max: 4, uitleg: [
    'Je pijlen ontploffen!',
    'Grotere ontploffing.'] },
];

const THEMAS = [
  { id: 'rivier', naam: 'Rivierlevel' },
  { id: 'berg', naam: 'Berglevel' },
];

function prijs(p, niveau) { return p.basis + niveau; }

function nieuweRun() {
  const up = {};
  POWERUPS.forEach(p => { up[p.id] = 0; });
  return { level: 0, up, harten: 3, shotjes: 0, flessen: 0, meters: 0 };
}

function maxHarten(run) { return 3 + run.up.hart; }
