import os

files = [
    r'F:\Antigravity\Alba\ALBA\components\PublicAgenda.tsx',
    r'F:\Antigravity\Alba\ALBA\app\admin\agenda\page.tsx'
]

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()
    text = text.replace('alba_agenda_v5', 'alba_agenda_v6')
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Bumped storage key to alba_agenda_v6 in {os.path.basename(fpath)}")
