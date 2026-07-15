"use client";

import React, { useState } from 'react';

// Dados simulados dos terapeutas/associados
const initialAssociates = [
  { id: 1, name: 'Dra. Aline Carvalho', role: 'Médica Ayurvédica', registry: 'ALBA-SP 1024', status: 'Ativo', email: 'aline@exemplo.com' },
  { id: 2, name: 'Thiago Mendes', role: 'Terapeuta Corporal', registry: 'ALBA-RJ 2155', status: 'Ativo', email: 'thiago@exemplo.com' },
  { id: 3, name: 'Julia Santini', role: 'Consultora de Bem-estar', registry: 'ALBA-MG 3012', status: 'Pendente', email: 'julia@exemplo.com' },
  { id: 4, name: 'Carlos Eduardo', role: 'Estudante', registry: '-', status: 'Inativo', email: 'carlos@exemplo.com' },
];

export default function AdminAssociadosPage() {
  const [associates, setAssociates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Médico(a) Ayurvédico',
    registry: '',
    bio: '',
    status: 'Ativo',
    location: 'Online', // Default added since TherapistCard uses it
    avatar: 'https://images.unsplash.com/photo-1594824406951-31823095b27b?q=80&w=200&auto=format&fit=crop',
    skills: [] as any[]
  });

  React.useEffect(() => {
    const saved = localStorage.getItem('alba_associados');
    if (saved) {
      setAssociates(JSON.parse(saved));
    } else {
      const formattedInitial = initialAssociates.map(a => ({
        ...a,
        id: 'prof-' + a.id,
        location: 'Não informada',
        avatar: 'https://images.unsplash.com/photo-1594824406951-31823095b27b?q=80&w=200&auto=format&fit=crop',
        bio: '',
        skills: [{ id: '1', name: a.role, slug: 'geral' }]
      }));
      setAssociates(formattedInitial);
      localStorage.setItem('alba_associados', JSON.stringify(formattedInitial));
    }
  }, []);

  // Filtro de busca na tabela
  const filteredAssociates = associates.filter(assoc => {
    const matchesSearch = assoc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          assoc.registry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || assoc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if(confirm('Tem certeza que deseja suspender ou remover este associado?')) {
      const newAssoc = associates.filter(a => a.id !== id);
      setAssociates(newAssoc);
      localStorage.setItem('alba_associados', JSON.stringify(newAssoc));
    }
  };

  const handleEdit = (assoc: any) => {
    setEditingId(assoc.id);
    setFormData({
      name: assoc.name || '',
      email: assoc.email || '',
      role: assoc.role || 'Médico(a) Ayurvédico',
      registry: assoc.registry || '',
      bio: assoc.bio || '',
      status: assoc.status || 'Ativo',
      location: assoc.location || 'Online',
      avatar: assoc.avatar || 'https://images.unsplash.com/photo-1594824406951-31823095b27b?q=80&w=200&auto=format&fit=crop',
      skills: assoc.skills || []
    });
    setView('form');
  };

  const handleNovo = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      role: 'Médico(a) Ayurvédico',
      registry: '',
      bio: '',
      status: 'Ativo',
      location: 'Online',
      avatar: 'https://images.unsplash.com/photo-1594824406951-31823095b27b?q=80&w=200&auto=format&fit=crop',
      skills: []
    });
    setView('form');
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Assegura que haja ao menos uma skill baseada na role
    const skills = formData.skills.length > 0 ? formData.skills : [{ id: Date.now().toString(), name: formData.role, slug: formData.role.toLowerCase().replace(/ /g, '-') }];

    const novoAssoc = {
      id: editingId || 'prof-' + Date.now(),
      ...formData,
      skills
    };

    let newAssoc;
    if (editingId) {
      newAssoc = associates.map(a => a.id === editingId ? novoAssoc : a);
    } else {
      newAssoc = [novoAssoc, ...associates];
    }

    setAssociates(newAssoc);
    localStorage.setItem('alba_associados', JSON.stringify(newAssoc));

    alert('Dados do associado salvos e atualizados no Diretório Público!');
    setView('list');
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-stone-900">Gestão de Associados</h2>
          <p className="text-stone-500 mt-1">
            Aprove credenciamentos, edite perfis e controle quem aparece na vitrine de profissionais.
          </p>
        </div>
        
        {view === 'list' ? (
          <button 
            onClick={handleNovo}
            className="cursor-pointer bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all active:scale-95 shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Cadastrar Profissional
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

      {view === 'list' && (
        <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm flex flex-col">
          
          {/* Barra de Busca e Filtros */}
          <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-stone-50/50">
            <div className="relative w-full sm:max-w-md">
              <input 
                type="text" 
                placeholder="Buscar por nome ou número de registro..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <svg className="w-5 h-5 text-stone-400 absolute left-4 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
              <button onClick={() => setFilterStatus('Todos')} className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filterStatus === 'Todos' ? 'bg-emerald-50 text-emerald-700' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}>Todos</button>
              <button onClick={() => setFilterStatus('Ativo')} className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filterStatus === 'Ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}>Ativos</button>
              <button onClick={() => setFilterStatus('Pendente')} className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filterStatus === 'Pendente' ? 'bg-orange-50 text-orange-700' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}>Pendentes</button>
              <button onClick={() => setFilterStatus('Inativo')} className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filterStatus === 'Inativo' ? 'bg-red-50 text-red-700' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}>Inativos</button>
            </div>
          </div>

          {/* Tabela de Associados */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white border-b border-stone-200 text-stone-500 text-sm">
                  <th className="p-6 font-medium">Profissional</th>
                  <th className="p-6 font-medium">Categoria / Papel</th>
                  <th className="p-6 font-medium">Registro (ALBA)</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredAssociates.map((assoc) => (
                  <tr key={assoc.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-stone-200 flex-shrink-0 flex items-center justify-center font-serif text-stone-600 font-bold overflow-hidden">
                          {assoc.avatar && assoc.avatar.startsWith('http') ? <img src={assoc.avatar} className="w-full h-full object-cover" /> : assoc.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-stone-900">{assoc.name}</p>
                          <p className="text-sm text-stone-500">{assoc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-stone-600 text-sm font-medium">{assoc.role}</td>
                    <td className="p-6 text-stone-500 text-sm font-mono">{assoc.registry}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                        assoc.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 
                        assoc.status === 'Pendente' ? 'bg-orange-100 text-orange-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${assoc.status === 'Ativo' ? 'bg-emerald-500' : assoc.status === 'Pendente' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                        {assoc.status}
                      </span>
                    </td>
                    <td className="p-6 flex items-center justify-end gap-3">
                      <button onClick={() => handleEdit(assoc)} className="cursor-pointer text-stone-400 hover:text-blue-600 transition-colors" title="Editar Perfil">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(assoc.id)} className="cursor-pointer text-stone-400 hover:text-red-500 transition-colors" title="Suspender Registro">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAssociates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-stone-500">Nenhum associado encontrado com esse filtro.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'form' && (
        <form onSubmit={handleSalvar} className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm">
          <h3 className="text-xl font-serif text-stone-900 mb-6 border-b border-stone-100 pb-4">Ficha do Associado</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Nome Completo</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="Ex: Dra. Julia Santini" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">E-mail Principal</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="email@exemplo.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Categoria Profissional</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all">
                <option>Médico(a) Ayurvédico</option>
                <option>Terapeuta Corporal</option>
                <option>Consultor(a) de Bem-estar</option>
                <option>Estudante</option>
                <option>Terapeuta e Doula</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Número de Registro (ALBA)</label>
              <input type="text" value={formData.registry} onChange={e => setFormData({...formData, registry: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-mono uppercase" placeholder="ALBA-SP 0000" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">Biografia (Aparecerá no Diretório Público)</label>
              <textarea rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none" placeholder="Breve resumo sobre a formação e especialidades do terapeuta..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Local de Atendimento</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="Ex: São Paulo, SP & Online" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">URL da Foto de Perfil</label>
              <input type="url" value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Status da Conta</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-bold">
                <option value="Ativo">Ativo (Exibir no Site)</option>
                <option value="Pendente">Pendente de Aprovação</option>
                <option value="Inativo">Inativo / Suspenso</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-stone-100 pt-6">
            <button type="button" onClick={() => setView('list')} className="cursor-pointer px-6 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="cursor-pointer px-8 py-3 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 transition-colors shadow-md">
              Salvar Perfil
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
