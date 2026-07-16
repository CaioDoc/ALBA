"use client";

import React, { useState } from 'react';
import { TherapistCard } from './TherapistCard';
import { TherapistModal } from './TherapistModal';

interface Therapist {
  id: string;
  name: string;
  role: string;
  registry: string;
  location: string;
  avatar: string;
  bio: string;
  whatsapp?: string;
  website?: string;
  skills: Array<{ id: string; name: string; slug: string }>;
}

// Filtros rápidos disponíveis
const quickFilters = ['Todos', 'Clínica Geral', 'Panchakarma', 'Nutrição', 'Massagem', 'Saúde da Mulher'];

export const TherapistDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [therapistsData, setTherapistsData] = useState<Therapist[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('alba_associados');
    if (saved) {
      // Filtrar apenas associados 'Ativos' para mostrar no diretório público
      setTherapistsData(JSON.parse(saved).filter((a: any) => a.status === 'Ativo'));
    } else {
      const initial: Therapist[] = [];
      setTherapistsData(initial);
      localStorage.setItem('alba_associados', JSON.stringify(initial));
    }
  }, []);

  // Lógica de Filtragem
  const filteredTherapists = therapistsData.filter((therapist) => {
    const matchesSearch = 
      therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      therapist.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      activeFilter === 'Todos' || 
      therapist.skills.some(skill => skill.name === activeFilter) ||
      therapist.skills.some(skill => skill.slug === activeFilter.toLowerCase().replace(/ /g, '-'));

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
          <div className="text-center py-24 bg-white rounded-[2rem] border border-stone-100 shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-3">Temos profissionais totalmente qualificados</h3>
            <p className="text-stone-500 max-w-md mx-auto mb-8">Nossa rede está sendo atualizada. Em breve, a lista completa de terapeutas credenciados e qualificados pela ALBA estará disponível aqui para você.</p>
            <a href="mailto:info@ayurvedica.org" className="cursor-pointer inline-flex items-center gap-2 bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-900/20 active:scale-95">
              Entre em contato conosco
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
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
