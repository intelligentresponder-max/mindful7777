#!/data/data/com.termux/files/usr/bin/bash
# ──────────────────────────────────────────────
# mindful7777 — Termux Push Script (Tablet)
# Aufruf: bash termux-push.sh [TOKEN]
# ──────────────────────────────────────────────
REPO="$HOME/storage/shared/Projects/mindful7777"
TOKEN="${1:-$GITHUB_TOKEN}"
BRANCH="main"

cd "$REPO" 2>/dev/null || {
  echo "Repo nicht gefunden. Klone..."
  git clone -b $BRANCH "https://${TOKEN}@github.com/intelligentresponder-max/mindful7777.git" \
    "$HOME/storage/shared/Projects/mindful7777"
  cd "$HOME/storage/shared/Projects/mindful7777"
}

echo "Status:"
git status --short

git add -A
MSG="update: $(date '+%d.%m %H:%M') from tablet"
git commit -m "$MSG" 2>/dev/null || echo "Nichts zu committen."

if [ -n "$TOKEN" ]; then
  git remote set-url origin "https://${TOKEN}@github.com/intelligentresponder-max/mindful7777.git"
fi

git push origin $BRANCH && echo "✅ Gepusht!" || echo "❌ Push fehlgeschlagen"
echo "Live: https://intelligentresponder-max.github.io/mindful7777/funnel/onboarding.html"
