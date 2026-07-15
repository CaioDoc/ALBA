"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { initialCourses } from '../data/cursos.js';

const atividadesList = [
  "Dosha Yoga",
  "Hatha Yoga Tradicional",
  "Personal Yoga",
  "Consulta de Medicina Ayurvédica",
  "Terapia com Florais de Bach",
  "Astrologia Védica (Jyotish)",
  "Massagem Ayurvédica (Abhyanga)",
  "Indian Head Massage (Champi)",
  "Meditação Cromática Vibracional"
];

function FormContent() {
  const searchParams = useSearchParams();
  const [selectedInteresse, setSelectedInteresse] = useState('');

  useEffect(() => {
    const interesseParam = searchParams.get('interesse');
    if (interesseParam) {
      setSelectedInteresse(interesseParam);
    }
  }, [searchParams]);

  return (
    <form className="space-y-6">
      {/* Nome */}
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-stone-700 mb-2">Nome Completo</label>
        <input 
          type="text" 
          id="nome"
          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          placeholder="Ex: Dra. Julia Santini"
        />
      </div>

      {/* Email e Telefone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">E-mail</label>
          <input 
            type="email" 
            id="email"
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-stone-700 mb-2">WhatsApp</label>
          <input 
            type="tel" 
            id="telefone"
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>

      {/* Tipo de Associação */}
      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-stone-700 mb-2">Categoria Desejada</label>
        <select 
          id="tipo"
          className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        >
          <option>Profissional Formado</option>
          <option>Estudante de Ayurveda</option>
          <option>Simpatizante / Parceiro</option>
        </select>
      </div>

      {/* Atividades & Cursos */}
      <div>
        <label htmlFor="interesse" className="block text-sm font-medium text-stone-700 mb-2">Atividades & Cursos (Selecione o seu interesse)</label>
        <select 
          id="interesse"
          value={selectedInteresse}
          onChange={(e) => setSelectedInteresse(e.target.value)}
          className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        >
          <option value="">Apenas Associação (Nenhum específico)</option>
          <optgroup label="Cursos e Formações">
            {initialCourses.map(course => (
              <option key={course.id} value={course.title}>{course.title}</option>
            ))}
          </optgroup>
          <optgroup label="Atividades e Consultas">
            {atividadesList.map(ativ => (
              <option key={ativ} value={ativ}>{ativ}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Mensagem */}
      <div>
        <label htmlFor="mensagem" className="block text-sm font-medium text-stone-700 mb-2">Conte um pouco sobre sua trajetória</label>
        <textarea 
          id="mensagem"
          rows={4}
          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
          placeholder="Sua formação, onde atua, ou dúvidas sobre a atividade/curso..."
        ></textarea>
      </div>

      {/* Botão de Envio */}
      <button 
        type="button" 
        className="cursor-pointer w-full bg-emerald-800 text-white py-4 rounded-xl font-bold hover:bg-emerald-900 transition-all active:scale-[0.98] shadow-md flex justify-center items-center gap-2"
      >
        Enviar Solicitação
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </form>
  );
}

export const AssocieseForm = () => {
  return (
    <Suspense fallback={<div className="text-stone-500">Carregando formulário...</div>}>
      <FormContent />
    </Suspense>
  );
};
