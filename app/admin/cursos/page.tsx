"use client";

import React, { useState } from 'react';

// Dados simulados dos cursos
const initialCourses = [
  { id: 1, title: 'Formação Profissional em Terapeuta Ayurvédico', category: 'Formação', workload: '300h', format: 'Híbrido', status: 'Inscrições Abertas', students: 45 },
  { id: 2, title: 'Workshop Intensivo de Culinária Ayurvédica', category: 'Workshops', workload: '16h', format: 'Presencial', status: 'Vagas Limitadas', students: 18 },
  { id: 3, title: 'Retiro Avançado de Desintoxicação', category: 'Imersões', workload: '7 Dias', format: 'Presencial', status: 'Últimas Vagas', students: 10 },
  { id: 4, title: 'Introdução aos Doshas na Vida Moderna', category: 'Workshops', workload: '8h', format: 'Online', status: 'Encerrado', students: 120 },
];

export default function AdminCursosPage() {
  const [courses, setCourses] = useState(initialCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if(confirm('Tem certeza que deseja deletar ou suspender este curso permanentemente?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Curso salvo com sucesso e publicado na página de Cursos!');
    setView('list');
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-stone-900">Gestão de Cursos</h2>
          <p className="text-stone-500 mt-1">
            Cadastre novas formações, workshops e acompanhe o status das turmas.
          </p>
        </div>
        
        {view === 'list' ? (
          <button 
            onClick={() => setView('form')}
            className="cursor-pointer bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all active:scale-95 shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Novo Curso ou Evento
          </button>
        ) : (
          <button 
            onClick={() => setView('list')}
            className="cursor-pointer bg-stone-200 text-stone-700 px-6 py-3 rounded-xl font-bold hover:bg-stone-300 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar para a Lista
          </button>
        )}
      </div>

      {/* VIEW: LISTA DE CURSOS */}
      {view === 'list' && (
        <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm flex flex-col">
          
          {/* Barra de Busca */}
          <div className="p-6 border-b border-stone-100 bg-stone-50/50">
            <div className="relative w-full max-w-md">
              <input 
                type="text" 
                placeholder="Buscar curso por título ou categoria..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
              />
              <svg className="w-5 h-5 text-stone-400 absolute left-4 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-stone-200 text-stone-500 text-sm">
                  <th className="p-6 font-medium">Nome do Curso</th>
                  <th className="p-6 font-medium">Categoria / Formato</th>
                  <th className="p-6 font-medium">Inscritos</th>
                  <th className="p-6 font-medium">Status de Vendas</th>
                  <th className="p-6 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-6 font-bold text-stone-900 max-w-xs truncate" title={course.title}>
                      {course.title}
                    </td>
                    <td className="p-6 text-stone-600 text-sm">
                      <span className="block font-medium">{course.category}</span>
                      <span className="text-stone-400 text-xs">{course.format} • {course.workload}</span>
                    </td>
                    <td className="p-6 text-stone-500 font-medium">
                      {course.students} <span className="text-xs font-normal">alunos</span>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                        course.status === 'Inscrições Abertas' ? 'bg-emerald-100 text-emerald-800' : 
                        course.status === 'Encerrado' ? 'bg-stone-200 text-stone-600' : 
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="p-6 flex items-center justify-end gap-3">
                      <button onClick={() => setView('form')} className="cursor-pointer text-stone-400 hover:text-blue-600 transition-colors" title="Editar Curso">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(course.id)} className="cursor-pointer text-stone-400 hover:text-red-500 transition-colors" title="Excluir Curso">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: FORMULÁRIO DE CADASTRO/EDIÇÃO */}
      {view === 'form' && (
        <form onSubmit={handleSalvar} className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm">
          <h3 className="text-xl font-serif text-stone-900 mb-6 border-b border-stone-100 pb-4">Detalhes do Curso</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">Título do Curso</label>
              <input type="text" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="Ex: Especialização em Fitoterapia" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Categoria</label>
              <select className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all">
                <option>Formação</option>
                <option>Workshops</option>
                <option>Especialização</option>
                <option>Imersões</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Formato das Aulas</label>
              <select className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all">
                <option>100% Online</option>
                <option>Presencial</option>
                <option>Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Carga Horária</label>
              <input type="text" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="Ex: 60h" />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Data de Início / Previsão</label>
              <input type="text" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="Ex: 15 de Março de 2027" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">Descrição Completa</label>
              <textarea rows={5} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none" placeholder="Escreva sobre o que os alunos aprenderão neste curso..."></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">URL da Imagem de Capa</label>
              <input type="url" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="https://..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Status de Venda (Aparece na TAG)</label>
              <select className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-bold text-emerald-800">
                <option>Inscrições Abertas</option>
                <option>Vagas Limitadas</option>
                <option>Últimas Vagas</option>
                <option>Brevemente</option>
                <option>Encerrado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Link do Checkout (Pagamento/Inscrição)</label>
              <input type="url" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="https://..." />
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-stone-100 pt-6">
            <button type="button" onClick={() => setView('list')} className="cursor-pointer px-6 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="cursor-pointer px-8 py-3 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 transition-colors shadow-md">
              Salvar e Publicar Curso
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
