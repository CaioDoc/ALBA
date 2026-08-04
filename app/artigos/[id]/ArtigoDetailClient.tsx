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
    const saved = localStorage.getItem('alba_artigos_v13');
    if (saved) {
      try {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          source = parsed;
        } else {
          source = initialArticles;
          localStorage.setItem('alba_artigos_v13', JSON.stringify(initialArticles));
        }
      } catch (e) {
        source = initialArticles;
        localStorage.setItem('alba_artigos_v13', JSON.stringify(initialArticles));
      }
    } else {
      source = initialArticles;
      localStorage.setItem('alba_artigos_v13', JSON.stringify(initialArticles));
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

  const formatArticleHtml = (html: string) => {
    if (!html) return '';
    
    let formatted = html;

    // 1. Converter [su_button url="URL" ...]Texto[/su_button] em botão de destaque estilizado
    formatted = formatted.replace(
      /\[su_button\s+url=["\']([^"\']+)["\'][^\]]*\](.*?)\[\/su_button\]/gi,
      (match, url, text) => {
        return `<div class="my-6"><a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-emerald-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-900 shadow-md transition-all cursor-pointer">${text} &rarr;</a></div>`;
      }
    );

    // 2. Converter shortcodes de vídeo [embed]https://youtu.be/...[/embed] ou [embed]https://www.youtube.com/...[/embed] em iframe responsivo
    formatted = formatted.replace(
      /\[embed\]\s*(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_\-]+)[^\s<]*)\s*\[\/embed\]/gi,
      (match, url, videoId) => {
        return `<div class="relative w-full aspect-video my-8 rounded-2xl overflow-hidden shadow-xl bg-stone-900"><iframe src="https://www.youtube.com/embed/${videoId}" title="Vídeo do YouTube" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      }
    );

    // Converter URLs puras do YouTube em vídeo embutido responsivo
    formatted = formatted.replace(
      /(?:<p>)?\s*(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_\-]+)[^\s<]*)\s*(?:<\/p>)?/gi,
      (match, url, videoId) => {
        return `<div class="relative w-full aspect-video my-8 rounded-2xl overflow-hidden shadow-xl bg-stone-900"><iframe src="https://www.youtube.com/embed/${videoId}" title="Vídeo do YouTube" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      }
    );

    // 3. Converter links diretos de imagem (.jpg, .jpeg, .png, .webp, .gif) em elementos <img> com moldura estilizada
    formatted = formatted.replace(
      /(?<!href=["\'])(?<!src=["\'])(?<!">)(https?:\/\/[^\s<"\'\)\\]+\.(?:jpg|jpeg|png|webp|gif))/gi,
      (match, url) => {
        return `<div class="my-8 rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100"><img src="${url}" alt="Imagem do artigo" class="w-full h-auto max-h-[550px] object-cover" /></div>`;
      }
    );

    // 4. Converter links em texto puro (não contidos em tags <a> ou <img>) em links clicáveis
    formatted = formatted.replace(
      /(?<!href=["\'])(?<!src=["\'])(?<!">)(https?:\/\/[^\s<"\'\)\\]+)/gi,
      (match, url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-emerald-700 font-medium underline hover:text-emerald-800 break-all">${url}</a>`;
      }
    );

    // 5. Limpar shortcodes brutos de galeria WordPress [gallery ...] para não exibir texto bruto de código
    formatted = formatted.replace(/\[gallery[^\]]*\]/gi, '');

    // 6. Limpar outros shortcodes isolados
    formatted = formatted.replace(/\[caption[^\]]*\](.*?)\[\/caption\]/gi, '$1');
    formatted = formatted.replace(/\[\/?embed\]/gi, '');
    
    // 7. Converter quebras de linha puras em <br/> se não houver tags de parágrafo <p>
    if (formatted.includes('\n') && !/<p[^>]*>/i.test(formatted)) {
      formatted = formatted.replace(/\r?\n/g, '<br/>');
    }
    
    // Adicionar espaçamento/quebra antes de <strong> ou <b> se não for precedido por quebra ou parágrafo
    formatted = formatted.replace(/(?<!<br\s*\/?>|<p[^>]*>|\n|^)\s*(<strong>|<b>)/gi, '<br/><br/>$1');
    
    // Adicionar quebra de linha IMEDIATAMENTE APÓS </strong> ou <b> se houver texto em seguida
    formatted = formatted.replace(/(<\/strong>|<\/b>)\s*(?!<br\s*\/?>|<\/p>|\n|$)/gi, '$1<br/>');

    return formatted;
  };

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
            <div className="mb-10 rounded-2xl overflow-hidden shadow-xl border border-stone-200 aspect-video relative bg-stone-100">
              <img 
                src={artigo.imagem} 
                alt={artigo.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div 
            className="text-stone-600 leading-relaxed custom-html-content space-y-4"
            dangerouslySetInnerHTML={{ __html: formatArticleHtml(artigo.conteudo || artigo.resumo || 'Conteúdo do artigo não disponível.') }}
          />
        </div>
      </section>
    </div>
  );
}
