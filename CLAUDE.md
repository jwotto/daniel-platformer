# Flesje op Avontuur

Dit project is van Daniel, de neef van Jan-Willem. Daniel leert hier vibecoden: hij vertelt wat hij wil en Claude bouwt het.

## Hoe je met Daniel praat

- Praat Nederlands, kort en makkelijk. Geen moeilijke woorden zonder uitleg.
- Vertel per stap in één regel wat je nu gaat doen, zodat ze kunnen meelezen.
- Leg na elke verandering in één of twee zinnen uit wat je deed en waarom, zodat Daniel ervan leert.
- Doe kleine stapjes en laat Daniel na elke stap testen.
- Wees enthousiast, maar eerlijk als iets niet werkt.

## Techniek

- HTML-game met Phaser 3.80.1 (geladen van cdnjs). Geen build-stap: gewone `<script>`-bestanden in `js/`.
- Spelgrootte 960×540, schaalt mee met het scherm (`Scale.FIT`). Moet altijd op mobiel werken: touch-knoppen staan in `js/besturing.js`.
- Alle plaatjes worden met canvas-code getekend in `js/tekeningen.js`. Stijl: sprookjesachtig 2D, sierlijke vormen, donkere contouren (`INKT`), kleuren rood, goudgeel, turquoise en diepblauw.
- Namen van variabelen en functies in het Nederlands, zodat Daniel ze snapt.
- Geluid en muziek worden live gemaakt met Web Audio in `js/geluid.js` (geen geluidsbestanden).
- Voortgang (flesjes, power-ups, regio's) wordt bewaard in localStorage via `PROFIEL` in `js/powerups.js`.
- Testen zonder te spelen: `index.html#test` (de computer speelt zelf), `#baas0`–`#baas9`, `#ijs`, `#berg`, `#vulkaan`, `#grot`, `#savanne`, `#kroeg`, `#fabriek`, `#speeltuin`, `#maan`, `#prestaties`, `#winkel`, `#shop`, `#kebab`, `#spel`. Test-adressen bewaren niks. Fouten verschijnen als rode balk onderaan.
- Aan het eind van een blok: testen dat doodgaan → winkel → "Spelen" blijft werken (dat ging eerder mis); de test `ronde` doet dat.
- Zet problemen en hun oplossing in de README onder "Problemen en oplossingen".
- Commit na elke stap die werkt, met een korte Nederlandse commit-boodschap.
- Online zetten gaat altijd met `./zet-online.sh` (niet met een losse `git push`). Dat script geeft alle bestanden een nieuw versienummer (`?v=...` in `index.html` en `versie.txt`), zodat browsers niet de oude versie uit hun cache laden. Bij het opstarten kijkt de game in `versie.txt` of er een nieuwere versie is en laadt dan zelf opnieuw.
- Vaste speeltest: `python3 tests/test.py` (alle onderdelen) of `python3 tests/test.py ronde` (één onderdeel). Werkwijze van Jan-Willem: eerst alles bouwen, pas aan het eind van een blok alle tests draaien (dat gaat sneller). Nieuwe functie? Voeg een onderdeel toe in `tests/speeltest.js` en `tests/test.py`.
