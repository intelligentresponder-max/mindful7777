# mindful7777 – SEO Blog Cluster

Dreisprachiger (DE/EN/FR) SEO-Blog-Cluster rund um das **Sock-Anchor-Protokoll** –
ein 90-Sekunden-Reset, der das Nervensystem über Atmung und klassische Konditionierung
von Beta- in Richtung Theta-Zustand bringt.

## Inhalt

| Datei | Thema | Canonical-URL |
|---|---|---|
| `00-blog-index.html` | Blog-Übersicht (verlinkt alle Posts) | `/blog` |
| `01-theta-zustand.html` | Theta-Wellen & Theta-Zustand | `/blog/theta-zustand` |
| `02-beta-wellen-stress.html` | Beta-Wellen & Kampf-oder-Flucht | `/blog/beta-wellen-stress` |
| `03-vagusnerv-atmung.html` | Vagusnerv & 4-6-Atmung | `/blog/vagusnerv-atmung` |
| `04-cortisol-stress.html` | Cortisol & Stressregulation | `/blog/cortisol-stress` |
| `05-klassische-konditionierung-anker.html` | Klassische Konditionierung (der Anker) | `/blog/klassische-konditionierung-anker` |
| `06-parasympathikus-regeneration.html` | Parasympathikus & Regeneration | `/blog/parasympathikus-regeneration` |
| `07-sock-anchor-protokoll.html` | **Pillar-Post**: das komplette Protokoll | `/blog/sock-anchor-protokoll` |
| `sitemap.xml` | Sitemap mit hreflang-Annotationen | `/sitemap.xml` |

`07` ist der Pillar-Post: Er enthält die 5-Schritte-Anleitung (HowTo-Schema) und
verlinkt intern auf alle sechs Themen-Posts → klassische Cluster-Struktur für Topic Authority.

## Mehrsprachigkeit

- **Eine Datei pro Post**, drei Sprachen via JavaScript-Sprachumschalter (DE/EN/FR).
- Französisch durchgängig im **Tutoiement** (tu/du).
- Marke **„Sock-Anchor"** bleibt in allen Sprachen unübersetzt (Wiedererkennung + SEO).
- Jede Sprache ist über einen URL-Parameter direkt aufrufbar und teilbar:
  `…/theta-zustand?lang=fr`. Der Umschalter aktualisiert die URL automatisch.
- **hreflang**-Tags (de / en / fr / x-default) sind in jeder Seite im `<head>` gesetzt
  und in der Sitemap annotiert → verhindert Duplicate-Content-Wertung durch Google.

## SEO-Ausstattung (pro Post)

- `title`, `meta description`, `canonical`
- Open Graph
- JSON-LD strukturierte Daten (`Article`; Pillar: `HowTo`)
- saubere H1 → H2-Hierarchie
- Glossar pro Post + Inline-Tooltips auf Fachbegriffen

## Inhaltliche Leitlinien

- Body-Text bleibt **sachlich und faktenbasiert**.
- Persuasive Sprachmuster (Präsupposition + eingebetteter Befehl, Prinzip „Sog statt Druck")
  ausschließlich im **CTA-Block**, bewusst sparsam (max. 2 Muster).
- **Health-Claims-Disclaimer** in allen drei Sprachen. Keine Heilversprechen –
  Formulierungen bleiben auf Entspannungs-/Wohlbefinden-Ebene (UWG / Health-Claims-konform).

## Deployment-Hinweise

> **Vor dem Push prüfen:** Wenn Dateien per Handy heruntergeladen wurden, können
> Suffixe wie ` (1)` oder `-2` am Namen hängen. Die Namen müssen **exakt** wie in der
> Tabelle oben lauten, da die Slugs in Canonical- und hreflang-URLs darauf verweisen.

1. **URL-Schema:** Die Canonicals enden **ohne** `.html` (z. B. `/blog/theta-zustand`).
   Das Hosting muss die Seiten unter diesen Pfaden ausliefern – per Rewrite, der die
   `.html`-Endung wegschneidet, oder durch entsprechende Routen.
   *Falls das Hosting nur `…/theta-zustand.html` liefern kann:* Canonical-, hreflang-
   und Sitemap-URLs auf das `.html`-Schema umstellen, damit nichts ins Leere zeigt.
2. **Sitemap:** `sitemap.xml` ins Repo-Root legen und in `robots.txt` referenzieren:
   ```
   Sitemap: https://mindful7777.com/sitemap.xml
   ```
3. Nach dem Push die Live-URLs in der Google Search Console einreichen.

## Visual Layer (sprachneutral)

Jede Seite hat eine dezente visuelle Ebene – komplett aus CSS / SVG / JS, **ohne Text**,
daher in allen drei Sprachen identisch und ohne Pflegeaufwand:

- atmende Theta-Welle im Hero (sanft driftendes SVG)
- ein Konzept-Icon pro Post (Welle, Lunge, Tropfen, Glocke, Blatt, Anker …)
- Scroll-Reveal beim Einscrollen
- pulsierender „Atem-Punkt" am CTA (~10 s, 4-6-Rhythmus)
- `prefers-reduced-motion` wird respektiert
- `<noscript>`-Fallback: ohne JavaScript bleibt der gesamte Text sichtbar (SEO-Schutz)

Die Icons sitzen **außerhalb** der übersetzten Textknoten, damit der Sprachwechsel
sie nicht überschreibt.

## Technik

- Reines HTML/CSS/JS, keine Build-Tools, keine externen Abhängigkeiten
  (außer Google Fonts via `@import`).
- i18n als JS-Objekt pro Datei; alle Sprach-Objekte wurden mit Node.js auf
  gültige Syntax und vollständige Schlüssel geprüft.

---

© 2026 mindful7777
