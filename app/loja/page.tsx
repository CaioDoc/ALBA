"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import Link from 'next/link';

const API_URL = 'https://ayurvedica.org/api/loja.php';

// Interface do Produto
interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  image: string;
  description: string;
  hotmartLink: string;
  status: string;
}

export default function LojaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true);

  // Carregar produtos da API MySQL ao iniciar
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filtrar apenas os ativos para exibir na loja pública
          const activeProducts = data.filter(p => p.status === 'Ativo');
          setProducts(activeProducts);
        }
      })
      .catch(err => {
        console.error('Erro ao carregar produtos', err);
        setProducts([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = activeCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-stone-100 border-b border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Nossa Loja Digital</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Aprofunde seus conhecimentos. Aqui você encontra e-books, mentorias e ferramentas 
            desenvolvidas por especialistas para o seu desenvolvimento no Ayurveda.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 flex-grow">
        <div className="max-w-7xl mx-auto">
          
          {/* Categorias / Filtro */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`cursor-pointer px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-emerald-800 text-white shadow-md' 
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Grid de Produtos */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-stone-600">Carregando loja...</h3>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-xl font-bold text-stone-600">Nenhum produto disponível</h3>
              <p className="text-stone-500 mt-2">No momento não temos produtos disponíveis. Volte em breve!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col bg-white rounded-[2rem] border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                  <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400">
                        Sem Imagem
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
                      {product.category}
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-serif text-stone-900 mb-3">{product.title}</h3>
                    <p className="text-stone-500 text-sm mb-6 flex-grow">{product.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto border-t border-stone-100 pt-6">
                      <div className="text-2xl font-bold text-emerald-700">{product.price}</div>
                      <a 
                        href={product.hotmartLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="cursor-pointer bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-colors shadow-md flex items-center gap-2"
                      >
                        Comprar
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
    </div>
  );
}
