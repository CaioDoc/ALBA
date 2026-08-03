"use client";

import React, { useState, useEffect } from 'react';
import { initialCourses as scrapedCourses } from '../../../data/cursos.js';

export default function AdminCursosPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Formação',
    format: '100% Online',
    workload: '',
    date: '',
    description: '',
    image: '',
    status: 'Inscrições Abertas',
    price: '',
    featured: false
  });

  const handleEdit = (course: any) => {
    setFormData({
      title: course.title || '',
      category: course.category || 'Formação',
      format: course.format || '100% Online',
      workload: course.workload || '',
      date: course.date || '',
      description: course.description || '',
      image: course.image || '',
      status: course.status || 'Inscrições Abertas',
      price: course.price || '',
      featured: course.featured || false
    });
    setView('form');
  };

  const handleNovo = () => {
    setFormData({
      title: '',
      category: 'Formação',
      format: '100% Online',
      workload: '',
      date: '',
      description: '',
      image: '',
      status: 'Inscrições Abertas',
      price: '',
      featured: false
    });
    setView('form');
  };

  useEffect(() => {
    const savedCourses = localStorage.getItem('alba_cursos_v31');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      setCourses(scrapedCourses);
      localStorage.setItem('alba_cursos_v31', JSON.stringify(scrapedCourses));
    }
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if(confirm('Tem certeza que deseja deletar ou suspender este curso permanentemente?')) {
      const newCourses = courses.filter(c => c.id !== id);
      setCourses(newCourses);
      localStorage.setItem('alba_cursos_v31', JSON.stringify(newCourses));
    }
  };

  const toggleFeatured = (id: number) => {
    const newCourses = courses.map(c => c.id === id ? { ...c, featured: !c.featured } : c);
    setCourses(newCourses);
    localStorage.setItem('alba_cursos_v31', JSON.stringify(newCourses));
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredCourses.length && filteredCourses.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredCourses.map(c => c.id));
    }
  };

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (confirm(`Tem certeza que deseja deletar os ${selectedItems.length} cursos selecionados permanentemente?`)) {
      const newCourses = courses.filter(c => !selectedItems.includes(c.id));
      setCourses(newCourses);
      localStorage.setItem('alba_cursos_v31', JSON.stringify(newCourses));
      setSelectedItems([]);
    }
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simplification: We don't have an editingId state, so we check if course exists by title
    const existingIndex = courses.findIndex(c => c.title === formData.title);
    
    let newCourses;
    if (existingIndex >= 0) {
      // Update
      const updatedCourses = [...courses];
      updatedCourses[existingIndex] = { ...updatedCourses[existingIndex], ...formData };
      newCourses = updatedCourses;
    } else {
      // Create
      const novoCurso = {
        id: Date.now(),
        ...formData,
        students: 0 // Default value
      };
      newCourses = [novoCurso, ...courses];
    }
    
    setCourses(newCourses);
    localStorage.setItem('alba_cursos_v31', JSON.stringify(newCourses));
    
    alert('Curso salvo e publicado com sucesso!');
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
            onClick={handleNovo}
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
          
          {/* Barra de Busca e Ações em Massa */}
          <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
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
            
            {selectedItems.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-red-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Deletar Selecionados ({selectedItems.length})
              </button>
            )}
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white border-b border-stone-200 text-stone-500 text-sm">
                  <th className="p-6 font-medium w-12">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      checked={selectedItems.length > 0 && selectedItems.length === filteredCourses.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-6 font-medium">Nome do Curso</th>
                  <th className="p-6 font-medium text-center">Destaque</th>
                  <th className="p-6 font-medium">Categoria / Formato</th>
                  <th className="p-6 font-medium">Inscritos</th>
                  <th className="p-6 font-medium">Status de Vendas</th>
                  <th className="p-6 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className={`hover:bg-stone-50/50 transition-colors ${selectedItems.includes(course.id) ? 'bg-emerald-50/30' : ''}`}>
                    <td className="p-6">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        checked={selectedItems.includes(course.id)}
                        onChange={() => toggleSelectItem(course.id)}
                      />
                    </td>
                    <td className="p-6 font-bold text-stone-900 max-w-xs truncate" title={course.title}>
                      {course.title}
                    </td>
                    <td className="p-6 text-center">
                      <button onClick={() => toggleFeatured(course.id)} className={`cursor-pointer transition-colors ${course.featured ? 'text-amber-400 hover:text-amber-500' : 'text-stone-300 hover:text-stone-400'}`} title={course.featured ? 'Remover Destaque' : 'Marcar como Destaque'}>
                        <svg className="w-6 h-6 inline-block" fill={course.featured ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                      </button>
                    </td>
                    <td className="p-6 text-stone-600 text-sm">
                      <span className="block font-medium">{course.category}</span>
                      <span className="text-stone-400 text-sm">{course.format} • {course.workload}</span>
                    </td>
                    <td className="p-6 text-stone-500 font-medium">
                      {course.students || 0} <span className="text-xs font-normal">alunos</span>
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
                      <button onClick={() => handleEdit(course)} className="cursor-pointer text-stone-400 hover:text-blue-600 transition-colors" title="Editar Curso">
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
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="Ex: Especialização em Fitoterapia" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Categoria</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all">
                <option>Formação</option>
                <option>Workshops</option>
                <option>Especialização</option>
                <option>Imersões</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Formato das Aulas</label>
              <select value={formData.format} onChange={e => setFormData({...formData, format: e.target.value})} className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all">
                <option>100% Online</option>
                <option>Presencial</option>
                <option>Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Carga Horária</label>
              <input type="text" value={formData.workload} onChange={e => setFormData({...formData, workload: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="Ex: 60h" />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Data de Início / Previsão</label>
              <input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="Ex: 15 de Março de 2027" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">Descrição Completa</label>
              <textarea rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none" placeholder="Escreva sobre o que os alunos aprenderão neste curso..."></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">URL da Imagem de Capa</label>
              <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="https://..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Status de Venda (Aparece na TAG)</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-bold text-emerald-800">
                <option>Inscrições Abertas</option>
                <option>Vagas Limitadas</option>
                <option>Últimas Vagas</option>
                <option>Brevemente</option>
                <option>Encerrado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Preço (Opcional)</label>
              <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="Ex: €200 ou Grátis" />
            </div>

            <div className="md:col-span-2 flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl mt-4">
              <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 cursor-pointer" />
              <label htmlFor="featured" className="text-sm font-bold text-amber-900 cursor-pointer">Destacar Curso Especialmente</label>
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
