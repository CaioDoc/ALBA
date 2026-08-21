import os

fpath = r'F:\Antigravity\Alba\ALBA\app\admin\agenda\page.tsx'

with open(fpath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace useEffect
old_effect = '''  React.useEffect(() => {
    const saved = localStorage.getItem('alba_agenda_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(sortEventsChronologically(parsed));
          return;
        }
      } catch (e) {}
    }
    const sortedInitial = sortEventsChronologically(initialEvents);
    setEvents(sortedInitial);
    localStorage.setItem('alba_agenda_v4', JSON.stringify(sortedInitial));
  }, []);'''

new_effect = '''  React.useEffect(() => {
    const saved = localStorage.getItem('alba_agenda_v5');
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setEvents(sortEventsChronologically(parsed));
          return;
        }
      } catch (e) {}
    }
    const sortedInitial = sortEventsChronologically(initialEvents);
    setEvents(sortedInitial);
    localStorage.setItem('alba_agenda_v5', JSON.stringify(sortedInitial));
  }, []);'''

text = text.replace(old_effect, new_effect)
text = text.replace('alba_agenda_v4', 'alba_agenda_v5')

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(text)

print("SUCCESS: Updated app/admin/agenda/page.tsx with bulletproof persistence!")
