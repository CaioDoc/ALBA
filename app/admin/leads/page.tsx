"use client";

import React, { useState } from 'react';

// Dados simulados vindos dos formulários do site
const initialLeads = [
  { 
    id: 1, 
    name: 'Mariana Silva', 
    email: 'mariana@exemplo.com', 
    phone: '+55 11 99999-0000', 
    type: 'Associe-se', 
    category: 'Estudante',
    date: 'Hoje, 10:42', 
    status: 'Novo',
    message: 'Olá! Sou estudante do segundo ano de Naturopatia e gostaria de saber quais são os requisitos exatos para me associar à ALBA na categoria de estudante. Vocês oferecem descontos em cursos para associados?' 
  },
  { 
    id: 2, 
    name: 'João Pedro Costa', 
    email: 'joao.terapeuta@exemplo.com', 
    phone: '+351 912 345 678', 
    type: 'Associe-se', 
    category: 'Profissional Formado',
    date: 'Ontem, 15:30', 
    status: 'Lido',
    message: 'Atuo como terapeuta ayurvédico há 5 anos em Lisboa e gostaria de fazer o credenciamento europeu através da ALBA. Seguem meus dados para contato.' 
  },
  { 
    id: 3, 
    name: 'Carla Mendes', 
    email: 'carla.m@exemplo.com', 
    phone: '+55 21 98888-1111', 
    type: 'Contato / Dúvida', 
    category: '-',
    date: '20 Jun 2026', 
    status: 'Respondido',
    message: 'Gostaria de saber se a Formação de Março será 100% online ou se haverá necessidade de deslocamento para a prática presencial. Obrigada!' 
  },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [filter, setFilter] = useState('Todos');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  React.useEffect(() => {
    const savedLeads = localStorage.getItem('alba_leads');
    if (savedLeads) {
      const parsed = JSON.parse(savedLeads);
      setLeads(parsed);
      setSelectedLead(parsed[0]);
    } else {
      setLeads(initialLeads);
      setSelectedLead(initialLeads[0]);
      localStorage.setItem('alba_leads', JSON.stringify(initialLeads));
    }
  }, []);

  const filteredLeads = leads.filter(lead => {
    if (filter === 'Novos') return lead.status === 'Novo';
    if (filter === 'Associe-se') return lead.type === 'Associe-se';
    return true;
  });

  const markAsRead = (lead: typeof initialLeads[0]) => {
    setSelectedLead(lead);
    if (lead.status === 'Novo') {
      const updatedLeads = leads.map(l => l.id === lead.id ? { ...l, status: 'Lido' } : l);
      setLeads(updatedLeads);
    }
  };

  const markAsReplied = () => {
    const updatedLeads = leads.map(l => l.id === selectedLead.id ? { ...l, status: 'Respondido' } : l);
    setLeads(updatedLeads);
    setSelectedLead({ ...selectedLead, status: 'Respondido' });
    alert('Status atualizado para Respondido!');
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (confirm(`Tem certeza que deseja deletar os ${selectedItems.length} leads selecionados permanentemente?`)) {
      const newLeads = leads.filter(l => !selectedItems.includes(l.id));
      setLeads(newLeads);
      localStorage.setItem('alba_leads', JSON.stringify(newLeads));
      setSelectedItems([]);
      // Se o selecionado estava entre os deletados, remove do painel direito
      if (selectedLead && selectedItems.includes(selectedLead.id)) {
        setSelectedLead(null);
      }
    }
  };

  const toggleSelectItem = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Previne abrir o lead quando clica no checkbox
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up h-[calc(100vh-8rem)] flex flex-col">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 flex-shrink-0">
        <div>
          <h2 className="text-3xl font-serif text-stone-900">Caixa de Entrada</h2>
          <p className="text-stone-500 mt-1">
            Gerencie os pedidos de associação e mensagens recebidas pelo site.
          </p>
        </div>
        
        <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-stone-200 shadow-sm">
          <button onClick={() => setFilter('Todos')} className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'Todos' ? 'bg-stone-100 text-stone-800' : 'text-stone-500 hover:bg-stone-50'}`}>Todos</button>
          <button onClick={() => setFilter('Novos')} className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'Novos' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-500 hover:bg-stone-50'}`}>Não Lidos</button>
          <button onClick={() => setFilter('Associe-se')} className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'Associe-se' ? 'bg-blue-50 text-blue-800' : 'text-stone-500 hover:bg-stone-50'}`}>Pedidos de Associação</button>
        </div>
      </div>

      {/* Interface Dividida (Lista vs Leitura) */}
      <div className="flex-1 bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm flex min-h-0">
        
        {/* Coluna da Esquerda: Lista de Mensagens */}
        <div className="w-full md:w-1/3 lg:w-[350px] border-r border-stone-100 flex flex-col bg-stone-50/30">
          
          {selectedItems.length > 0 && (
            <div className="p-3 border-b border-stone-100 bg-red-50 flex items-center justify-between">
              <span className="text-sm font-bold text-red-800">{selectedItems.length} selecionados</span>
              <button 
                onClick={handleBulkDelete}
                className="cursor-pointer bg-white text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-red-200"
              >
                Deletar
              </button>
            </div>
          )}

          <div className="overflow-y-auto hide-scrollbar flex-1 p-4 space-y-3">
            {filteredLeads.map((lead) => (
              <div 
                key={lead.id}
                onClick={() => markAsRead(lead)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  selectedLead.id === lead.id 
                    ? 'bg-white border-emerald-200 shadow-md ring-1 ring-emerald-500/10' 
                    : 'bg-white border-stone-100 shadow-sm hover:border-emerald-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
                      checked={selectedItems.includes(lead.id)}
                      onClick={(e) => toggleSelectItem(e, lead.id)}
                      readOnly
                    />
                    <p className={`text-sm truncate pr-2 ${lead.status === 'Novo' ? 'font-bold text-stone-900' : 'font-medium text-stone-700'}`}>
                      {lead.name}
                    </p>
                  </div>
                  <p className="text-xs text-stone-400 whitespace-nowrap">{lead.date}</p>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    lead.type === 'Associe-se' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {lead.type}
                  </span>
                  {lead.status === 'Novo' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                </div>
                
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {lead.message}
                </p>
              </div>
            ))}
            {filteredLeads.length === 0 && (
              <p className="text-center text-sm text-stone-400 mt-8">Nenhuma mensagem encontrada.</p>
            )}
          </div>
        </div>

        {/* Coluna da Direita: Painel de Leitura */}
        <div className="hidden md:flex flex-1 flex-col bg-white">
          {selectedLead ? (
            <>
              {/* Header do Email */}
              <div className="p-8 border-b border-stone-100 flex-shrink-0">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-serif text-stone-900 mb-2">{selectedLead.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-stone-500">
                      <a href={`mailto:${selectedLead.email}`} className="cursor-pointer hover:text-emerald-700 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {selectedLead.email}
                      </a>
                      <span>•</span>
                      <a href={`tel:${selectedLead.phone}`} className="cursor-pointer hover:text-emerald-700 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {selectedLead.phone}
                      </a>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-stone-400 mb-2">{selectedLead.date}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedLead.status === 'Respondido' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {selectedLead.status}
                    </span>
                  </div>
                </div>

                {/* Badge de Contexto */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-stone-100 text-stone-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">Origem: Formulário &quot;{selectedLead.type}&quot;</p>
                    {selectedLead.category !== '-' && (
                      <p className="text-xs text-stone-500">Categoria informada: {selectedLead.category}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Corpo da Mensagem */}
              <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
                <p className="text-stone-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {selectedLead.message}
                </p>
              </div>

              {/* Barra de Ferramentas / Resposta */}
              <div className="p-6 border-t border-stone-100 bg-stone-50 flex items-center gap-4 flex-shrink-0">
                <a 
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="cursor-pointer flex-1 bg-[#008069] text-white py-3.5 rounded-xl font-bold hover:bg-[#016B58] transition-all active:scale-[0.98] shadow-md flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.031 2.007a9.96 9.96 0 00-7.07 2.926 9.96 9.96 0 00-2.927 7.07c-.004 1.764.444 3.498 1.302 5.02L2.007 22l5.12-1.332a9.932 9.932 0 004.904 1.291h.005c5.503 0 9.975-4.476 9.978-9.978a9.96 9.96 0 00-2.927-7.07 9.957 9.957 0 00-7.056-2.904zm.005 16.29a8.212 8.212 0 01-4.186-1.143l-.3-.178-3.112.81.828-3.033-.195-.311a8.216 8.216 0 01-1.258-4.385c-.002-4.542 3.696-8.24 8.24-8.242a8.217 8.217 0 015.826 2.41 8.216 8.216 0 012.408 5.827c-.002 4.542-3.696 8.24-8.24 8.241z" clipRule="evenodd" /></svg>
                  Responder no WhatsApp
                </a>
                <a 
                  href={`mailto:${selectedLead.email}`}
                  className="cursor-pointer flex-1 bg-white border border-stone-200 text-stone-700 py-3.5 rounded-xl font-bold hover:bg-stone-50 transition-all active:scale-[0.98] shadow-sm flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Responder por E-mail
                </a>
                
                {selectedLead.status !== 'Respondido' && (
                  <button onClick={markAsReplied} className="cursor-pointer px-4 py-3 text-stone-500 hover:text-emerald-700 font-bold text-sm hover:bg-emerald-50 rounded-xl transition-colors">
                    Marcar como Resolvido
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-stone-400 flex-col gap-4">
              <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <p>Selecione uma mensagem na lista para ler.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
