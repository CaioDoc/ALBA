"use client";

import React, { useState } from 'react';
import { TherapistCard } from './TherapistCard';
import { TherapistModal } from './TherapistModal';

// Nossos dados de teste
const therapistsData = [
  {
    id: 'prof-1',
    name: 'Dra. Aline Carvalho',
    role: 'Médica Ayurvédica',
    registry: 'ABRA-SP 1024',
    location: 'São Paulo, SP & Online',
    avatar: 'https://images.unsplash.com/photo-1594824406951-31823095b27b?q=80&w=200&auto=format&fit=crop',
    bio: 'Especialista em saúde da mulher e nutrição ayurvédica. Foco em tratamentos preventivos, gestão de estresse e desintoxicação profunda.',
    skills: [
      { id: 'skl-008', name: 'Nutrição Ayurvédica', slug: 'nutricao-ayurvedica' },
      { id: 'skl-003', name: 'Panchakarma', slug: 'panchakarma' },
      { id: 'skl-006', name: 'Análise de Doshas', slug: 'analise-de-doshas' }
    ]
  },
  {
    id: 'prof-2',
    name: 'Thiago Mendes',
    role: 'Terapeuta Corporal',
    registry: 'ABRA-RJ 2155',
    location: 'Rio de Janeiro, RJ',
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&auto=format&fit=crop',
    bio: 'Com mais de 10 anos de prática, Thiago é focado no alinhamento físico e energético, utilizando técnicas manuais tradicionais da Índia.',
    skills: [
      { id: 'skl-001', name: 'Abhyanga', slug: 'abhyanga' },
      { id: 'skl-004', name: 'Udvartana', slug: 'udvartana' },
      { id: 'skl-011', name: 'Yoga Terapêutico', slug: 'yoga-terapeutico' }
    ]
  },
  {
    id: 'prof-3',
    name: 'Julia Santini',
    role: 'Consultora de Bem-estar',
    registry: 'ABRA-MG 3012',
    location: 'Atendimento 100% Online',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    bio: 'Ajudando você a construir uma rotina diária (Dinacharya) sustentável. Foco em fitoterapia e reequilíbrio emocional através dos temperos.',
    skills: [
      { id: 'skl-010', name: 'Rotina Diária (Dinacharya)', slug: 'dinacharya' },
      { id: 'skl-009', name: 'Fitoterapia', slug: 'fitoterapia' },
      { id: 'skl-013', name: 'Aromaterapia', slug: 'aromaterapia' }
    ]
  },
  {
    id: 'prof-4',
    name: 'Dr. Roberto Almeida',
    role: 'Médico Ayurvédico',
    registry: 'ALBA-RS 4432',
    location: 'Porto Alegre, RS',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    bio: 'Foco em distúrbios digestivos severos e desintoxicação crônica.',
    skills: [{ id: '1', name: 'Clínica Geral', slug: 'geral' }]
  },
  {
    id: 'prof-5',
    name: 'Camila Fernandes',
    role: 'Terapeuta e Doula',
    registry: 'ALBA-BA 7761',
    location: 'Salvador, BA',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    bio: 'Atuação exclusiva com gestantes, pós-parto e ginecologia natural.',
    skills: [{ id: '1', name: 'Saúde da Mulher', slug: 'mulher' }]
  }
];

// Filtros rápidos disponíveis
const quickFilters = ['Todos', 'Clínica Geral', 'Panchakarma', 'Nutrição', 'Massagem', 'Saúde da Mulher'];

export const TherapistDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedTherapist, setSelectedTherapist] = useState(null);

  // Lógica de Filtragem
  const filteredTherapists = therapistsData.filter((therapist) => {
    const matchesSearch = 
      therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      therapist.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      activeFilter === 'Todos' || 
      therapist.skills.some(skill => skill.name === activeFilter);

    return matchesSearch && matchesFilter;
  });

  return (
    <section className="py-24 px-4 bg-stone-100">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">
              Profissionais Credenciados
            </h2>
            <p className="text-stone-500">
              Encontre o terapeuta ideal para acompanhar a sua jornada. Busque por nome, cidade ou especialidade.
            </p>
          </div>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          {/* Input de Busca */}
          <div className="relative w-full md:max-w-xs">
            <input 
              type="text" 
              placeholder="Buscar por nome ou cidade..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
            />
            <svg className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Chips de Filtro */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 hide-scrollbar items-center">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter 
                    ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/10' 
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Resultados */}
        {filteredTherapists.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTherapists.map((therapist) => (
              <TherapistCard 
                key={therapist.id}
                {...therapist}
                onOpenProfile={() => setSelectedTherapist(therapist)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-stone-100 border-dashed">
            <p className="text-stone-500">Nenhum profissional encontrado com esses filtros.</p>
            <button 
              onClick={() => { setSearchTerm(''); setActiveFilter('Todos'); }}
              className="mt-4 text-emerald-700 font-medium hover:text-emerald-800 underline"
            >
              Limpar filtros
            </button>
          </div>
        )}

      </div>
      <TherapistModal 
        therapist={selectedTherapist} 
        isOpen={!!selectedTherapist} 
        onClose={() => setSelectedTherapist(null)} 
      />
    </section>
  );
};
