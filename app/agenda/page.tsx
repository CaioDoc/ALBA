import React from 'react';
import { Navbar } from '../../components/Navbar';
import { PublicAgenda } from '../../components/PublicAgenda';

export default function AgendaPage() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4 bg-stone-100 border-b border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-emerald-700 font-bold mb-4 uppercase tracking-widest text-sm">Eventos ALBA</p>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Agenda Completa</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">Confira nossa programação de congressos, workshops e palestras para o ano.</p>
        </div>
      </section>

      <PublicAgenda />
    </div>
  );
}
