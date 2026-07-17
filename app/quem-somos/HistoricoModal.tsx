'use client';

import React, { useState } from 'react';

export function HistoricoModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="mt-8">
        <button 
          onClick={() => setIsOpen(true)}
          className="cursor-pointer inline-flex items-center justify-center bg-stone-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-900 transition-all active:scale-95 shadow-md"
        >
          Histórico (Saiba Mais)
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors z-10 shadow-sm"
              aria-label="Fechar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header Image */}
            <div className="w-full h-64 md:h-80 relative">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop" 
                alt="Histórico Ayurveda" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent flex items-end">
                <div className="p-8 md:p-12 w-full">
                  <h2 className="text-3xl md:text-5xl font-serif text-white font-bold">Histórico</h2>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 md:p-12 prose prose-stone md:prose-lg max-w-none text-stone-600">
              <p className="leading-relaxed text-justify mb-6">
                A Associação Luso-Brasileira de Ayurvédica e Disciplinas Associadas, A.L.B.A., é uma associação sem fins lucrativos e de duração ilimitada, fundada por um grupo de amantes da tradição da Índia antiga, alunos de Valter Carlos Cardim, ítalo-brasileiro, que atuava em Portugal desde agosto de 1990 ensinando algumas técnicas de tratamento corporal e meditação. Foi constituída oficialmente em 25 de janeiro de 2001. A A.L.B.A herdou o trabalho da Associação Ayurvédica do Brasil, que atuava em São Paulo, Brasil, desde 1989.
              </p>
              <p className="leading-relaxed text-justify mb-6">
                A A.L.B.A deu continuidade ao trabalho realizado pelo seu fundador no âmbito do estudo e da prática do Sistema Oriental de Tratamento Corporal Ayurvédico, como técnica terapêutica, bem como o estudo da filosofia Védica (Hindu), nas suas várias modalidades (Medicina Ayurvédica, Massagem Terapêutica Ayurvédica e Yoga), bem como outras técnicas orientais e ocidentais que visem a evolução do homem, para além de estimular e promover as artes e a cultura orientais e ocidentais, intercambiando-as entre si. Em novembro de 2023 transferiu a sua sede para São Paulo, Brasil.
              </p>
              <h3 className="text-2xl font-serif text-stone-900 mt-8 mb-4">Especialidades</h3>
              <p className="leading-relaxed text-justify">
                Formação em técnicas orientais de tratamento corporal, meditação, yoga, Massagem Ayurvedica em várias vertentes, Naturopatia e Nutrição segundo a Ayurvedica e outras formações complementares na área das terapias ocidentais-orientais.
              </p>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
