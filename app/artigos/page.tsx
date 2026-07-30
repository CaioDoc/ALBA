"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';

import { initialArticles } from '../../data/artigos';

const categories = ['Todos', 'Yoga', 'Massagens Ayurvédicas', 'Medicina Ayurvédica', 'Estudos Holísticos', 'Geral'];

export default function ArtigosPage() {
  const [artigosDatabase, setArtigosDatabase] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    const saved = localStorage.getItem('alba_artigos_v9');
    if (saved) {
      try {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArtigosDatabase(parsed.filter((a: any) => a.status === 'Publicado'));
        } else {
          setArtigosDatabase(initialArticles.filter((a: any) => a.status === 'Publicado'));
          localStorage.setItem('alba_artigos_v9', JSON.stringify(initialArticles));
        }
      } catch (e) {
        setArtigosDatabase(initialArticles.filter((a: any) => a.status === 'Publicado'));
        localStorage.setItem('alba_artigos_v9', JSON.stringify(initialArticles));
      }
    } else {
      setArtigosDatabase(initialArticles.filter((a: any) => a.status === 'Publicado'));
      localStorage.setItem('alba_artigos_v9', JSON.stringify(initialArticles));
    }
  }, []);

  // Filter articles
  const filteredArticles = artigosDatabase.filter((artigo) => {
    const matchesCategory = activeCategory === 'Todos' || artigo.tag === activeCategory;
    const matchesSearch = artigo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          artigo.resumo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Reset to first page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
          {/* Filtros e Busca */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            {/* Input de Busca */}
            <div className="relative w-full md:max-w-xs flex-shrink-0">
              <input 
                type="text" 
                placeholder="Buscar artigo..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-full text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
              />
              <svg className="w-5 h-5 text-stone-400 absolute left-4 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Menu de Filtros Rápidos */}
            <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 hide-scrollbar items-center flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`cursor-pointer whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                    activeCategory === cat
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-md'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          {currentArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {currentArticles.map((artigo) => (
                <Link key={artigo.id} href={`/artigos/${artigo.id}`} className="group flex flex-col bg-white rounded-[2rem] border border-stone-200/80 p-8 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100/60">{artigo.tag || 'Geral'}</span>
                    <span className="text-xs text-stone-400 font-medium">{artigo.date || ''}</span>
                  </div>
                  <h3 className="text-xl font-serif text-stone-900 mb-3 group-hover:text-emerald-700 transition-colors leading-snug">{artigo.title}</h3>
                  <p className="text-stone-600 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">{artigo.resumo}</p>
                  <div className="text-emerald-700 font-bold text-sm flex items-center gap-1.5 mt-auto pt-4 border-t border-stone-100">
                    Ler Artigo Completo
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-stone-100 mb-16">
              <p className="text-stone-500 text-lg">Nenhum artigo encontrado com os filtros selecionados.</p>
            </div>
          )}

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
