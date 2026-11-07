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
      w.koop(w.kaarten[0]); moet(PROFIEL.up.dash === 1 && PROFIEL.flessen === 94, 'kopen werkte niet');
      w.ongedaan(); moet(PROFIEL.up.dash === 0 && PROFIEL.flessen === 100, 'ongedaan werkte niet');
      doe('baas kopen, naar shop en terug'); w.koop(w.baasKaart); moet(PROFIEL.ticket, 'baas kopen werkte niet');
      w.naarShop(); await wacht(() => actief('Shop'), 5000, 'shop');
      scene('Shop').terug(); await wacht(() => actief('Winkel'), 5000, 'terug naar winkel');
      moet(!scene('Winkel').kiest && PROFIEL.ticket, 'na de shop moest je opnieuw kiezen of was je ticket weg');
      doe('vechten'); scene('Winkel').vechten(); moet(!PROFIEL.ticket, 'ticket niet opgebruikt');
      await wacht(() => spelKlaar(1.5) && scene('Spel').baasModus, 8000, 'baasgevecht start');
      doe('dood in baasgevecht'); scene('Spel').gameOver(); await wacht(() => actief('Winkel'), 5000, 'winkel na baas');
      kiesUpgrade(scene('Winkel'));
      doe('weer spelen'); scene('Winkel').spelen(); await wacht(() => spelKlaar(1) && !scene('Spel').baasModus, 8000, 'normaal spelen na baas');
      return 'doodgaan, kiezen, kopen, ongedaan, shop, baasgevecht en weer spelen werken';
    },

    // in elke regio 3 keer in het water vallen: 1 hartje eraf en veilig op een platform
    async vallen() {
      for (let r = 0; r < 4; r++) {
        doe('regio ' + r); speel({ level: r }); await wacht(() => spelKlaar() && scene('Spel').n === r, 8000, 'regio ' + r);
        const sp = scene('Spel');
        for (let i = 0; i < 6; i++) { sp.speler.x += 60; await slaap(60); }
        for (let v = 0; v < 3; v++) {
          sp.run.harten = 50; sp.speler.y = 650;
          await slaap(1300);
          moet(sp.run.harten === 49, sp.reg.id + ': val ' + (v + 1) + ' kostte ' + (50 - sp.run.harten) + ' hartjes');
          moet(opPlatform(sp) && sp.speler.y < 240, sp.reg.id + ': val ' + (v + 1) + ' niet veilig op het platform (y=' + Math.round(sp.speler.y) + ')');
        }
      }
      return '12 keer gevallen: steeds 1 hartje eraf en veilig op het platformpje';
    },

    // elke regio heeft zijn eigen monsters
    async monsters() {
      const MAG = {
        rivier: ['kruiper', 'vliegvis', 'goud'], ijs: ['klont', 'klontje', 'pinguin', 'vliegpinguin', 'goud'],
        berg: ['fust', 'adelaar', 'goud'], vulkaan: ['lava', 'golem', 'ptero', 'goud'],
      };
      const EIGEN = { rivier: ['kruiper', 'vliegvis'], ijs: ['klont', 'klontje', 'pinguin', 'vliegpinguin'], berg: ['fust', 'adelaar'], vulkaan: ['lava', 'golem', 'ptero'] };
      const uit = [];
      for (let r = 0; r < 4; r++) {
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
      for (let n = 0; n < 4; n++) {
        doe('baas ' + n); PROFIEL.regio = n;
        speel({ level: n, baas: true }); await wacht(() => spelKlaar(0.3) && scene('Spel').baasModus && scene('Spel').n === n, 8000, 'baas ' + n);
        const sp = scene('Spel'), b = sp.baas, gezien = new Set();
        // kijk tot hij 2 soorten aanvallen heeft gedaan (max 20 seconden), maak hem dan woedend
        const eind = Date.now() + 20000;
        while (Date.now() < eind && b.active && gezien.size < 2) {
          sp.run.harten = 99;
          if (b.status !== 'wacht') gezien.add(b.aanvallen[(b.beurt - 1) % b.aanvallen.length]);
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
      moet(PROFIEL.flessen === 15, 'geen 15 flesjes maar ' + PROFIEL.flessen);
      moet(PROFIEL.skins.includes('padkoning'), 'geen Padkoning-skin');
      moet(PROFIEL.regio === 1, 'volgende regio niet open');
      doe('door naar volgende regio'); await wacht(() => spelKlaar(0.5) && scene('Spel').n === 1, 15000, 'IJsvlakte start');
      return '+15 flesjes, Padkoning-skin en door naar de IJsvlakte';
    },

    // draairad: kost 5, je wint een nieuwe skin, daarna kost het 10
    async shop() {
      PROFIEL.flessen = 200;
      scene('Titel').scene.start('Shop'); await wacht(() => actief('Shop'), 5000, 'shop');
      const s = scene('Shop');
      doe('draaien'); s.draai(); moet(s.draait, 'rad draait niet');
      await wacht(() => !s.draait, 8000, 'rad stopt');
      moet(PROFIEL.skins.length === 2 && PROFIEL.flessen === 195 && draaiPrijs() === 10, 'prijs of skin klopt niet');
      doe('terug'); s.terug(); await wacht(() => actief('Titel'), 5000, 'terug naar titel');
      return 'gewonnen: ' + skinVan(PROFIEL.skin).naam + ', volgende draai kost ' + draaiPrijs();
    },

    // monsters met een zwakke plek: verkeerd raken ketst af, goed raken doet pijn
    async zwak() {
      const uit = [];
      for (let r = 1; r < 4; r++) {
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
