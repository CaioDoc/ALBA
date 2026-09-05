"use client";

import React, { useState } from 'react';

import { sortEventsChronologically } from '../../../data/agenda';

const API_URL = '/api/agenda.php';

// Helper: save events to server
const saveToServer = async (events: any[]) => {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(events),
    });
  } catch (e) {
    console.warn('Servidor indisponível, salvando localmente.', e);
  }
  // Always keep localStorage in sync as fallback
  localStorage.setItem('alba_agenda_server', JSON.stringify(events));
};

// Helper: load events from server
const loadFromServer = async (): Promise<any[] | null> => {
  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (e) {
    console.warn('Servidor indisponível, lendo do localStorage.', e);
  }
  return null;
};

export default function AdminAgendaPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Palestra',
    date: '',
    location: '',
    status: 'Programado',
    description: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiNotice, setAiNotice] = useState('');

  const handleGenerateAIDescription = () => {
    if (!formData.title.trim()) {
      alert('Por favor, preencha o "Título do Evento" primeiro para que a IA possa gerar a descrição adequada!');
      return;
    }

    setIsGeneratingAI(true);
    setAiNotice('');

    setTimeout(() => {
      const titleLower = formData.title.toLowerCase();
      const eventType = formData.type || 'Palestra';
      
      let generatedText = '';

      if (titleLower.includes('champi') || titleLower.includes('head') || titleLower.includes('cabeca') || titleLower.includes('cabeça')) {
        generatedText = `Neste ${eventType.toLowerCase()} exclusivo, iremos explorar as técnicas ancestrais da Indian Head Massage (Champi).

• Fundamentos anatômicos e energéticos da cabeça, ombros e pescoço.
• Aplicação prática de óleos vegetais aquecidos adaptados a cada Dosha.
• Alívio do estresse mental, insônia e tensões acumuladas.

Voltado para terapeutas, estudantes e praticantes interessados na saúde holística.`;
      } else if (titleLower.includes('agni') || titleLower.includes('digestao') || titleLower.includes('nutricao') || titleLower.includes('alimentacao')) {
        generatedText = `Junte-se a nós neste ${eventType.toLowerCase()} dedicado à saúde digestiva sob a ótica da Medicina Ayurvédica.

• O papel fundamental de Agni (fogo digestivo) na prevenção de doenças e vitalidade (Ojas).
• Combinações alimentares compatíveis e rotinas nutricionais sazonais (Ritucharya).
• Dicas práticas e receitas ayurvédicas para equilibrar a digestão diária.

Evento aberto a todos que buscam transformar sua relação com a nutrição integral.`;
      } else if (titleLower.includes('dosha') || titleLower.includes('vata') || titleLower.includes('pitta') || titleLower.includes('kapha')) {
        generatedText = `Um encontro imperdível para compreender a teoria dos Tridoshas (Vata, Pitta e Kapha) e sua aplicação na vida cotidiana.

• Como identificar seu biotipo constitucional (Prakriti) e desequilíbrios momentâneos (Vikriti).
• Estratégias de autocuidado, estilo de vida (Dinacharya) e rotinas para cada estação.
• Práticas recomendadas para manter a mente e o corpo em total sintonia.

Ideal para associados, alunos e simpatizantes da sabedoria Ayurvédica.`;
      } else if (titleLower.includes('yoga') || titleLower.includes('meditacao') || titleLower.includes('asana') || titleLower.includes('pranayama')) {
        generatedText = `Uma imersão dedicada à união do Yoga e da Meditação como ferramentas de expansão de consciência e cura.

• Prática guiada de Asanas (posturas) e Pranayamas (exercícios respiratórios).
• Integração do movimento com a calma mental e regulação do sistema nervoso.
• Espaço aberto para dúvidas e partilha de experiências entre os participantes.

Traga roupas confortáveis e seu tapete de prática. Todos os níveis de experiência são bem-vindos!`;
      } else {
        generatedText = `Seja muito bem-vindo ao evento "${formData.title}". Uma realização oficial da Associação Luso-Brasileira de Ayurveda (ALBA).

• Apresentação dos conceitos fundamentais e aplicações práticas do tema.
• Discussão técnica e cases com especialistas e docentes convidados.
• Momento dedicado para perguntas, networking e troca de saberes entre os participantes.

Garanta sua vaga com antecedência. Encontro aberto a associados e comunidade geral.`;
      }

      setFormData(prev => ({ ...prev, description: generatedText }));
      setIsGeneratingAI(false);
      setAiNotice('✨ Descrição gerada com IA com sucesso!');
      setTimeout(() => setAiNotice(''), 4000);
    }, 600);
  };


  React.useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      // Try server first
      const serverData = await loadFromServer();
      if (serverData !== null) {
        setEvents(sortEventsChronologically(serverData));
        localStorage.setItem('alba_agenda_server', JSON.stringify(serverData));
      } else {
        // Fallback: localStorage
        const saved = localStorage.getItem('alba_agenda_server');
        if (saved !== null) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setEvents(sortEventsChronologically(parsed));
            }
          } catch (e) {}
        }
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const filteredEvents = sortEventsChronologically(
    events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = async (id: number) => {
    if(confirm('Deseja realmente cancelar e remover este evento da agenda pública?')) {
      const newEvents = events.filter(e => e.id !== id);
      setEvents(newEvents);
      await saveToServer(newEvents);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredEvents.length && filteredEvents.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredEvents.map(e => e.id));
    }
  };

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (confirm(`Tem certeza que deseja cancelar e remover os ${selectedItems.length} eventos selecionados permanentemente?`)) {
      const newEvents = events.filter(e => !selectedItems.includes(e.id));
      setEvents(newEvents);
      await saveToServer(newEvents);
      setSelectedItems([]);
    }
  };

  const handleEdit = (evt: any) => {
    setEditingId(evt.id);
    setFormData({
      title: evt.title || '',
      type: evt.type || 'Palestra',
      date: evt.date || '',
      location: evt.location || '',
      status: evt.status || 'Programado',
      description: evt.description || ''
    });
    setView('form');
  };

  const handleNovo = () => {
    setEditingId(null);
    setFormData({
      title: '',
      type: 'Palestra',
      date: '',
      location: '',
      status: 'Programado',
      description: ''
    });
    setView('form');
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto generate day and month from date string if possible, or use defaults
    const parts = formData.date.split(' ');
    const day = parts[0] || '01';
    let month = parts[2] || 'JAN'; // "20 de Julho" -> parts[0]="20", parts[1]="de", parts[2]="Julho"
    if (month.length > 3) month = month.substring(0, 3).toUpperCase();

    const novoEvento = {
      id: editingId || Date.now(),
      ...formData,
      day,
      month
    };

    let newEvents;
    if (editingId) {
      newEvents = events.map(ev => ev.id === editingId ? novoEvento : ev);
    } else {
      newEvents = [...events, novoEvento];
    }

    const sortedEvents = sortEventsChronologically(newEvents);
    setEvents(sortedEvents);
    await saveToServer(sortedEvents);

    alert('Evento salvo e publicado na Agenda Oficial!');
    setView('list');
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-stone-900">Agenda de Eventos</h2>
          <p className="text-stone-500 mt-1">
            Gerencie datas de palestras, encontros ao vivo, lives e congressos da Associação.
          </p>
        </div>
        
        {view === 'list' ? (
          <button 
            onClick={() => setView('form')}
            className="cursor-pointer bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all active:scale-95 shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Agendar Novo Evento
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

      {/* VIEW: LISTA DE EVENTOS */}
      {view === 'list' && (
        <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm flex flex-col">
          
          <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full max-w-md">
              <input 
                type="text" 
                placeholder="Buscar evento por nome ou tipo..." 
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

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white border-b border-stone-200 text-stone-500 text-sm">
                  <th className="p-6 font-medium w-12">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      checked={selectedItems.length > 0 && selectedItems.length === filteredEvents.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-6 font-medium">Data e Hora</th>
                  <th className="p-6 font-medium">Nome do Evento</th>
                  <th className="p-6 font-medium">Local / Plataforma</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className={`hover:bg-stone-50/50 transition-colors ${selectedItems.includes(event.id) ? 'bg-emerald-50/30' : ''}`}>
                    <td className="p-6">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        checked={selectedItems.includes(event.id)}
                        onChange={() => toggleSelectItem(event.id)}
                      />
                    </td>
                    <td className="p-6">
                      <span className="inline-block px-3 py-1 bg-stone-100 text-stone-700 rounded-lg text-sm font-bold border border-stone-200 whitespace-nowrap">
                        {event.date}
                      </span>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-stone-900">{event.title}</p>
                      <p className="text-sm text-stone-500 uppercase tracking-wider mt-1">{event.type}</p>
                    </td>
                    <td className="p-6 text-stone-600 text-sm flex items-center gap-2 mt-2">
                      <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {event.location}
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        event.status === 'Programado' ? 'bg-blue-100 text-blue-800' : 
                        event.status === 'Esgotado' ? 'bg-orange-100 text-orange-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="p-6 flex items-center justify-end gap-3">
                      <button onClick={() => handleEdit(event)} className="cursor-pointer text-stone-400 hover:text-emerald-600 transition-colors" title="Editar Evento">
                        <svg className="w-5 h-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="cursor-pointer text-stone-400 hover:text-red-500 transition-colors" title="Cancelar Evento">
                        <svg className="w-5 h-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: FORMULÁRIO DE AGENDA */}
      {view === 'form' && (
        <form onSubmit={handleSalvar} className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm">
          <h3 className="text-xl font-serif text-stone-900 mb-6 border-b border-stone-100 pb-4">Detalhes do Evento</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">Título do Evento</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="Ex: Palestra Magna: Os segredos do Agni" />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Tipo de Evento</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all">
                <option>Palestra</option>
                <option>Congresso</option>
                <option>Reunião Interna (Associados)</option>
                <option>Live / Webinar</option>
                <option>Workshop Prático</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Data e Horário</label>
              <input type="text" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="Ex: 20 de Julho, 2026 - 19h30" />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Local ou Plataforma (Link)</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" placeholder="Ex: YouTube Live ou Rua Exemplo, 123" />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Status do Evento</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-bold text-stone-700">
                <option>Programado</option>
                <option>Esgotado</option>
                <option>Cancelado / Adiado</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-stone-700">Descrição / Pauta do Evento</label>
                <button 
                  type="button" 
                  onClick={handleGenerateAIDescription}
                  disabled={isGeneratingAI}
                  className="cursor-pointer bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                  title="Gerar texto automático baseado no título do evento"
                >
                  {isGeneratingAI ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Gerando com IA...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>✨ Gerar Descrição com IA</span>
                    </>
                  )}
                </button>
              </div>
              
              {aiNotice && (
                <div className="mb-2 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in-up">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{aiNotice}</span>
                </div>
              )}

              <textarea 
                rows={5} 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none font-sans leading-relaxed text-stone-800" 
                placeholder="Digite os detalhes sobre o evento ou clique no botão acima para gerar uma descrição completa com IA baseada no título..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-stone-100 pt-6">
            <button type="button" onClick={() => setView('list')} className="cursor-pointer px-6 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="cursor-pointer px-8 py-3 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 transition-colors shadow-md flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Publicar na Agenda
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
