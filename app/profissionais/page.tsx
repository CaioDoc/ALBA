import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '../../components/Navbar';
import { TherapistDirectory } from '../../components/TherapistDirectory';

export const metadata: Metadata = {
  title: 'Rede de Terapeutas',
  description: 'Encontre terapeutas ayurvédicos credenciados pela ALBA em todo o Brasil e Portugal. Profissionais qualificados para cuidar da sua saúde integral.',
  openGraph: {
    title: 'Rede de Terapeutas | ALBA',
    description: 'Encontre terapeutas ayurvédicos credenciados pela ALBA.',
  },
};

export default function ProfissionaisPage() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <Navbar />
      
      {/* Cabeçalho da Página */}
      <section className="pt-24 pb-8 px-4 bg-stone-100 border-b border-stone-200 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">
            Rede de Terapeutas
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Todos os profissionais listados abaixo são membros ativos da Associação Luso-Brasileira de Ayurveda, comprometidos com a ética e a saúde integral.
          </p>
        </div>
      </section>

      {/* O nosso componente interativo que já possui filtros e o Modal embutido */}
      <TherapistDirectory />
    </div>
  );
}
