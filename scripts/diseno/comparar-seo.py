"""Compara las senales SEO de CADA pagina del sitemap local (out/) contra
produccion: title, description, canonical, robots, H1 y largo del JSON-LD.

    npm run build && python3 scripts/diseno/comparar-seo.py

Sirve para comprobar que un cambio de diseno no toco lo que Google lee. Lo
esperado: "IGUALES: N de N" mas las paginas NUEVAS o las que se cambiaron a
proposito. Cualquier otra que salga como CAMBIA es un aviso para detenerse —
sobre todo /jardines-del-sur-7 (posicion #1, su title/H1/canonical NO se tocan).
"""
import os
import re
import sys
import urllib.request

OUT = "out"
PROD = "https://alttahomescancun.mx"


def senales(h):
    def g(p):
        m = re.search(p, h, re.S)
        return m.group(1) if m else None

    h1 = re.sub(r"<[^>]+>", " ", g(r"<h1[^>]*>(.*?)</h1>") or "")
    ld = sum(len(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S))
    return {
        "title": g(r"<title>(.*?)</title>"),
        "desc": g(r'<meta name="description" content="([^"]*)"'),
        "canonical": g(r'<link rel="canonical" href="([^"]*)"'),
        "robots": g(r'<meta name="robots" content="([^"]*)"'),
        "h1": " ".join(h1.split()),
        "jsonld": ld,
    }


def main():
    if not os.path.exists(f"{OUT}/sitemap.xml"):
        sys.exit("Falta out/sitemap.xml: correr npm run build primero.")
    urls = re.findall(r"<loc>([^<]+)</loc>", open(f"{OUT}/sitemap.xml").read())
    iguales = 0
    for u in urls:
        ruta = u.replace(PROD, "") or "/"
        f = f"{OUT}/index.html" if ruta == "/" else f"{OUT}{ruta}.html"
        if not os.path.exists(f):
            f = f"{OUT}{ruta}/index.html"
        local = senales(open(f, encoding="utf-8").read())
        try:
            req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
            prod = senales(urllib.request.urlopen(req, timeout=20).read().decode("utf-8"))
        except Exception:
            print(f"NUEVA   {ruta}\n        title: {local['title']}\n        h1:    {local['h1']}\n        desc:  {local['desc']}")
            continue
        dif = [k for k in local if local[k] != prod[k]]
        if not dif:
            iguales += 1
            continue
        print(f"CAMBIA  {ruta}")
        for k in dif:
            print(f"        {k}: {prod[k]!r}\n           → {local[k]!r}")
    print(f"\nIGUALES: {iguales} de {len(urls)}")


if __name__ == "__main__":
    main()
