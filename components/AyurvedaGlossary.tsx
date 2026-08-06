"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Dados do Glossário
const glossaryData = [
  {
    id: 'abhyanga',
    title: 'Abhyanga',
    subtitle: 'Oleação corporal terapêutica',
    description: 'Uma das práticas corporais mais clássicas do Ayurveda. Consiste na aplicação de óleos vegetais mornos e medicados com ervas por todo o corpo. Promove relaxamento profundo do sistema nervoso, nutre os tecidos (dhatus) e ajuda na eliminação de toxinas.',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'shirodhara',
    title: 'Shirodhara',
    subtitle: 'Fluxo contínuo na mente',
    description: 'Terapia onde um fio contínuo e suave de óleo morno é derramado sobre a testa (no chakra do terceiro olho). É incrivelmente eficaz para tratar insônia, ansiedade, estresse crônico e acalmar a mente agitada (excesso de Vata).',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'panchakarma',
    title: 'Panchakarma',
    subtitle: 'Desintoxicação profunda',
    description: 'O principal programa de limpeza e rejuvenescimento do Ayurveda. Composto por cinco processos terapêuticos principais, ele atua limpando as toxinas (Ama) acumuladas nos canais do corpo, restaurando o equilíbrio imunológico e celular.',
    image: '/images/artigos/medicina_ayurv_dica___um_sistema_de_cura_hol_stica.jpg'
  },
  {
    id: 'dinacharya',
    title: 'Dinacharya',
    subtitle: 'Rotina diária de saúde',
    description: 'Conjunto de hábitos diários recomendados para alinhar o nosso relógio biológico aos ciclos da natureza. Inclui práticas como acordar cedo, raspar a língua, meditar e alimentar-se em horários adequados para otimizar a digestão.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop'
  }
];

export const AyurvedaGlossary = () => {
  // Estado para controlar qual item está aberto. Começa com o primeiro aberto (opcional)
  const [expandedId, setExpandedId] = useState<string | null>(glossaryData[0].id);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {glossaryData.map((item) => {
        const isExpanded = expandedId === item.id;

        return (
          <div 
            key={item.id} 
            className={`border rounded-3xl overflow-hidden transition-all duration-500 ${
              isExpanded ? 'bg-white border-emerald-200 shadow-lg shadow-emerald-900/5' : 'bg-stone-50 border-stone-200 hover:border-emerald-200'
            }`}
          >
            {/* Cabeçalho do Accordion (Área Clicável) */}
            <button
              onClick={() => toggleExpand(item.id)}
              className="cursor-pointer w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none"
            >
              <div>
                <h3 className={`text-xl font-serif transition-colors duration-300 ${isExpanded ? 'text-emerald-800' : 'text-stone-800'}`}>
                  {item.title}
                </h3>
                <p className="text-sm text-stone-500 mt-1">{item.subtitle}</p>
              </div>
              
              {/* Ícone de Mais/Menos */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500 ${isExpanded ? 'bg-emerald-100 text-emerald-700 rotate-180' : 'bg-stone-100 text-stone-400'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
              </div>
            </button>

            {/* Conteúdo Expansível (Grid Animation Trick) */}
            <div 
              className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 pt-2 flex flex-col md:flex-row gap-8 opacity-100 transition-opacity duration-500 delay-100">
                  
                  {/* Texto Explicativo */}
                  <div className="flex-1">
                    <p className="text-stone-600 leading-relaxed">
                      {item.description}
                    </p>
                    <Link href="/profissionais" className="cursor-pointer mt-6 text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors">
                      Encontrar terapeuta com esta especialidade
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Imagem Ilustrativa */}
                  <div className="w-full md:w-64 h-40 flex-shrink-0 rounded-2xl overflow-hidden shadow-inner">
                    <img 
                      src={item.image} 
                      alt={`Ilustração de ${item.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                </div>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};
