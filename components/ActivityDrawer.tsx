"use client";

import React, { useEffect } from 'react';

interface Activity {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  duration?: string;
  indicatedFor?: string;
}

interface ActivityDrawerProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityDrawer: React.FC<ActivityDrawerProps> = ({ activity, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!activity) return null;

  return (
    <>
      {/* Overlay Escuro de Fundo */}
      <div 
        className={`fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300 cursor-pointer ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      ></div>

      {/* Painel da Drawer Deslizante */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Imagem de Cobertura */}
        <div className="relative h-64 w-full bg-stone-100 flex-shrink-0">
          <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-black/20 backdrop-blur-md hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-6 bg-emerald-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {activity.category}
          </div>
        </div>

        {/* Informações Roláveis */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 hide-scrollbar text-stone-800">
          <h2 className="text-2xl font-serif text-stone-900 mb-6">{activity.title}</h2>
          
          {/* Caixa de Metadados Rápidos */}
          <div className="space-y-4 mb-8 text-sm bg-stone-50 p-5 rounded-2xl border border-stone-100">
            {activity.duration && (
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-stone-500">Duração Média</span>
                <span className="font-bold text-stone-700">{activity.duration}</span>
              </div>
            )}
            {activity.indicatedFor && (
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-stone-500">Indicado para</span>
                <span className="font-bold text-stone-700">{activity.indicatedFor}</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-stone-900 mb-3">Sobre a Prática</h3>
          <p className="text-stone-600 leading-relaxed mb-6">
            {activity.description}
          </p>
          <p className="text-stone-600 leading-relaxed text-sm italic">
            * Todas as atividades da ABRA são conduzidas por profissionais certificados e experientes, respeitando os preceitos clássicos da tradição védica.
          </p>
        </div>

        {/* Botão de Ação no Rodapé */}
        <div className="p-6 bg-white border-t border-stone-100 flex-shrink-0">
          <button className="w-full bg-emerald-800 text-white py-4 rounded-xl font-bold hover:bg-emerald-900 transition-all active:scale-[0.98] shadow-md flex justify-center items-center gap-2 cursor-pointer">
            Agendar / Inscrever-se
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </div>
    </>
  );
};
