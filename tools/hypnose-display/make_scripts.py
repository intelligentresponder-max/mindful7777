#!/usr/bin/env python3
"""Bündelt scripts/*.md zu scripts.js (damit das Steuerpult sie auch ohne Server/fetch lädt).
Aufruf im Ordner tools/hypnose-display:  python3 make_scripts.py
Neues Skript = .md in scripts/ ablegen und dieses Skript laufen lassen."""
import glob, json, os
here = os.path.dirname(os.path.abspath(__file__))
items = []
for f in sorted(glob.glob(os.path.join(here, "scripts", "*.md"))):
    items.append({"id": os.path.splitext(os.path.basename(f))[0], "md": open(f, encoding="utf-8").read()})
with open(os.path.join(here, "scripts.js"), "w", encoding="utf-8") as o:
    o.write("/* erzeugt von make_scripts.py – nicht von Hand ändern, sondern scripts/*.md pflegen */\nwindow.SCRIPTS = " + json.dumps(items, ensure_ascii=False, indent=1) + ";\n")
print(len(items), "Skripte")
