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

export const initialEvents: EventItem[] = [
  {
    id: 1,
    day: "20",
    month: "NOV",
    title: "Palestra Gratuita: Ayurveda e Saúde Mental na Vida Moderna",
    location: "Transmissão Online via YouTube Live",
    type: "Palestra Online",
    date: "20 de Novembro, 2026 - 19h30",
    status: "Confirmado",
    description: "Nesta palestra exclusiva, abordaremos como a sabedoria secular do Ayurveda pode prevenir e tratar desequilíbrios mentais, estresse, ansiedade e insônia na rotina moderna.\n\n• O papel do fogo digestivo (Agni) na saúde do sistema nervoso.\n• Fitoterapia e rotinas diárias (Dinacharya) para equilíbrio das emoções.\n• Sessão interativa de perguntas e respostas com docentes da ALBA.\n\nEvento gratuito e aberto ao público."
  },
  {
    id: 2,
    day: "10",
    month: "DEZ",
    title: "Workshop Prático de Massagem Indian Head (Champi)",
    location: "Sede da ALBA - Presencial",
    type: "Workshop Prático",
    date: "10 de Dezembro, 2026 - 10h00 às 17h00",
    status: "Confirmado",
    description: "Aprenda a aplicação milenar da massagem indiana na cabeça, ombros e pescoço (Champi).\n\n• Técnicas de alívio de tensões profundas e estimulação dos pontos Marma.\n• Utilização de óleos medicados específicos para cada Dosha.\n• Certificado de participação emitido pela ALBA.\n\nVagas limitadas."
  },
  {
    id: 3,
    day: "15",
    month: "JAN",
    title: "Congresso Internacional Luso-Brasileiro de Ayurveda",
    location: "Lisboa, Portugal (Transmissão Híbrida)",
    type: "Congresso",
    date: "15 a 18 de Janeiro, 2027",
    status: "Confirmado",
    description: "O maior encontro de profissionais e pesquisadores do Ayurveda em língua portuguesa.\n\n• Apresentação de trabalhos científicos e casos clínicos de sucesso.\n• Palestrantes internacionais e feira de produtos naturais.\n• Descontos especiais para associados da ALBA."
  }
];
