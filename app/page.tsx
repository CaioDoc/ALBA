import React from 'react';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { AyurvedaGlossary } from '../components/AyurvedaGlossary';
import { CourseCarousel } from '../components/CourseCarousel';
import { PublicAgenda } from '../components/PublicAgenda';

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      
      <Navbar />

      {/* 1. Hero Section (Mantido intacto com o Split Layout) */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-emerald-50/30 -z-10"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-stone-600 text-xs font-bold mb-8 border border-stone-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              A essência da saúde integral
            </div>

            <h1 className="text-5xl md:text-6xl font-serif text-stone-900 mb-6 leading-tight">
              A ciência da vida em <span className="text-emerald-700 italic">equilíbrio</span> com a sua essência.
            </h1>
            
            <p className="text-lg text-stone-500 mb-10 leading-relaxed max-w-lg">
              A Associação Brasileira de Ayurveda promove o conhecimento milenar para o bem-estar, conectando você a terapeutas credenciados em todo o território nacional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/profissionais" className="cursor-pointer bg-stone-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-900 transition-all duration-300 active:scale-95 shadow-xl shadow-stone-900/10 flex items-center justify-center gap-2">
                Encontrar Terapeuta
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link href="/ayurveda" className="cursor-pointer bg-white border border-stone-200 text-stone-700 px-8 py-4 rounded-2xl font-bold hover:bg-stone-50 transition-all duration-300 active:scale-95 flex items-center justify-center">
                Conheça a Filosofia
              </Link>
            </div>
          </div>

          <div className="relative w-full h-[500px] lg:h-[650px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10">
            <img 
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop" 
              alt="Pessoa meditando em meio à natureza" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply"></div>
          </div>

        </div>
      </section>

      {/* 2. Credibilidade */}
      <section className="py-12 border-y border-stone-100 bg-white/50">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-24 text-center">
          <div className="space-y-1">
            <p className="text-4xl font-serif text-emerald-800">15+</p>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Anos de História</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-serif text-emerald-800">400+</p>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Terapeutas Credenciados</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-serif text-emerald-800">100%</p>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Foco na Saúde Integral</p>
          </div>
        </div>
      </section>

      {/* 3. NOVA SEÇÃO: Filosofia Elegante */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2">
            <p className="text-emerald-700 font-bold mb-4 uppercase tracking-widest text-sm">A Essência do Tratamento</p>
            <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-6 leading-tight">
              Harmonia verdadeira entre Corpo, Mente e Espírito
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed mb-8">
              O Ayurveda não trata apenas os sintomas de forma isolada, mas busca a raiz profunda do desequilíbrio. Nossa prática se apoia em três fundamentos para transformar a sua saúde de forma duradoura.
            </p>
            <Link href="/ayurveda" className="cursor-pointer inline-flex items-center text-emerald-700 font-bold hover:text-emerald-800 transition-colors">
              Ler mais sobre o Ayurveda
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="lg:w-1/2 space-y-4">
            <div className="p-6 md:p-8 rounded-[2rem] bg-stone-50 border border-stone-100 flex gap-6 hover:bg-emerald-50/50 transition-colors duration-300">
              <div className="w-12 h-12 flex-shrink-0 bg-white rounded-2xl flex items-center justify-center text-emerald-700 shadow-sm font-serif text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-serif text-stone-900 mb-2">Saúde Preventiva</h3>
                <p className="text-stone-500 text-sm leading-relaxed">Ajuste de rotinas e alimentação adequadas ao seu biotipo natural, fortalecendo a imunidade antes que as enfermidades se manifestem.</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 rounded-[2rem] bg-stone-50 border border-stone-100 flex gap-6 hover:bg-emerald-50/50 transition-colors duration-300">
              <div className="w-12 h-12 flex-shrink-0 bg-white rounded-2xl flex items-center justify-center text-emerald-700 shadow-sm font-serif text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-serif text-stone-900 mb-2">Atenção Individualizada</h3>
                <p className="text-stone-500 text-sm leading-relaxed">Reconhecemos que cada pessoa é um universo único. Todas as terapias e orientações são desenhadas sob medida para a sua constituição.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-[2rem] bg-stone-50 border border-stone-100 flex gap-6 hover:bg-emerald-50/50 transition-colors duration-300">
              <div className="w-12 h-12 flex-shrink-0 bg-white rounded-2xl flex items-center justify-center text-emerald-700 shadow-sm font-serif text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-serif text-stone-900 mb-2">Equilíbrio Nervoso</h3>
                <p className="text-stone-500 text-sm leading-relaxed">Atuação terapêutica profunda no sistema nervoso central para ajudar no gerenciamento do estresse, da ansiedade e da insônia.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SEÇÃO DE CURSOS (Nova Aba de Educação) */}
      <CourseCarousel />

      {/* SEÇÃO DE AGENDA DE EVENTOS */}
      <PublicAgenda />

      {/* 4. Glossário Interativo */}
      <section className="py-24 px-4 bg-stone-50 border-t border-stone-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-emerald-700 font-bold mb-4 uppercase tracking-widest text-sm">Vocabulário Prático</p>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">
              Mergulhe nos Conceitos
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed">
              O vocabulário ayurvédico, de origem sânscrita, pode parecer complexo no início. Explore os termos abaixo para entender melhor as terapias que guiam nossos profissionais.
            </p>
          </div>
          
          {/* Nosso novo componente expansível */}
          <AyurvedaGlossary />
          
        </div>
      </section>

      {/* 5. NOVO BANNER CTA: Encontrar Profissionais */}
      <section className="px-4 py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto bg-emerald-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          {/* Textura sutil no fundo do banner */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop')] opacity-10 mix-blend-overlay bg-cover bg-center"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
              Encontre o terapeuta ideal para a sua jornada.
            </h2>
            <p className="text-emerald-100 text-lg mb-10">
              Acesse nosso diretório oficial com centenas de profissionais avaliados e qualificados em todo o Brasil, prontos para guiar você ao equilíbrio.
            </p>
            <Link href="/profissionais" className="cursor-pointer inline-flex items-center gap-2 bg-white text-emerald-950 px-8 py-4 rounded-2xl font-bold hover:bg-stone-100 transition-all duration-300 active:scale-95 shadow-xl">
              Acessar Rede de Profissionais
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
}
