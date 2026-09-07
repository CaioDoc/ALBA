"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { CheckoutModal, ProductItem } from '../../components/CheckoutModal';
import { ProductDrawer } from '../../components/ProductDrawer';

const API_URL = '/api/loja.php';

const defaultProducts: ProductItem[] = [
  {
    "id": "prod-champi-livro-fisico",
    "title": "Massagem Indiana à Cabeça Champi, Manual Prático e Noções Teóricas Básicas",
    "category": "Livro",
    "type": "fisico",
    "price": "R$ 60,00",
    "priceNumber": 60.0,
    "image": "/books/champi.jpeg",
    "description": "O manual de Indian Head Massage (conhecida como Champi) descreve a técnica de massagem na cabeça passo a passo, com todos os movimentos e pontos de energia.",
    "digitalUrl": "",
    "status": "Ativo"
  },
  {
    "id": "prod-champi-livro-digital",
    "title": "Massagem Indiana à Cabeça Champi, Manual Prático e Noções Teóricas Básicas",
    "category": "E-book",
    "type": "digital",
    "price": "R$ 20,00",
    "priceNumber": 20.0,
    "image": "/books/champi.jpeg",
    "description": "O manual de Indian Head Massage (conhecida como Champi) descreve a técnica de massagem na cabeça passo a passo, com todos os movimentos e pontos de energia.",
    "digitalUrl": "https://drive.google.com/file/d/1s3hwrKcM3YzwkgBArDhbzdRvSP_xvPfQ/view?usp=sharing",
    "status": "Ativo"
  },
  {
    "id": "prod-manual-indian-head-massage-digital",
    "title": "Manual de Indian Head Massage",
    "category": "Apostila",
    "type": "digital",
    "price": "R$ 15,00",
    "priceNumber": 15.0,
    "image": "/images/cursos/indian-head-massage-champi/thumb/thumb.jpg",
    "description": "Este manual descreve, passo a passo, a realização de uma massagem completa com as mãos dos pés à cabeça.",
    "digitalUrl": "https://drive.google.com/file/d/1WOEPtqbReenpSo9Hpj7rRL1CS9ya4Wgn/view?usp=sharing",
    "status": "Ativo"
  }
];

const STORE_FILTERS = ['Todos', 'Apostilas', 'Livros', 'E-books'] as const;
type StoreFilter = typeof STORE_FILTERS[number];

const MAX_DESC_CHARS = 165;

export default function LojaPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<StoreFilter>('Todos');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [drawerProduct, setDrawerProduct] = useState<ProductItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Helper para resolver caminho de imagens locais no GitHub Pages ou domínio principal
  const getImagePath = (src: string) => {
    const fallback = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop';
    if (!src) return fallback;
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    
    const clean = src.replace(/^\//, '');
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (window.location.hostname.includes('github.io') || pathname.startsWith('/ALBA')) {
        return `/ALBA/${clean}`;
      }
    }
    return `/${clean}`;
  };

  // Carregar produtos do servidor / fallback
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}?action=products`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const activeOnly = data.filter((p: ProductItem) => p.status === 'Ativo');
            setProducts(activeOnly);
            localStorage.setItem('alba_loja_produtos_server', JSON.stringify(data));
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Servidor indisponível, tentando localStorage.', e);
      }

      // Fallback localStorage
      const saved = localStorage.getItem('alba_loja_produtos_server');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const activeOnly = parsed.filter((p: ProductItem) => p.status === 'Ativo');
            setProducts(activeOnly);
            setIsLoading(false);
            return;
          }
        } catch (e) {}
      }

      // Fallback padrão
      setProducts(defaultProducts);
      setIsLoading(false);
    };

    load();
  }, []);

  // Lógica de correspondência de categoria por filtro
  const isCategoryMatch = (product: ProductItem, filter: StoreFilter): boolean => {
    if (filter === 'Todos') return true;
    const cat = (product.category || '').toLowerCase().trim();
    if (filter === 'Apostilas') {
      return cat.includes('apostil') || cat.includes('manual');
    }
    if (filter === 'Livros') {
      return cat.includes('livro');
    }
    if (filter === 'E-books') {
      return cat.includes('e-book') || cat.includes('ebook');
    }
    return false;
  };

  const filteredProducts = products.filter(p => isCategoryMatch(p, activeFilter));

  const getFilterCount = (filter: StoreFilter) => {
    return products.filter(p => isCategoryMatch(p, filter)).length;
  };

  const handleOpenCheckout = (product: ProductItem) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleOpenDrawer = (product: ProductItem) => {
    setDrawerProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerProduct(null);
  };

  const handleBuyFromDrawer = (product: ProductItem) => {
    setIsDrawerOpen(false);
    setDrawerProduct(null);
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-stone-100 border-b border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-emerald-700 font-bold mb-4 uppercase tracking-widest text-sm">Loja Oficial ALBA</p>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Livros, Apostilas & E-books</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Adquira apostilas e e-books digitais com acesso liberado após a confirmação ou livros impressos com entrega em todo o Brasil.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 flex-grow">
        <div className="max-w-7xl mx-auto">
          
          {/* Categorias / Filtros Requisitados: Todos, Apostilas, Livros, E-books */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {STORE_FILTERS.map(filter => {
              const count = getFilterCount(filter);
              const isActive = activeFilter === filter;
              return (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`cursor-pointer px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                    isActive 
                      ? 'bg-emerald-800 text-white shadow-md scale-105' 
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-emerald-800'
                  }`}
                >
                  <span>{filter}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-emerald-950/40 text-emerald-100' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grid de Produtos */}
          {isLoading ? (
            <div className="w-full flex flex-col items-center justify-center min-h-[300px] gap-4">
              <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin"></div>
              <p className="text-stone-500 text-sm">Carregando catálogo da loja...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-stone-100 max-w-xl mx-auto shadow-sm">
              <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-xl font-serif text-stone-700 font-bold">Nenhum item em "{activeFilter}"</h3>
              <p className="text-stone-500 text-sm mt-2 mb-6">No momento não encontramos materiais cadastrados nesta categoria.</p>
              <button
                onClick={() => setActiveFilter('Todos')}
                className="cursor-pointer text-xs font-bold px-5 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
              >
                Ver todos os materiais
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const description = product.description || '';
                const isLong = description.length > MAX_DESC_CHARS;
                const shortDesc = isLong ? description.slice(0, MAX_DESC_CHARS).trim() + '...' : description;

                return (
                  <div 
                    key={product.id} 
                    className="group flex flex-col bg-white rounded-[2rem] border border-stone-200/80 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
                  >
                    {/* Imagem de Capa do Card */}
                    <div 
                      onClick={() => handleOpenDrawer(product)}
                      className="relative h-64 w-full overflow-hidden bg-stone-100 flex items-center justify-center cursor-pointer"
                      title="Clique para ver detalhes"
                    >
                      {product.image ? (
                        <img 
                          src={getImagePath(product.image)} 
                          alt={product.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400 font-medium">
                          Sem Imagem
                        </div>
                      )}
                      
                      {/* Badge de Categoria */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-stone-800 shadow-sm">
                        {product.category}
                      </div>

                      {/* Badge de Tipo (Digital vs Físico) */}
                      <div className="absolute top-4 right-4 shadow-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          product.type === 'digital' 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-amber-600 text-white'
                        }`}>
                          {product.type === 'digital' ? '✨ Digital' : '📦 Físico'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Conteúdo do Card com limite de caracteres */}
                    <div className="p-7 md:p-8 flex flex-col flex-grow">
                      <h3 
                        onClick={() => handleOpenDrawer(product)}
                        className="text-xl md:text-2xl font-serif text-stone-900 mb-3 group-hover:text-emerald-700 transition-colors leading-snug cursor-pointer line-clamp-2"
                        title={product.title}
                      >
                        {product.title}
                      </h3>
                      
                      {/* Descrição truncada em 165 caracteres + Botão Leia mais / Mais detalhes */}
                      <div className="mb-6 flex-grow flex flex-col justify-between">
                        <p className="text-stone-500 text-sm leading-relaxed">
                          {shortDesc}
                        </p>
                        
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(product)}
                          className="cursor-pointer text-emerald-700 hover:text-emerald-900 font-bold text-xs inline-flex items-center gap-1.5 transition-colors mt-3 w-fit group/btn"
                        >
                          <span>{isLong ? 'Leia mais' : 'Mais detalhes'}</span>
                          <svg className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Rodapé do Card com Preço e Botão de Compra */}
                      <div className="flex items-center justify-between mt-auto border-t border-stone-100 pt-5">
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">Valor</span>
                          <div className="text-2xl font-bold font-serif text-emerald-800">{product.price}</div>
                        </div>
                        
                        <button 
                          onClick={() => handleOpenCheckout(product)}
                          className="cursor-pointer bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all active:scale-95 shadow-md flex items-center gap-2"
                        >
                          <span>Comprar</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Drawer Lateral com Detalhes Completos do Produto */}
      <ProductDrawer 
        product={drawerProduct}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onBuy={handleBuyFromDrawer}
      />

      {/* Modal de Checkout */}
      <CheckoutModal
        product={selectedProduct}
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setSelectedProduct(null);
        }}
      />
      
    </div>
  );
}
