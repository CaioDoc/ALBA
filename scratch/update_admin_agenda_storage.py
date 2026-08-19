import os

fpath = r'F:\Antigravity\Alba\ALBA\app\admin\agenda\page.tsx'

with open(fpath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace initialEvents import and definition
text = text.replace(
    '// Dados simulados da agenda de eventos\nconst initialEvents: any[] = [];',
    "import { initialEvents } from '../../../data/agenda';"
)

# Replace useEffect initialization
old_effect = '''  React.useEffect(() => {
    const saved = localStorage.getItem('alba_agenda_v2');
    if (saved) {
      setEvents(JSON.parse(saved));
    } else {
      setEvents([]);
      localStorage.setItem('alba_agenda_v2', JSON.stringify([]));
    }
  }, []);'''

new_effect = '''  React.useEffect(() => {
    const saved = localStorage.getItem('alba_agenda_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(parsed);
          return;
        }
      } catch (e) {}
    }
    setEvents(initialEvents);
    localStorage.setItem('alba_agenda_v3', JSON.stringify(initialEvents));
  }, []);'''

text = text.replace(old_effect, new_effect)

# Replace all remaining alba_agenda_v2 occurrences with alba_agenda_v3
text = text.replace('alba_agenda_v2', 'alba_agenda_v3')

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(text)

print("SUCCESS: Updated app/admin/agenda/page.tsx with data/agenda.ts import and alba_agenda_v3 storage key!")
