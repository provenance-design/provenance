#!/usr/bin/env python3
"""
set_images.py — Scan public/images/ and update archive.js imageUrl fields.
Run from ~/Desktop/provenance-site/
"""
import os, re, json, glob

IMAGES_DIR = os.path.join(os.path.dirname(__file__), "public", "images")
ARCHIVE_PATH = os.path.join(os.path.dirname(__file__), "app", "data", "archive.js")

# Find all local images
local = {}
for f in glob.glob(os.path.join(IMAGES_DIR, "*")):
    name = os.path.basename(f)
    parts = name.rsplit(".", 1)
    if len(parts) == 2 and parts[0].isdigit():
        local[int(parts[0])] = f"/images/{name}"

if not local:
    print("No images found in public/images/")
    exit()

print(f"Found {len(local)} local images: {sorted(local.keys())}")

# Load archive.js
with open(ARCHIVE_PATH) as f:
    js = f.read()

m = re.search(r'export const ARCHIVE = (\[[\s\S]*\]);', js)
archive = json.loads(m.group(1))

updated = 0
for entry in archive:
    if entry["id"] in local:
        old = entry.get("imageUrl")
        entry["imageUrl"] = local[entry["id"]]
        if old != local[entry["id"]]:
            print(f"  [{entry['id']}] {entry['title']} → {local[entry['id']]}")
            updated += 1

# Rebuild
conn_types = json.dumps({"argument":{"label":"Argument","symbol":"⟷","color":"#8B4513"},"lineage":{"label":"Lineage","symbol":"→","color":"#2F5233"},"material":{"label":"Material Thread","symbol":"◆","color":"#4A6741"},"sameProblem":{"label":"Same Problem","symbol":"◎","color":"#5B7065"},"zeitgeist":{"label":"Zeitgeist","symbol":"≈","color":"#6B7B6F"},"method":{"label":"Shared Method","symbol":"●","color":"#7A8B7A"}})
disciplines = json.dumps(["Product","Furniture","Graphic","Lighting","Architecture","Typography","Textile","Transport","Ceramic","Glass","Metalwork"])

new_js = f"export const CONNECTION_TYPES = {conn_types};\n\nexport const DISCIPLINES = {disciplines};\n\nexport const ARCHIVE = {json.dumps(archive, indent=2)};\n"

with open(ARCHIVE_PATH, "w") as f:
    f.write(new_js)

print(f"\nUpdated {updated} entries. Now commit and push.")
