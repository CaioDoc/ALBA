import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '../../components/Navbar';
import { AssocieseForm } from '../../components/AssocieseForm';

export const metadata: Metadata = {
  title: 'Associe-se',
  description: 'Torne-se um associado da ALBA. Acesse benefícios exclusivos, eventos, cursos e networking com profissionais de Ayurveda em Portugal e Brasil.',
  openGraph: {
    title: 'Associe-se | ALBA',
    description: 'Torne-se um associado da ALBA e acesse benefícios exclusivos.',
  },
};

export default function AssociesePage() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Coluna da Esquerda: Textos e Benefícios */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-8 border border-emerald-200 w-max">
              Faça parte da Associação
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6 leading-tight">
              Junte-se à maior rede de Ayurveda do Brasil.
            </h1>
            
            <p className="text-lg text-stone-600 leading-relaxed mb-10">
              Seja você um terapeuta experiente, um estudante em formação ou um simpatizante das práticas integrativas, a ALBA tem um espaço para você.
            </p>

            <div className="space-y-8">
              {/* Benefício 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-stone-200 text-emerald-700 shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-serif text-stone-900 mb-1">Credibilidade e Confiança</h3>
                  <p className="text-stone-500 text-sm">Seu perfil listado em nosso diretório oficial, atestando sua formação perante os pacientes.</p>
                </div>
              </div>

              {/* Benefício 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-stone-200 text-emerald-700 shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-serif text-stone-900 mb-1">Acesso a Estudos e Cursos</h3>
                  <p className="text-stone-500 text-sm">Participe de congressos, workshops e tenha acesso a materiais de estudo exclusivos para associados.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Formulário de Cadastro */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200 shadow-xl shadow-stone-200/50">
            <h3 className="text-2xl font-serif text-stone-900 mb-2">Inicie seu credenciamento ou contato</h3>
            <p className="text-stone-500 text-sm mb-8">Preencha os dados abaixo e nossa equipe entrará em contato com os próximos passos.</p>
            
            <AssocieseForm />
          </div>

        </div>
      </section>
    </div>
  );
}
