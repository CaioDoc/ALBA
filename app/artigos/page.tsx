"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';

export default function ArtigosPage() {
  const [artigosDatabase, setArtigosDatabase] = useState<any[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('alba_artigos');
    if (saved) {
      setArtigosDatabase(JSON.parse(saved).filter((a: any) => a.status === 'Publicado'));
    } else {
      const initial = [
        { id: 1, tag: 'Fundamentos', title: 'O que é a Medicina Tradicional Indiana?', resumo: 'Uma visão abrangente sobre como o Ayurveda enxerga o corpo humano...', imagem: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop', status: 'Publicado' },
        { id: 2, tag: 'Biotipos', title: 'Os Doshas: Vata, Pitta e Kapha', resumo: 'Compreenda os três humores biológicos que regem nossa fisiologia.', imagem: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop', status: 'Publicado' },
        { id: 3, tag: 'Nutrição', title: 'Alimentação Ayurvédica no Cotidiano', resumo: 'Como o uso de temperos e a escolha consciente podem prevenir doenças.', imagem: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop', status: 'Publicado' },
        { id: 4, tag: 'Bem-estar', title: 'O poder do Dinacharya (Rotina Diária)', resumo: 'Descubra como pequenos hábitos diários podem resetar sua saúde.', imagem: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop', status: 'Publicado' },
        { id: 5, tag: 'Terapias', title: 'Massagem Abhyanga e a Nutrição Celular', resumo: 'Os benefícios do óleo morno aplicado no corpo e mente.', imagem: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=600&auto=format&fit=crop', status: 'Publicado' },
        { id: 6, tag: 'Mente', title: 'Ansiedade sob a ótica de Vata', resumo: 'Estratégias de aterramento para controlar o estresse moderno.', imagem: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600&auto=format&fit=crop', status: 'Publicado' },
        { id: 7, tag: 'Fitoterapia', title: 'Ashwagandha: O Ginseng Indiano', resumo: 'A erva adaptógena mais famosa e seus reais benefícios clínicos.', imagem: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=600&auto=format&fit=crop', status: 'Publicado' },
        { id: 8, tag: 'Digestão', title: 'Agni: O Fogo Digestivo', resumo: 'A base da saúde no Ayurveda começa pela sua capacidade de digerir a vida.', imagem: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop', status: 'Publicado' },
        { id: 9, tag: 'Estações', title: 'Ayurveda no Inverno', resumo: 'Dicas de autocuidado para se proteger do frio e manter a imunidade.', imagem: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600&auto=format&fit=crop', status: 'Publicado' },
        { id: 10, tag: 'Saúde da Mulher', title: 'Ciclos Femininos Naturais', resumo: 'Compreendendo as fases da lua e o equilíbrio hormonal através do Ayurveda.', imagem: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=600&auto=format&fit=crop', status: 'Publicado' },
        { id: 11, tag: 'Fundamentos', title: 'Entendendo Ama (Toxinas)', resumo: 'Como o acúmulo de alimentos não digeridos causa doenças.', imagem: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=600&auto=format&fit=crop', status: 'Publicado' },
        { id: 12, tag: 'Terapias', title: 'Os 5 Procedimentos do Panchakarma', resumo: 'A desintoxicação profunda e guiada milenar.', imagem: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop', status: 'Publicado' },
      ];
      setArtigosDatabase(initial);
      localStorage.setItem('alba_artigos', JSON.stringify(initial));
    }
  }, []);

  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(artigosDatabase.length / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = artigosDatabase.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <Navbar />
      <section className="pt-24 pb-16 px-4 bg-stone-100 border-b border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Artigos e Publicações</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">Explore nosso acervo histórico de publicações sobre o Ayurveda.</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {currentArticles.map((artigo) => (
              <Link key={artigo.id} href={`/artigos/${artigo.id}`} className="group flex flex-col bg-white rounded-[2rem] border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer">
                <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                  <img src={artigo.imagem} alt={artigo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-emerald-800">{artigo.tag}</div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-serif text-stone-900 mb-3 group-hover:text-emerald-700">{artigo.title}</h3>
                  <p className="text-stone-500 text-sm mb-6 flex-grow">{artigo.resumo}</p>
                  <div className="text-emerald-700 font-bold text-sm flex items-center gap-1">
                    Ler Artigo Completo
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="cursor-pointer px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`cursor-pointer w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-colors ${
                    currentPage === idx + 1 ? 'bg-emerald-800 text-white shadow-md' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="cursor-pointer px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
