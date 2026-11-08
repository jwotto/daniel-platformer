// Start de game.
const config = {
  // ?canvas in het adres = zonder WebGL (alleen voor tests: dan kun je het beeld opslaan)
  type: location.search.includes('canvas') ? Phaser.CANVAS : Phaser.AUTO,
  parent: 'spel',
  width: 960,
  height: 540,
  backgroundColor: '#0d1636',
  physics: { default: 'arcade', arcade: { gravity: { y: 1500 }, debug: false } },
  // EXPAND: de game wordt breder (of hoger) zodat hij het hele scherm vult; scherm.js vult de randen op
  scale: { mode: Phaser.Scale.EXPAND, autoCenter: Phaser.Scale.NO_CENTER },
  input: { activePointers: 4 },
  scene: [Boot, Titel, Spel, Winkel, PowerUps, Shop, Prestaties, LevelKeuze, Gokkast, Dieren, Instellingen, StopVraag],
};

// Eerst de lettertypes laden (maximaal 2,5 seconde wachten), dan beginnen
const lettertypes = document.fonts
  ? Promise.all([document.fonts.load('700 20px "Alegreya Sans"'), document.fonts.load('800 40px "Alegreya SC"')])
  : Promise.resolve();
Promise.race([lettertypes, new Promise(r => setTimeout(r, 2500))])
  .catch(() => {})
  .then(() => {
    zetDraai();
    window.spel = new Phaser.Game(config);
    // zodra het spel klaar is: draaien en randen opvullen regelen
    const wacht = () => (window.spel.isBooted && window.spel.scale.canvas ? startScherm(window.spel) : setTimeout(wacht, 30));
    wacht();
  });
