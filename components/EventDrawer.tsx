"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';

interface EventDrawerProps {
  event: {
    id: number | string;
    title: string;
    type: string;
    day: string;
    month: string;
    location: string;
    date?: string;
    description?: string;
    status?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventDrawer = ({ event, isOpen, onClose }: EventDrawerProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!event) return null;

  return (
    <>
      <div className={`fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300 cursor-pointer ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={onClose}></div>
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="relative p-8 bg-stone-100 border-b border-stone-200">
          <button onClick={onClose} aria-label="Fechar" className="absolute top-6 right-6 w-10 h-10 bg-white hover:bg-stone-200 text-stone-600 rounded-full flex items-center justify-center transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">{event.type}</span>
          <h2 className="text-2xl font-serif text-stone-900 mt-2">{event.title}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-8 text-stone-800 space-y-6">
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-stone-500 text-sm">Data:</span> 
              <span className="font-bold text-stone-900">{event.date || `${event.day} de ${event.month}`}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-stone-500 text-sm">Local:</span> 
              <span className="font-bold text-stone-900">{event.location}</span>
            </div>
            {event.status && (
              <div className="flex items-center gap-3">
                <span className="text-stone-500 text-sm">Status:</span> 
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  event.status === 'Programado' ? 'bg-emerald-100 text-emerald-800' :
                  event.status === 'Esgotado' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </span>
              </div>
            )}
          </div>

          {/* Descrição / Pauta do Evento */}
          <div>
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Sobre o Evento / Programação</h4>
            {event.description ? (
              <div className="text-stone-700 text-sm leading-relaxed whitespace-pre-line bg-stone-50/70 p-4 rounded-xl border border-stone-100">
                {event.description}
              </div>
            ) : (
              <p className="text-stone-600 leading-relaxed text-sm">
                Garanta sua vaga neste evento exclusivo da ALBA. Vagas limitadas sujeitas à disponibilidade.
              </p>
            )}
          </div>
        </div>
        <div className="p-6 bg-white border-t border-stone-100">
          <Link 
            href="/associe-se"
            className="w-full bg-emerald-800 text-white py-4 rounded-xl font-bold hover:bg-emerald-900 transition-all cursor-pointer flex justify-center items-center gap-2 shadow-md active:scale-95"
          >
            <span>Inscrever-se Agora</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
};
