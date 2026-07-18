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
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipo: 'Profissional Formado',
    mensagem: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    const interesseParam = searchParams.get('interesse');
    if (interesseParam) {
      setSelectedInteresse(interesseParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);
    
    const messageContent = selectedInteresse ? `Interesse selecionado: ${selectedInteresse}\n\n${formData.mensagem}` : formData.mensagem;

    // 1. Salvar no Admin (localStorage)
    const existingLeads = JSON.parse(localStorage.getItem('alba_leads') || '[]');
    const newLead = {
      id: Date.now(),
      name: formData.nome,
      email: formData.email,
      phone: formData.telefone,
      type: 'Associe-se',
      category: formData.tipo,
      date: new Date().toLocaleDateString('pt-BR') + ', ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'Novo',
      message: messageContent
    };
    
    localStorage.setItem('alba_leads', JSON.stringify([newLead, ...existingLeads]));

    try {

      const response = await fetch('/mailer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          subject: `Nova Solicitação de Associação: ${formData.nome}`,
          from_name: formData.nome,
          email: formData.email,
          phone: formData.telefone,
          category: formData.tipo,
          message: messageContent
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setSubmitError(true);
      }
    } catch (error) {
      console.error(error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-emerald-50 text-emerald-800 p-8 rounded-2xl border border-emerald-200 text-center animate-fade-in-up">
        <svg className="w-16 h-16 mx-auto mb-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-2xl font-serif mb-2">Solicitação Enviada!</h3>
        <p className="text-sm">Recebemos seus dados com sucesso. Nossa equipe entrará em contato em breve através do seu WhatsApp ou E-mail.</p>
        <button 
          onClick={() => {
            setIsSubmitted(false);
            setFormData({nome: '', email: '', telefone: '', tipo: 'Profissional Formado', mensagem: ''});
            setSelectedInteresse('');
          }}
          className="cursor-pointer mt-6 px-6 py-2 bg-emerald-800 text-white rounded-xl font-bold hover:bg-emerald-900 transition-all text-sm"
        >
          Enviar Nova Mensagem
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Nome */}
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-stone-700 mb-2">Nome Completo</label>
        <input 
          type="text" 
          id="nome"
          required
          value={formData.nome}
          onChange={(e) => setFormData({...formData, nome: e.target.value})}
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
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-stone-700 mb-2">WhatsApp</label>
          <input 
            type="tel" 
            id="telefone"
            required
            value={formData.telefone}
            onChange={(e) => setFormData({...formData, telefone: e.target.value})}
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
          value={formData.tipo}
          onChange={(e) => setFormData({...formData, tipo: e.target.value})}
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
          value={formData.mensagem}
          onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
          placeholder="Sua formação, onde atua, ou dúvidas sobre a atividade/curso..."
        ></textarea>
      </div>

      {/* Botão de Envio */}
      {submitError && (
        <p className="text-red-500 text-sm font-medium">Ocorreu um erro ao enviar seu e-mail. Mas sua solicitação foi salva em nosso sistema.</p>
      )}
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="cursor-pointer w-full bg-emerald-800 disabled:opacity-50 text-white py-4 rounded-xl font-bold hover:bg-emerald-900 transition-all active:scale-[0.98] shadow-md flex justify-center items-center gap-2"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
        {!isSubmitting && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
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
