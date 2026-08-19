import os
import re

root = r'F:\Antigravity\Alba\ALBA'

for dirpath, dirnames, filenames in os.walk(root):
    if any(x in dirpath for x in ['node_modules', '.next', 'out', '.git']):
        continue
    for fname in filenames:
        if fname.endswith(('.tsx', '.jsx', '.ts', '.js')):
            fpath = os.path.join(dirpath, fname)
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
                if 'slice(' in text or 'upcomingEvents' in text or 'PublicAgenda' in text:
                    for idx, line in enumerate(text.splitlines(), 1):
                        if any(k in line for k in ['slice', 'upcomingEvents', 'limit', 'filter']):
                            print(f"{os.path.relpath(fpath, root)}:{idx} -> {line.strip()[:120]}")
