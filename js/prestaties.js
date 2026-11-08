// Prestaties: 40 doelen, van makkelijk naar moeilijk. Haal je er een, dan krijg je flesjes.
// Elke prestatie kijkt naar één teller in PROFIEL.stats: haal je het 'doel', dan is hij binnen.

const PRESTATIES = [
  { id: 'eerste', naam: 'Eerste stapjes', uitleg: 'Speel je eerste potje', stat: 'potjes', doel: 1, beloning: 1 },
  { id: 'au', naam: 'Au!', uitleg: 'Ga voor het eerst dood', stat: 'dood', doel: 1, beloning: 1 },
  { id: 'jager', naam: 'Monsterjager', uitleg: 'Versla je eerste monster', stat: 'monsters', doel: 1, beloning: 1 },
  { id: 'plons', naam: 'Plons!', uitleg: 'Val in het water', stat: 'plons', doel: 1, beloning: 1 },
  { id: 'flesje', naam: 'Eerste flesje', uitleg: 'Vul je eerste flesje met shotjes', stat: 'flesVol', doel: 1, beloning: 1 },
  { id: 'kebab1', naam: 'PRRRT!', uitleg: 'Eet een kebabrol', stat: 'kebab', doel: 1, beloning: 2 },
  { id: 'shoppen', naam: 'Shoppen', uitleg: 'Koop je eerste power-up', stat: 'koop', doel: 1, beloning: 2 },
  { id: 'gok', naam: 'Gokje wagen', uitleg: 'Draai aan de gokkast', stat: 'gokken', doel: 1, beloning: 1 },
  { id: 'rad', naam: 'Draaien maar', uitleg: 'Draai aan het rad in de shop', stat: 'draai', doel: 1, beloning: 2 },
  { id: 'm100', naam: '100 meter', uitleg: 'Kom 100 meter ver in één potje', stat: 'meters', doel: 100, beloning: 2 },
  { id: 'tien', naam: 'Tien op een rij', uitleg: 'Versla 10 monsters', stat: 'monsters', doel: 10, beloning: 2 },
  { id: 'slasher', naam: 'Slasher', uitleg: 'Versla 25 monsters door te slaan', stat: 'slash', doel: 25, beloning: 3 },
  { id: 'schutter', naam: 'Scherpschutter', uitleg: 'Versla 25 monsters met pijlen', stat: 'pijl', doel: 25, beloning: 3 },
  { id: 'stamper', naam: 'Stamper', uitleg: 'Versla 10 monsters door erop te springen', stat: 'stamp', doel: 10, beloning: 3 },
  { id: 'kist', naam: 'Schatzoeker', uitleg: 'Open een schatkist', stat: 'kisten', doel: 1, beloning: 2 },
  { id: 'goud1', naam: 'Goudzoeker', uitleg: 'Vang een gouden flesje', stat: 'goud', doel: 1, beloning: 3 },
  { id: 'm300', naam: '300 meter', uitleg: 'Kom 300 meter ver in één potje', stat: 'meters', doel: 300, beloning: 3 },
  { id: 'pad', naam: 'Koning gevloerd', uitleg: 'Versla Koning Bierpad', stat: 'baas_pad', doel: 1, beloning: 4 },
  { id: 'vijftig', naam: 'Monsterplaag', uitleg: 'Versla 50 monsters', stat: 'monsters', doel: 50, beloning: 4 },
  { id: 'skins3', naam: 'Verzamelaar', uitleg: 'Heb 3 skins', stat: 'skins', doel: 3, beloning: 4 },
  { id: 'kebab10', naam: 'Scheetkampioen', uitleg: 'Eet 10 kebabrollen', stat: 'kebab', doel: 10, beloning: 5 },
  { id: 'beer', naam: 'IJsbreker', uitleg: 'Versla De IJsbierbeer', stat: 'baas_beer', doel: 1, beloning: 5 },
  { id: 'spaar25', naam: 'Spaarpot', uitleg: 'Verdien in totaal 25 flesjes', stat: 'flessenTotaal', doel: 25, beloning: 5 },
  { id: 'm500', naam: '500 meter', uitleg: 'Kom 500 meter ver in één potje', stat: 'meters', doel: 500, beloning: 5 },
  { id: 'potje25', naam: 'Slachtpartij', uitleg: 'Versla 25 monsters in één potje', stat: 'potjeMonsters', doel: 25, beloning: 6 },
  { id: 'geit', naam: 'Bokkensprong', uitleg: 'Versla De Bokbiergeit', stat: 'baas_geit', doel: 1, beloning: 6 },
  { id: 'koop15', naam: 'Power-up gek', uitleg: 'Koop 15 power-ups', stat: 'koop', doel: 15, beloning: 6 },
  { id: 'goud5', naam: 'Goudkoorts', uitleg: 'Vang 5 gouden flesjes', stat: 'goud', doel: 5, beloning: 7 },
  { id: 'draak', naam: 'Drakendoder', uitleg: 'Versla De Brouwdraak', stat: 'baas_draak', doel: 1, beloning: 8 },
  { id: 'monsters200', naam: 'Monsterverdelger', uitleg: 'Versla 200 monsters', stat: 'monsters', doel: 200, beloning: 8 },
  { id: 'salamander', naam: 'Grottenkruiper', uitleg: 'Versla De Salamander', stat: 'baas_salamander', doel: 1, beloning: 9 },
  { id: 'lepelaar', naam: 'Zwaartekrachtloos', uitleg: 'Versla De Lepelaar', stat: 'baas_lepelaar', doel: 1, beloning: 10 },
  { id: 'm1000', naam: 'Kilometervreter', uitleg: 'Kom 1000 meter ver in één potje', stat: 'meters', doel: 1000, beloning: 10 },
  { id: 'gaaf', naam: 'Onaantastbaar', uitleg: 'Versla een eindbaas zonder geraakt te worden', stat: 'zonderGeraakt', doel: 1, beloning: 12 },
  { id: 'nippertje', naam: 'Op het nippertje', uitleg: 'Versla een eindbaas met nog maar 1 hartje', stat: 'eenHart', doel: 1, beloning: 12 },
  { id: 'kroegbaas', naam: 'Kroegtijger', uitleg: 'Versla De Kroegbaas', stat: 'baas_kroegbaas', doel: 1, beloning: 12 },
  { id: 'machine', naam: 'Fabrieksbaas', uitleg: 'Versla De Brouwmachine', stat: 'baas_machine', doel: 1, beloning: 14 },
  { id: 'clown', naam: 'Clownsneus', uitleg: 'Versla De Eenwielerclown', stat: 'baas_clown', doel: 1, beloning: 16 },
  { id: 'moederschip', naam: 'Maanlander', uitleg: 'Versla Het Moederschip', stat: 'baas_moederschip', doel: 1, beloning: 18 },
  { id: 'alexander', naam: 'Terminator-terminator', uitleg: 'Versla Alexander de Terminator', stat: 'baas_alexander', doel: 1, beloning: 40 },
  { id: 'worst', naam: 'Worstenbroodje', uitleg: 'Versla De Grote Roze Worst', stat: 'baas_worst', doel: 1, beloning: 60 },
  { id: 'alleskins', naam: 'Modekoning', uitleg: 'Verzamel alle skins', stat: 'skins', doel: () => SKINS.length, beloning: 20 },
  { id: 'dier1', naam: 'Baasje', uitleg: 'Win je eerste huisdier', stat: 'dieren', doel: 1, beloning: 10 },
  { id: 'ster', naam: 'Opnieuw gebrouwen', uitleg: 'Brouw opnieuw en verdien een ster', stat: 'prestige', doel: 1, beloning: 25 },
  { id: 'legende', naam: 'BVO-legende', uitleg: 'Verdien in totaal 500 flesjes', stat: 'flessenTotaal', doel: 500, beloning: 30 },
];

// prestaties die nog in beeld moeten komen (gehaald terwijl er geen scherm was)
const NOG_MELDEN = [];
function meldOpenPrestaties(scene) {
  NOG_MELDEN.splice(0).forEach((p, i) => scene.time.delayedCall(600 + i * 1600, () => toonPrestatie(scene, p)));
}

function statVan(naam) {
  if (naam === 'skins') return PROFIEL.skins.length;
  return PROFIEL.stats[naam] || 0;
}
function doelVan(p) { return typeof p.doel === 'function' ? p.doel() : p.doel; }

// teller ophogen
function statTel(naam, n) { PROFIEL.stats[naam] = (PROFIEL.stats[naam] || 0) + (n === undefined ? 1 : n); }
// teller op minstens deze waarde zetten (voor "beste ooit")
function statMax(naam, w) { PROFIEL.stats[naam] = Math.max(PROFIEL.stats[naam] || 0, w); }

// Kijk welke prestaties nu binnen zijn; geef de flesjes en laat een melding zien
function checkPrestaties(scene) {
  const nieuw = PRESTATIES.filter(p => !PROFIEL.prestaties.includes(p.id) && statVan(p.stat) >= doelVan(p));
  if (!nieuw.length) return;
  for (const p of nieuw) {
    PROFIEL.prestaties.push(p.id);
    PROFIEL.flessen += p.beloning;
    statTel('flessenTotaal', p.beloning);
  }
  bewaarProfiel();
  if (scene && scene.add) nieuw.forEach((p, i) => scene.time.delayedCall(i * 1600, () => toonPrestatie(scene, p)));
  else NOG_MELDEN.push(...nieuw); // geen scherm? dan laten we hem straks zien
  // misschien maakt de beloning weer een nieuwe prestatie los (Spaarpot)
  checkPrestaties(scene);
}

// melding bovenin: "🏆 Prestatie: ... +N flesjes"
function toonPrestatie(scene, p) {
  if (!scene.sys || !scene.sys.isActive()) return;
  const c = scene.add.container(480, -40).setDepth(500);
  if (c.setScrollFactor) c.setScrollFactor(0);
  const g = scene.add.graphics();
  g.fillStyle(0x0a1028, 0.95).fillRoundedRect(-220, -26, 440, 52, 26);
  g.lineStyle(3, 0xf2c14e, 1).strokeRoundedRect(-220, -26, 440, 52, 26);
  const t = scene.add.text(0, 0, `🏆 ${p.naam}!   +${p.beloning} flesje${p.beloning === 1 ? '' : 's'}`, {
    fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: '#f2c14e',
  }).setOrigin(0.5);
  c.add([g, t]);
  Geluid.effect('prijs');
  scene.tweens.add({ targets: c, y: 40, duration: 350, ease: 'Back.easeOut' });
  scene.tweens.add({ targets: c, y: -40, delay: 2300, duration: 300, onComplete: () => c.destroy() });
}

// ---------- HET PRESTATIESCHERM ----------
class Prestaties extends Phaser.Scene {
  constructor() { super('Prestaties'); }

  create(data) {
    // waar ga je heen met "Terug"? Normaal het titelscherm, vanuit de winkel terug naar de winkel
    this.terugNaar = (data && data.terugNaar) || 'Titel';
    this.terugData = data && data.terugData;
    this.weg = false;
    this.add.image(0, 0, 'lucht_rivier').setOrigin(0);
    this.add.rectangle(0, 0, 960, 540, 0x0a1028, 0.6).setOrigin(0);
    const klaar = PRESTATIES.filter(p => PROFIEL.prestaties.includes(p.id)).length;
    this.add.text(480, 10, `Prestaties  ${klaar}/${PRESTATIES.length}`, {
      fontFamily: FONT_TITEL, fontSize: '38px', color: '#f2c14e', stroke: '#0a1028', strokeThickness: 7,
    }).setOrigin(0.5, 0);

    const BOVEN = 64, ONDER = 456;
    const lijst = this.add.container(0, 0);
    const vak = this.make.graphics({ add: false }).fillRect(0, BOVEN, 960, ONDER - BOVEN);
    lijst.setMask(vak.createGeometryMask());
    PRESTATIES.forEach((p, i) => {
      const x = 20 + (i % 2) * 465, y = BOVEN + 6 + Math.floor(i / 2) * 64, w = 450, h = 58;
      const heb = PROFIEL.prestaties.includes(p.id);
      const g = this.add.graphics();
      g.fillStyle(heb ? 0x22336a : 0x16244f, 0.95).fillRoundedRect(x, y, w, h, 12);
      g.lineStyle(heb ? 3 : 2, heb ? 0xf2c14e : 0x2c4387, 1).strokeRoundedRect(x, y, w, h, 12);
      const beker = this.add.text(x + 28, y + h / 2, heb ? '🏆' : '🔒', { fontFamily: FONT, fontSize: '26px' }).setOrigin(0.5).setAlpha(heb ? 1 : 0.5);
      const naam = this.add.text(x + 54, y + 7, p.naam, { fontFamily: FONT_TITEL, fontSize: '19px', color: heb ? '#f2c14e' : '#a9b6d8' });
      const doel = doelVan(p), nu = Math.min(statVan(p.stat), doel);
      const uitleg = this.add.text(x + 54, y + 32, p.uitleg + (heb || doel <= 1 ? '' : `  (${nu}/${doel})`), { fontFamily: FONT, fontSize: '14px', color: heb ? '#f3ead6' : '#7a8ab8' });
      const prijs = this.add.text(x + w - 12, y + h / 2, '+' + p.beloning, { fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: heb ? '#5fd38a' : '#f2c14e' }).setOrigin(1, 0.5);
      const fles = this.add.image(x + w - 50, y + h / 2, 'fles_mini').setScale(0.7).setOrigin(1, 0.5);
      if (p.beloning >= 10) prijs.setX(x + w - 12), fles.setX(x + w - 58);
      lijst.add([g, beker, naam, uitleg, prijs, fles]);
    });

    // scrollen (muiswiel, pijltjes of slepen)
    const max = Math.max(0, BOVEN + 6 + Math.ceil(PRESTATIES.length / 2) * 64 - ONDER + 4);
    let scroll = 0;
    const balk = this.add.graphics();
    const zet = (y) => {
      scroll = Phaser.Math.Clamp(y, 0, max); lijst.y = -scroll;
      const hoog = ONDER - BOVEN, lengte = hoog * hoog / (hoog + max);
      balk.clear().fillStyle(0x0a1028, 0.6).fillRoundedRect(951, BOVEN, 6, hoog, 3)
        .fillStyle(0xf2c14e, 1).fillRoundedRect(951, BOVEN + (hoog - lengte) * scroll / (max || 1), 6, lengte, 3);
    };
    zet(0);
    this.input.on('wheel', (p, o, dx, dy) => zet(scroll + dy * 0.6));
    this.input.keyboard.on('keydown-DOWN', () => zet(scroll + 90));
    this.input.keyboard.on('keydown-UP', () => zet(scroll - 90));
    let start = null;
    this.input.on('pointerdown', p => { const y = p.y - this.cameras.main.y; start = y >= BOVEN && y <= ONDER ? { y: p.y, s: scroll } : null; });
    this.input.on('pointermove', p => { if (start && p.isDown) zet(start.s - (p.y - start.y)); });
    this.input.on('pointerup', () => { start = null; });

    knop(this, 380, 470, 200, 54, '← Terug', 0x3cc8bb, () => this.terug());
    this.input.keyboard.on('keydown-ESC', () => this.terug());
  }

  terug() {
    if (this.weg) return;
    this.weg = true;
    this.scene.start(this.terugNaar, this.terugData);
  }
}
