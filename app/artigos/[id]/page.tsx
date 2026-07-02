import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/Navbar';

export default function ArtigoDetalhePage({ params }: { params: { id: string } }) {
  // Em uma aplicação real, você buscaria os dados baseados no ID.
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4 bg-stone-100 border-b border-stone-200">
        <div className="max-w-3xl mx-auto">
          <Link href="/artigos" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 mb-6 cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar para Artigos
          </Link>
          <span className="block text-emerald-700 font-bold mb-4 uppercase tracking-widest text-xs">Publicado Oficialmente</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Visualização de Artigo</h1>
          <p className="text-stone-500 text-sm">Escrito por equipe ALBA Ayurveda.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-stone md:prose-lg">
          <p className="lead text-xl text-stone-600 leading-relaxed mb-8">
            O Ayurveda, frequentemente traduzido como a &quot;Ciência da Vida&quot;, é um sistema de medicina tradicional que se originou na Índia há mais de 5.000 anos. Ele oferece uma abordagem holística para a saúde, focando não apenas no tratamento de doenças, mas na prevenção e promoção do bem-estar contínuo.
          </p>
          <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop" alt="Ayurveda Capa" className="rounded-3xl w-full object-cover h-80 my-8 shadow-md" />
          <h2 className="text-2xl font-serif text-stone-900 mt-10 mb-4">Os Três Doshas Fundamentais</h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            A base do diagnóstico e tratamento ayurvédico repousa sobre o conceito dos três doshas: Vata, Pitta e Kapha. Estas são as forças energéticas da natureza que ajudam a entender como o ambiente externo reflete em nossa fisiologia interna.
          </p>
          <ul className="space-y-3 mb-10">
            <li className="flex items-center gap-2 text-stone-700"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> <strong>Vata:</strong> O princípio do movimento (Ar e Éter).</li>
            <li className="flex items-center gap-2 text-stone-700"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> <strong>Pitta:</strong> O princípio da transformação (Fogo e Água).</li>
            <li className="flex items-center gap-2 text-stone-700"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> <strong>Kapha:</strong> O princípio da estrutura (Terra e Água).</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

// Adicione esta função no arquivo app/artigos/[id]/page.tsx
export async function generateStaticParams() {
  // Como temos 12 artigos mapeados no nosso banco de dados simulado,
  // informamos ao Next.js para gerar as páginas estáticas de 1 a 12 no build
  return Array.from({ length: 12 }).map((_, idx) => ({
    id: (idx + 1).toString(),
  }));
}
