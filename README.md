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
- Ga je dood, dan kom je in de **winkel**. Daar koop je power-ups met je flesjes. Alles wat je koopt blijft van jou.
- In de winkel koop je ook een gevecht met de **eindbaas**. Dat is duur! Versla je hem, dan ga je door naar de volgende regio. Verlies je, dan mag je het gratis nog een keer proberen.
- Regio's die je hebt vrijgespeeld kun je in de winkel kiezen als startplek.

### Regio's en eindbazen

| Regio | Eindbaas | Aanvallen |
|---|---|---|
| 🐸 Rivier | Koning Bierpad | springt en maakt schuimgolven, spuugt bierbellen |
| 🧊 IJsvlakte (je glijdt!) | De IJsbierbeer | rent op je af, ijspegels uit de lucht, gooit ijsblokjes |
| ⛰️ Bergen | De Bokbiergeit | ramt, rolt biervaten, springt |
| 🌋 Vulkaan | De Brouwdraak | vliegt, spuwt vuurballen, lavaregen, duikt op je af |

Daarna begint het opnieuw met Rivier 2, en alles is sterker.

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
| `js/main.js` | zet alles aan |
| `manifest.webmanifest`, `icoon-*.png` | zodat de game als app op je beginscherm kan |

### Test-adressen

Zet dit achter het adres van de game (je opgeslagen spel wordt dan niet aangeraakt):
- `#test`: de computer speelt zelf, met alle power-ups op niveau 2
- `#baas0` t/m `#baas3`: meteen vechten tegen een eindbaas (de computer speelt)
- `#ijs`, `#berg`, `#vulkaan`: meteen naar die regio
- `#winkel`: meteen naar de winkel, met 60 flesjes

## Problemen en oplossingen

- **Na twee keer doodgaan bleef de game hangen.** Oorzaak: een scherm onthield "ik ben al weg" van de vorige keer, en reageerde de volgende keer niet meer op de knop. Oplossing: dat vlaggetje wordt nu elke keer opnieuw op nul gezet als het scherm opent. Getest met drie keer doodgaan en echt klikken.
- **In de eindbaas-arena leek je op het water te staan.** Oorzaak: het water lag vóór de vloer. Oplossing: de vloer van de arena een hogere laag geven.
- **Achter de maan zat een donkerblauwe vlek.** Oorzaak: de sikkel werd gemaakt door er een blauw rondje overheen te tekenen. Oplossing: de tweede cirkel andersom tekenen, dan wordt het een echt gat in de maan.
- **De uitleg van de toetsen op het titelscherm was onzichtbaar.** Oorzaak: de tekst lag achter het water. Oplossing: de tekst een hogere laag geven.
- **Volledig scherm werkt niet op iPhone.** Oorzaak: Apple staat dat niet toe voor websites. Oplossing: de game op je beginscherm zetten, dan opent hij als app op volledig scherm.
- **Na "Vecht tegen de baas!" kon je nergens meer op drukken.** Oorzaak: Phaser gebruikt het level steeds opnieuw, en het level onthield nog de meterteller van het vorige potje. Die was al weggegooid, maar het baasgevecht probeerde hem toch bij te werken en liep vast. Oplossing: aan het begin van elk potje die oude dingen leegmaken. Getest: doodgaan → baas kopen → vechten → doodgaan → gewoon spelen.
- **Fouten zien op je telefoon?** Als er iets misgaat, komt er onderaan een rode balk met de fout. Maak daar een screenshot van en geef hem aan Claude.
