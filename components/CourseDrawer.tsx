"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SyllabusModule {
  moduleTitle: string;
  theoretical?: string[];
  practical?: string[];
}

interface CourseDrawerProps {
  course: {
    id: number | string;
    title: string;
    category: string;
    image: string;
    date?: string;
    workload: string;
    format: string;
    price: string;
    description: string;
    targetAudience?: string;
    certification?: string;
    objectives?: string[];
    syllabus?: SyllabusModule[];
    providedMaterials?: string;
    neededMaterials?: string;
    requirements?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseDrawer = ({ course, isOpen, onClose }: CourseDrawerProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'info'>('overview');

  // Reseta para a primeira aba quando troca de curso
  useEffect(() => {
    setActiveTab('overview');
  }, [course]);

  // Trava o scroll da página quando a drawer está aberta
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!course) return null;

  const hasSyllabus = Array.isArray(course.syllabus) && course.syllabus.length > 0;

  const getImagePath = (src: string) => {
    const fallback = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop';
    if (!src) return fallback;
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    
    const clean = src.replace(/^\//, '');
    
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (window.location.hostname.includes('github.io') || pathname.startsWith('/ALBA')) {
        return `/ALBA/${clean}`;
      }
    }
    return `/${clean}`;
  };

  return (
    <>
      {/* Overlay escuro */}
      <div 
        className={`fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300 cursor-pointer ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      ></div>

      {/* Drawer Deslizante */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Imagem do Topo */}
        <div className="relative h-56 md:h-64 w-full bg-stone-100 flex-shrink-0 overflow-hidden">
          <img 
            src={getImagePath((course as any).drawerImage || course.image)} 
            alt={course.title} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent pointer-events-none"></div>
          
          <button 
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-6 right-6 w-10 h-10 bg-black/40 backdrop-blur-md hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
            <span className="bg-emerald-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              {course.category}
            </span>
            <span className="bg-stone-900/90 text-stone-200 px-3 py-1 rounded-full text-xs font-bold border border-stone-700">
              {course.workload}
            </span>
          </div>
        </div>

        {/* Header do Título */}
        <div className="p-6 pb-2 border-b border-stone-100 flex-shrink-0">
          <h2 className="text-2xl font-serif text-stone-900 leading-tight">{course.title}</h2>
        </div>

        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50/50 flex-shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`cursor-pointer py-3 px-4 font-bold text-xs md:text-sm border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Visão Geral
          </button>
          
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`cursor-pointer py-3 px-4 font-bold text-xs md:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'syllabus'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Programa do Curso
            {hasSyllabus && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`cursor-pointer py-3 px-4 font-bold text-xs md:text-sm border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Certificado & Admissão
          </button>
        </div>

        {/* CONTEÚDO ROLÁVEL */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 hide-scrollbar text-stone-800 space-y-6">

          {/* ABA 1: VISÃO GERAL */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Card de Ficha Técnica */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
                <div>
                  <span className="text-xs font-bold uppercase text-stone-400 block mb-1">Carga Horária</span>
                  <span className="font-bold text-stone-800 text-base">{course.workload}</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-stone-400 block mb-1">Formato</span>
                  <span className="font-bold text-stone-800 text-base">{course.format}</span>
                </div>
                {course.price && (
                  <div className="col-span-2 pt-3 border-t border-stone-200">
                    <span className="text-xs font-bold uppercase text-stone-400 block mb-1">Investimento / Condições</span>
                    <span className="font-bold text-emerald-800 text-sm whitespace-pre-line">{course.price}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-3">Sobre esta Formação</h3>
                <p className="text-stone-600 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {course.targetAudience && (
                <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                  <h4 className="text-sm font-bold text-emerald-900 mb-2 uppercase tracking-wider">Destinatários / Público-Alvo</h4>
                  <p className="text-sm text-stone-700 leading-relaxed">{course.targetAudience}</p>
                </div>
              )}

              {Array.isArray(course.objectives) && course.objectives.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-3">Objetivos do Programa</h3>
                  <ul className="space-y-2 text-sm text-stone-600">
                    {course.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ABA 2: PROGRAMA DO CURSO (SYLLABUS DETALHADO) */}
          {activeTab === 'syllabus' && (
            <div className="space-y-6 animate-fade-in-up">
              {hasSyllabus ? (
                course.syllabus!.map((moduleItem, modIdx) => (
                  <div key={modIdx} className="bg-stone-50 border border-stone-200 rounded-2xl p-5 md:p-6 space-y-4">
                    <h3 className="text-lg font-bold text-stone-900 font-serif border-b border-stone-200 pb-3 flex items-center gap-2">
                      <span className="w-7 h-7 bg-emerald-800 text-white rounded-lg text-xs flex items-center justify-center font-sans font-bold">{modIdx + 1}</span>
                      {moduleItem.moduleTitle}
                    </h3>

                    {Array.isArray(moduleItem.theoretical) && moduleItem.theoretical.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          Conteúdo Teórico
                        </h4>
                        <ul className="space-y-2 text-xs md:text-sm text-stone-600 pl-2">
                          {moduleItem.theoretical.map((item, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-2">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(moduleItem.practical) && moduleItem.practical.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>
                          Conteúdo Prático
                        </h4>
                        <ul className="space-y-2 text-xs md:text-sm text-stone-600 pl-2">
                          {moduleItem.practical.map((item, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <h4 className="text-base font-bold text-stone-900">Programa Completo em Atualização</h4>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    O plano de estudos detalhado deste programa está a ser formatado pela coordenação pedagógica da ALBA de acordo com as normas oficiais.
                  </p>
                  <p className="text-xs text-stone-500">
                    Clique em &quot;Garantir Minha Vaga&quot; para solicitar o PDF oficial do programa via WhatsApp ou E-mail.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ABA 3: CERTIFICADO & ADMISSÃO */}
          {activeTab === 'info' && (
            <div className="space-y-6 animate-fade-in-up">
              {course.certification && (
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <h3 className="text-sm font-bold text-emerald-900 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    Certificação Profissional
                  </h3>
                  <p className="text-sm text-stone-700 leading-relaxed">{course.certification}</p>
                </div>
              )}

              {course.requirements && (
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-2 uppercase tracking-wider">Condições de Admissão</h3>
                  <p className="text-sm text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">{course.requirements}</p>
                </div>
              )}

              {course.providedMaterials && (
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-2 uppercase tracking-wider">Material Fornecido</h3>
                  <p className="text-sm text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">{course.providedMaterials}</p>
                </div>
              )}

              {course.neededMaterials && (
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-2 uppercase tracking-wider">Material Necessário</h3>
                  <p className="text-sm text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">{course.neededMaterials}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Rodapé Fixo com Botão de Inscrição e Botão PDF do Curso */}
        <div className="p-6 bg-white border-t border-stone-200 flex-shrink-0 flex flex-col sm:flex-row gap-3">
          {(course as any).pdfUrl ? (
            <a 
              href={getImagePath((course as any).pdfUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:w-1/2 bg-amber-700 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-amber-800 transition-all active:scale-[0.98] shadow-md flex justify-center items-center gap-2 cursor-pointer text-center text-sm"
            >
              <svg className="w-5 h-5 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF do Curso
            </a>
          ) : (
            <Link 
              href={`/associe-se?interesse=${encodeURIComponent(`PDF do Curso: ${course.title}`)}`}
              className="sm:w-1/2 bg-amber-700 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-amber-800 transition-all active:scale-[0.98] shadow-md flex justify-center items-center gap-2 cursor-pointer text-center text-sm"
            >
              <svg className="w-5 h-5 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF do Curso
            </Link>
          )}

          <Link 
            href={`/associe-se?interesse=${encodeURIComponent(course.title)}`}
            className="sm:w-1/2 bg-emerald-800 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-emerald-900 transition-all active:scale-[0.98] shadow-md flex justify-center items-center gap-2 cursor-pointer text-center text-sm"
          >
            Garantir Minha Vaga / Informações
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </div>
    </>
  );
};

