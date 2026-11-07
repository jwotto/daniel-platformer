#!/usr/bin/env bash
# Zet de game online op GitHub Pages, met een nieuw versienummer.
# Zo halen browsers de nieuwe bestanden op in plaats van de oude uit hun geheugen (cache).
set -euo pipefail
cd "$(dirname "$0")"
VERSIE=$(date +%Y%m%d%H%M%S)
sed -i -E "s/\?v=[0-9]+\"/?v=$VERSIE\"/g; s/const VERSIE = '[0-9]+'/const VERSIE = '$VERSIE'/" index.html
echo "$VERSIE" > versie.txt
git add index.html versie.txt
git commit -q -m "Online zetten (versie $VERSIE)"
git push -q
echo "Online gezet: versie $VERSIE. Over 1 à 2 minuten staat hij op https://jwotto.github.io/daniel-platformer/"
