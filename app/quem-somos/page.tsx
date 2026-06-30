import React from 'react';
import { Navbar } from '../../components/Navbar';

export default function QuemSomosPage() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <Navbar />

      <section className="pt-24 pb-16 px-4 bg-stone-100 border-b border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-emerald-700 font-bold mb-4 uppercase tracking-widest text-sm">História da ALBA</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 mb-6">Quem Somos</h1>
          <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            A Associação Luso-Brasileira de Ayurveda (ALBA) dedica-se à promoção, ensino e prática da autêntica Medicina Ayurvédica em países de língua portuguesa.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          
          <div className="prose prose-stone md:prose-lg mx-auto">
            <h2 className="text-3xl font-serif text-stone-900 mb-6">Nossas Raízes</h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              A ALBA nasceu da união de terapeutas e médicos especialistas apaixonados pela medicina tradicional indiana. O nosso objetivo sempre foi preservar a pureza e a essência do Ayurveda, adaptando seus ensinamentos valiosos para a realidade e clima tanto do Brasil quanto de Portugal.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Através da formação de novos profissionais, organização de seminários, publicações e desenvolvimento de projetos de responsabilidade social, buscamos não apenas tratar o indivíduo, mas educar a sociedade para um estilo de vida preventivo e equilibrado.
            </p>
          </div>

          {/* Destaque Acreditação Europeia */}
          <div className="bg-emerald-900 rounded-[2rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
                <svg className="w-8 h-8 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif text-white mb-4">Acreditação Europeia</h2>
              <p className="text-emerald-100 leading-relaxed max-w-2xl mx-auto mb-8">
                Como parte de nosso compromisso com a excelência internacional, possuímos ligação e acreditação direta com a divisão europeia. Nossos padrões de ensino e prática seguem as diretrizes estabelecidas na Europa, garantindo o mais alto nível de profissionalismo aos nossos associados.
              </p>
              <a href="https://www.ayurvedica.eu/" target="_blank" rel="noreferrer" className="cursor-pointer inline-flex bg-white text-emerald-900 px-8 py-4 rounded-xl font-bold hover:bg-stone-100 transition-all active:scale-95 shadow-md">
                Conheça a ALBA Europeia (ayurvedica.eu)
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
