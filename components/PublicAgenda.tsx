"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { EventDrawer } from './EventDrawer';

interface Event {
  id: number;
  day: string;
  month: string;
  title: string;
  location: string;
  type: string;
  date?: string;
  description?: string;
  status?: string;
}

export const PublicAgenda = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('alba_agenda_v2');
    if (saved) {
      setUpcomingEvents(JSON.parse(saved).filter((e: any) => e.status !== 'Cancelado / Adiado'));
    } else {
      setUpcomingEvents([]);
      localStorage.setItem('alba_agenda_v2', JSON.stringify([]));
    }
  }, []);

  return (
    <section className="py-24 px-4 bg-white border-t border-stone-100 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/3 flex flex-col items-start">
          <p className="text-emerald-700 font-bold mb-4 uppercase tracking-widest text-sm">Próximos Encontros</p>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-6">Agenda Oficial de Eventos</h2>
          <p className="text-stone-500 text-lg mb-8">Confira a programação de palestras, workshops e congressos anuais da ALBA.</p>
          <Link href="/associe-se" className="cursor-pointer bg-stone-100 text-stone-700 px-8 py-4 rounded-2xl font-bold hover:bg-stone-200 transition-all flex items-center gap-2">
            Entrar em Contato
          </Link>
        </div>

        <div className="lg:w-2/3 flex flex-col">
          {upcomingEvents.length > 0 ? (
            <div className="flex flex-col gap-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="group flex flex-col sm:flex-row items-center gap-6 p-6 bg-stone-50 rounded-[2rem] border border-stone-100 hover:shadow-xl hover:bg-white transition-all">
                  <div className="flex-shrink-0 w-20 h-24 bg-white rounded-2xl border border-stone-200 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-50 w-full text-center py-1.5 border-b border-stone-100">{event.month}</span>
                    <span className="text-3xl font-serif text-stone-900 flex-1 flex items-center justify-center mt-1">{event.day}</span>
                  </div>
                  <div className="flex-1 w-full text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-stone-400 uppercase">{event.type}</span>
                      {event.status && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          event.status === 'Confirmado' ? 'bg-emerald-100 text-emerald-800' :
                          event.status === 'Esgotado' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {event.status}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-serif text-stone-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-stone-500 font-medium mb-1">{event.location}</p>
                    {event.description && (
                      <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <button onClick={() => setSelectedEvent(event)} className="cursor-pointer w-full sm:w-auto text-center bg-stone-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all whitespace-nowrap">
                    Garantir Vaga
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Container Vazio / Empty State */
            <div className="w-full bg-stone-50 border border-dashed border-stone-300 rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
              <div className="w-16 h-16 bg-emerald-100/60 text-emerald-800 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif text-stone-900 mb-3">
                Ainda não há eventos cadastrados no calendário
              </h3>
              <p className="text-stone-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Novas datas de palestras, encontros ao vivo, workshops e congressos serão anunciadas em breve. Fique atento às nossas redes ou entre em contato com nossa equipe.
              </p>
              <Link href="/associe-se" className="cursor-pointer inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-7 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-md active:scale-95">
                <span>Receber Notificações</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
      <EventDrawer event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} />
    </section>
  );
};
