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
      doe('power-ups: kopen en ongedaan'); PROFIEL.flessen = 100;
      w.naar('PowerUps'); await wacht(() => actief('PowerUps'), 5000, 'power-upscherm');
      const pu = scene('PowerUps');
      pu.koop(pu.kaarten[0]); const na = PROFIEL.flessen;
      moet(PROFIEL.up.dash === 1 && na < 100, 'kopen werkte niet');
      pu.ongedaan(); moet(PROFIEL.up.dash === 0 && PROFIEL.flessen === na + 6, 'ongedaan werkte niet');
      pu.terug(); await wacht(() => actief('Winkel') && !scene('Winkel').kiest, 5000, 'terug naar het menu');
      doe('baas kopen, naar shop en terug'); moet(scene('Winkel').koopBaas() && PROFIEL.ticket === PROFIEL.regio, 'baas kopen werkte niet');
      scene('Winkel').naar('Shop'); await wacht(() => actief('Shop'), 5000, 'shop');
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
        while (Date.now() < eind && b.active && gezien.size < 2 && b.baas !== 'machine') {
          sp.run.harten = 99;
          if (b.status !== 'wacht' && b.beurt > 0) gezien.add(b.aanvallen[(b.beurt - 1) % b.aanvallen.length]);
          await slaap(50);
        }
        b.hp = Math.floor(b.maxHp * 0.4); await slaap(300);
        if (b.baas !== 'machine') moet(gezien.size >= 2, sp.reg.baasNaam + ' deed maar ' + gezien.size + ' soort aanval');
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
      PROFIEL.prestaties = PRESTATIES.map(p => p.id); // geen extra flesjes van prestaties
      speel({ level: 0, baas: true }); await wacht(() => spelKlaar(1) && scene('Spel').baasModus, 8000, 'baasgevecht');
      const sp = scene('Spel');
      const beloning = baasBeloning(0); // vóór het verslaan: de eerste keer is de beloning hoger
      doe('baas verslaan'); sp.baas.hp = 1; sp.raakVijand(sp.baas, 5, 1, 'slash');
      moet(sp.gewonnen, 'baas niet verslagen');
      await wacht(() => actief('Schatkist'), 15000, 'schatkist met de beloning');
      scene('Schatkist').neem();
      moet(PROFIEL.flessen === beloning, 'geen ' + beloning + ' flesjes maar ' + PROFIEL.flessen);
      moet(PROFIEL.skins.includes('padkoning'), 'geen Padkoning-skin');
      moet(PROFIEL.regio === 1, 'volgende regio niet open');
      doe('door naar volgende regio'); await wacht(() => spelKlaar(0.5) && scene('Spel').n === 1, 15000, 'IJsvlakte start');
      return '+' + beloning + ' flesjes (uit de schatkist), Padkoning-skin en door naar de IJsvlakte';
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
      moet(w.baasN() === 0 && w.tegels.Eindbaas.hint.text.includes('✔'), 'baastegel toont niet Koning Bierpad met vinkje');
      moet(baasBeloning(0) > baasPrijs(0) && baasBeloning(5) > baasPrijs(5), 'beloning niet hoger dan de prijs');
      w.toonBaas(); moet(w.baasLaag, 'baasvenster gaat niet open');
      w.koopBaas(); moet(PROFIEL.ticket === 0 && PROFIEL.flessen === 100 - baasPrijs(0), 'opnieuw kopen werkte niet');
      w.baasLaag.forEach(o => o.destroy()); w.baasLaag = null;
      w.kiesRegio(2); moet(w.baasN() === 2 && !w.tegels.Eindbaas.hint.text.includes('✔'), 'nieuwe baas heeft een vinkje');
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
      kiesUpgrade(scene('Winkel')); scene('Winkel').naar('PowerUps'); await wacht(() => actief('PowerUps'), 5000, 'power-ups');
      const w = scene('PowerUps');
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
        if (sc.tegels && sc.tegels[tekst]) { sc.tegels[tekst].z.emit('pointerup'); return; } // tegels in het Game over-menu
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
      PROFIEL.flessen = 300; PROFIEL.regio = 10; // alles open
      doe('shop'); scene('Titel').scene.start('Shop'); await wacht(() => actief('Shop'), 4000, 'shop');
      druk(scene('Shop'), 'Draai'); await wacht(() => !scene('Shop').draait, 8000, 'rad');
      druk(scene('Shop'), 'Terug'); await wacht(() => actief('Titel'), 4000, 'titel');
      doe('titel → start (3× noob)');
      for (let i = 0; i < 3; i++) { druk(scene('Titel'), 'Start'); moet(scene('Titel').gepest === i + 1, 'Start-knop rende niet weg'); await wacht(() => !scene('Titel').rent, 3000, 'knop staat stil'); }
      druk(scene('Titel'), 'Start'); await wacht(() => spelKlaar(0.5), 8000, 'spel');
      doe('instellingen → verder spelen');
      scene('Spel').scene.launch('Instellingen', { terug: 'Spel' }); scene('Spel').scene.pause();
      await wacht(() => actief('Instellingen'), 4000, 'instellingen');
      druk(scene('Instellingen'), 'Verder spelen'); await wacht(() => actief('Spel') && !M().isPaused('Spel'), 4000, 'verder spelen');
      doe('winkel'); scene('Spel').gameOver(); await wacht(() => actief('Winkel'), 5000, 'winkel');
      const w = scene('Winkel'); kiesUpgrade(w);
      druk(w, 'Power-ups'); await wacht(() => actief('PowerUps'), 4000, 'power-ups vanuit het menu');
      const pu = scene('PowerUps'); pu.koop(pu.kaarten[1]);
      druk(pu, 'Ongedaan'); moet(PROFIEL.up.dubbel === 0, 'Ongedaan-knop werkte niet');
      druk(pu, 'Terug'); await wacht(() => actief('Winkel'), 4000, 'terug naar het menu');
      druk(scene('Winkel'), 'Eindbaas'); moet(scene('Winkel').baasLaag, 'eindbaasvenster ging niet open');
      druk(scene('Winkel'), 'Sluiten'); moet(!scene('Winkel').baasLaag, 'eindbaasvenster ging niet dicht');
      druk(scene('Winkel'), 'Level'); await wacht(() => actief('LevelKeuze'), 4000, 'levelscherm');
      druk(scene('LevelKeuze'), 'Sluiten'); await wacht(() => actief('Winkel') && !actief('LevelKeuze'), 4000, 'terug van levelscherm');
      druk(scene('Winkel'), 'Gokkast'); await wacht(() => actief('Gokkast'), 4000, 'gokkast vanuit winkel');
      druk(scene('Gokkast'), 'Terug'); await wacht(() => actief('Winkel'), 4000, 'terug naar winkel');
      druk(scene('Winkel'), 'Dieren'); await wacht(() => actief('Dieren'), 4000, 'dieren vanuit winkel');
      druk(scene('Dieren'), 'Terug'); await wacht(() => actief('Winkel'), 4000, 'terug naar winkel');
      druk(scene('Winkel'), 'Prestaties'); await wacht(() => actief('Prestaties'), 4000, 'prestaties vanuit winkel');
      druk(scene('Prestaties'), 'Terug'); await wacht(() => actief('Winkel') && !scene('Winkel').kiest, 4000, 'terug naar winkel');
      druk(scene('Winkel'), 'Skins'); await wacht(() => actief('Shop'), 4000, 'shop vanuit winkel');
      druk(scene('Shop'), 'Terug'); await wacht(() => actief('Winkel'), 4000, 'terug naar winkel');
      druk(scene('Winkel'), 'Spelen'); await wacht(() => spelKlaar(0.5), 8000, 'spelen');
      scene('Spel').gameOver(); await wacht(() => actief('Winkel'), 5000, 'winkel');
      kiesUpgrade(scene('Winkel'));
      druk(scene('Winkel'), 'Instellingen'); await wacht(() => actief('Instellingen'), 4000, 'instellingen vanuit menu');
      druk(scene('Instellingen'), 'Klaar'); await wacht(() => actief('Winkel') && !M().isPaused('Winkel'), 4000, 'terug in het menu');
      doe('stop potje'); scene('Winkel').spelen(); await wacht(() => spelKlaar(0.5), 8000, 'spel');
      scene('Spel').scene.launch('Instellingen', { terug: 'Spel' }); scene('Spel').scene.pause();
      await wacht(() => actief('Instellingen'), 4000, 'instellingen');
      druk(scene('Instellingen'), 'Stop potje'); await wacht(() => actief('StopVraag'), 4000, 'vraag: zeker weten?');
      druk(scene('StopVraag'), 'Nee'); await wacht(() => actief('Spel') && !M().isPaused('Spel') && !actief('StopVraag'), 4000, 'verder na nee');
      doe('stopknop'); const fl = PROFIEL.flessen; scene('Spel').stopKnop.emit('pointerup');
      await wacht(() => actief('StopVraag'), 4000, 'vraag via de stopknop');
      druk(scene('StopVraag'), 'Ja'); await wacht(() => actief('Winkel'), 6000, 'Game over-menu na stoppen');
      moet(PROFIEL.flessen >= fl, 'flesjes kwijt na stoppen');
      return 'Start (3× noob), Draai, Terug, Verder spelen, Stop potje (Nee/Ja), stopknop, en in het Game over-menu: Power-ups (kopen/ongedaan), Eindbaas, Level, Gokkast, Dieren, Prestaties, Skins, Instellingen en Spelen werken';
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
      doe('leveltegel'); w.tegels.Level.z.emit('pointerup'); await wacht(() => actief('LevelKeuze'), 4000, 'levelscherm');
      const l = scene('LevelKeuze');
      moet(l.kaarten.length === REGIOS.length, 'niet alle levels te zien');
      doe('dicht level'); l.kies(5, l.kaarten[5].c); moet(PROFIEL.startRegio === 0 && actief('LevelKeuze'), 'dicht level kon gekozen worden');
      doe('open level'); l.kies(2, l.kaarten[2].c); await wacht(() => actief('Winkel') && !actief('LevelKeuze'), 10000, 'terug naar winkel');
      moet(PROFIEL.startRegio === 2 && scene('Winkel').levelHint.text.includes('Bergen'), 'level niet gekozen');
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
      PROFIEL.flessen = 5000; PROFIEL.prestaties = PRESTATIES.map(p => p.id);
      scene('Titel').scene.start('Dieren'); await wacht(() => actief('Dieren'), 5000, 'dierenwinkel');
      const d = scene('Dieren');
      doe('draaien'); d.draai(); await wacht(() => !d.draait, 8000, 'rad stopt');
      const id = Object.keys(PROFIEL.dieren)[0];
      moet(id && PROFIEL.dier === id && PROFIEL.flessen === 4500 && dierPrijs() === 750, 'draaien klopt niet');
      doe('upgraden'); const v = d.vakjes.find(v => v.d.id === id);
      for (let i = 0; i < 5; i++) d.upgrade(v);
      moet(PROFIEL.dieren[id] === 5 && PROFIEL.flessen === 4500 - 300 - 600 - 900 - 1200, 'upgraden klopt niet (' + PROFIEL.dieren[id] + ', ' + PROFIEL.flessen + ')');
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
      const dag = scene('Spel').run.dagbonus ? 2 : 1; // het eerste potje van de dag telt dubbel
      moet(Math.abs(scene('Spel').shotBonus - 1.1 * dag) < 0.001, 'ster geeft geen +10% shotjes');
      return 'ster 1: alles terug naar het begin, skins blijven, shotjes ×1.1';
    },

    // balans meten (geen goed/fout): hoeveel flesjes per minuut verdien je per regio?
    async balans() {
      window.AUTOPILOOT = true;
      const uit = [];
      for (let r = 0; r < 10; r++) {
        PROFIEL.up.dash = 2; PROFIEL.up.dubbel = 1; PROFIEL.up.slash = 1;
        doe('regio ' + r); speel({ level: r, up: actieveUp() }); await wacht(() => spelKlaar(0.3) && scene('Spel').n === r, 8000, 'regio ' + r);
        const sp = scene('Spel');
        const shot0 = PROFIEL.flessen * 10 + PROFIEL.shotjes, m0 = PROFIEL.stats.monsters || 0, t0 = sp.tijd;
        while (sp.tijd - t0 < 40) { sp.run.harten = 99; await slaap(200); }
        const min = (sp.tijd - t0) / 60, fl = (PROFIEL.flessen * 10 + PROFIEL.shotjes - shot0) / 10;
        uit.push(`${sp.reg.id}:${(fl / min).toFixed(1)}fl/min,${Math.round(((PROFIEL.stats.monsters || 0) - m0) / min)}mon/min,${Math.round(sp.meters() / min)}m/min`);
      }
      return uit.join('  ');
    },

    // sloten en oneindige power-ups
    async balansregels() {
      PROFIEL.regio = 0; PROFIEL.flessen = 10000;
      scene('Titel').scene.start('Winkel', { meters: 0, regio: 0, baas: false }); await wacht(() => actief('Winkel'), 5000, 'menu');
      const w = scene('Winkel'); kiesUpgrade(w);
      doe('gokkast op slot'); w.naarOpSlot('Gokkast', GOKKAST_VANAF); await slaap(200); moet(actief('Winkel'), 'gokkast was niet op slot');
      w.naar('PowerUps'); await wacht(() => actief('PowerUps'), 5000, 'power-ups');
      const pu = scene('PowerUps'), kaart = id => pu.kaarten.find(k => k.p.id === id);
      doe('dure power-up op slot'); pu.koop(kaart('maatje')); moet(PROFIEL.up.maatje === 0 && kaart('maatje').prijsT.text === '🔒', 'flesmaatje was niet op slot');
      doe('oneindig'); for (let i = 0; i < 8; i++) pu.koop(kaart('hart'));
      moet(PROFIEL.up.hart === 8 && kaart('hart').oneindigT.text.includes('8'), 'extra hartje is niet oneindig');
      moet(prijs(POWERUPS.find(p => p.id === 'hart'), 20) > 500, 'oneindig wordt niet duur genoeg');
      doe('boogkracht en behendigheid'); pu.koop(kaart('boogkracht')); pu.koop(kaart('behendig'));
      moet(PROFIEL.up.boogkracht === 1 && PROFIEL.up.behendig === 1, 'nieuwe power-ups niet te koop');
      PROFIEL.keuze = ''; // geen willekeurige upgrade (Gulzig zet je hartjes op 1)
      pu.spelen(); await wacht(() => spelKlaar(0.5), 8000, 'spel');
      const sp = scene('Spel');
      moet(Math.abs(sp.pijlSchade() - 1.15) < 0.001, 'boogkracht doet niks');
      moet(sp.maxH === 11, 'hartjes kloppen niet (' + sp.maxH + ')');
      moet(Math.abs(kritKans(1) - 0.05) < 0.001 && kritKans(100) < 0.5 && kritKans(10) > 0.3, 'kritieke kans klopt niet');
      return 'gokkast en flesmaatje op slot; hartje tot 8 (∞); boogkracht 1.15× schade; 11 hartjes; krit 5% → max 50%';
    },

    // schatkist: nemen, of gokken (verlies, ×3)
    async schatkist() {
      PROFIEL.flessen = 0; PROFIEL.prestaties = PRESTATIES.map(p => p.id);
      speel({ level: 2 }); await wacht(() => spelKlaar(0.5), 8000, 'spel');
      const sp = scene('Spel');
      doe('kist vinden'); sp.maakKist(sp.speler.x, sp.speler.y);
      await wacht(() => actief('Schatkist') && M().isPaused('Spel'), 4000, 'schatkist gaat open en spel pauzeert');
      const inzet = scene('Schatkist').inzet; scene('Schatkist').neem();
      await wacht(() => !actief('Schatkist') && !M().isPaused('Spel'), 4000, 'spel gaat verder');
      moet(PROFIEL.flessen === inzet, 'nemen klopt niet');
      doe('gokken: verlies'); sp.maakKist(sp.speler.x, sp.speler.y); await wacht(() => actief('Schatkist'), 4000, 'kist 2');
      const v = PROFIEL.flessen; scene('Schatkist').draai(0); await wacht(() => !actief('Schatkist'), 20000, 'rad stopt');
      moet(PROFIEL.flessen === v, 'verlies klopt niet');
      doe('gokken: ×3'); sp.maakKist(sp.speler.x, sp.speler.y); await wacht(() => actief('Schatkist'), 4000, 'kist 3');
      const i2 = scene('Schatkist').inzet, v2 = PROFIEL.flessen; scene('Schatkist').draai(KIST_VAKJES.indexOf(3)); await wacht(() => !actief('Schatkist'), 20000, 'rad stopt');
      moet(PROFIEL.flessen === v2 + i2 * 3, '×3 klopt niet');
      const ev = KIST_VAKJES.reduce((a, b) => a + b, 0) / KIST_VAKJES.length;
      moet(KIST_VAKJES.filter(x => !x).length === KIST_VAKJES.length / 2 && Math.abs(ev - 1) < 0.001, 'kansen kloppen niet');
      return 'nemen, verlies en ×3 werken; 50% weg, gemiddeld precies je inzet terug';
    },

    // Brouwmachine: in de grond niet te raken, na 3 rondes boven, daarna 2× zo zwaar; van de vloer vallen
    async machine() {
      PROFIEL.regio = 7;
      speel({ level: 7, baas: true, harten: 5 }); await wacht(() => spelKlaar(0.5) && scene('Spel').baasModus && scene('Spel').baas, 8000, 'Brouwmachine');
      const sp = scene('Spel'), b = sp.baas;
      moet(b.maxHp >= 500, 'te weinig levens (' + b.maxHp + ')');
      moet(b.status === 'grond' && !b.body.enable, 'begint niet in de grond');
      doe('in de grond niet te raken'); const hp = b.hp; sp.raakVijand(b, 10, 1, 'slash'); moet(b.hp === hp, 'kon hem raken in de grond');
      doe('3 rondes'); for (let r = 1; r <= 3; r++) { b.timer = 0; await wacht(() => b.ronde === r, 4000, 'ronde ' + r); }
      await wacht(() => sp.kogels.getChildren().some(k => k.texture.key === 'perszij'), 8000, 'een pers van opzij');
      doe('naar boven'); b.timer = 0; await wacht(() => b.status === 'boven' && b.body.enable, 6000, 'machine komt naar boven');
      sp.raakVijand(b, 10, 1, 'slash'); moet(b.hp < hp, 'boven kon je hem niet raken');
      doe('weer weg, ×2'); b.timer = 0; await wacht(() => b.status === 'grond' && b.cyclus === 2, 4000, 'weer de grond in');
      doe('van de vloer vallen'); sp.run.harten = 5; sp.onkwetsbaar = 0; sp.speler.body.reset(900, 560); sp.speler.body.setVelocity(0, 400);
      await wacht(() => sp.run.harten === 4, 4000, 'hartje kwijt na vallen');
      moet(Math.abs(sp.speler.x - 480) < 20 && sp.speler.y < 240, 'niet terug op het bovenste platform');
      return 'in de grond onraakbaar, 3 rondes met zijpersen, boven raakbaar, daarna ×2; vallen kost 1 hartje en je staat op het bovenste platform';
    },

    // na een gewonnen baas: doodgaan in het volgende level, dan opnieuw spelen én de volgende baas kunnen doen
    async nabaas() {
      PROFIEL.regio = 0; PROFIEL.flessen = 200; PROFIEL.prestaties = PRESTATIES.map(p => p.id);
      scene('Titel').scene.start('Spel', { run: nieuweRun(true, 0) }); await wacht(() => spelKlaar(1) && scene('Spel').baasModus, 8000, 'baas');
      let sp = scene('Spel'); sp.baas.hp = 1; sp.raakVijand(sp.baas, 5, 1, 'slash');
      await wacht(() => actief('Schatkist'), 15000, 'schatkist'); scene('Schatkist').neem();
      await wacht(() => spelKlaar(0.5) && scene('Spel').n === 1 && !scene('Spel').baasModus, 15000, 'volgende level');
      doe('doodgaan in het volgende level'); scene('Spel').gameOver(); await wacht(() => actief('Winkel'), 6000, 'menu na doodgaan');
      const w = scene('Winkel'); kiesUpgrade(w);
      doe('opnieuw spelen'); w.spelen(); await wacht(() => spelKlaar(0.5), 8000, 'opnieuw spelen');
      doe('stoppen en de volgende baas'); scene('Spel').gameOver(); await wacht(() => actief('Winkel'), 6000, 'menu');
      kiesUpgrade(scene('Winkel')); PROFIEL.startRegio = 1; scene('Winkel').vernieuwAlles();
      moet(scene('Winkel').koopBaas(), 'kon de volgende baas niet kopen'); scene('Winkel').vechten();
      await wacht(() => spelKlaar(0.5) && scene('Spel').baasModus && scene('Spel').n === 1, 8000, 'volgende baas start');
      return 'na de baas: doodgaan, opnieuw spelen en de volgende baas starten werkt';
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
