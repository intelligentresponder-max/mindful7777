#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# mindful7777 - SEO & Monetarisierung Update Push
# Alle optimierten Dateien ins GitHub-Repo pushen
# ═══════════════════════════════════════════════════════════════

echo "🚀 mindful7777 GitHub Push Script"
echo "════════════════════════════════════════════════════════════"
echo ""

# Wechsel ins Repo-Verzeichnis
cd ~/Projects/mindful7777 || { echo "❌ Fehler: Repo-Ordner nicht gefunden"; exit 1; }

echo "📂 Aktuelles Verzeichnis: $(pwd)"
echo ""

# Status checken
echo "📊 Git Status:"
git status --short
echo ""

# Dateien hinzufügen
echo "➕ Füge Dateien hinzu..."
git add vip.html
git add impressum.html
git add datenschutz.html
git add robots.txt
git add sitemap.xml
git add favicon.svg
git add favicon-generator.html

echo "✅ Dateien gestaged"
echo ""

# Änderungen anzeigen
echo "📝 Änderungen:"
git status --short
echo ""

# Commit mit detaillierter Message
echo "💾 Erstelle Commit..."
git commit -m "🎯 SEO-Optimierung + Impressum-Absicherung + Monetarisierung

✅ SEO komplett implementiert:
- Meta Descriptions für alle Seiten
- Open Graph Tags (WhatsApp/Facebook/Telegram Previews)
- Twitter Card Meta Tags
- robots.txt für Crawler-Steuerung
- sitemap.xml für Google Search Console

✅ Impressum doppelt gesichert:
- Daten eingefügt: A. Schwarz, Am Lausberg 8, 60435 Frankfurt
- Doppelklick-Schutz gegen automatisches Scraping
- JavaScript-Sicherheitsabfrage vor Daten-Anzeige

✅ Stripe Buy Button Integration:
- Embedded Widget in vip.html
- Fallback Payment Link
- Throne Wishlist verlinkt

✅ Favicons vollständig:
- SVG + Generator-Tool
- Bereit für PNG-Export (16x16, 32x32, 180x180)

🎯 Nächster Schritt: Lead Magnet (Sock-Anchor PDF) + Email-Funnel"

echo "✅ Commit erstellt"
echo ""

# Push to GitHub
echo "🌐 Pushe zu GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "✅ PUSH ERFOLGREICH!"
    echo ""
    echo "🔗 Dein Repo: https://github.com/intelligentresponder-max/mindful7777"
    echo ""
    echo "📋 Nächste Schritte:"
    echo "   1. favicon-generator.html öffnen → PNGs downloaden"
    echo "   2. favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png"
    echo "      ins Repo kopieren + git add + commit + push"
    echo "   3. Lead Magnet erstellen (PDF + Audio)"
    echo "════════════════════════════════════════════════════════════"
else
    echo ""
    echo "❌ Push fehlgeschlagen. Checke deine Git-Credentials."
    echo "   Hilfe: git config --list | grep user"
fi
