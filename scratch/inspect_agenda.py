import os

root = r'F:\Antigravity\Alba\ALBA'

files_to_check = [
    r'app\agenda\page.tsx',
    r'app\admin\agenda\page.tsx',
    r'components\Navbar.tsx'
]

for rel_path in files_to_check:
    fpath = os.path.join(root, rel_path)
    print(f"=== File: {rel_path} ===")
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
            print(f"Total lines: {len(lines)}")
            print("First 20 lines:")
            for l in lines[:20]:
                print("  ", l.rstrip())
    else:
        print("  File DOES NOT EXIST!")
    print()
