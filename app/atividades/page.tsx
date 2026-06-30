"use client";

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { ActivityDrawer } from '../../components/ActivityDrawer';

const activitiesData = [
  // Aulas
  {
    id: 'dosha-yoga',
    title: 'Dosha Yoga',
    category: 'Aulas e Práticas',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop',
    description: 'Prática de yoga totalmente personalizada e adaptada para equilibrar o seu Dosha predominante ou tratar desvios de saúde atuais (Vikriti). Utiliza asanas, pranayamas e meditações específicas para acalmar Vata, resfriar Pitta ou estimular Kapha.',
    duration: '60 minutos',
    indicatedFor: 'Alinhamento energético, redução de estresse e equilíbrio dos biotipos.'
  },
  {
    id: 'hatha-yoga',
    title: 'Hatha Yoga Tradicional',
    category: 'Aulas e Práticas',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop',
    description: 'Focada no fortalecimento físico, flexibilidade e controle da respiração. Uma prática ancestral que purifica os canais energéticos (nadis) do corpo, ideal para estabelecer uma base sólida de bem-estar.',
    duration: '60 minutos',
    indicatedFor: 'Vitalidade física, flexibilidade, foco mental e relaxamento.'
  },
  {
    id: 'personal-yoga',
    title: 'Personal Yoga',
    category: 'Aulas e Práticas',
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=600&auto=format&fit=crop',
    description: 'Atendimento particular com acompanhamento minucioso de um instrutor. O programa de posturas e exercícios respiratórios é desenhado exclusivamente para seus objetivos de saúde e limites físicos.',
    duration: '60 a 75 minutos',
    indicatedFor: 'Praticantes de todos os níveis que buscam evolução direcionada ou possuem restrições físicas.'
  },
  // Consultas
  {
    id: 'medicina-ayurvedica',
    title: 'Consulta de Medicina Ayurvédica',
    category: 'Consultas Terapêuticas',
    image: 'https://images.unsplash.com/photo-1594824406951-31823095b27b?q=80&w=600&auto=format&fit=crop',
    description: 'Avaliação clínica minuciosa que inclui a anamnese profunda, exame físico e a leitura tradicional do pulso (Nadi Pariksha). Identifica sua constituição de nascimento e prescreve planos de desintoxicação, fitoterapia e rotinas alimentares.',
    duration: '90 minutos (Primeira consulta)',
    indicatedFor: 'Identificação do Dosha, tratamento de doenças crônicas e transição de estilo de vida.'
  },
  {
    id: 'florais-bach',
    title: 'Terapia com Florais de Bach',
    category: 'Consultas Terapêuticas',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop',
    description: 'Abordagem focada no reequilíbrio das emoções e estados mentais. Através de uma conversa terapêutica, são selecionadas essências florais específicas para modular o medo, ansiedade, insegurança ou cansaço.',
    duration: '50 minutos',
    indicatedFor: 'Suporte emocional, gerenciamento de crises, estresse e autoconhecimento.'
  },
  {
    id: 'astrologia-vedica',
    title: 'Astrologia Védica (Jyotish)',
    category: 'Consultas Terapêuticas',
    image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600&auto=format&fit=crop',
    description: 'Estudo do mapa astral sob a ótica da sabedoria védica tradicional. Revela as tendências de saúde, carreira, relacionamentos e propósitos espirituais (Dharma), oferecendo remédios astrológicos como mantras e meditações.',
    duration: '75 minutos',
    indicatedFor: 'Clareza de caminhos de vida, entendimento de ciclos temporais e tendências de saúde sutil.'
  },
  // Massagem
  {
    id: 'massagem-ayurvedica',
    title: 'Massagem Ayurvédica (Abhyanga)',
    category: 'Massagens e Terapias',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=600&auto=format&fit=crop',
    description: 'Massagem profunda realizada com óleos vegetais mornos e medicados com ervas específicas para o seu biotipo. Nutre os tecidos, remove toxinas físicas arraigadas e induz a um relaxamento absoluto do sistema nervoso.',
    duration: '60 a 75 minutos',
    indicatedFor: 'Redução drástica de ansiedade, insônia, dores musculares e eliminação de toxinas (Ama).'
  },
  {
    id: 'indian-head',
    title: 'Indian Head Massage (Champi)',
    category: 'Massagens e Terapias',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=600&auto=format&fit=crop',
    description: 'Técnica tradicional focada nos ombros, pescoço, couro cabeludo e pontos marma da face. Alivia instantaneamente a tensão acumulada na região cervical e melhora a circulação de energia vital em direção à mente.',
    duration: '45 minutos',
    indicatedFor: 'Alívio de dores de cabeça, enxaqueca, bruxismo e estresse mental gerado por excesso de telas.'
  },
  // Meditação
  {
    id: 'meditacao-cromatica',
    title: 'Meditação Cromática Vibracional',
    category: 'Terapias Vibracionais',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600&auto=format&fit=crop',
    description: 'Uma jornada sutil guiada que combina técnicas de visualização de frequências de cores específicas associadas ao alinhamento dos centros energéticos (Chakras). Ajuda a harmonizar as camadas mais profundas e sutis da mente.',
    duration: '45 minutos',
    indicatedFor: 'Paz interior profunda, limpeza de impressões mentais negativas (Samskaras) e equilíbrio emocional.'
  }
];

const categories = ['Todos', 'Aulas e Práticas', 'Consultas Terapêuticas', 'Massagens e Terapias', 'Terapias Vibracionais'];

export default function AtividadesPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedActivity, setSelectedActivity] = useState<typeof activitiesData[0] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredActivities = activitiesData.filter((act) => {
    return activeCategory === 'Todos' || act.category === activeCategory;
  });

  const handleOpenDrawer = (activity: typeof activitiesData[0]) => {
    setSelectedActivity(activity);
    isDrawerOpen ? setIsDrawerOpen(false) : setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <Navbar />

      <section className="pt-24 pb-16 px-4 bg-stone-100 border-b border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-emerald-700 font-bold mb-4 uppercase tracking-widest text-sm">Nossa Grade de Práticas</p>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Atividades</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Oferecemos uma abordagem integrativa completa para cuidar do seu bem-estar. Navegue e agende as aulas, consultas e terapias ideais para o seu momento.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Menu de Filtros em Chips */}
          <div className="flex overflow-x-auto gap-2 pb-6 mb-12 border-b border-stone-200/60 hide-scrollbar items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat ? 'bg-emerald-800 text-white shadow-md' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de Atividades Refinado com Imagens Recortadas */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((act) => (
              <div 
                key={act.id} 
                className="group bg-white rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-2xl hover:shadow-stone-200/40 transition-all duration-500 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 w-full overflow-hidden relative bg-stone-100">
                    <img 
                      src={act.image} 
                      alt={act.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-800">
                      {act.category}
                    </div>
                  </div>

                  <div className="p-6 md:p-8 pb-2">
                    <h3 className="text-xl font-serif text-stone-900 mb-2 group-hover:text-emerald-800 transition-colors duration-300">
                      {act.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">
                      {act.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-8 pt-2">
                  <button 
                    onClick={() => handleOpenDrawer(act)}
                    className="cursor-pointer w-full bg-stone-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all duration-300 active:scale-95 flex items-center justify-center gap-1"
                  >
                    Saber Mais
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Drawer Controlada por Estado */}
      <ActivityDrawer 
        activity={selectedActivity}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
