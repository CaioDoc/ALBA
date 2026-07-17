"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/Navbar';

import { initialArticles } from '../../../data/artigos';

export default function ArtigoDetailClient({ id }: { id: string }) {
  const [artigo, setArtigo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let source = [];
    const saved = localStorage.getItem('alba_artigos_v4');
    if (saved) {
      source = JSON.parse(saved);
    } else {
      source = initialArticles;
      localStorage.setItem('alba_artigos_v4', JSON.stringify(initialArticles));
    }
    
    const found = source.find((a: any) => String(a.id) === String(id));
    if (found) {
      setArtigo(found);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex items-center justify-center">
        <p className="text-stone-500">Carregando artigo...</p>
      </div>
    );
  }

  if (!artigo) {
    return (
      <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
        <Navbar />
        <div className="pt-32 pb-16 px-4 text-center">
          <h1 className="text-3xl font-serif text-stone-900 mb-4">Artigo não encontrado</h1>
          <Link href="/artigos" className="text-emerald-700 hover:underline">Voltar para Artigos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4 bg-stone-100 border-b border-stone-200">
        <div className="max-w-3xl mx-auto">
          <Link href="/artigos" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 mb-6 cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar para Artigos
          </Link>
          <span className="block text-emerald-700 font-bold mb-4 uppercase tracking-widest text-xs">{artigo.tag || 'Publicado'}</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">{artigo.title}</h1>
          <p className="text-stone-500 text-sm">Escrito por {artigo.author || 'Equipe ALBA Ayurveda'} • {artigo.date || ''}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-stone md:prose-lg">
          {artigo.imagem && (
            <img src={artigo.imagem} alt={artigo.title} className="rounded-3xl w-full object-cover h-80 mb-10 shadow-md" />
          )}
          
          <div 
            className="text-stone-600 leading-relaxed custom-html-content"
            dangerouslySetInnerHTML={{ __html: artigo.conteudo || artigo.resumo || 'Conteúdo do artigo não disponível.' }}
          />
        </div>
      </section>
    </div>
  );
}
