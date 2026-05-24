#!/bin/bash

# Script: Favicon-Links in alle HTML-Dateien einfügen
# Führe aus in ~/Projects/mindful7777: bash add-favicons.sh

echo "🔍 Füge Favicon-Links in alle HTML-Dateien ein..."
echo ""

# Finde alle HTML-Dateien im aktuellen Verzeichnis (nicht rekursiv in Unterordnern)
for file in *.html; do
  # Prüfe ob Datei existiert (bei keinen .html-Dateien würde *.html als String bleiben)
  [ -e "$file" ] || continue
  
  # Prüfe ob Favicon-Links bereits existieren
  if grep -q "favicon.svg" "$file"; then
    echo "⏭️  $file - bereits vorhanden"
  else
    echo "✏️  $file - füge Favicon-Links ein..."
    
    # Erstelle temporäre Datei mit eingefügten Favicon-Links
    awk '
      /<\/head>/ && !done {
        print "  <link rel=\"icon\" type=\"image/svg+xml\" href=\"favicon.svg\" />"
        print "  <link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"favicon-32x32.png\" />"
        print "  <link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"favicon-16x16.png\" />"
        print "  <link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"apple-touch-icon.png\" />"
        done=1
      }
      { print }
    ' "$file" > "$file.tmp"
    
    # Ersetze Original mit temporärer Datei
    mv "$file.tmp" "$file"
    echo "   ✅ Fertig"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Alle HTML-Dateien aktualisiert!"
echo ""
echo "🔧 Nächste Schritte:"
echo "   git status              # Prüfe Änderungen"
echo "   git diff vip.html       # Zeige Details"
echo "   git add *.html          # Stage alle HTML"
echo "   git commit -m 'Add favicon links to all pages'"
echo "   git push origin main"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
