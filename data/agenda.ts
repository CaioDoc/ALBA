export interface EventItem {
  id: number;
  day: string;
  month: string;
  title: string;
  location: string;
  type: string;
  date: string;
  status: string;
  description: string;
}

const monthsMap: { [key: string]: number } = {
  jan: 0, fev: 1, feb: 1, mar: 2, abr: 3, apr: 3, mai: 4, may: 4, jun: 5,
  jul: 6, ago: 7, aug: 7, set: 8, sep: 8, out: 9, oct: 9, nov: 10, dez: 11, dec: 11
};

export const getEventTimestamp = (evt: Partial<EventItem>): number => {
  const text = `${evt.date || ''} ${evt.month || ''} ${evt.day || ''}`.toLowerCase();
  
  // Extract year if available (e.g. 2026, 2027)
  const yearMatch = text.match(/20\d{2}/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : new Date().getFullYear();
  
  // Extract day number
  let day = 1;
  const dayMatch = text.match(/\b([0-3]?[0-9])\b/);
  if (dayMatch) {
    const dVal = parseInt(dayMatch[1], 10);
    if (dVal >= 1 && dVal <= 31) day = dVal;
  }
  
  // Extract month
  let month = 0;
  for (const [mName, mIndex] of Object.entries(monthsMap)) {
    if (text.includes(mName)) {
      month = mIndex;
      break;
    }
  }
  
  return new Date(year, month, day).getTime();
};

export const sortEventsChronologically = <T extends Partial<EventItem>>(events: T[]): T[] => {
  return [...events].sort((a, b) => getEventTimestamp(a) - getEventTimestamp(b));
};

export const initialEvents: EventItem[] = [];
