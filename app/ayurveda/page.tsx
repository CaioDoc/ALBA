import React from 'react';
import { Navbar } from '../../components/Navbar'; // Voltando duas pastas para achar os componentes

export default function AyurvedaPage() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      
      {/* 1. Importando nosso cabeçalho escuro */}
      <Navbar />

      {/* 2. Cabeçalho da Página (Page Hero) */}
      <section className="pt-24 pb-16 px-4 bg-stone-100 border-b border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-emerald-700 font-medium mb-4 uppercase tracking-widest text-sm">
            Filosofia e Prática
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 mb-6">
            A Ciência da Vida Longa
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Originada na Índia há mais de 5.000 anos, o Ayurveda é o sistema de saúde integrativa mais antigo do mundo, reconhecido pela Organização Mundial da Saúde (OMS).
          </p>
        </div>
      </section>

      {/* 3. Corpo do Texto (Estilo Editorial) */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          
          <div className="prose prose-stone prose-lg md:prose-xl mx-auto">
            <p className="lead text-2xl text-stone-800 font-serif mb-8">
              O Ayurveda não foca apenas na doença, mas sim na pessoa que está doente. É uma jornada contínua para manter a harmonia entre o corpo, a mente e o ambiente.
            </p>
            
            <h2 className="text-2xl font-bold text-stone-900 mt-12 mb-4">Os Cinco Elementos e os Doshas</h2>
            <p className="mb-6 text-stone-600 leading-relaxed">
              Segundo a filosofia ayurvédica, tudo no universo — incluindo o corpo humano — é composto por cinco elementos fundamentais: <strong>Éter (Espaço), Ar, Fogo, Água e Terra</strong>. A combinação desses elementos dá origem aos três biotipos básicos ou "Doshas".
            </p>
            <p className="mb-12 text-stone-600 leading-relaxed">
              Todos nós possuímos os três Doshas, mas geralmente um ou dois são predominantes. Conhecer a sua constituição única (Prakriti) é o primeiro passo para o autoconhecimento e a cura.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Os Três Doshas (Cards Explicativos) */}
      <section className="py-16 px-4 bg-white border-y border-stone-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          
          {/* Vata */}
          <div className="bg-stone-50 p-8 rounded-[2rem] border border-stone-100 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-700 font-serif text-2xl">
              V
            </div>
            <h3 className="text-2xl font-serif text-stone-900 mb-2">Vata</h3>
            <p className="text-sm font-medium text-blue-600 mb-4">Éter + Ar</p>
            <p className="text-stone-600 leading-relaxed mb-6">
              Responsável pelo movimento físico e mental. Pessoas com predominância em Vata são criativas, enérgicas e dinâmicas, mas podem sofrer de ansiedade e insônia quando em desequilíbrio.
            </p>
          </div>

          {/* Pitta */}
          <div className="bg-stone-50 p-8 rounded-[2rem] border border-stone-100 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-700 font-serif text-2xl">
              P
            </div>
            <h3 className="text-2xl font-serif text-stone-900 mb-2">Pitta</h3>
            <p className="text-sm font-medium text-red-600 mb-4">Fogo + Água</p>
            <p className="text-stone-600 leading-relaxed mb-6">
              Controla o metabolismo e a digestão. Indivíduos Pitta são inteligentes, focados e líderes natos. Em desequilíbrio, tendem à irritabilidade, inflamações e perfeccionismo excessivo.
            </p>
          </div>

          {/* Kapha */}
          <div className="bg-stone-50 p-8 rounded-[2rem] border border-stone-100 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-700 font-serif text-2xl">
              K
            </div>
            <h3 className="text-2xl font-serif text-stone-900 mb-2">Kapha</h3>
            <p className="text-sm font-medium text-emerald-600 mb-4">Terra + Água</p>
            <p className="text-stone-600 leading-relaxed mb-6">
              Governa a estrutura e a lubrificação do corpo. Pessoas Kapha são calmas, amorosas e possuem grande resistência física. Fora de eixo, podem apresentar letargia, apego e ganho de peso.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Call to Action final */}
      <section className="py-24 px-4 bg-emerald-900 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif text-white mb-6">Pronto para encontrar o seu equilíbrio?</h2>
          <p className="text-emerald-100 mb-10 text-lg">
            Um terapeuta ayurvédico credenciado pode avaliar o seu pulso, sua rotina e criar um plano de saúde personalizado para você.
          </p>
          {/* Botão com cursor-pointer explícito garantido */}
          <button className="cursor-pointer bg-white text-emerald-900 px-8 py-4 rounded-2xl font-bold hover:bg-stone-100 transition-all duration-300 active:scale-95 shadow-xl">
            Encontrar um Terapeuta
          </button>
        </div>
      </section>

    </div>
  );
}
