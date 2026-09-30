# -*- coding: utf-8 -*-
"""
Master Integration Script for 50 Emergency Fiches
Merges 50 emergency fiches into asmedix_db.json, updates specialty counts,
and regenerates lib/db/seedFiches.ts.
"""

import sys
import os
import json

# Add scripts directory to path
sys.path.append('scripts')
from fiches_part1 import FICHES_50 as p1
from fiches_part2 import FICHES_PART2 as p2
from fiches_part3 import FICHES_PART3 as p3

all_50_new = p1 + p2 + p3
print(f"Total new emergency fiches to integrate: {len(all_50_new)}")

# 1. Load data/asmedix_db.json
db_path = os.path.join("data", "asmedix_db.json")
with open(db_path, "r", encoding="utf-8") as f:
    db = json.load(f)

existing_fiches = db.get("fiches", [])
print(f"Existing fiches in asmedix_db.json: {len(existing_fiches)}")

# Create a map by id
fiches_map = {f["id"]: f for f in existing_fiches}

# Merge all 50 new fiches
added_count = 0
updated_count = 0
for nf in all_50_new:
    fid = nf["id"]
    if fid in fiches_map:
        fiches_map[fid] = nf
        updated_count += 1
    else:
        fiches_map[fid] = nf
        added_count += 1

merged_fiches = list(fiches_map.values())
db["fiches"] = merged_fiches
print(f"Merged total fiches: {len(merged_fiches)} (Added: {added_count}, Updated: {updated_count})")

# 2. Update specialty counts in asmedix_db.json
specialties = db.get("specialties", [])
fiches_per_spec = {}
for f in merged_fiches:
    sid = f.get("specialtyId")
    if sid:
        fiches_per_spec[sid] = fiches_per_spec.get(sid, 0) + 1

for spec in specialties:
    sid = spec.get("id")
    spec["totalFiches"] = fiches_per_spec.get(sid, 0)

db["specialties"] = specialties

# 3. Save asmedix_db.json
with open(db_path, "w", encoding="utf-8") as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Successfully saved updated {db_path} with {len(merged_fiches)} fiches.")

# 4. Regenerate lib/db/seedFiches.ts
seed_path = os.path.join("lib", "db", "seedFiches.ts")
ts_content = "import { Fiche } from '@/types';\n\nexport const INITIAL_FICHES: Fiche[] = " + json.dumps(merged_fiches, ensure_ascii=False, indent=2) + ";\n"

with open(seed_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully regenerated {seed_path} with {len(merged_fiches)} fiches.")

# 5. Print summary table by specialty
print("\n=== SYNTHÈSE DES FICHES FLASH PAR MODULE DANS AS-MEDIX ===")
for s in specialties:
    sid = s.get("id")
    name = s.get("name")
    count = s.get("totalFiches", 0)
    if count > 0:
        print(f"  • [{sid}] {name} : {count} fiches")
