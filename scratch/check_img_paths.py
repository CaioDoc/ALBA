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
                if 'basePath' in text or 'process.env.NEXT_PUBLIC_BASE_PATH' in text:
                    print(f"Found basePath reference in {os.path.relpath(fpath, root)}")
