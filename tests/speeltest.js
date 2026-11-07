// Speeltest: speelt de game na en meldt OK of FOUT aan tests/test.py.
// Elk onderdeel is een losse functie. Een nieuw onderdeel toevoegen? Zet hem in ONDERDELEN
// en voeg zijn naam toe aan ONDERDELEN en TIJD in tests/test.py.
(function () {
  const naam = new URLSearchParams(location.search).get('onderdeel');
  const meld = tekst => { new Image().src = '/LOG?naam=' + naam + '&tekst=' + encodeURIComponent(tekst); };
  const slaap = ms => new Promise(r => setTimeout(r, ms));
  const M = () => window.spel && window.spel.scene;
  const scene = n => M().getScene(n);
  const actief = n => M() && M().isActive(n);
  async function wacht(fn, ms, wat) {
    const eind = Date.now() + (ms || 8000);
    while (!fn()) {
      if (Date.now() > eind) throw new Error('duurt te lang: ' + wat);
      await slaap(40);
    }
  }
  function moet(ok, wat) { if (!ok) throw new Error(wat); }
  let stap = '';
  const doe = s => { stap = s; meld(s); };
  const speel = run => scene('Titel').scene.start('Spel', { run: Object.assign({ level: 0, up: PROFIEL.up, harten: 99, baas: false }, run) });
  const spelKlaar = (t) => actief('Spel') && scene('Spel').tijd > (t || 0.5);
  const kiesUpgrade = (w) => {
    const z = w.children.list.filter(o => o.type === 'Zone' && o.depth === 300);
    moet(z.length === 3, 'keuzescherm heeft geen 3 keuzes');
    z[0].emit('pointerup');
  };
  const opPlatform = sp => sp.platforms.getChildren().some(p => sp.speler.x >= p.x && sp.speler.x <= p.x + p.displayWidth && Math.abs(sp.speler.y - p.y) < 4);

  const ONDERDELEN = {
    // doodgaan → keuze → winkel (kopen, ongedaan) → shop en terug → baasgevecht → doodgaan → spelen
    async ronde() {
      doe('normaal potje'); speel({ harten: 3 }); await wacht(() => spelKlaar(1), 8000, 'spel start');
      doe('doodgaan'); scene('Spel').gameOver(); await wacht(() => actief('Winkel'), 5000, 'winkel');
      const w = scene('Winkel');
      moet(w.kiest, 'geen keuzescherm na doodgaan');
      w.spelen(); await slaap(300); moet(actief('Winkel'), 'spelen kon al vóór het kiezen');
      doe('upgrade kiezen'); kiesUpgrade(w); moet(PROFIEL.keuze && !w.kiest, 'kiezen werkte niet');
      doe('kopen en ongedaan'); PROFIEL.flessen = 100; w.vernieuwAlles();
      w.koop(w.kaarten[0]); const na = PROFIEL.flessen;
      moet(PROFIEL.up.dash === 1 && na < 100, 'kopen werkte niet');
      w.ongedaan(); moet(PROFIEL.up.dash === 0 && PROFIEL.flessen === na + 6, 'ongedaan werkte niet');
      doe('baas kopen, naar shop en terug'); w.koop(w.baasKaart); moet(PROFIEL.ticket === PROFIEL.regio, 'baas kopen werkte niet');
      w.naarShop(); await wacht(() => actief('Shop'), 5000, 'shop');
      scene('Shop').terug(); await wacht(() => actief('Winkel'), 5000, 'terug naar winkel');
      moet(!scene('Winkel').kiest && PROFIEL.ticket !== false, 'na de shop moest je opnieuw kiezen of was je ticket weg');
      doe('vechten'); scene('Winkel').vechten(); moet(PROFIEL.ticket === false, 'ticket niet opgebruikt');
      await wacht(() => spelKlaar(1.5) && scene('Spel').baasModus, 8000, 'baasgevecht start');
      doe('dood in baasgevecht'); scene('Spel').gameOver(); await wacht(() => actief('Winkel'), 5000, 'winkel na baas');
      kiesUpgrade(scene('Winkel'));
      doe('weer spelen'); scene('Winkel').spelen(); await wacht(() => spelKlaar(1) && !scene('Spel').baasModus, 8000, 'normaal spelen na baas');
      return 'doodgaan, kiezen, kopen, ongedaan, shop, baasgevecht en weer spelen werken';
    },

    // in elke regio 3 keer in het water vallen: 1 hartje eraf en veilig op een platform
    async vallen() {
      for (let r = 0; r < 10; r++) {
        doe('regio ' + r); speel({ level: r }); await wacht(() => spelKlaar() && scene('Spel').n === r, 8000, 'regio ' + r);
        const sp = scene('Spel');
        for (let i = 0; i < 6; i++) { sp.speler.x += 60; await slaap(60); }
        for (let v = 0; v < 3; v++) {
          sp.run.harten = 50; sp.speler.y = 650;
          await slaap(1300);
          moet(sp.run.harten === 49, sp.reg.id + ': val ' + (v + 1) + ' kostte ' + (50 - sp.run.harten) + ' hartjes');
          moet(opPlatform(sp) && sp.speler.y < 270, sp.reg.id + ': val ' + (v + 1) + ' niet veilig op het platform (y=' + Math.round(sp.speler.y) + ')');
        }
      }
      return '12 keer gevallen: steeds 1 hartje eraf en veilig op het platformpje';
    },

    // elke regio heeft zijn eigen monsters
    async monsters() {
      const MAG = {
        rivier: ['kruiper', 'vliegvis', 'goud'], ijs: ['klont', 'klontje', 'pinguin', 'vliegpinguin', 'goud'],
        berg: ['fust', 'adelaar', 'goud'], vulkaan: ['lava', 'golem', 'ptero', 'goud'],
        grot: ['mol', 'vleermuis', 'goud'], savanne: ['neushoorn', 'gier', 'goud'],
        kroeg: ['darter', 'uitsmijter', 'bierpul', 'goud'], fabriek: ['robot', 'stoomketel', 'drone', 'goud'],
        speeltuin: ['wipkip', 'zandmonster', 'ballon', 'goud'], maan: ['alien', 'kraterkruiper', 'ufo', 'goud'],
      };
      const EIGEN = { rivier: ['kruiper', 'vliegvis'], ijs: ['klont', 'klontje', 'pinguin', 'vliegpinguin'], berg: ['fust', 'adelaar'], vulkaan: ['lava', 'golem', 'ptero'], grot: ['mol', 'vleermuis'], savanne: ['neushoorn', 'gier'],
        kroeg: ['darter', 'uitsmijter', 'bierpul'], fabriek: ['robot', 'stoomketel', 'drone'], speeltuin: ['wipkip', 'zandmonster', 'ballon'], maan: ['alien', 'kraterkruiper', 'ufo'] };
      const uit = [];
      for (let r = 0; r < 10; r++) {
        doe('regio ' + r); speel({ level: r }); await wacht(() => spelKlaar() && scene('Spel').n === r, 8000, 'regio ' + r);
        const sp = scene('Spel'), gezien = new Set();
        for (let i = 0; i < 120; i++) {
          sp.onkwetsbaar = 5; sp.run.harten = 99; sp.speler.x += 30; sp.speler.y = Math.min(sp.speler.y, 300);
          sp.vijanden.getChildren().forEach(v => v.active && gezien.add(v.soort));
          await slaap(50);
        }
        const id = sp.reg.id, vreemd = [...gezien].filter(s => !MAG[id].includes(s));
        moet(!vreemd.length, id + ': verkeerde monsters ' + vreemd.join(','));
        moet(EIGEN[id].some(s => gezien.has(s)), id + ': eigen monsters niet gezien (wel: ' + [...gezien].join(',') + ')');
        uit.push(id + ': ' + [...gezien].join('/'));
      }
      return uit.join('  ·  ');
    },

    // elke eindbaas doet zijn eigen aanvallen en wordt woedend
    async bazen() {
      const uit = [];
      for (let n = 0; n < 10; n++) {
        doe('baas ' + n); PROFIEL.regio = n;
        speel({ level: n, baas: true }); await wacht(() => spelKlaar(0.3) && scene('Spel').baasModus && scene('Spel').n === n, 8000, 'baas ' + n);
        const sp = scene('Spel'), b = sp.baas, gezien = new Set();
        // kijk tot hij 2 soorten aanvallen heeft gedaan (max 20 seconden), maak hem dan woedend
        const eind = Date.now() + 20000;
        while (Date.now() < eind && b.active && gezien.size < 2) {
          sp.run.harten = 99;
          if (b.status !== 'wacht' && b.beurt > 0) gezien.add(b.aanvallen[(b.beurt - 1) % b.aanvallen.length]);
          await slaap(50);
        }
        b.hp = Math.floor(b.maxHp * 0.4); await slaap(300);
        moet(gezien.size >= 2, sp.reg.baasNaam + ' deed maar ' + gezien.size + ' soort aanval');
        moet(b.woedend, sp.reg.baasNaam + ' werd niet woedend');
        uit.push(sp.reg.baasNaam + ': ' + [...gezien].join('/'));
      }
      return uit.join('  ·  ');
    },

    // de dure power-ups doen wat ze moeten doen
    async powerups() {
      ['schild', 'maatje', 'stomp', 'reserve', 'boer', 'magneet', 'statiegeld', 'doorboor', 'slok', 'kebabradar']
        .forEach(k => { PROFIEL.up[k] = POWERUPS.find(p => p.id === k).max; });
      speel({ level: 0, harten: 3 }); await wacht(() => spelKlaar(1), 8000, 'spel start');
      const sp = scene('Spel');
      doe('schuimschild'); sp.onkwetsbaar = 0; sp.schade(1); moet(sp.run.harten === 3 && sp.schilden === 1, 'schuimschild vangt niets op');
      doe('reservevat'); sp.schilden = 0; sp.run.harten = 1; sp.onkwetsbaar = 0; sp.schade(1);
      moet(!sp.dood && sp.run.harten === 1 && sp.reserve === 0, 'reservevat gaf geen tweede kans');
      doe('stampen');
      const stampbaar = v => v.active && v.loopt && v.soort !== 'goud' && (!ZWAK[v.soort] || ZWAK[v.soort] === 'stamp');
      for (let i = 0; i < 200 && !sp.vijanden.getChildren().some(stampbaar); i++) { sp.onkwetsbaar = 5; sp.speler.x += 25; sp.speler.y = Math.min(sp.speler.y, 300); await slaap(40); }
      const v = sp.vijanden.getChildren().find(stampbaar), hp = v.hp;
      sp.speler.x = v.x; sp.speler.y = v.y - v.displayHeight - 2; sp.speler.body.setVelocity(0, 300); sp.spelerRaakt(v);
      moet(v.hp < hp && sp.speler.body.velocity.y < -400, 'stampen deed niks');
      doe('flesmaatje'); const voor = sp.verslagen;
      for (let i = 0; i < 120; i++) { sp.onkwetsbaar = 5; sp.run.harten = 3; sp.speler.x += 20; if (sp.speler.y > 400) sp.speler.y = 300; await slaap(50); }
      moet(sp.verslagen > voor, 'flesmaatje versloeg niets');
      return 'schild, reservevat, stampen en flesmaatje werken (maatje versloeg ' + (sp.verslagen - voor) + ' monsters)';
    },

    // eindbaas verslaan: flesjes, baas-skin en door naar de volgende regio
    async beloning() {
      PROFIEL.regio = 0; PROFIEL.flessen = 0;
      speel({ level: 0, baas: true }); await wacht(() => spelKlaar(1) && scene('Spel').baasModus, 8000, 'baasgevecht');
      const sp = scene('Spel');
      doe('baas verslaan'); sp.baas.hp = 1; sp.raakVijand(sp.baas, 5, 1, 'slash');
      moet(sp.gewonnen, 'baas niet verslagen');
      moet(PROFIEL.flessen === baasBeloning(0), 'geen ' + baasBeloning(0) + ' flesjes maar ' + PROFIEL.flessen);
      moet(PROFIEL.skins.includes('padkoning'), 'geen Padkoning-skin');
      moet(PROFIEL.regio === 1, 'volgende regio niet open');
      doe('door naar volgende regio'); await wacht(() => spelKlaar(0.5) && scene('Spel').n === 1, 15000, 'IJsvlakte start');
      return '+' + baasBeloning(0) + ' flesjes, Padkoning-skin en door naar de IJsvlakte';
    },

    // draairad: kost 5, je wint een nieuwe skin, daarna kost het 10
    async shop() {
      PROFIEL.flessen = 200;
      scene('Titel').scene.start('Shop'); await wacht(() => actief('Shop'), 5000, 'shop');
      const s = scene('Shop');
      doe('draaien'); s.draai(); moet(s.draait, 'rad draait niet');
      await wacht(() => !s.draait, 8000, 'rad stopt');
      moet(PROFIEL.skins.length === 2 && PROFIEL.flessen < 200 && draaiPrijs() === 10, 'prijs of skin klopt niet');
      doe('terug'); s.terug(); await wacht(() => actief('Titel'), 5000, 'terug naar titel');
      return 'gewonnen: ' + skinVan(PROFIEL.skin).naam + ', volgende draai kost ' + draaiPrijs();
    },

    // monsters met een zwakke plek: verkeerd raken ketst af, goed raken doet pijn
    async zwak() {
      const uit = [];
      for (let r = 1; r < 10; r++) {
        speel({ level: r }); await wacht(() => spelKlaar() && scene('Spel').n === r, 8000, 'regio ' + r);
        const sp = scene('Spel'), getest = new Set();
        for (let i = 0; i < 160 && getest.size < 3; i++) {
          sp.onkwetsbaar = 5; sp.run.harten = 99; sp.speler.x += 25; sp.speler.y = Math.min(sp.speler.y, 300);
          for (const v of sp.vijanden.getChildren()) {
            const zw = ZWAK[v.soort];
            if (!v.active || !zw || getest.has(v.soort) || v.hp < 1) continue;
            doe(sp.reg.id + ' ' + v.soort);
            const fout = zw === 'slash' ? 'pijl' : 'slash', hp = v.hp;
            sp.raakVijand(v, 1, 1, fout);
            moet(v.active && v.hp === hp, v.soort + ' ging dood/kwijt met ' + fout + ' (mag alleen ' + zw + ')');
            sp.raakVijand(v, 1, 1, zw);
            moet(!v.active || v.hp < hp, v.soort + ' kreeg geen schade met ' + zw);
            getest.add(v.soort); uit.push(v.soort + ':' + zw);
          }
          await slaap(50);
        }
      }
      moet(uit.length >= 5, 'te weinig monsters getest: ' + uit.join(','));
      return uit.join('  ');
    },

    // spikes doen pijn, ook als je erop springt
    async spikes() {
      speel({ level: 1, harten: 5 }); await wacht(() => spelKlaar(0.5), 8000, 'spel start');
      const sp = scene('Spel');
      const p = sp.maakPlatform(sp.speler.x + 200, 380, 240);
      sp.maakSpikes(p.x + 80, 380, 60);
      moet(sp.spikes.countActive() >= 1, 'geen spikes');
      const s = sp.spikes.getChildren()[sp.spikes.getChildren().length - 1];
      sp.onkwetsbaar = 0; sp.speler.body.reset(s.x + 30, 360); await slaap(400);
      moet(sp.run.harten === 4, 'spikes deden geen pijn (harten=' + sp.run.harten + ')');
      return 'au! 1 hartje eraf op de spikes';
    },

    // een verslagen baas nog eens doen: vinkje, opnieuw betalen, beloning hoger dan de prijs
    async opnieuw() {
      PROFIEL.regio = 2; PROFIEL.startRegio = 0; PROFIEL.flessen = 100;
      scene('Titel').scene.start('Winkel', { meters: 0, regio: 0, baas: false }); await wacht(() => actief('Winkel'), 5000, 'winkel');
      const w = scene('Winkel'); kiesUpgrade(w);
      moet(w.baasKaart.naam.text === REGIOS[0].baasNaam && w.baasKaart.vinkje.visible, 'baaskaart toont niet Koning Bierpad met vinkje');
      moet(baasBeloning(0) > baasPrijs(0) && baasBeloning(5) > baasPrijs(5), 'beloning niet hoger dan de prijs');
      w.koop(w.baasKaart); moet(PROFIEL.ticket === 0 && PROFIEL.flessen === 100 - baasPrijs(0), 'opnieuw kopen werkte niet');
      w.kiesRegio(2); moet(!w.baasKaart.vinkje.visible && w.baasKaart.naam.text === REGIOS[2].baasNaam, 'nieuwe baas heeft een vinkje');
      w.kiesRegio(-2); w.vechten();
      await wacht(() => spelKlaar(0.5) && scene('Spel').baasModus && scene('Spel').n === 0, 8000, 'gevecht tegen Koning Bierpad');
      return 'Koning Bierpad nog eens: prijs ' + baasPrijs(0) + ', beloning ' + baasBeloning(0);
    },

    // prestaties: tellers lopen op, flesjes erbij, en het scherm opent
    async prestaties() {
      PROFIEL.flessen = 0;
      scene('Titel').scene.start('Spel', { run: nieuweRun(false) }); await wacht(() => spelKlaar(1.5), 8000, 'spel start');
      moet(PROFIEL.prestaties.includes('eerste'), 'geen prestatie voor je eerste potje');
      const sp = scene('Spel');
      doe('monster verslaan');
      await wacht(() => sp.vijanden.getChildren().some(v => v.active && !ZWAK[v.soort] && v.soort !== 'goud'), 8000, 'een monster');
      const v = sp.vijanden.getChildren().find(v => v.active && !ZWAK[v.soort] && v.soort !== 'goud');
      sp.raakVijand(v, 99, 1, 'slash');
      moet(PROFIEL.prestaties.includes('jager') && PROFIEL.stats.slash === 1, 'monster verslaan telde niet');
      const fl = PROFIEL.flessen;
      moet(fl >= 2, 'geen flesjes gekregen (' + fl + ')');
      doe('scherm'); sp.scene.start('Prestaties'); await wacht(() => actief('Prestaties'), 5000, 'prestatiescherm');
      scene('Prestaties').terug(); await wacht(() => actief('Titel'), 5000, 'terug naar titel');
      return PROFIEL.prestaties.length + ' prestaties, ' + fl + ' flesjes verdiend';
    },

    // power-up lager zetten: aan-niveau ≤ gekocht, en het spel gebruikt het aan-niveau
    async aan() {
      PROFIEL.flessen = 500; PROFIEL.up.dash = 5;
      scene('Titel').scene.start('Winkel', { meters: 0, regio: 0, baas: false }); await wacht(() => actief('Winkel'), 5000, 'winkel');
      const w = scene('Winkel'); kiesUpgrade(w);
      const k = w.kaarten.find(k => k.p.id === 'dash');
      moet(k.hebT.text === 'heb MAX' && k.aanT.text === 'aan 5', 'kaart toont niet heb MAX / aan 5');
      w.zetAan(k, -1); w.zetAan(k, -1); w.zetAan(k, -1);
      moet(aanNiveau('dash') === 2 && k.aanT.text === 'aan 2' && PROFIEL.up.dash === 5, 'lager zetten werkte niet');
      w.zetAan(k, 1); moet(aanNiveau('dash') === 3, 'hoger zetten werkte niet');
      w.spelen(); await wacht(() => spelKlaar(0.5), 8000, 'spel start');
      moet(scene('Spel').run.up.dash === 3, 'spel gebruikt niet het aan-niveau (' + scene('Spel').run.up.dash + ')');
      return 'dash: heb MAX, aan 3, en het spel gebruikt 3';
    },

    // alle knoppen één keer indrukken
    async knoppen() {
      const druk = (sc, tekst) => {
        const zones = sc.children.list.filter(o => o.type === 'Zone');
        let t = null, z = null;
        for (const o of sc.children.list) {
          if (o.type !== 'Text' || !o.text.includes(tekst)) continue;
          z = zones.find(q => Math.abs(q.x + q.width / 2 - o.x) < 4 && Math.abs(q.y + q.height / 2 - o.y) < 4);
          if (z) { t = o; break; }
        }
        moet(t && z, 'knop "' + tekst + '" niet gevonden in ' + sc.scene.key);
        z.emit('pointerup', { y: t.y, x: t.x });
      };
      PROFIEL.flessen = 300;
      doe('titel → shop'); druk(scene('Titel'), 'Shop'); await wacht(() => actief('Shop'), 4000, 'shop');
      druk(scene('Shop'), 'Draai'); await wacht(() => !scene('Shop').draait, 8000, 'rad');
      druk(scene('Shop'), 'Terug'); await wacht(() => actief('Titel'), 4000, 'titel');
      doe('titel → prestaties'); druk(scene('Titel'), 'Prestaties'); await wacht(() => actief('Prestaties'), 4000, 'prestaties');
      druk(scene('Prestaties'), 'Terug'); await wacht(() => actief('Titel'), 4000, 'titel');
      doe('titel → start'); druk(scene('Titel'), 'Start'); await wacht(() => spelKlaar(0.5), 8000, 'spel');
      doe('instellingen → hoofdscherm');
      const sp = scene('Spel'); sp.scene.launch('Instellingen', { terug: 'Spel' }); sp.scene.pause();
      await wacht(() => actief('Instellingen'), 4000, 'instellingen');
      druk(scene('Instellingen'), 'Hoofdscherm'); await wacht(() => actief('Titel') && !M().isPaused('Spel') && !actief('Instellingen'), 4000, 'hoofdscherm');
      doe('instellingen → verder spelen'); druk(scene('Titel'), 'Start'); await wacht(() => spelKlaar(0.5), 8000, 'spel');
      scene('Spel').scene.launch('Instellingen', { terug: 'Spel' }); scene('Spel').scene.pause();
      await wacht(() => actief('Instellingen'), 4000, 'instellingen');
      druk(scene('Instellingen'), 'Verder spelen'); await wacht(() => actief('Spel') && !M().isPaused('Spel'), 4000, 'verder spelen');
      doe('winkel'); scene('Spel').gameOver(); await wacht(() => actief('Winkel'), 5000, 'winkel');
      const w = scene('Winkel'); kiesUpgrade(w);
      w.kaarten[0].g; w.koop(w.kaarten[1]);
      druk(w, '↶'); moet(PROFIEL.up.dubbel === 0, 'Ongedaan-knop werkte niet');
      druk(w, 'Gok'); await wacht(() => actief('Gokkast'), 4000, 'gokkast vanuit winkel');
      druk(scene('Gokkast'), 'Terug'); await wacht(() => actief('Winkel'), 4000, 'terug naar winkel');
      druk(scene('Winkel'), 'Dieren'); await wacht(() => actief('Dieren'), 4000, 'dieren vanuit winkel');
      druk(scene('Dieren'), 'Terug'); await wacht(() => actief('Winkel'), 4000, 'terug naar winkel');
      druk(scene('Winkel'), 'Prestaties'); await wacht(() => actief('Prestaties'), 4000, 'prestaties vanuit winkel');
      druk(scene('Prestaties'), 'Terug'); await wacht(() => actief('Winkel') && !scene('Winkel').kiest, 4000, 'terug naar winkel');
      druk(scene('Winkel'), 'Shop'); await wacht(() => actief('Shop'), 4000, 'shop vanuit winkel');
      druk(scene('Shop'), 'Terug'); await wacht(() => actief('Winkel'), 4000, 'terug naar winkel');
      druk(scene('Winkel'), 'Spelen'); await wacht(() => spelKlaar(0.5), 8000, 'spelen');
      scene('Spel').gameOver(); await wacht(() => actief('Winkel'), 5000, 'winkel');
      druk(scene('Winkel'), 'Menu'); await wacht(() => actief('Titel'), 4000, 'menu vanuit winkel');
      return 'Start, Shop, Draai, Terug, Prestaties, Hoofdscherm, Verder spelen, Ongedaan, Gok↔winkel, Dieren↔winkel, Prestaties↔winkel, Shop↔winkel, Spelen en Menu werken';
    },

    // regio-trucjes: trampoline, lopende band, bierplas, maan
    async trucjes() {
      doe('speeltuin'); speel({ level: 8 }); await wacht(() => spelKlaar(0.5) && scene('Spel').n === 8, 8000, 'speeltuin');
      let sp = scene('Spel');
      const leeg = (sp) => { // andere platforms en monsters rond de testplek weghalen
        for (const g of [sp.platforms, sp.vijanden, sp.trampolines, sp.plassen, sp.spikes]) g.getChildren().slice().forEach(o => { if (o.x > sp.speler.x + 60 && o.x < sp.speler.x + 600) o.destroy(); });
      };
      leeg(sp);
      const p = sp.maakPlatform(sp.speler.x + 150, 400, 240, true); sp.maakTrampoline(p.x + 120, 400);
      sp.speler.body.reset(p.x + 120, 360); sp.speler.body.setVelocity(0, 200);
      await wacht(() => sp.speler.body.velocity.y < -600, 2000, 'trampoline stuitert');
      doe('fabriek'); speel({ level: 7 }); await wacht(() => spelKlaar(0.5) && scene('Spel').n === 7, 8000, 'fabriek');
      sp = scene('Spel'); leeg(sp);
      const b = sp.maakPlatform(sp.speler.x + 150, 400, 300, true); sp.maakBand(b, 1);
      sp.speler.body.reset(b.x + 60, 398); await slaap(200);
      // meten in speltijd: de testbrowser draait soms langzamer dan echt
      const x0 = sp.speler.x, t0 = sp.tijd; await slaap(1000);
      const snel = (sp.speler.x - x0) / Math.max(0.05, sp.tijd - t0);
      moet(snel > 80, 'lopende band duwt niet (' + Math.round(snel) + ' per seconde)');
      doe('maan'); speel({ level: 9 }); await wacht(() => spelKlaar(0.5) && scene('Spel').n === 9, 8000, 'maan');
      moet(scene('Spel').physics.world.gravity.y < 1000, 'geen lage zwaartekracht op de maan');
      doe('rivier'); speel({ level: 0 }); await wacht(() => spelKlaar(0.5) && scene('Spel').n === 0, 8000, 'rivier');
      moet(scene('Spel').physics.world.gravity.y === 1500, 'zwaartekracht niet terug na de maan');
      return 'trampoline, lopende band, maanzwaartekracht en terug op aarde werken';
    },

    // levelkeuze: open regio kiezen werkt, dichte regio niet
    async levels() {
      PROFIEL.regio = 3; PROFIEL.startRegio = 0;
      scene('Titel').scene.start('Winkel', { meters: 0, regio: 0, baas: false }); await wacht(() => actief('Winkel'), 5000, 'winkel');
      const w = scene('Winkel'); kiesUpgrade(w);
      doe('levelknop'); w.levelKnop.z.emit('pointerup'); await wacht(() => actief('LevelKeuze'), 4000, 'levelscherm');
      const l = scene('LevelKeuze');
      moet(l.kaarten.length === REGIOS.length, 'niet alle levels te zien');
      doe('dicht level'); l.kies(5, l.kaarten[5].c); moet(PROFIEL.startRegio === 0 && actief('LevelKeuze'), 'dicht level kon gekozen worden');
      doe('open level'); l.kies(2, l.kaarten[2].c); await wacht(() => actief('Winkel') && !actief('LevelKeuze'), 10000, 'terug naar winkel');
      moet(PROFIEL.startRegio === 2 && scene('Winkel').regioTekst.text.includes('Bergen'), 'level niet gekozen');
      scene('Winkel').spelen(); await wacht(() => spelKlaar(0.5) && scene('Spel').n === 2, 8000, 'spelen in de Bergen');
      return 'Bergen gekozen met het plaatje, dicht level geweigerd, spel start in de Bergen';
    },

    // gokkast: inzet eraf, winst erbij volgens het vakje
    async gokken() {
      PROFIEL.flessen = 100;
      PROFIEL.prestaties = PRESTATIES.map(p => p.id); // prestaties geven extra flesjes: hier even niet
      scene('Titel').scene.start('Gokkast'); await wacht(() => actief('Gokkast'), 5000, 'gokkast');
      const g = scene('Gokkast');
      const ev = GOK_VAKJES.reduce((a, b) => a + b, 0) / GOK_VAKJES.length;
      moet(ev < 1 && GOK_VAKJES.filter(v => !v).length > GOK_VAKJES.length / 2, 'verliezen is niet veel waarschijnlijker');
      doe('verlies'); g.draai(0); moet(PROFIEL.flessen === 95, 'inzet niet afgehaald'); await wacht(() => !g.draait, 8000, 'rad stopt');
      moet(PROFIEL.flessen === 95, 'verlies klopt niet');
      doe('jackpot'); g.draai(GOK_VAKJES.indexOf(5)); await wacht(() => !g.draait, 8000, 'rad stopt');
      moet(PROFIEL.flessen === 95 - 5 + 25, 'jackpot klopt niet (' + PROFIEL.flessen + ')');
      doe('alles'); g.allesInzetten(); g.draai(0); await wacht(() => !g.draait, 8000, 'rad stopt');
      moet(PROFIEL.flessen === 0, 'alles inzetten klopt niet');
      g.terug(); await wacht(() => actief('Shop'), 5000, 'terug naar shop');
      return 'verlies -5, jackpot ×5 = +25, alles kwijt bij niks; gemiddeld ' + Math.round(ev * 100) + '% terug';
    },

    // huisdieren: draaien, upgraden, meenemen, en het dier werkt in het spel
    async dieren() {
      PROFIEL.flessen = 1000; PROFIEL.prestaties = PRESTATIES.map(p => p.id);
      scene('Titel').scene.start('Dieren'); await wacht(() => actief('Dieren'), 5000, 'dierenwinkel');
      const d = scene('Dieren');
      doe('draaien'); d.draai(); await wacht(() => !d.draait, 8000, 'rad stopt');
      const id = Object.keys(PROFIEL.dieren)[0];
      moet(id && PROFIEL.dier === id && PROFIEL.flessen === 920 && dierPrijs() === 120, 'draaien klopt niet');
      doe('upgraden'); const v = d.vakjes.find(v => v.d.id === id);
      for (let i = 0; i < 5; i++) d.upgrade(v);
      moet(PROFIEL.dieren[id] === 5 && PROFIEL.flessen === 920 - 50 - 100 - 150 - 200, 'upgraden klopt niet (' + PROFIEL.dieren[id] + ', ' + PROFIEL.flessen + ')');
      doe('thuislaten en meenemen'); d.neemMee(v); moet(PROFIEL.dier === '', 'thuislaten werkte niet'); d.neemMee(v); moet(PROFIEL.dier === id, 'meenemen werkte niet');
      doe('in het spel'); PROFIEL.dieren.schildpad = 4; PROFIEL.dier = 'schildpad';
      d.terug(); await wacht(() => actief('Titel'), 4000, 'titel');
      scene('Titel').scene.start('Spel', { run: nieuweRun(false) }); await wacht(() => spelKlaar(0.5), 8000, 'spel');
      moet(scene('Spel').dier && scene('Spel').maxH === maxHarten() + 2, 'schildpad geeft geen 2 hartjes extra');
      return 'gewonnen: ' + DIEREN.find(x => x.id === id).naam + ', tot niveau 5 geüpgraded; schildpad niveau 4 = +2 hartjes';
    },

    // opnieuw brouwen: alles terug naar het begin, maar een ster erbij
    async prestige() {
      PROFIEL.regio = REGIOS.length; PROFIEL.flessen = 300; PROFIEL.up.dash = 3; PROFIEL.skins.push('goud');
      scene('Titel').scene.restart(); await wacht(() => actief('Titel'), 4000, 'titel');
      const t = scene('Titel');
      doe('vraag'); t.vraagOpnieuw(); moet(t.vraag, 'geen vraag');
      t.opnieuwBrouwen(); await wacht(() => actief('Titel'), 4000, 'titel na brouwen');
      moet(PROFIEL.sterren === 1 && PROFIEL.regio === 0 && PROFIEL.flessen === 0 && PROFIEL.up.dash === 0 && PROFIEL.skins.includes('goud'), 'opnieuw brouwen klopt niet');
      scene('Titel').scene.start('Spel', { run: nieuweRun(false) }); await wacht(() => spelKlaar(0.5), 8000, 'spel');
      moet(Math.abs(scene('Spel').shotBonus - 1.1) < 0.001, 'ster geeft geen +10% shotjes');
      return 'ster 1: alles terug naar het begin, skins blijven, shotjes ×1.1';
    },

    // kebabrol eten: scheet en heel hoog de lucht in
    async kebab() {
      speel({ kebab: true }); await wacht(() => spelKlaar(0.5), 8000, 'spel start');
      const sp = scene('Spel');
      moet(sp.kebabs.countActive() === 1, 'geen kebabrol');
      sp.speler.x = 320; sp.speler.y = 400; await slaap(200);
      moet(sp.kebabs.countActive() === 0, 'kebab niet opgegeten');
      await slaap(500); moet(sp.speler.y < 250, 'niet hoog gesprongen (y=' + Math.round(sp.speler.y) + ')');
      return 'kebab op en hoog de lucht in (y=' + Math.round(sp.speler.y) + ')';
    },
  };

  (async () => {
    try {
      await wacht(() => actief('Titel'), 15000, 'titelscherm');
      const fn = ONDERDELEN[naam];
      if (!fn) throw new Error('onbekend onderdeel');
      const tekst = await fn();
      await slaap(300);
      const fout = document.getElementById('fout').textContent.trim();
      meld(fout ? 'FOUT: rode balk: ' + fout : 'OK: ' + tekst);
    } catch (e) {
      const fout = document.getElementById('fout').textContent.trim();
      meld('FOUT bij "' + stap + '": ' + e.message + (fout ? '  (rode balk: ' + fout + ')' : ''));
    }
  })();
})();
