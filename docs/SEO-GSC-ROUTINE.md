# SEO & Google Search Console — Routine & Referenz

> Erstellt für mindful7777. Bezug: GSC-Property
> `https://intelligentresponder-max.github.io/mindful7777/`
> Sitemap: `https://intelligentresponder-max.github.io/mindful7777/sitemap.xml` (20 URLs)

---

## 1. Seitenindexierungsbericht (GSC-Hilfeartikel 6258314)

Der Bericht **„Seiten" / „Page indexing"** in der Search Console zeigt, welche
URLs Google indexiert hat und welche nicht — mit Begründung pro Status.

### Status verstehen

| Status | Bedeutung | Handlung |
|---|---|---|
| **Indexiert** | In Google-Suche auffindbar | nichts — Ziel erreicht ✅ |
| **Entdeckt – zurzeit nicht indexiert** | Google kennt die URL, hat sie noch nicht gecrawlt | warten (normal bei neuen Seiten) |
| **Gecrawlt – zurzeit nicht indexiert** | Gecrawlt, aber nicht aufgenommen | Content-Qualität/Einzigartigkeit prüfen |
| **Duplikat ohne nutzerseitig kanonische Seite** | Google sieht Inhalt als Dublette | canonical + hreflang prüfen |
| **Alternative Seite mit korrektem kanonischen Tag** | Sprachvariante, korrekt erkannt | nichts — so gewollt ✅ |
| **Ausgeschlossen durch „noindex"** | Meta-Tag blockiert Indexierung | nur entfernen, wenn Seite rein soll |
| **Durch robots.txt blockiert** | Crawling unterbunden | robots.txt prüfen |
| **Soft 404** | Seite wirkt leer/fehlerhaft | Inhalt/Statuscode prüfen |

### Wichtig für uns
- **Neue Seiten** stehen oft erst auf „Entdeckt – nicht indexiert". Das ist **normal**
  und dauert **Tage bis Wochen**. Nicht beunruhigen.
- Unsere **hreflang + canonical**-Arbeit zielt genau auf die „Duplikat"-Status:
  Die DE/EN/FR-Varianten sollen als **Alternativen** erkannt werden, nicht als Dubletten.

---

## 2. Routine: Neue Blog-Seite live bringen (Checkliste)

1. HTML im bewährten Template bauen (DE/EN/FR i18n-Objekt, Glossar, CTA-Muster).
2. **Brand-Check** gegen `knowledge/verbotene_phrasen.md` — ABER: Verneinungen
   („kein Chakren, keine Manifestation") sind **erlaubt**. Scanner-Treffer immer
   im Kontext prüfen, nicht blind ersetzen.
3. **URLs prüfen:** Domain = `intelligentresponder-max.github.io/mindful7777`,
   Schema **MIT `.html`** (GitHub Pages liefert ohne Rewrite kein clean-URL).
4. **hreflang** (de/en/fr/x-default) im `<head>`; bei Einzeldateien `?lang=`,
   bei getrennten DE/EN-Dateien gegenseitig verlinken.
5. **i18n mit Node validieren** (fängt Quote-Escaping-Bugs):
   `node -e "const o={...}; console.log(Object.keys(o.en).length)"`
6. In **`sitemap.xml`** eintragen (mit `<xhtml:link hreflang>`-Annotationen).
7. Push → GitHub Pages **2–3 Min Build-Zeit** abwarten.
8. Live testen: Datei-URL im Browser + Sprachumschalter + `?lang=fr`.
9. GSC: **„URLprüfung"** → URL eingeben → „Indexierung beantragen".

---

## 3. Routine: Sitemap aktuell halten

- Liegt im **Repo-Root**: `~/mindful7777/sitemap.xml`
- In GSC unter **„Sitemaps"** einmalig eingereicht als `sitemap.xml`.
- Bei neuen Seiten: URL + hreflang-Block ergänzen, pushen. Google liest sie
  automatisch neu — kein erneutes Einreichen nötig.
- Quick-Check Anzahl URLs: `grep -c "<loc>" ~/mindful7777/sitemap.xml`

---

## 4. Termux Quick-Reference (Handy-Workflow)

```bash
# Stand holen
cd ~/mindful7777 && git pull origin main --rebase

# Download aufräumen (Suffix-Chaos vermeiden!)  -> IMMER vor neuem Download
rm -f ~/storage/downloads/*.html ~/storage/downloads/sitemap*.xml

# kopieren ins Repo
cp ~/storage/downloads/NN-name.html ~/mindful7777/blog/

# pushen
git add . && git commit -m "typ: beschreibung" && git push origin main
```

### Stolperfallen (real passiert, hier dokumentiert)
- **Android-Download-Suffix**: `datei (1).html` / `datei-1.html` → vor dem Kopieren
  prüfen mit `ls`, ggf. `rm -f *-1.html`. Die Version **ohne** Suffix ist die zuletzt
  geladene.
- **Browser hängt `.txt` an** (z.B. Google-Verify-Datei `google….html.txt`):
  beim Kopieren umbenennen → Zielname ohne `.txt`.
- **Domain-Falle**: NICHT `mindful7777.com` oder `.de` in URLs — die Live-Adresse
  ist `intelligentresponder-max.github.io/mindful7777`.
- **URL-Schema**: GitHub Pages braucht **`.html`** in Links, sonst 404.
- **Verneinungs-Falle beim Brand-Check**: Wort-Scanner meldet „Chakren/Manifestation"
  auch in „**kein** Chakren" → das ist korrekt und bleibt.

---

## 5. Google-Verifizierung (HTML-Datei-Methode) — falls neu nötig

1. In GSC Verify-Datei `google….html` herunterladen.
2. Falls Browser `.txt` anhängt: beim Kopieren entfernen.
3. Ins **Repo-Root** (nicht `blog/`): `cp … ~/mindful7777/google….html`
4. Push, **2 Min warten**, im Browser testen, dass die Datei live ist.
5. In GSC auf „Verify" — Datei **nie löschen**, auch nach Erfolg nicht.

---

*Stand: 2026-06-28. Bei Google-Statusdetails, die sich geändert haben könnten,
in der Search Console direkt unter „Seiten" → „Weitere Infos" gegenprüfen.*
