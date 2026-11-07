#!/usr/bin/env python3
"""Vaste speeltest voor BVO.

Start:  python3 tests/test.py            (alle onderdelen)
        python3 tests/test.py vallen     (één onderdeel)

Wat het doet: start een klein webservertje, opent de game in een onzichtbare Chrome
en laat tests/speeltest.js het spel naspelen. Elk onderdeel zegt OK of FOUT.
Fouten in de game (de rode balk) tellen ook als FOUT.
"""
import http.server, os, socketserver, subprocess, sys, tempfile, threading, time, urllib.parse, shutil

MAP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ONDERDELEN = ['ronde', 'vallen', 'monsters', 'zwak', 'bazen', 'beloning', 'opnieuw', 'powerups', 'shop', 'spikes', 'kebab', 'prestaties', 'aan', 'knoppen', 'trucjes', 'levels', 'gokken', 'dieren', 'prestige', 'balansregels']
TIJD = {'balans': 900, 'ronde': 40, 'vallen': 160, 'monsters': 160, 'bazen': 260, 'powerups': 40, 'shop': 30, 'zwak': 150, 'beloning': 40, 'opnieuw': 30, 'kebab': 20, 'spikes': 20, 'prestaties': 30, 'aan': 30, 'knoppen': 60, 'trucjes': 40, 'levels': 30, 'gokken': 40, 'dieren': 40, 'prestige': 30, 'balansregels': 40}
uitslag = {}


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=MAP, **k)

    def log_message(self, *a):
        pass

    def do_GET(self):
        url = urllib.parse.urlparse(self.path)
        if url.path == '/LOG':
            # de test stuurt zijn uitslag hierheen
            q = urllib.parse.parse_qs(url.query)
            uitslag[q['naam'][0]] = q['tekst'][0]
            self.send_response(204); self.end_headers(); return
        if url.path == '/test':
            # index.html met de testcode erin
            html = open(os.path.join(MAP, 'index.html'), encoding='utf-8').read()
            html = html.replace('</body>', '<script src="tests/speeltest.js"></script></body>')
            data = html.encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers(); self.wfile.write(data); return
        return super().do_GET()


def chrome():
    for naam in ['google-chrome', 'chromium', 'chromium-browser']:
        if shutil.which(naam):
            return naam
    sys.exit('Geen Chrome gevonden.')


def main():
    kies = sys.argv[1:] or ONDERDELEN
    socketserver.TCPServer.allow_reuse_address = True
    server = socketserver.ThreadingTCPServer(('127.0.0.1', 0), Handler)
    poort = server.server_address[1]
    threading.Thread(target=server.serve_forever, daemon=True).start()
    fouten = 0
    for naam in kies:
        if naam not in ONDERDELEN and naam != 'balans':
            print(f'? onbekend onderdeel: {naam} (kies uit {", ".join(ONDERDELEN)})'); fouten += 1; continue
        profiel = tempfile.mkdtemp(prefix='bvo-test-')
        p = subprocess.Popen([chrome(), '--headless=new', '--disable-gpu', '--no-sandbox', '--mute-audio',
                              f'--user-data-dir={profiel}', '--remote-debugging-port=0',
                              f'http://127.0.0.1:{poort}/test?onderdeel={naam}'],
                             stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        eind = time.time() + TIJD[naam]
        while time.time() < eind and not uitslag.get(naam, '').startswith(('OK', 'FOUT')):
            time.sleep(0.3)
        p.kill(); p.wait()
        shutil.rmtree(profiel, ignore_errors=True)
        tekst = uitslag.get(naam, 'FOUT: geen uitslag (te traag of vastgelopen)')
        if not tekst.startswith(('OK', 'FOUT')):
            tekst = 'FOUT: niet afgemaakt, laatste stap: ' + tekst
        if tekst.startswith('FOUT'):
            fouten += 1
        print(f'{"✔" if tekst.startswith("OK") else "✘"} {naam:9} {tekst}')
    server.shutdown()
    print('\nAlles goed!' if not fouten else f'\n{fouten} onderdeel/onderdelen fout.')
    sys.exit(1 if fouten else 0)


if __name__ == '__main__':
    main()
