"use client";

import React, { useState } from 'react';

// Dados simulados da agenda de eventos
const initialEvents = [
  { id: 1, title: 'Congresso Luso-Brasileiro de Ayurveda', date: '12 a 15 de Novembro, 2026', location: 'Lisboa, Portugal (Transmissão Online)', type: 'Congresso', status: 'Confirmado' },
  { id: 2, title: 'Palestra Gratuita: Ayurveda e Saúde Mental', date: '20 de Julho, 2026 - 19h30', location: 'YouTube Live', type: 'Palestra', status: 'Confirmado' },
  { id: 3, title: 'Encontro Mensal de Associados (Networking)', date: '05 de Agosto, 2026 - 18h00', location: 'Google Meet', type: 'Reunião Interna', status: 'Confirmado' },
  { id: 4, title: 'Workshop de Massagem Indian Head (Champi)', date: '10 de Setembro, 2026', location: 'Sede São Paulo, SP', type: 'Workshop Prático', status: 'Esgotado' },
];

export default function AdminAgendaPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');

  const [formData, setFormData] = useState({
    title: '',
    type: 'Palestra',
    date: '', // Will be parsed to day/month for public view
    location: '',
    status: 'Confirmado',
    description: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('alba_agenda');
    if (saved) {
      setEvents(JSON.parse(saved));
    } else {
      setEvents(initialEvents);
      localStorage.setItem('alba_agenda', JSON.stringify(initialEvents));
    }
  }, []);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if(confirm('Deseja realmente cancelar e remover este evento da agenda pública?')) {
      const newEvents = events.filter(e => e.id !== id);
      setEvents(newEvents);
      localStorage.setItem('alba_agenda', JSON.stringify(newEvents));
    }
  };

  const handleEdit = (evt: any) => {
    setEditingId(evt.id);
    setFormData({
      title: evt.title || '',
      type: evt.type || 'Palestra',
      date: evt.date || '',
      location: evt.location || '',
      status: evt.status || 'Confirmado',
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
      status: 'Confirmado',
      description: ''
    });
    setView('form');
  };

  const handleSalvar = (e: React.FormEvent) => {
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

    setEvents(newEvents);
    localStorage.setItem('alba_agenda', JSON.stringify(newEvents));

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
          
          <div className="p-6 border-b border-stone-100 bg-stone-50/50">
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white border-b border-stone-200 text-stone-500 text-sm">
                  <th className="p-6 font-medium">Data e Hora</th>
                  <th className="p-6 font-medium">Nome do Evento</th>
                  <th className="p-6 font-medium">Local / Plataforma</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-stone-50/50 transition-colors">
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
                        event.status === 'Confirmado' ? 'bg-blue-100 text-blue-800' : 
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
                <option>Confirmado</option>
                <option>Esgotado</option>
                <option>Cancelado / Adiado</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">Descrição / Pauta do Evento</label>
              <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none" placeholder="Detalhes sobre quem vai falar, cronograma, etc..."></textarea>
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
