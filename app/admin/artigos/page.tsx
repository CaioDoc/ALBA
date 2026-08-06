"use client";

import React, { useState, useRef } from 'react';

import { initialArticles } from '../../../data/artigos';

export default function AdminArtigosPage() {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  React.useEffect(() => {
    const saved = localStorage.getItem('alba_artigos_v17');
    if (saved) {
      let parsed = JSON.parse(saved);
      setArticles(parsed);
    } else {
      setArticles(initialArticles);
      localStorage.setItem('alba_artigos_v17', JSON.stringify(initialArticles));
    }
  }, []);

  // Estados do Editor
  const [editingId, setEditingId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [promptIA, setPromptIA] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Referência para manipular a posição do cursor no textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- FUNÇÕES DA LISTA (CRUD) ---
  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja deletar este artigo? Essa ação não pode ser desfeita.')) {
      const newArticles = articles.filter(a => a.id !== id);
      setArticles(newArticles);
      localStorage.setItem('alba_artigos_v17', JSON.stringify(newArticles));
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === articles.length && articles.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(articles.map(a => a.id));
    }
  };

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (confirm(`Tem certeza que deseja deletar os ${selectedItems.length} artigos selecionados permanentemente?`)) {
      const newArticles = articles.filter(a => !selectedItems.includes(a.id));
      setArticles(newArticles);
      localStorage.setItem('alba_artigos_v17', JSON.stringify(newArticles));
      setSelectedItems([]);
    }
  };

  const handleEdit = (artigo: typeof initialArticles[0]) => {
    setEditingId(artigo.id);
    setTitulo(artigo.title);
    setConteudo(artigo.conteudo);
    setView('editor');
  };

  const handleNovoArtigo = () => {
    setEditingId(null);
    setTitulo('');
    setConteudo('');
    setView('editor');
  };

  // --- FUNÇÕES DE SALVAMENTO ---
  const salvarArtigo = (statusDesejado: 'Rascunho' | 'Publicado') => {
    if (!titulo.trim()) {
      alert('Por favor, dê um título ao seu artigo antes de salvar.');
      return;
    }

    const nextId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
    const novoArtigo = {
      id: editingId || nextId, // Usa ID sequencial para funcionar com páginas estáticas
      title: titulo,
      author: 'Admin',
      status: statusDesejado,
      date: new Date().toLocaleDateString('pt-BR'),
      conteudo: conteudo,
      resumo: conteudo ? conteudo.substring(0, 100) + '...' : '',
      imagem: '/images/artigos/medicina_ayurv_dica___um_sistema_de_cura_hol_stica.jpg', // default image
      tag: 'Geral'
    };

    let newArticles;
    if (editingId) {
      // Atualiza o artigo existente
      newArticles = articles.map(a => a.id === editingId ? { ...a, ...novoArtigo } : a);
    } else {
      // Cria um novo no topo da lista
      newArticles = [novoArtigo, ...articles];
    }
    
    setArticles(newArticles);
      localStorage.setItem('alba_artigos_v13', JSON.stringify(newArticles));

    alert(`Artigo ${statusDesejado === 'Rascunho' ? 'salvo como rascunho' : 'publicado'} com sucesso!`);
    setView('list');
  };

  // --- FUNÇÕES DO EDITOR DE TEXTO (FORMATADORES) ---
  const formatarTexto = (prefixo: string, sufixo: string = '') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textoSelecionado = conteudo.substring(start, end);
    const textoNovo = conteudo.substring(0, start) + prefixo + textoSelecionado + sufixo + conteudo.substring(end);
    
    setConteudo(textoNovo);
    
    // Devolve o foco para o textarea na posição correta
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefixo.length, end + prefixo.length);
    }, 0);
  };

  const handleInserirImagem = () => {
    const url = prompt("Cole a URL da imagem:");
    if (url) {
      formatarTexto(`<img src="${url}" alt="Descrição da Imagem" style="max-width: 100%; border-radius: 8px;" />`);
    }
  };

  // --- FUNÇÕES DA IA ---
  const handleGerarComIA = () => {
    if (!promptIA) return;
    setIsGenerating(true);
    setTimeout(() => {
      if(!titulo) setTitulo('Os Benefícios da Fitoterapia Ayurvédica');
      setConteudo((prev) => prev + '\n\nA ansiedade é frequentemente classificada no Ayurveda como um desequilíbrio profundo do Dosha Vata, regido pelos elementos Ar e Éter. Quando há excesso de movimento e instabilidade na mente, o corpo responde com estresse crônico.\n\nPara o tratamento, a fitoterapia (Dravya Guna) oferece aliados poderosos. Ervas adaptógenas como **Ashwagandha** e **Brahmi** são fundamentais. A Ashwagandha atua aterrando o sistema nervoso, promovendo força e resistência...');
      setIsGenerating(false);
      setPromptIA('');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-stone-900">Artigos</h2>
          <p className="text-stone-500 mt-1">
            Gerencie o conteúdo do blog ou utilize o assistente de IA para criar novas postagens.
          </p>
        </div>
        
        {view === 'list' ? (
          <button 
            onClick={handleNovoArtigo}
            className="cursor-pointer bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all active:scale-95 shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Escrever Novo Artigo
          </button>
        ) : (
          <button 
            onClick={() => setView('list')}
            className="cursor-pointer bg-stone-200 text-stone-700 px-6 py-3 rounded-xl font-bold hover:bg-stone-300 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar para a Lista
          </button>
        )}
      </div>

      {/* VIEW: LISTA DE ARTIGOS (CRUD) */}
      {view === 'list' && (
        <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm">
          {selectedItems.length > 0 && (
            <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex items-center">
              <button 
                onClick={handleBulkDelete}
                className="cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-red-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Deletar Selecionados ({selectedItems.length})
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm">
                  <th className="p-6 font-medium w-12">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      checked={selectedItems.length > 0 && selectedItems.length === articles.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-6 font-medium">Título do Artigo</th>
                  <th className="p-6 font-medium">Autor</th>
                  <th className="p-6 font-medium">Data</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {articles.map((artigo) => (
                  <tr key={artigo.id} className={`hover:bg-stone-50/50 transition-colors ${selectedItems.includes(artigo.id) ? 'bg-emerald-50/30' : ''}`}>
                    <td className="p-6">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        checked={selectedItems.includes(artigo.id)}
                        onChange={() => toggleSelectItem(artigo.id)}
                      />
                    </td>
                    <td className="p-6 font-bold text-stone-900">{artigo.title}</td>
                    <td className="p-6 text-stone-500 text-sm">{artigo.author}</td>
                    <td className="p-6 text-stone-500 text-sm">{artigo.date}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        artigo.status === 'Publicado' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {artigo.status}
                      </span>
                    </td>
                    <td className="p-6 flex items-center justify-end gap-3">
                      <button onClick={() => handleEdit(artigo)} className="cursor-pointer text-stone-400 hover:text-emerald-600 transition-colors" title="Editar Artigo">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(artigo.id)} className="cursor-pointer text-stone-400 hover:text-red-500 transition-colors" title="Excluir Artigo">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-stone-500">Nenhum artigo encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: EDITOR DE TEXTO E IA */}
      {view === 'editor' && (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Coluna Principal: Editor Funcional */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-stone-200 shadow-sm flex flex-col h-[700px]">
              
              <input 
                type="text" 
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título do Artigo..."
                className="w-full text-3xl font-serif text-stone-900 border-none focus:outline-none focus:ring-0 mb-6 placeholder:text-stone-300"
              />
              
              {/* Barra de Ferramentas Funcional */}
              <div className="flex gap-2 border-y border-stone-100 py-3 mb-6 overflow-x-auto hide-scrollbar">
                <button onClick={() => formatarTexto('<strong>', '</strong>')} className="cursor-pointer px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg font-serif font-bold transition-colors" title="Negrito">B</button>
                <button onClick={() => formatarTexto('<em>', '</em>')} className="cursor-pointer px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg font-serif italic transition-colors" title="Itálico">I</button>
                <button onClick={() => formatarTexto('<blockquote>', '</blockquote>')} className="cursor-pointer px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center" title="Citação">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                </button>
                <button onClick={() => formatarTexto('<ul><li>', '</li></ul>')} className="cursor-pointer px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center" title="Lista">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <div className="w-px h-6 bg-stone-200 my-auto mx-2"></div>
                <button onClick={handleInserirImagem} className="cursor-pointer px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Inserir Imagem
                </button>
              </div>

              <textarea 
                ref={textareaRef}
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                placeholder="Escreva seu artigo aqui. Selecione o texto e use os botões acima para formatar..."
                className="w-full flex-1 border-none focus:outline-none focus:ring-0 text-stone-700 leading-relaxed resize-none placeholder:text-stone-300"
              ></textarea>

              {/* Botões de Ação Separados */}
              <div className="pt-6 border-t border-stone-100 mt-auto flex flex-col sm:flex-row justify-end gap-4">
                <button 
                  onClick={() => salvarArtigo('Rascunho')}
                  className="cursor-pointer bg-stone-100 text-stone-700 border border-stone-200 px-8 py-3 rounded-xl font-bold hover:bg-stone-200 transition-all active:scale-95 shadow-sm"
                >
                  Salvar Rascunho
                </button>
                <button 
                  onClick={() => salvarArtigo('Publicado')}
                  className="cursor-pointer bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Publicar Artigo
                </button>
              </div>

            </div>
          </div>

          {/* Coluna Lateral: Assistente de Inteligência Artificial */}
          <div className="lg:col-span-1">
            <div className="bg-emerald-950 p-6 md:p-8 rounded-[2rem] shadow-xl sticky top-8 text-white">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center shadow-inner">
                  <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-xl font-serif font-bold">Assistente IA</h3>
              </div>

              <p className="text-sm text-emerald-200 mb-6 leading-relaxed">
                Descreva brevemente sobre o que você quer falar e eu escreverei um texto baseado na medicina ayurvédica.
              </p>

              <textarea 
                value={promptIA}
                onChange={(e) => setPromptIA(e.target.value)}
                placeholder="Ex: Escreva sobre os benefícios da Ashwagandha para reduzir a ansiedade."
                rows={4}
                className="w-full px-4 py-3 bg-emerald-900 border border-emerald-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder:text-emerald-400/50 transition-all resize-none mb-4"
              ></textarea>

              <button 
                onClick={handleGerarComIA}
                disabled={isGenerating || !promptIA}
                className="cursor-pointer w-full bg-white text-emerald-950 py-3 rounded-xl font-bold hover:bg-stone-100 transition-all active:scale-[0.98] shadow-md flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Gerando Texto...' : 'Gerar Rascunho Mágico'}
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
