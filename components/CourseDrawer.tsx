"use client";

import React, { useEffect } from 'react';

export const CourseDrawer = ({ course, isOpen, onClose }: any) => {
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

  return (
    <>
      {/* Overlay escuro */}
      <div 
        className={`fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300 cursor-pointer ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      ></div>

      {/* Drawer Deslizante */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Imagem do Topo */}
        <div className="relative h-64 w-full bg-stone-100 flex-shrink-0">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-6 bg-emerald-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {course.category}
          </div>
        </div>

        {/* Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 hide-scrollbar text-stone-800">
          <p className="text-emerald-700 font-bold text-sm mb-2">{course.date}</p>
          <h2 className="text-2xl font-serif text-stone-900 mb-6">{course.title}</h2>
          
          <div className="space-y-4 mb-8 text-sm bg-stone-50 p-5 rounded-2xl border border-stone-100">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-stone-500">Carga Horária</span>
              <span className="font-bold text-stone-700">{course.workload}</span>
            </div>
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-stone-500">Formato</span>
              <span className="font-bold text-stone-700 text-right max-w-[60%]">{course.format}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-stone-500">Status</span>
              <span className="font-bold text-emerald-700">{course.price}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-stone-900 mb-3">Sobre o Programa</h3>
          <p className="text-stone-600 leading-relaxed mb-6">
            {course.description}
          </p>
          <p className="text-stone-600 leading-relaxed">
            Este programa é certificado pela Associação Luso-Brasileira de Ayurveda, garantindo a excelência e tradição na transmissão do conhecimento védico.
          </p>
        </div>

        {/* Rodapé Fixo com Botão de Inscrição */}
        <div className="p-6 bg-white border-t border-stone-100 flex-shrink-0">
          <button className="w-full bg-emerald-800 text-white py-4 rounded-xl font-bold hover:bg-emerald-900 transition-all active:scale-[0.98] shadow-md flex justify-center items-center gap-2 cursor-pointer">
            Garantir Minha Vaga
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </div>
    </>
  );
};
