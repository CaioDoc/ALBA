import os

root_dir = r'F:\Antigravity\Alba\ALBA'

found = []
for dirpath, dirnames, filenames in os.walk(root_dir):
    if any(x in dirpath for x in ['node_modules', '.next', 'out', '.git']):
        continue
    for fname in filenames:
        if fname.endswith(('.ts', '.tsx', '.js', '.jsx')):
            fpath = os.path.join(dirpath, fname)
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
                if 'translate' in text.lower() or 'googtrans' in text.lower() or 'gtranslate' in text.lower() or 'idioma' in text.lower() or 'bandeira' in text.lower():
                    found.append((fpath, [line for line in text.splitlines() if any(k in line.lower() for k in ['translate', 'googtrans', 'gtranslate', 'lang'])]))

print(f"Found translation references in {len(found)} files:")
for fpath, lines in found:
    print(f"\nFile: {os.path.relpath(fpath, root_dir)}")
    for line in lines[:5]:
        print("  ->", line.strip()[:100])
