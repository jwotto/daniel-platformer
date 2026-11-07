// Start de game.
const config = {
  type: Phaser.AUTO,
  parent: 'spel',
  width: 960,
  height: 540,
  backgroundColor: '#0d1636',
  physics: { default: 'arcade', arcade: { gravity: { y: 1500 }, debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { activePointers: 4 },
  scene: [Boot, Titel, Spel, Winkel, PowerUps, Shop, Prestaties, LevelKeuze, Gokkast, Dieren, Instellingen],
};

// Eerst de lettertypes laden (maximaal 2,5 seconde wachten), dan beginnen
const lettertypes = document.fonts
  ? Promise.all([document.fonts.load('700 20px "Alegreya Sans"'), document.fonts.load('800 40px "Alegreya SC"')])
  : Promise.resolve();
Promise.race([lettertypes, new Promise(r => setTimeout(r, 2500))])
  .catch(() => {})
  .then(() => { window.spel = new Phaser.Game(config); });
