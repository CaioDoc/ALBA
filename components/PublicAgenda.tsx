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
}

const upcomingEvents: Event[] = [
  { id: 1, day: '20', month: 'JUL', title: 'Palestra Gratuita: Ayurveda e Saúde Mental', location: 'Transmissão via YouTube Live', type: 'Palestra Online' },
  { id: 2, day: '10', month: 'SET', title: 'Workshop de Massagem Indian Head (Champi)', location: 'Sede da ALBA - São Paulo, SP', type: 'Prática Presencial' },
];

export const PublicAgenda = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <section className="py-24 px-4 bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/3 flex flex-col items-start">
          <p className="text-emerald-700 font-bold mb-4 uppercase tracking-widest text-sm">Próximos Encontros</p>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-6">Agenda Oficial de Eventos</h2>
          <p className="text-stone-500 text-lg mb-8">Participe de nossas palestras e congressos anuais.</p>
          <Link href="/agenda" className="cursor-pointer bg-stone-100 text-stone-700 px-8 py-4 rounded-2xl font-bold hover:bg-stone-200 transition-all flex items-center gap-2">
            Ver Calendário Completo
          </Link>
        </div>
        <div className="lg:w-2/3 flex flex-col gap-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="group flex flex-col sm:flex-row items-center gap-6 p-6 bg-stone-50 rounded-[2rem] border border-stone-100 hover:shadow-xl hover:bg-white transition-all">
              <div className="flex-shrink-0 w-20 h-24 bg-white rounded-2xl border border-stone-200 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-50 w-full text-center py-1.5 border-b border-stone-100">{event.month}</span>
                <span className="text-3xl font-serif text-stone-900 flex-1 flex items-center justify-center mt-1">{event.day}</span>
              </div>
              <div className="flex-1 w-full text-left">
                <p className="text-xs font-bold text-stone-400 uppercase mb-1">{event.type}</p>
                <h3 className="text-xl font-serif text-stone-900 mb-2">{event.title}</h3>
                <p className="text-sm text-stone-500">{event.location}</p>
              </div>
              <button onClick={() => setSelectedEvent(event)} className="cursor-pointer w-full sm:w-auto text-center bg-stone-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all whitespace-nowrap">
                Garantir Vaga
              </button>
            </div>
          ))}
        </div>
      </div>
      <EventDrawer event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} />
    </section>
  );
};
