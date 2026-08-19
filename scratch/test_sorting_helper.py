import re
from datetime import datetime

months_map = {
    'jan': 1, 'fev': 2, 'mar': 3, 'abr': 4, 'mai': 5, 'jun': 6,
    'jul': 7, 'ago': 8, 'set': 9, 'out': 10, 'nov': 11, 'dez': 12
}

def parse_event_date(evt):
    text = (str(evt.get('date', '')) + " " + str(evt.get('month', '')) + " " + str(evt.get('day', ''))).lower()
    
    # Find year (4 digits e.g. 2026, 2027)
    year_match = re.search(r'20\d{2}', text)
    year = int(year_match.group(0)) if year_match else 2026
    
    # Find day (1 or 2 digits e.g. 04, 10, 20)
    day = 1
    day_match = re.search(r'\b([0-3]?[0-9])\b', text)
    if day_match:
        d_val = int(day_match.group(1))
        if 1 <= d_val <= 31:
            day = d_val
            
    # Find month
    month = 1
    for m_name, m_num in months_map.items():
        if m_name in text:
            month = m_num
            break
            
    return datetime(year, month, day).timestamp()

test_events = [
    {'title': 'Evento Outubro', 'date': '10 de Outubro, 2026'},
    {'title': 'Evento Setembro', 'date': '04 de Setembro, 2026'},
    {'title': 'Evento Janeiro', 'date': '15 de Janeiro, 2027'},
    {'title': 'Evento Novembro', 'date': '20 de Novembro, 2026'}
]

sorted_evts = sorted(test_events, key=parse_event_date)
print("Sorted events:")
for e in sorted_evts:
    print(" -", e['title'], "| Date:", e['date'])
