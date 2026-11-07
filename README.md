# Flesje op Avontuur

**Yo niffow, zullen we een game gaan bouwen?** 🎮

Een roguelike platformer van Daniel. Het is een HTML-game, gemaakt met [Phaser 3](https://phaser.io/). Hij werkt in de browser op de computer én op je telefoon.

## Spelen

**▶ https://jwotto.github.io/daniel-platformer/**

- Werkt op de computer en op je telefoon. Houd je telefoon dwars.
- **Volledig scherm:** op Android gaat hij vanzelf op volledig scherm als je tikt om te beginnen (of via het knopje rechtsboven). Op een iPhone: tik in Safari op Deel → **Zet op beginscherm** en open de game vanaf je beginscherm.
- Na een wijziging duurt het ongeveer een minuut voordat de link de nieuwe versie laat zien.

### Besturing

| Wat | Toetsenbord | Telefoon |
|---|---|---|
| Lopen | ← → (of A D) | duim links op het scherm en schuiven |
| Springen | spatie (lang = hoger) | SPRING |
| Slash | X | SLASH |
| Pijl schieten | C | PIJL |
| Dash (na kopen) | shift + pijltjes | DASH + duim richting |
| Smash (na kopen) | ↓ in de lucht | duim omlaag in de lucht |
| Zweven (na kopen) | spatie vasthouden | SPRING vasthouden |
| Wall jump (na kopen) | tegen de muur duwen + spatie, steeds opnieuw | duim naar de muur + SPRING |
| Instellingen | Esc | tandwiel rechtsboven |

## Hoe het werkt

- Elke regio loopt **eindeloos** door en wordt steeds moeilijker: sneller scherm, meer en sterkere vijanden, klimmuren en grote gaten.
- Vijanden laten **shotjes** vallen. 10 shotjes = **1 vol flesje**. In latere regio's zijn shotjes meer waard.
- Ga je dood, dan kies je eerst **1 van 3 upgrades** voor je volgende potje. Elke upgrade heeft een plus én een min, bijvoorbeeld *Springveer*: 1.2× zo hoog springen, maar 0.8× zo snel lopen. Of *Gulzig*: 1.5× zoveel shotjes, maar maar 1 hartje. De upgrade geldt alleen voor dat ene potje (ook als je daarin een eindbaas verslaat).
- Daarna kom je in de **winkel**. Daar koop je power-ups met je flesjes. Alles wat je koopt blijft van jou.
- In de winkel koop je ook een gevecht met de **eindbaas**. Dat is duur! Versla je hem, dan ga je door naar de volgende regio. Verlies je, dan mag je het gratis nog een keer proberen.
- Regio's die je hebt vrijgespeeld kun je in de winkel kiezen als startplek.
- Af en toe zweeft er een **kebabrol**. Eet je hem op, dan laat je een scheet en vlieg je heel hoog de lucht in!
- Je held draagt een **bierfles als muts**.

### Shop en skins

Op het titelscherm zit de **Shop**. Daar draai je aan een rad en win je een nieuwe **skin**: andere kleren en een ander flesje op je hoofd. De eerste keer draaien kost 5 flesjes, daarna elke keer 5 meer (10, 15, 20 …). Je wint altijd een skin die je nog niet had. Bij "Jouw skins" tik je een skin aan om hem aan te trekken.

Skins: Gewoon · Groene Fles · Goudkoning · Nachtridder · Rode Duivel · IJskoud · Roze Rosé · Zombie.

### Regio's en eindbazen

| Regio | Eindbaas | Aanvallen |
|---|---|---|
| 🐸 Rivier | Koning Bierpad | springt en maakt schuimgolven, spuugt bierbellen |
| 🧊 IJsvlakte (je glijdt!) | De IJsbierbeer | rent op je af, ijspegels uit de lucht, gooit ijsblokjes |
| ⛰️ Bergen | De Bokbiergeit | ramt, rolt biervaten, springt |
| 🌋 Vulkaan | De Brouwdraak | vliegt, spuwt vuurballen, lavaregen, duikt op je af |

Daarna begint het opnieuw met Rivier 2, en alles is sterker.

### Monsters per regio

| Regio | Monsters |
|---|---|
| 🐸 Rivier | kruiper (loopt heen en weer) · dwaallicht (zweeft op je af) |
| 🧊 IJsvlakte | **IJsklontje** (breekt in 3 kleintjes) · **Pinguïn-ober** (gooit glazen bier) · dwaallicht |
| ⛰️ Bergen | **Rollend fust** (rolt op je af, spring eroverheen) · **Hopvleermuis** (hangt onder platforms en duikt op je af) |
| 🌋 Vulkaan | **Lavalager** (ontploft als je te dichtbij komt) · **Brouwketel-golem** (groot en sterk, stampt schokgolven) · dwaallicht |
| Overal, zeldzaam | **Gouden flesje met pootjes**: rent weg, vang hem voor een heel flesje! |

### Power-ups

Dash · Dubbele sprong · Wall jump · Extra hartje · Zweven · Sterkere slash · Dubbele pijlen · Ontploffende pijlen · Smash.
Elke power-up kun je meerdere keren kopen. Hij wordt dan beter én duurder.

### Geluid

8-bit geluidjes en hyperactieve polka met hardcore drums, live gemaakt met de computer (`js/geluid.js`). Muziek en geluidjes kun je apart uitzetten in de instellingen.

## Bestanden

| Bestand | Wat zit erin |
|---|---|
| `index.html` | de pagina die de game start |
| `js/tekeningen.js` | alle plaatjes (met code getekend), ook de eindbazen, en de kleuren |
| `js/geluid.js` | geluidjes en muziek |
| `js/powerups.js` | power-ups, prijzen, regio's, eindbazen en opslaan |
| `js/besturing.js` | toetsenbord en touch-knoppen |
| `js/spel.js` | het level en de eindbaas-gevechten |
| `js/schermen.js` | titelscherm, instellingen en winkel |
| `js/shop.js` | de shop met het draairad en je skins |
| `js/main.js` | zet alles aan |
| `manifest.webmanifest`, `icoon-*.png` | zodat de game als app op je beginscherm kan |

### Test-adressen

Zet dit achter het adres van de game (je opgeslagen spel wordt dan niet aangeraakt):
- `#test`: de computer speelt zelf, met alle power-ups op niveau 2
- `#baas0` t/m `#baas3`: meteen vechten tegen een eindbaas (de computer speelt)
- `#ijs`, `#berg`, `#vulkaan`: meteen naar die regio
- `#winkel`: meteen naar de winkel, met 60 flesjes
- `#shop`: meteen naar de shop met het draairad, met 200 flesjes
- `#kebab`: meteen spelen met een kebabrol voor je neus

## Online zetten

Typ `./zet-online.sh`. Dat geeft de game een nieuw versienummer, maakt een commit en zet hem op GitHub. Na 1 à 2 minuten staat hij online.

Waarom een versienummer? Je browser bewaart de bestanden van de game een tijdje (de *cache*), zodat hij sneller laadt. Zonder nieuw nummer speel je dan nog de oude versie. Met een nieuw nummer haalt de browser alles opnieuw op. De game kijkt bij het opstarten ook zelf of er een nieuwere versie is, en laadt dan meteen opnieuw.

## Problemen en oplossingen

- **Na twee keer doodgaan bleef de game hangen.** Oorzaak: een scherm onthield "ik ben al weg" van de vorige keer, en reageerde de volgende keer niet meer op de knop. Oplossing: dat vlaggetje wordt nu elke keer opnieuw op nul gezet als het scherm opent. Getest met drie keer doodgaan en echt klikken.
- **In de eindbaas-arena leek je op het water te staan.** Oorzaak: het water lag vóór de vloer. Oplossing: de vloer van de arena een hogere laag geven.
- **Achter de maan zat een donkerblauwe vlek.** Oorzaak: de sikkel werd gemaakt door er een blauw rondje overheen te tekenen. Oplossing: de tweede cirkel andersom tekenen, dan wordt het een echt gat in de maan.
- **De uitleg van de toetsen op het titelscherm was onzichtbaar.** Oorzaak: de tekst lag achter het water. Oplossing: de tekst een hogere laag geven.
- **Volledig scherm werkt niet op iPhone.** Oorzaak: Apple staat dat niet toe voor websites. Oplossing: de game op je beginscherm zetten, dan opent hij als app op volledig scherm.
- **Na "Vecht tegen de baas!" kon je nergens meer op drukken.** Oorzaak: Phaser gebruikt het level steeds opnieuw, en het level onthield nog de meterteller van het vorige potje. Die was al weggegooid, maar het baasgevecht probeerde hem toch bij te werken en liep vast. Oplossing: aan het begin van elk potje die oude dingen leegmaken. Getest: doodgaan → baas kopen → vechten → doodgaan → gewoon spelen.
- **Na in het water vallen ging je soms meteen weer dood.** Oorzaak: je kwam terug op een bestaand platform, soms laag, smal of vlak bij een vijand. Oplossing: je komt nu altijd terug op een eigen veilig platformpje, hoog en midden in beeld. Vijanden en kogels vlakbij worden weggehaald, je knippert 2,5 seconde (onkwetsbaar) en het scherm wacht even. Getest: na een val 1 hartje kwijt en je staat stil op het platformpje.
- **Fouten zien op je telefoon?** Als er iets misgaat, komt er onderaan een rode balk met de fout. Maak daar een screenshot van en geef hem aan Claude.
