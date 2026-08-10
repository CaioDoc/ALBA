"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';

export default function ProfissionaisPage() {
  const getImagePath = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <Navbar />
      
      {/* Cabeçalho da Página */}
      <section className="pt-28 pb-12 px-4 bg-stone-100 border-b border-stone-200 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-emerald-800 font-bold uppercase tracking-widest text-xs mb-3 block">
            Corpo Docente & Responsável Técnico
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">
            Profissional Responsável
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Conheça a trajetória e formação do fundador da Associação Luso-Brasileira de Ayurveda (ALBA).
          </p>
        </div>
      </section>

      {/* Seção Principal em Duas Colunas (Artigo com Foto no Canto Esquerdo) */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* COLUNA DA ESQUERDA: Foto e Card de Destaque */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-stone-900 group">
              <img 
                src="/images/profissional/valter.jpeg" 
                alt="Valter Carlos Cardim (Swami Gyanesh)" 
                className="w-full h-auto object-cover max-h-[620px] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="inline-block bg-emerald-800/90 backdrop-blur-md text-emerald-100 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                  Fundador & Mestre Ayurvédico
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                  Valter Carlos Cardim
                </h2>
                <p className="text-emerald-200 text-sm font-medium mt-0.5">
                  (Swami Gyanesh)
                </p>
              </div>
            </div>

            {/* Card de Contato Rápido */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-stone-500 font-bold">Informações e Agendamento</p>
                <a 
                  href="mailto:info@ayurvedica.org" 
                  className="text-emerald-800 font-bold hover:underline text-sm md:text-base break-all"
                >
                  info@ayurvedica.org
                </a>
              </div>
              <a 
                href="mailto:info@ayurvedica.org" 
                className="w-12 h-12 bg-emerald-800 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-900 transition-all flex-shrink-0 shadow-md cursor-pointer"
                title="Enviar E-mail"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* COLUNA DA DIREITA: Artigo Biográfico e Especialidades */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-emerald-800 font-bold uppercase tracking-widest text-xs block mb-2">
                Biografia & Trajetória
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-900 font-bold leading-tight mb-4">
                Valter Carlos Cardim <span className="text-stone-500 font-normal text-2xl md:text-3xl block md:inline">(Swami Gyanesh)</span>
              </h2>
              <p className="text-lg text-emerald-900 font-serif italic border-l-4 border-emerald-800 pl-4 py-1 bg-emerald-50/60 rounded-r-xl">
                Dedicação contínua ao estudo e à aplicação prática das artes corporais e da Medicina Ayurvédica desde 1970.
              </p>
            </div>

            {/* Texto em Formato de Artigo */}
            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed text-base md:text-lg space-y-5">
              <p>
                <strong>Valter Carlos Cardim (Swami Gyanesh)</strong> dedica-se ao estudo de técnicas que trabalham o corpo desde 1970. Em 1980 é iniciado pessoalmente pelo seu mestre Osho (Bagwan Shree Rajneesh). Em 1981 viaja para os Estados Unidos onde permanece e participa do Festival Vida Internacional na comunidade do seu mestre.
              </p>

              <p>
                Em 1989 viaja para a Índia onde aprofunda os seus conhecimentos sobre Ayurvédica em Poona. Participou em vários workshops na Rajneesh Foundation International nos Estados Unidos e na Índia. Estudou no Instituto Corpo de São Paulo, no Instituto Soma de São Paulo, e na Escola de Massagens Amor.
              </p>

              <p>
                Possui curso de Medicina Ayurvédica, com pós-graduação pela Universidade de Maimónides, com certificação pela Universidade de Gujarat, Índia. Concluiu pós-doutorado em Cultura e Comunicação, onde estudou a aplicação da Medicina Ayurvédica na Cultura Contemporânea.
              </p>
            </div>

            {/* Card Elegante com as Áreas de Atendimento */}
            <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-800/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-800 text-emerald-100 rounded-xl flex items-center justify-center font-bold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">Áreas de Atendimento & Especialidades</h3>
                </div>

                <p className="text-stone-300 text-base md:text-lg leading-relaxed">
                  Atendimentos na área da arte da massagem corporal Ayurvédica, Nutrição e Estilo de Vida segundo a Ayurveda e Naturopatia Ayurvédica. Também possui conhecimento sobre análise do sangue vivo.
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="bg-stone-800 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-700">Massagem Corporativa Ayurvédica</span>
                  <span className="bg-stone-800 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-700">Nutrição & Estilo de Vida</span>
                  <span className="bg-stone-800 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-700">Naturopatia Ayurvédica</span>
                  <span className="bg-stone-800 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-700">Análise do Sangue Vivo</span>
                </div>
              </div>
            </div>

            {/* Bloco de Contato e Dúvidas */}
            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-serif font-bold text-emerald-950 mb-1">Deseja agendar um atendimento ou solicitar mais informações?</h4>
                <p className="text-stone-600 text-sm">Entre em contacto direto através do nosso suporte oficial por e-mail.</p>
              </div>
              <a 
                href="mailto:info@ayurvedica.org" 
                className="bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-emerald-900 transition-all shadow-md hover:shadow-emerald-900/30 whitespace-nowrap cursor-pointer inline-flex items-center gap-2"
              >
                <span>Enviar E-mail</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
