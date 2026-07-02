"use client";

import React, { useEffect } from 'react';
import { SkillBadge } from './SkillBadge';

export const TherapistModal = ({ therapist, isOpen, onClose }: any) => {
  // Trava o scroll da página de fundo quando o modal abre
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !therapist) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay escuro com desfoque */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm cursor-pointer" 
        onClick={onClose}
        aria-label="Fechar modal"
      ></div>
      
      {/* Container do Modal */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up z-10">
        
        {/* Botão de Fechar */}
        <button 
          onClick={onClose}
          className="cursor-pointer absolute top-6 right-6 w-10 h-10 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full flex items-center justify-center transition-colors z-20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Conteúdo Rolável do Modal */}
        <div className="overflow-y-auto p-8 md:p-10 hide-scrollbar">
          
          {/* Header do Perfil */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 text-center md:text-left">
            <div className="w-28 h-28 flex-shrink-0 rounded-full border-4 border-stone-50 overflow-hidden shadow-lg">
              <img src={therapist.avatar} alt={therapist.name} className="w-full h-full object-cover" />
            </div>
            <div className="mt-2">
              <h2 className="text-3xl font-serif text-stone-900 mb-1">{therapist.name}</h2>
              <p className="text-emerald-700 font-medium mb-1">{therapist.role}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-stone-500 text-sm">
                <span>{therapist.registry}</span>
                <span>•</span>
                <span>{therapist.location}</span>
              </div>
            </div>
          </div>

          {/* Biografia Completa */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-stone-900 mb-3">Sobre o Profissional</h3>
            <p className="text-stone-600 leading-relaxed">
              {therapist.bio}
              {/* Adicionando um texto extra mockado para dar volume ao modal */}
              {" "}Trabalha com foco no reequilíbrio dos Doshas através de rotinas adaptadas à vida moderna. As consultas são focadas em entender a raiz do desequilíbrio para um tratamento a longo prazo.
            </p>
          </div>

          {/* Especialidades */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-stone-900 mb-3">Especialidades</h3>
            <div className="flex flex-wrap gap-2">
              {therapist.skills.map(skill => (
                <SkillBadge key={skill.id} name={skill.name} slug={skill.slug} />
              ))}
            </div>
          </div>

          {/* Call to Action (Contato) */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-stone-100">
            <button className="cursor-pointer flex-1 bg-emerald-800 text-white py-4 rounded-xl font-bold hover:bg-emerald-900 transition-all active:scale-[0.98] flex justify-center items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Enviar WhatsApp
            </button>
            <button className="cursor-pointer flex-1 bg-stone-100 text-stone-700 py-4 rounded-xl font-bold hover:bg-stone-200 transition-all active:scale-[0.98]">
              Visitar Site
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
