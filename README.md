# Flesje op Avontuur

**Yo niffow, zullen we een game gaan bouwen?** 🎮

Een roguelike platformer van Daniel. Het is een HTML-game, gemaakt met [Phaser 3](https://phaser.io/). Hij werkt in de browser op de computer én op je telefoon.

## Spelen

**▶ https://jwotto.github.io/daniel-platformer/**

- Werkt op de computer en op je telefoon. Houd je telefoon dwars.
- Na een wijziging duurt het ongeveer een minuut voordat de link de nieuwe versie laat zien.
- Zonder internet: open `index.html` in Chrome of Edge.

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

## Hoe het werkt

- Elk level wordt door de computer gemaakt, elke keer anders.
- Het scherm schuift langzaam naar rechts. Val je eraf of in het water, dan ben je een hartje kwijt.
- Vijanden laten **shotjes** vallen. 10 shotjes = **1 vol flesje**.
- Aan het eind van het level ga je door de poort. Daarna koop je **power-ups** met je flesjes.
- Levels: Rivierlevel → Berglevel → Rivierlevel 2 → … (eindbazen komen later)

### Power-ups

Dash · Dubbele sprong · Extra hartje · Dubbele pijlen · Sterkere slash · Zweven · Wall jump · Smash · Ontploffende pijlen.
Elke power-up kun je meerdere keren kopen. Hij wordt dan steeds beter en ook steeds duurder.

## Bestanden

| Bestand | Wat zit erin |
|---|---|
| `index.html` | de pagina die de game start |
| `js/tekeningen.js` | alle plaatjes (met code getekend) en de kleuren |
| `js/powerups.js` | de power-ups, prijzen en uitleg |
| `js/besturing.js` | toetsenbord en touch-knoppen |
| `js/spel.js` | het level: springen, vechten, vijanden, shotjes |
| `js/schermen.js` | titelscherm, winkel en game over |
| `js/main.js` | zet alles aan |

### Test-adressen

Zet dit achter het adres van de game:
- `#test`: de computer speelt zelf, met alle power-ups op niveau 2
- `#winkel`: meteen naar de winkel, met 20 flesjes
- `#berg`: meteen naar het berglevel

## Problemen en oplossingen

- **Achter de maan zat een donkerblauwe vlek.** Oorzaak: de sikkel werd gemaakt door er een blauw rondje overheen te tekenen, en dat paste niet bij de lucht. Oplossing: de tweede cirkel andersom tekenen, dan wordt het een echt gat in de maan.
- **De uitleg van de toetsen op het titelscherm was onzichtbaar.** Oorzaak: de tekst lag achter het water. Oplossing: de tekst een hogere laag geven (`setDepth(20)`).
- **Fouten zien op je telefoon?** Als er iets misgaat, komt er onderaan een rode balk met de fout. Maak daar een screenshot van en geef hem aan Claude.
