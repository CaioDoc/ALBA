"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '../../components/Navbar';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  photo: string;
}

export interface ProfissionalData {
  headerBadge: string;
  headerTitle: string;
  headerDescription: string;
  name: string;
  spiritualName: string;
  roleBadge: string;
  photo: string;
  contactEmail: string;
  contactPhone?: string;
  bioBadge: string;
  bioTitle: string;
  quote: string;
  bioText: string;
  specialtiesTitle: string;
  specialtiesDescription: string;
  specialtiesList: string[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonEmail: string;
  outrosProfissionais?: TeamMember[];
}

const defaultProfissional: ProfissionalData = {
  headerBadge: "Corpo Docente & Responsável Técnico",
  headerTitle: "Profissionais da ALBA",
  headerDescription: "Conheça nossos mestres, terapeutas e profissionais dedicados à sabedoria e práticas da Medicina Ayurvédica.",
  name: "Valter Carlos Cardim",
  spiritualName: "(Swami Gyanesh)",
  roleBadge: "Fundador & Mestre Ayurvédico",
  photo: "/images/profissional/valter.jpeg",
  contactEmail: "info@ayurvedica.org",
  contactPhone: "",
  bioBadge: "Biografia & Trajetória",
  bioTitle: "Valter Carlos Cardim (Swami Gyanesh)",
  quote: "Dedicação contínua ao estudo e à aplicação prática das artes corporais e da Medicina Ayurvédica desde 1970.",
  bioText: "Valter Carlos Cardim (Swami Gyanesh) dedica-se ao estudo de técnicas que trabalham o corpo desde 1970. Em 1980 é iniciado pessoalmente pelo seu mestre Osho (Bagwan Shree Rajneesh). Em 1981 viaja para os Estados Unidos onde permanece e participa do Festival Vida Internacional na comunidade do seu mestre.\n\nEm 1989 viaja para a Índia onde aprofunda os seus conhecimentos sobre Ayurvédica em Poona. Participou em vários workshops na Rajneesh Foundation International nos Estados Unidos e na Índia. Estudou no Instituto Corpo de São Paulo, no Instituto Soma de São Paulo, e na Escola de Massagens Amor.\n\nPossui curso de Medicina Ayurvédica, com pós-graduação pela Universidade de Maimónides, com certificação pela Universidade de Gujarat, Índia. Concluiu pós-doutorado em Cultura e Comunicação, onde estudou a aplicação da Medicina Ayurvédica na Cultura Contemporânea.",
  specialtiesTitle: "Áreas de Atendimento & Especialidades",
  specialtiesDescription: "Atendimentos na área da arte da massagem corporal Ayurvédica, Nutrição e Estilo de Vida segundo a Ayurveda e Naturopatia Ayurvédica. Também possui conhecimento sobre análise do sangue vivo.",
  specialtiesList: [
    "Massagem Corporativa Ayurvédica",
    "Nutrição & Estilo de Vida",
    "Naturopatia Ayurvédica",
    "Análise do Sangue Vivo"
  ],
  ctaTitle: "Deseja agendar um atendimento ou solicitar mais informações?",
  ctaSubtitle: "Entre em contacto direto através do nosso suporte oficial por e-mail.",
  ctaButtonText: "Enviar E-mail",
  ctaButtonEmail: "info@ayurvedica.org",
  outrosProfissionais: [
    {
      id: "prof-1",
      name: "Dra. Mariana Fernandes",
      role: "Terapeuta Ayurvédica & Panchakarma",
      description: "Especialista em terapias de desintoxicação e rejuvenescimento corporal segundo os textos clássicos da Ayurveda. Atendimentos integrativos focados no alívio do estresse e reequilíbrio dos doshas.",
      photo: "https://images.unsplash.com/photo-1594824406951-31823095b27b?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "prof-2",
      name: "Carlos Alberto Mendonça",
      role: "Instrutor de Yoga & Meditação Ayurvédica",
      description: "Facilitador de práticas de Hatha Yoga e técnicas milenares de respiração (Pranayama). Integra a sabedoria védica no cultivo da clareza mental e vitalidade física diária.",
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "prof-3",
      name: "Juliana Silveira",
      role: "Nutrição Ayurvédica & Fitoterapia",
      description: "Consultoria nutricional individualizada respeitando a constituição individual (Prakriti). Orientação no uso culinário de ervas medicinais e especiarias para digestão e imunidade.",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
    }
  ]
};

const API_URL = '/api/profissionais.php';

function ProfissionaisContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ProfissionalData>(defaultProfissional);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getImagePath = (path: string) => {
    if (!path) return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.replace(/^\//, '');
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (window.location.hostname.includes('github.io') || pathname.startsWith('/ALBA')) {
        return `/ALBA/${clean}`;
      }
    }
    return `/${clean}`;
  };

  // Carrega parâmetros da URL inicial
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setSelectedId(idFromUrl);
    } else {
      setSelectedId(null);
    }
  }, [searchParams]);

  // Listener para botão voltar/avançar do navegador
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      setSelectedId(id || null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Carrega dados da API / localStorage
  useEffect(() => {
    const loadProfissionalData = async () => {
      try {
        const res = await fetch(API_URL, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json && json.name) {
            setData(prev => ({
              ...defaultProfissional,
              ...json,
              outrosProfissionais: json.outrosProfissionais || prev.outrosProfissionais || []
            }));
            localStorage.setItem('alba_profissionais_data', JSON.stringify(json));
            return;
          }
        }
      } catch (e) {
        console.warn('API de profissionais indisponível, tentando fallback em localStorage.', e);
      }

      const saved = localStorage.getItem('alba_profissionais_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.name) {
            setData(prev => ({
              ...defaultProfissional,
              ...parsed,
              outrosProfissionais: parsed.outrosProfissionais || prev.outrosProfissionais || []
            }));
          }
        } catch (err) {}
      }
    };

    loadProfissionalData();
  }, []);

  // Selecionar profissional para ver página individual
  const handleSelectProfessional = (id: string) => {
    setSelectedId(id);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('id', id);
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Voltar para o Grid 3x3
  const handleBackToGrid = () => {
    setSelectedId(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Divide a biografia de Valter em parágrafos separados
  const bioParagraphs = (data.bioText || '')
    .split(/\n\s*\n|\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const emailDestino = data.ctaButtonEmail || data.contactEmail || 'info@ayurvedica.org';
  const outros = data.outrosProfissionais || [];

  // Constrói a lista de todos os profissionais para o Grid 3x3 (incluindo Valter em primeiro lugar)
  const valterCard = {
    id: 'valter',
    name: data.name || "Valter Carlos Cardim",
    spiritualName: data.spiritualName || "(Swami Gyanesh)",
    role: data.roleBadge || "Fundador & Mestre Ayurvédico",
    photo: data.photo || "/images/profissional/valter.jpeg",
    description: data.quote || "Fundador da Associação Luso-Brasileira de Ayurveda (ALBA). Dedicação contínua ao estudo e à aplicação prática das artes corporais e da Medicina Ayurvédica desde 1970.",
    isFounder: true
  };

  const allProfessionalsGrid = [
    valterCard,
    ...outros.map(m => ({
      id: m.id,
      name: m.name,
      spiritualName: '',
      role: m.role,
      photo: m.photo,
      description: m.description,
      isFounder: false
    }))
  ];

  // Se um profissional foi selecionado, busca os dados para exibir a página dele
  const isValterSelected = selectedId === 'valter';
  const selectedOtherMember = outros.find(m => m.id === selectedId);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex flex-col">
      <Navbar />

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* CENÁRIO 1: VISUALIZANDO A PÁGINA INDIVIDUAL DO PROFISSIONAL       */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {selectedId && (
        <div className="flex-grow pt-24 pb-16 animate-fade-in">
          
          {/* Barra de Voltar */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
            <button
              onClick={handleBackToGrid}
              className="cursor-pointer inline-flex items-center gap-2.5 px-5 py-2.5 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-xl text-stone-700 hover:text-emerald-900 font-bold text-xs uppercase tracking-wider shadow-xs transition-all"
            >
              <svg className="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Voltar para Todos os Profissionais</span>
            </button>
          </div>

          {/* 1.A: PÁGINA COMPLETA DO VALTER CARLOS CARDIM */}
          {isValterSelected && (
            <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* COLUNA ESQUERDA: Foto e Card de Destaque */}
                <div className="lg:col-span-5 sticky top-28 space-y-6">
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-stone-900 group">
                    <img 
                      src={getImagePath(data.photo)} 
                      alt={`${data.name} ${data.spiritualName || ''}`} 
                      className="w-full h-auto object-cover max-h-[620px] transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/profissional/valter.jpeg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      {data.roleBadge && (
                        <span className="inline-block bg-emerald-800/90 backdrop-blur-md text-emerald-100 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                          {data.roleBadge}
                        </span>
                      )}
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                        {data.name}
                      </h2>
                      {data.spiritualName && (
                        <p className="text-emerald-200 text-sm font-medium mt-0.5">
                          {data.spiritualName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card de Contato Rápido */}
                  {data.contactEmail && (
                    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-stone-500 font-bold">Informações e Agendamento</p>
                        <a 
                          href={`mailto:${data.contactEmail}`} 
                          className="text-emerald-800 font-bold hover:underline text-sm md:text-base break-all"
                        >
                          {data.contactEmail}
                        </a>
                      </div>
                      <a 
                        href={`mailto:${data.contactEmail}`} 
                        className="w-12 h-12 bg-emerald-800 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-900 transition-all flex-shrink-0 shadow-md cursor-pointer"
                        title="Enviar E-mail"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>

                {/* COLUNA DIREITA: Artigo Biográfico e Especialidades */}
                <div className="lg:col-span-7 space-y-8">
                  <div>
                    {data.bioBadge && (
                      <span className="text-emerald-800 font-bold uppercase tracking-widest text-xs block mb-2">
                        {data.bioBadge}
                      </span>
                    )}
                    <h2 className="text-3xl md:text-4xl font-serif text-stone-900 font-bold leading-tight mb-4">
                      {data.bioTitle || data.name}
                    </h2>
                    {data.quote && (
                      <p className="text-lg text-emerald-900 font-serif italic border-l-4 border-emerald-800 pl-4 py-2 bg-emerald-50/60 rounded-r-xl">
                        {data.quote}
                      </p>
                    )}
                  </div>

                  {/* Texto da Biografia */}
                  <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed text-base md:text-lg space-y-5">
                    {bioParagraphs.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Especialidades */}
                  <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-800/20 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-800 text-emerald-100 rounded-xl flex items-center justify-center font-bold">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-white">
                          {data.specialtiesTitle || "Áreas de Atendimento & Especialidades"}
                        </h3>
                      </div>

                      {data.specialtiesDescription && (
                        <p className="text-stone-300 text-base md:text-lg leading-relaxed">
                          {data.specialtiesDescription}
                        </p>
                      )}

                      {data.specialtiesList && data.specialtiesList.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-2">
                          {data.specialtiesList.map((spec, i) => (
                            <span 
                              key={i} 
                              className="bg-stone-800 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-700"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bloco de Contato (CTA) */}
                  <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <h4 className="text-lg font-serif font-bold text-emerald-950 mb-1">
                        {data.ctaTitle || "Deseja agendar um atendimento ou solicitar mais informações?"}
                      </h4>
                      <p className="text-stone-600 text-sm">
                        {data.ctaSubtitle || "Entre em contacto direto através do nosso suporte oficial por e-mail."}
                      </p>
                    </div>
                    <a 
                      href={`mailto:${emailDestino}`} 
                      className="bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-emerald-900 transition-all shadow-md hover:shadow-emerald-900/30 whitespace-nowrap cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>{data.ctaButtonText || "Enviar E-mail"}</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>

                </div>

              </div>
            </section>
          )}

          {/* 1.B: PÁGINA COMPLETA DE OUTRO PROFISSIONAL */}
          {selectedOtherMember && (
            <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* COLUNA ESQUERDA: Foto e Destaque */}
                <div className="lg:col-span-5 sticky top-28 space-y-6">
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-stone-900 group">
                    <img 
                      src={getImagePath(selectedOtherMember.photo)} 
                      alt={selectedOtherMember.name} 
                      className="w-full h-auto object-cover max-h-[620px] transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <span className="inline-block bg-emerald-800/90 backdrop-blur-md text-emerald-100 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                        {selectedOtherMember.role}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                        {selectedOtherMember.name}
                      </h2>
                    </div>
                  </div>

                  {/* Card de Contato */}
                  <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-stone-500 font-bold">Informações e Agendamento</p>
                      <a 
                        href={`mailto:${emailDestino}?subject=Agendamento com ${encodeURIComponent(selectedOtherMember.name)}`} 
                        className="text-emerald-800 font-bold hover:underline text-sm md:text-base break-all"
                      >
                        {emailDestino}
                      </a>
                    </div>
                    <a 
                      href={`mailto:${emailDestino}?subject=Agendamento com ${encodeURIComponent(selectedOtherMember.name)}`} 
                      className="w-12 h-12 bg-emerald-800 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-900 transition-all flex-shrink-0 shadow-md cursor-pointer"
                      title="Enviar E-mail"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* COLUNA DIREITA: Trajetória & Descrição Completa */}
                <div className="lg:col-span-7 space-y-8">
                  <div>
                    <span className="text-emerald-800 font-bold uppercase tracking-widest text-xs block mb-2">
                      Corpo Docente & Especialista
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-stone-900 font-bold leading-tight mb-3">
                      {selectedOtherMember.name}
                    </h2>
                    <p className="text-base font-bold text-emerald-800 uppercase tracking-wider pb-3 border-b border-stone-200">
                      {selectedOtherMember.role}
                    </p>
                  </div>

                  {/* Descrição Completa do Profissional */}
                  <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed text-base md:text-lg space-y-5">
                    {selectedOtherMember.description.split(/\n\s*\n|\n/).map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {/* Card de Atendimento e Práticas */}
                  <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                    <div className="relative z-10 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-800 text-emerald-100 rounded-xl flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <h3 className="text-xl font-serif font-bold text-white">
                          Atendimento Integrativo & Medicina Tradicional
                        </h3>
                      </div>
                      <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                        Consultas e terapias conduzidas com rigor teórico e respeito às tradições védicas preservadas pela Associação Luso-Brasileira de Ayurveda.
                      </p>
                    </div>
                  </div>

                  {/* Bloco de Agendamento */}
                  <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <h4 className="text-lg font-serif font-bold text-emerald-950 mb-1">
                        Deseja agendar uma sessão com {selectedOtherMember.name}?
                      </h4>
                      <p className="text-stone-600 text-sm">
                        Entre em contato através do nosso canal oficial para verificar disponibilidade e horários.
                      </p>
                    </div>
                    <a 
                      href={`mailto:${emailDestino}?subject=Agendamento com ${encodeURIComponent(selectedOtherMember.name)}`} 
                      className="bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-emerald-900 transition-all shadow-md hover:shadow-emerald-900/30 whitespace-nowrap cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Agendar Atendimento</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>

                </div>

              </div>
            </section>
          )}

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* CENÁRIO 2: VITRINE PRINCIPAL - DISPLAY EM GRADE 3x3 COMPLETO     */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {!selectedId && (
        <div className="flex-grow">
          {/* Cabeçalho da Vitrine */}
          <section className="pt-28 pb-14 px-4 bg-stone-100 border-b border-stone-200 text-center">
            <div className="max-w-4xl mx-auto">
              <span className="text-emerald-800 font-bold uppercase tracking-widest text-xs mb-3 block">
                {data.headerBadge || "Corpo Docente & Responsável Técnico"}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4 font-bold">
                {data.headerTitle || "Profissionais da ALBA"}
              </h1>
              <p className="text-base md:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                {data.headerDescription || "Conheça nossos mestres, terapeutas e profissionais dedicados à sabedoria e práticas da Medicina Ayurvédica."}
              </p>
            </div>
          </section>

          {/* Grid 3x3 com TODOS os profissionais (incluindo o Valter Cardim) */}
          <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProfessionalsGrid.map((prof) => (
                <div
                  key={prof.id}
                  onClick={() => handleSelectProfessional(prof.id)}
                  className="group bg-white rounded-[2.5rem] border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-emerald-300 transition-all duration-500 flex flex-col cursor-pointer transform hover:-translate-y-1.5"
                  title={`Clique para ver a página de ${prof.name}`}
                >
                  {/* Foto do Profissional */}
                  <div className="relative h-80 w-full overflow-hidden bg-stone-100 flex items-center justify-center">
                    <img 
                      src={getImagePath(prof.photo)} 
                      alt={prof.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                  </div>

                  {/* Informações do Card */}
                  <div className="p-7 md:p-8 flex flex-col flex-grow">
                    <div className="mb-2">
                      <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                        {prof.name}
                      </h3>
                      {prof.spiritualName && (
                        <p className="text-xs text-stone-500 font-medium mt-0.5">
                          {prof.spiritualName}
                        </p>
                      )}
                    </div>

                    {/* Subtítulo: Área de Atuação */}
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-4 pb-3 border-b border-stone-100">
                      {prof.role}
                    </p>

                    {/* Descrição resumida */}
                    <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                      {prof.description}
                    </p>

                    {/* Botão de Ação: Ver Página do Profissional */}
                    <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between text-emerald-800 font-bold text-sm group-hover:text-emerald-950">
                      <span>Ver Perfil Completo</span>
                      <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-all shadow-xs">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

    </div>
  );
}

export default function ProfissionaisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center font-sans text-stone-600">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Carregando profissionais...</span>
        </div>
      </div>
    }>
      <ProfissionaisContent />
    </Suspense>
  );
}
