#!/usr/bin/env python3
"""
mindful7777 Link Checker
Prüft das gesamte Repo auf:
  1. Tote lokale Pfade (href/src/action die auf nicht-existente Dateien zeigen)
  2. Externe URLs (HTTP-Status-Check)
  3. Platzhalter & TODO-Marker im Code
  4. Unfertige Audio-Player (src leer oder Platzhalter)

Ausgabe: Konsole + reports/link_check_report.txt
"""

import os
import re
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path
from collections import defaultdict

# -- Konfiguration -------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent

SCAN_EXTENSIONS = {".html", ".css", ".js"}

# Externe Domains, die wir NICHT prüfen (Payment-Links, Social etc.)
SKIP_EXTERNAL_DOMAINS = {
    "ko-fi.com", "gumroad.com", "throne.com", "discord.gg", "discord.com",
    "stripe.com", "paypal.com", "twitter.com", "instagram.com", "tiktok.com",
    "facebook.com", "linkedin.com", "youtube.com", "fonts.googleapis.com",
    "fonts.gstatic.com", "cdnjs.cloudflare.com", "cdn.jsdelivr.net",
    "unpkg.com", "ajax.googleapis.com", "kit.fontawesome.com",
    "googletagmanager.com", "google-analytics.com", "plausible.io",
    "convertkit.com", "ck.page",
}

# Placeholder-Muster die auf unfertige Inhalte hinweisen
PLACEHOLDER_PATTERNS = [
    (r'\[TODO[^\]]*\]',              "TODO-Marker"),
    (r'\[PLACEHOLDER[^\]]*\]',       "PLACEHOLDER-Marker"),
    (r'DEINE[_\s]URL',               "DEINE_URL Platzhalter"),
    (r'YOUR[_\s]LINK',               "YOUR_LINK Platzhalter"),
    (r'href=["\']#["\']',            "Leerer href-Anker"),
    (r'href=["\']javascript:void',   "javascript:void Link"),
    (r'TODO:',                       "TODO-Kommentar"),
    (r'FIXME:',                      "FIXME-Kommentar"),
    (r'LOREM\s+IPSUM',               "Lorem Ipsum Text"),
    (r'lorem ipsum',                 "Lorem Ipsum Text"),
    (r'Mustertext',                  "Mustertext Platzhalter"),
    (r'INSERT\s+HERE',               "INSERT HERE Platzhalter"),
    (r'COMING\s+SOON',               "Coming Soon Marker"),
    (r'#D4A574.*TODO',               "CSS TODO"),
]

# Audio-Player Prüfung: <audio> oder <source> ohne gültige src
AUDIO_PLACEHOLDER_PATTERNS = [
    r'<audio[^>]*src=["\']["\']',           # src=""
    r'<source[^>]*src=["\']["\']',          # src=""
    r'<audio[^>]*>\s*</audio>',             # leerer audio-Tag
    r'src=["\'].*TODO.*["\']',              # src="TODO..."
    r'src=["\'].*placeholder.*["\']',       # src="placeholder..."
]

# Pfade/Dateien die wir beim lokalen Check ignorieren
IGNORE_LOCAL_PATHS = {
    "#", "javascript:", "mailto:", "tel:", "data:", "blob:",
    "http://", "https://", "//",
}

IGNORE_FILES = {
    "favicon-generator.html",  # Tool-Seite
}

REPORT_DIR = REPO_ROOT / "reports"

# -- Farben für Terminal-Ausgabe ------------------------------------------------

class C:
    RED    = "\033[91m"
    YELLOW = "\033[93m"
    GREEN  = "\033[92m"
    BLUE   = "\033[94m"
    BOLD   = "\033[1m"
    RESET  = "\033[0m"
    CYAN   = "\033[96m"
    GREY   = "\033[90m"

def cprint(color, msg):
    print(f"{color}{msg}{C.RESET}", flush=True)

# -- Hilfsfunktionen ------------------------------------------------------------

def get_all_files():
    files = []
    for ext in SCAN_EXTENSIONS:
        files.extend(REPO_ROOT.rglob(f"*{ext}"))
    # .git, node_modules, output ausschließen
    return [
        f for f in files
        if ".git" not in f.parts
        and "node_modules" not in f.parts
        and "output" not in f.parts
        and f.name not in IGNORE_FILES
    ]

def extract_links(content, file_path):
    """Extrahiert alle href, src, action Attribute aus HTML/CSS/JS."""
    links = []
    patterns = [
        r'href=["\']([^"\']+)["\']',
        r'src=["\']([^"\']+)["\']',
        r'action=["\']([^"\']+)["\']',
        r'url\(["\']?([^"\')\s]+)["\']?\)',   # CSS url()
        r'import\s+["\']([^"\']+)["\']',       # JS import
    ]
    for pat in patterns:
        for m in re.finditer(pat, content, re.IGNORECASE):
            links.append(m.group(1).strip())
    return links

def is_external(url):
    return url.startswith("http://") or url.startswith("https://") or url.startswith("//")

def should_skip_external(url):
    for domain in SKIP_EXTERNAL_DOMAINS:
        if domain in url:
            return True
    return False

def resolve_local_path(link, source_file):
    """Löst einen relativen oder absoluten lokalen Pfad auf."""
    # URL-kodierte Fragmente (%23 = #) überspringen
    if link.startswith("%23") or "%23" in link.split("?")[0].split("/")[-1]:
        return None
    # Fragment und Query entfernen
    clean = link.split("?")[0].split("#")[0]
    if not clean:
        return None

    if clean.startswith("/"):
        # Absoluter Pfad relativ zu REPO_ROOT
        # GitHub Pages: /mindful7777/... -> strip prefix
        clean = re.sub(r'^/mindful7777', '', clean)
        clean = clean.lstrip("/")
        target = REPO_ROOT / clean
    else:
        target = (source_file.parent / clean).resolve()

    return target

def check_external_url(url, timeout=8):
    """Gibt (status_code, error_msg) zurück."""
    if url.startswith("//"):
        url = "https:" + url
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "mindful7777-LinkChecker/1.0"}
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, None
    except urllib.error.HTTPError as e:
        return e.code, str(e)
    except urllib.error.URLError as e:
        return 0, str(e.reason)
    except Exception as e:
        return 0, str(e)

# -- Prüf-Module ---------------------------------------------------------------

def check_local_links(files):
    """Modul 1: Tote lokale Pfade."""
    issues = []
    for f in files:
        content = f.read_text(encoding="utf-8", errors="ignore")
        links = extract_links(content, f)
        for link in links:
            # Externe & spezielle Links überspringen
            if any(link.startswith(skip) for skip in IGNORE_LOCAL_PATHS):
                continue
            if is_external(link):
                continue

            target = resolve_local_path(link, f)
            if target is None:
                continue

            # Prüfe ob Datei oder Verzeichnis (index.html) existiert
            exists = target.exists()
            if not exists and target.suffix == "":
                # Verzeichnis -> prüfe index.html
                exists = (target / "index.html").exists()

            if not exists:
                rel_source = f.relative_to(REPO_ROOT)
                issues.append({
                    "file": str(rel_source),
                    "link": link,
                    "resolved": str(target.relative_to(REPO_ROOT)) if target.is_relative_to(REPO_ROOT) else str(target),
                    "type": "Toter lokaler Pfad",
                })
    return issues

def check_external_links(files, do_fetch=True):
    """Modul 2: Externe URLs prüfen."""
    issues = []
    seen = {}  # URL -> result (deduplizieren)

    # Alle externen URLs sammeln
    url_map = defaultdict(list)  # url -> [(file, link)]
    for f in files:
        if f.suffix != ".html":
            continue
        content = f.read_text(encoding="utf-8", errors="ignore")
        links = extract_links(content, f)
        for link in links:
            if not is_external(link):
                continue
            if should_skip_external(link):
                continue
            url_map[link].append(f.relative_to(REPO_ROOT))

    if not do_fetch:
        cprint(C.GREY, f"  [Externe URL-Prüfung übersprungen — {len(url_map)} URLs gefunden]")
        return issues

    total = len(url_map)
    cprint(C.CYAN, f"  Prüfe {total} externe URLs (Payment/CDN/Social übersprungen)...")

    for i, (url, sources) in enumerate(url_map.items(), 1):
        if url in seen:
            status, err = seen[url]
        else:
            status, err = check_external_url(url)
            seen[url] = (status, err)
            time.sleep(0.3)  # Rate-Limiting

        marker = f"[{i}/{total}]"
        if status == 0 or status >= 400:
            label = f"HTTP {status}" if status else "Nicht erreichbar"
            cprint(C.RED, f"  {marker} X {label}: {url[:80]}")
            for src in sources:
                issues.append({
                    "file": str(src),
                    "link": url,
                    "status": status,
                    "error": err or "",
                    "type": f"Externe URL fehlerhaft ({label})",
                })
        elif status in (301, 302):
            cprint(C.YELLOW, f"  {marker} -> Redirect {status}: {url[:80]}")
        else:
            cprint(C.GREY, f"  {marker} OK {status}: {url[:70]}")

    return issues

def check_placeholders(files):
    """Modul 3: Platzhalter & TODO-Marker."""
    issues = []
    compiled = [(re.compile(pat, re.IGNORECASE), label) for pat, label in PLACEHOLDER_PATTERNS]

    for f in files:
        content = f.read_text(encoding="utf-8", errors="ignore")
        for regex, label in compiled:
            for m in regex.finditer(content):
                line_num = content[:m.start()].count("\n") + 1
                snippet = content[m.start():m.start()+60].replace("\n", " ").strip()
                issues.append({
                    "file": str(f.relative_to(REPO_ROOT)),
                    "line": line_num,
                    "match": snippet,
                    "type": label,
                })
    return issues

def check_audio_players(files):
    """Modul 4: Unfertige Audio-Player."""
    issues = []
    compiled = [re.compile(p, re.IGNORECASE | re.DOTALL) for p in AUDIO_PLACEHOLDER_PATTERNS]

    for f in files:
        if f.suffix != ".html":
            continue
        content = f.read_text(encoding="utf-8", errors="ignore")

        # Nur in Bereichen mit <audio> oder <source> suchen
        if "<audio" not in content.lower() and "<source" not in content.lower():
            # Kein Audio-Tag -> Platzhalter-Muster trotzdem auf leere img-src prüfen? Nein.
            pass
        else:
            for regex in compiled:
                for m in regex.finditer(content):
                    snippet = content[m.start():m.start()+80].replace("\n", " ").strip()
                    # False Positive: base64-Bilder überspringen
                    if "data:image" in snippet or "base64," in snippet:
                        continue
                    # False Positive: Script-Tags überspringen
                    ctx_start = max(0, m.start() - 30)
                    ctx = content[ctx_start:m.start()]
                    if "<script" in ctx or "convertkit" in snippet or "cloudflare" in snippet:
                        continue
                    line_num = content[:m.start()].count("\n") + 1
                    issues.append({
                        "file": str(f.relative_to(REPO_ROOT)),
                        "line": line_num,
                        "match": snippet,
                        "type": "Unfertiger Audio-Player",
                    })

        # Prüfe ob audio-src auf existierende Datei zeigt
        for m in re.finditer(r'<(?:audio|source)[^>]+src=["\']([^"\']+)["\']', content, re.IGNORECASE):
            src = m.group(1)
            if is_external(src) or any(src.startswith(s) for s in IGNORE_LOCAL_PATHS):
                continue
            target = resolve_local_path(src, f)
            if target and not target.exists():
                line_num = content[:m.start()].count("\n") + 1
                issues.append({
                    "file": str(f.relative_to(REPO_ROOT)),
                    "line": line_num,
                    "match": src,
                    "type": "Audio-Datei fehlt",
                })

    return issues

# -- Report-Ausgabe -------------------------------------------------------------

def print_section(title, issues, color, key_fields):
    cprint(C.BOLD + color, f"\n{'='*60}")
    cprint(C.BOLD + color, f"  {title}  ({len(issues)} Treffer)")
    cprint(C.BOLD + color, f"{'='*60}")
    if not issues:
        cprint(C.GREEN, "  OK Keine Probleme gefunden.")
        return
    # Gruppieren nach Datei
    by_file = defaultdict(list)
    for issue in issues:
        by_file[issue["file"]].append(issue)
    for fname, items in sorted(by_file.items()):
        cprint(C.BOLD, f"\n  >> {fname}")
        for item in items:
            parts = [f"    -> [{item['type']}]"]
            for k in key_fields:
                if k in item and item[k]:
                    parts.append(f"{k}: {str(item[k])[:100]}")
            print("  ".join(parts))

def write_report(all_issues, path):
    path.parent.mkdir(exist_ok=True)
    lines = [
        "mindful7777 Link Check Report",
        f"Datum: {time.strftime('%Y-%m-%d %H:%M:%S')}",
        f"Repo: {REPO_ROOT}",
        "=" * 70,
        "",
    ]
    sections = [
        ("Tote lokale Pfade",        all_issues["local"],     ["link", "resolved"]),
        ("Externe URLs fehlerhaft",  all_issues["external"],  ["link", "status", "error"]),
        ("Platzhalter / TODOs",      all_issues["placeholders"], ["line", "match"]),
        ("Audio-Probleme",           all_issues["audio"],     ["line", "match"]),
    ]
    total = sum(len(v) for v in all_issues.values())
    lines.append(f"GESAMT: {total} Probleme gefunden\n")

    for title, issues, fields in sections:
        lines.append(f"\n{'-'*60}")
        lines.append(f"{title} ({len(issues)} Treffer)")
        lines.append(f"{'-'*60}")
        if not issues:
            lines.append("  OK Keine Probleme")
            continue
        by_file = defaultdict(list)
        for issue in issues:
            by_file[issue["file"]].append(issue)
        for fname, items in sorted(by_file.items()):
            lines.append(f"\n  {fname}")
            for item in items:
                parts = [f"    [{item['type']}]"]
                for k in fields:
                    if k in item and item[k]:
                        parts.append(f"{k}={str(item[k])[:100]}")
                lines.append(" | ".join(parts))

    path.write_text("\n".join(lines), encoding="utf-8")
    cprint(C.GREEN, f"\n  Report gespeichert: {path.relative_to(REPO_ROOT)}")

# -- Main -----------------------------------------------------------------------

def main():
    # --no-external Flag zum Überspringen der HTTP-Checks
    do_external = "--no-external" not in sys.argv

    cprint(C.BOLD + C.BLUE, "\n" + "="*60)
    cprint(C.BOLD + C.BLUE, "  mindful7777 Link Checker")
    cprint(C.BOLD + C.BLUE, "="*60)
    print(f"  Repo: {REPO_ROOT}")
    print(f"  Externe URL-Prüfung: {'JA' if do_external else 'NEIN (--no-external)'}\n")

    files = get_all_files()
    cprint(C.CYAN, f"  {len(files)} Dateien gefunden zum Scannen\n")

    # -- Modul 1: Lokale Links --
    cprint(C.BOLD, "[ 1/4 ] Lokale Pfade prüfen...")
    local_issues = check_local_links(files)
    cprint(C.RED if local_issues else C.GREEN,
           f"  -> {len(local_issues)} tote lokale Pfade")

    # -- Modul 2: Externe URLs --
    cprint(C.BOLD, "\n[ 2/4 ] Externe URLs prüfen...")
    external_issues = check_external_links(files, do_fetch=do_external)
    cprint(C.RED if external_issues else C.GREEN,
           f"  -> {len(external_issues)} fehlerhafte externe URLs")

    # -- Modul 3: Platzhalter --
    cprint(C.BOLD, "\n[ 3/4 ] Platzhalter & TODOs scannen...")
    placeholder_issues = check_placeholders(files)
    cprint(C.YELLOW if placeholder_issues else C.GREEN,
           f"  -> {len(placeholder_issues)} Platzhalter/TODOs gefunden")

    # -- Modul 4: Audio-Player --
    cprint(C.BOLD, "\n[ 4/4 ] Audio-Player prüfen...")
    audio_issues = check_audio_players(files)
    cprint(C.RED if audio_issues else C.GREEN,
           f"  -> {len(audio_issues)} Audio-Probleme gefunden")

    # -- Ergebnisse ausgeben --
    all_issues = {
        "local":        local_issues,
        "external":     external_issues,
        "placeholders": placeholder_issues,
        "audio":        audio_issues,
    }

    print_section("1. Tote lokale Pfade",       local_issues,       C.RED,    ["link", "resolved"])
    print_section("2. Externe URLs fehlerhaft", external_issues,    C.RED,    ["link", "status", "error"])
    print_section("3. Platzhalter / TODOs",     placeholder_issues, C.YELLOW, ["line", "match"])
    print_section("4. Audio-Probleme",          audio_issues,       C.RED,    ["line", "match"])

    # -- Zusammenfassung --
    total = sum(len(v) for v in all_issues.values())
    cprint(C.BOLD + C.BLUE, f"\n{'='*60}")
    cprint(C.BOLD, f"  ZUSAMMENFASSUNG")
    cprint(C.BOLD + C.BLUE, f"{'='*60}")
    print(f"  Lokale Pfad-Fehler:    {len(local_issues):>4}")
    print(f"  Externe URL-Fehler:    {len(external_issues):>4}")
    print(f"  Platzhalter/TODOs:     {len(placeholder_issues):>4}")
    print(f"  Audio-Probleme:        {len(audio_issues):>4}")
    cprint(C.BOLD, f"  {'-'*30}")
    total_color = C.RED if total > 0 else C.GREEN
    cprint(C.BOLD + total_color, f"  GESAMT:                {total:>4}")

    # -- Report schreiben --
    report_path = REPORT_DIR / "link_check_report.txt"
    write_report(all_issues, report_path)

    sys.exit(1 if (local_issues or external_issues or audio_issues) else 0)

if __name__ == "__main__":
    main()
