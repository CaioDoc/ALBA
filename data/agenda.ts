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

export const initialEvents: EventItem[] = sortEventsChronologically([
  {
    id: 1,
    day: "04",
    month: "SET",
    title: "Workshop de Diagnóstico Ayurvédico e Pulsologia",
    location: "Sede ALBA / Transmissão Online",
    type: "Workshop Prático",
    date: "04 de Setembro, 2026 - 19h00",
    status: "Confirmado",
    description: "Aprenda os métodos tradicionais de avaliação clínica (Nadi Pariksha) e diagnóstico constitucional segundo os princípios do Ayurveda.\n\n• Avaliação dos doshas Vata, Pitta e Kapha através da leitura de pulso.\n• Sinais clínicos da pele, olhos e língua.\n• Certificado de participação emitido pela ALBA."
  },
  {
    id: 2,
    day: "18",
    month: "SET",
    title: "Encontro Mensal de Associados ALBA (Networking & Casos Clínicos)",
    location: "Transmissão Online via Google Meet",
    type: "Reunião Interna (Associados)",
    date: "18 de Setembro, 2026 - 18h30",
    status: "Confirmado",
    description: "Reunião periódica de integração dos terapeutas e associados credenciados da ALBA.\n\n• Apresentação e discussão colaborativa de casos clínicos avançados.\n• Esclarecimento de dúvidas metodológicas e éticas.\n• Networking profissional e novidades institucionais."
  },
  {
    id: 3,
    day: "10",
    month: "OUT",
    title: "Palestra Gratuita: Ayurveda e Saúde Mental na Vida Moderna",
    location: "Transmissão Online via YouTube Live",
    type: "Palestra Online",
    date: "10 de Outubro, 2026 - 19h30",
    status: "Confirmado",
    description: "Nesta palestra exclusiva, abordaremos como a sabedoria secular do Ayurveda pode prevenir e tratar desequilíbrios mentais, estresse, ansiedade e insônia na rotina moderna.\n\n• O papel do fogo digestivo (Agni) na saúde do sistema nervoso.\n• Fitoterapia e rotinas diárias (Dinacharya) para equilíbrio das emoções.\n• Sessão interativa de perguntas e respostas com docentes da ALBA.\n\nEvento gratuito e aberto ao público."
  },
  {
    id: 4,
    day: "28",
    month: "OUT",
    title: "Webinar: Guia Prático de Alimentação e Culinária Ayurvédica",
    location: "Transmissão Online via Zoom Live",
    type: "Live / Webinar",
    date: "28 de Outubro, 2026 - 20h00",
    status: "Confirmado",
    description: "Conheça os segredos do uso das especiarias medicinais e combinações alimentares equilibradas.\n\n• Como adaptar as refeições para cada biotipo (Prakriti).\n• O uso de temperos como medicina na cozinha diária.\n• Guia prático de preparo de Ghee e chás terapêuticos."
  },
  {
    id: 5,
    day: "20",
    month: "NOV",
    title: "Workshop Prático de Massagem Indian Head (Champi)",
    location: "Sede da ALBA - Presencial",
    type: "Workshop Prático",
    date: "20 de Novembro, 2026 - 10h00 às 17h00",
    status: "Confirmado",
    description: "Aprenda a aplicação milenar da massagem indiana na cabeça, ombros e pescoço (Champi).\n\n• Técnicas de alívio de tensões profundas e estimulação dos pontos Marma.\n• Utilização de óleos medicados específicos para cada Dosha.\n• Certificado de participação emitido pela ALBA.\n\nVagas limitadas."
  },
  {
    id: 6,
    day: "15",
    month: "JAN",
    title: "Congresso Internacional Luso-Brasileiro de Ayurveda",
    location: "Lisboa, Portugal (Transmissão Híbrida)",
    type: "Congresso",
    date: "15 a 18 de Janeiro, 2027",
    status: "Confirmado",
    description: "O maior encontro de profissionais e pesquisadores do Ayurveda em língua portuguesa.\n\n• Apresentação de trabalhos científicos e casos clínicos de sucesso.\n• Palestrantes internacionais e feira de produtos naturais.\n• Descontos especiais para associados da ALBA."
  }
]);
