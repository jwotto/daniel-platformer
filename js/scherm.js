// Het scherm: altijd liggend spelen en het hele scherm vullen.
//
// 1. Telefoon rechtop? Dan draaien we de game zelf een kwartslag, zodat je meteen kunt spelen.
// 2. De game is 960×540. Op een breder (of hoger) scherm vullen we de randen op:
//    daar loopt de wereld gewoon door (lucht, bergen, platforms, monsters).
//    Alles wat je moet aanraken (menu's, knoppen, HUD) blijft in het midden.

const BASIS_B = 960, BASIS_H = 540;

// moet de game gedraaid worden? (telefoon rechtop, of #draai in het adres om te testen)
function moetDraaien() {
  const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return (touch || location.search.includes('draai')) && window.innerHeight > window.innerWidth;
}

// het speelvak draaien (of weer recht zetten)
function zetDraai() {
  const el = document.getElementById('spel');
  const draai = moetDraaien();
  document.body.classList.toggle('gedraaid', draai);
  if (draai) {
    el.style.cssText = `position:fixed;top:0;left:0;right:auto;bottom:auto;width:${window.innerHeight}px;height:${window.innerWidth}px;` +
      `transform-origin:0 0;transform:translateX(${window.innerWidth}px) rotate(90deg);`;
  } else el.style.cssText = '';
}

// Phaser moet weten hoe groot het vak is (zonder de draaiing) en waar je drukt (mét de draaiing)
function scherpstellenPhaser(game) {
  const sm = game.scale;
  sm.getParentBounds = function () {
    if (!this.parent) return false;
    const w = this.parent.clientWidth, h = this.parent.clientHeight;
    if (this.parentSize.width !== w || this.parentSize.height !== h) { this.parentSize.setSize(w, h); return true; }
    return false;
  };
  const im = game.input;
  const origineel = im.transformPointer.bind(im);
  im.transformPointer = function (pointer, pageX, pageY, wasMove) {
    if (!document.body.classList.contains('gedraaid')) return origineel(pointer, pageX, pageY, wasMove);
    const r = sm.canvas.getBoundingClientRect();
    // het canvas staat 90° gedraaid: zijn linkerbovenhoek zit rechtsboven op het scherm
    const cx = pageY - (r.top + window.scrollY), cy = (r.left + window.scrollX + r.width) - pageX;
    const p0 = pointer.position, p1 = pointer.prevPosition;
    p1.x = p0.x; p1.y = p0.y;
    p0.x = cx * sm.canvas.width / r.height;
    p0.y = cy * sm.canvas.height / r.width;
  };
}

// ---------- RANDEN OPVULLEN ----------
// Per scherm: de gewone camera blijft 960×540 in het midden. Om hem heen komen 'randcamera's'
// die hetzelfde zien (zonder HUD en knoppen), plus uitgerekte kopieën van de achtergrond.
const RAND_KOPIE = '__randKopie';

function vulScherm(scene) {
  // de echte grootte van het canvas (bij EXPAND groter dan 960×540)
  const W = scene.scale.canvas.width, H = scene.scale.canvas.height;
  // hele pixels, anders zie je een dun naadje
  const ox = Math.max(0, Math.floor((W - BASIS_B) / 2)), oy = Math.max(0, Math.floor((H - BASIS_H) / 2));
  const main = scene.cameras.main;
  // oude randen weg
  (scene.__randen || []).forEach(r => {
    if (scene.cameras.cameras.includes(r.cam)) scene.cameras.remove(r.cam);
    r.kopieen.forEach(k => { if (k.scene) k.destroy(); });
  });
  scene.__randen = [];
  main.setViewport(ox, oy, BASIS_B, BASIS_H);
  scene.__vulMaat = W + 'x' + H; scene.__vulCamX = ox;
  // de mist maakt de randen van het midden donker: op een breed of hoog scherm geeft dat een naad, dus dan uit
  scene.children.list.forEach(o => { if (o.texture && o.texture.key === 'mist') o.setVisible(!ox && !oy); });
  if (!ox && !oy) return;

  // achtergrond-stukken: liggen in de linkerbovenhoek en zijn het hele scherm breed
  const bg = scene.children.list.filter(o => !o[RAND_KOPIE] && (o.type === 'Image' || o.type === 'Rectangle' || o.type === 'TileSprite')
    && o.x === 0 && o.originX === 0 && o.displayWidth >= BASIS_B - 1 && (o.y === 0 || o.type === 'TileSprite') && o.visible
    && !(o.texture && o.texture.key === 'mist')); // de mist (donkere randjes) niet uitrekken, dat geeft een naad

  const vakken = [];
  if (ox) { vakken.push([0, oy, ox, BASIS_H], [ox + BASIS_B, oy, W - ox - BASIS_B, BASIS_H]); }
  if (oy) { vakken.push([0, 0, W, oy], [0, oy + BASIS_H, W, H - oy - BASIS_H]); }
  for (const [vx, vy, vw, vh] of vakken) {
    if (vw <= 0 || vh <= 0) continue;
    const cam = scene.cameras.add(vx, vy, vw, vh);
    cam.setBackgroundColor(scene.sys.game.config.backgroundColor);
    // kopieën van de achtergrond, zo neergezet dat ze precies aansluiten op het midden
    const kopieen = bg.map(o => {
      let k;
      if (o.type === 'Image') {
        // de buitenste rand van het plaatje (1 kolom of 1 rij pixels) uitrekken: dan sluit de kleur precies aan
        const bron = o.texture.getSourceImage(), fw = bron.width, fh = bron.height;
        const zij = vy === oy ? (vx < ox ? 'L' : 'R') : (vy < oy ? 'T' : 'B');
        if (zij === 'B') return null; // onder komt het water, daar geen lucht
        const key = 'rand_' + o.texture.key + '_' + zij;
        if (!scene.textures.exists(key)) {
          const t = zij === 'T' ? scene.textures.createCanvas(key, fw, 1) : scene.textures.createCanvas(key, 1, fh);
          const ctx = t.getContext();
          if (zij === 'L') ctx.drawImage(bron, 0, 0, 1, fh, 0, 0, 1, fh);
          else if (zij === 'R') ctx.drawImage(bron, fw - 1, 0, 1, fh, 0, 0, 1, fh);
          else ctx.drawImage(bron, 0, 0, fw, 1, 0, 0, fw, 1);
          t.refresh();
        }
        k = scene.add.image(0, 0, key).setOrigin(0);
        if (zij === 'T') { k.setDisplaySize(W, oy); k.plekX = 0; k.plekY = 0; }
        else { k.setDisplaySize(vw, BASIS_H); k.plekX = vx; k.plekY = oy; }
      }
      else if (o.type === 'Rectangle') k = scene.add.rectangle(0, 0, W, H, o.fillColor, o.fillAlpha).setOrigin(0);
      else {
        // raakt hij de onderkant (water, grond)? dan laten we hem doorlopen tot de onderkant van het scherm
        const totOnder = o.y + o.height >= BASIS_H - 1;
        k = scene.add.tileSprite(0, 0, W, totOnder ? H - (o.y + oy) : o.height, o.texture.key).setOrigin(0);
      }
      k[RAND_KOPIE] = true;
      k.bron = o;
      k.setScrollFactor(0).setDepth(o.depth).setAlpha(o.alpha);
      if (k.plekX !== undefined) { k.x = k.plekX - vx; k.y = k.plekY - vy; }
      else { k.x = -vx; k.y = (o.type === 'TileSprite' ? o.y + oy : 0) - vy; }
      return k;
    }).filter(Boolean);
    scene.__randen.push({ cam, kopieen, vx, vy });
  }
  // kopieën alleen in hun eigen randcamera
  for (const r of scene.__randen) {
    main.ignore(r.kopieen);
    for (const r2 of scene.__randen) if (r2 !== r) r2.cam.ignore(r.kopieen);
  }
  randBijwerken(scene);
}

// elke beeldje: randcamera's laten meekijken en dingen die vast in beeld staan (HUD) overslaan
function randBijwerken(scene) {
  // vangnet: klopt de schermmaat nog? zo niet, dan alles opnieuw instellen
  const sm = scene.scale, el = sm.parent;
  const doel = el ? el.clientWidth + 'x' + el.clientHeight : '';
  if (el && sm.__ingesteld !== doel) {
    sm.__ingesteld = doel;
    sm.getParentBounds(); sm.refresh();
  }
  const maat = sm.canvas.width + 'x' + sm.canvas.height;
  if (scene.__vulMaat !== maat || (scene.__vulCamX !== undefined && scene.cameras.main.x !== scene.__vulCamX)) vulScherm(scene);
  const randen = scene.__randen;
  if (!randen || !randen.length) return;
  const main = scene.cameras.main;
  for (const r of randen) {
    r.cam.scrollX = main.scrollX + r.vx - main.x;
    r.cam.scrollY = main.scrollY + r.vy - main.y;
    for (const k of r.kopieen) {
      // origineel is weg (bijv. keuzescherm gesloten)? dan de kopie ook weg
      // (doorzichtig in plaats van onzichtbaar: een randcamera zonder iets te tekenen geeft een leeg beeld)
      if (!scene.children.exists(k.bron)) { k.setAlpha(0); continue; }
      k.setAlpha(k.bron.visible ? k.bron.alpha : 0);
      if (k.type === 'TileSprite') { k.tilePositionX = k.bron.tilePositionX - main.x; k.tilePositionY = k.bron.tilePositionY; }
    }
  }
  // wat vast in beeld staat (HUD, knoppen, teksten) hoort alleen in het midden
  for (const o of scene.children.list) {
    if (o[RAND_KOPIE] || o.scrollFactorX !== 0) continue;
    for (const r of randen) if (!(o.cameraFilter & r.cam.id)) r.cam.ignore(o);
  }
}

function startScherm(game) {
  zetDraai();
  scherpstellenPhaser(game);
  const opnieuw = () => {
    zetDraai();
    // eerst de nieuwe maat laten lezen, dan pas alles opnieuw instellen
    game.scale.getParentBounds();
    game.scale.refresh();
  };
  window.addEventListener('resize', () => setTimeout(opnieuw, 60));
  window.addEventListener('orientationchange', () => setTimeout(opnieuw, 250));
  // Vlak voor elk beeldje: alle actieve schermen nalopen (nieuw gestart? andere maat? randen meeschuiven).
  // Zo hoeft geen enkel scherm zich aan te melden, en klopt het altijd, ook na een herstart.
  game.events.on('poststep', () => {
    for (const scene of game.scene.getScenes(true)) {
      if (!scene.__haak) {
        scene.__haak = true;
        // bij afsluiten zijn de randcamera's en kopieën weg: volgende keer opnieuw opbouwen
        scene.sys.events.on('shutdown', () => { scene.__randen = []; scene.__vulMaat = null; scene.__vulCamX = undefined; });
      }
      randBijwerken(scene);
    }
  });
  game.scale.on('resize', () => {
    // Phaser zet eerst zelf de camera's goed; bij het volgende beeldje vullen wij de randen opnieuw
    for (const scene of game.scene.getScenes(true)) scene.__vulMaat = null;
  });
  opnieuw();
}
