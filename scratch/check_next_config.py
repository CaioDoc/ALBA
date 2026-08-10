import os

root = r'F:\Antigravity\Alba\ALBA'
for f in os.listdir(root):
    if 'next.config' in f:
        fpath = os.path.join(root, f)
        print(f"Found {f}:")
        with open(fpath, 'r', encoding='utf-8') as content:
            print(content.read())
