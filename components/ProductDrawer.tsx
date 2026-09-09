"use client";

import React, { useEffect } from 'react';
import { ProductItem } from './CheckoutModal';

interface ProductDrawerProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (product: ProductItem) => void;
}

export const ProductDrawer = ({ product, isOpen, onClose, onBuy }: ProductDrawerProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!product) return null;

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

  const cleanCategory = (cat?: string, title?: string) => {
    if (!cat) return 'Livro';
    const trimmed = cat.trim();
    const lower = trimmed.toLowerCase();
    if (lower.includes('livros & apostilas') || lower.includes('livros e apostilas')) {
      const t = (title || '').toLowerCase();
      return (t.includes('manual') || t.includes('apostil')) ? 'Apostila' : 'Livro';
    }
    return trimmed;
  };

  return (
    <>
      {/* Backdrop com blur */}
      <div 
        className={`fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300 cursor-pointer ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`} 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container Lateral */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
      >
        {/* Barra superior estética */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-800" />

        {/* Header do Drawer */}
        <div className="relative p-6 md:p-8 bg-stone-100 border-b border-stone-200 pr-16">
          <button 
            onClick={onClose} 
            aria-label="Fechar" 
            className="cursor-pointer absolute top-6 right-6 w-10 h-10 bg-white hover:bg-stone-200 text-stone-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
              {cleanCategory(product.category, product.title)}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              product.type === 'digital' 
                ? 'bg-teal-100 text-teal-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {product.type === 'digital' ? '✨ Conteúdo Digital' : '📦 Envio Físico'}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-serif text-stone-900 leading-snug mt-2">
            {product.title}
          </h2>
        </div>

        {/* Corpo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 text-stone-800 space-y-6">
          
          {/* Imagem de Capa */}
          <div className="w-full h-72 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm relative flex items-center justify-center">
            {product.image ? (
              <img 
                src={getImagePath(product.image)} 
                alt={product.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop';
                }}
              />
            ) : (
              <div className="text-stone-400 font-medium text-sm flex flex-col items-center gap-2">
                <span className="text-4xl">📖</span>
                <span>Sem imagem disponível</span>
              </div>
            )}
          </div>

          {/* Card de Preço e Destaques */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Preço oficial</span>
              <span className="text-3xl font-serif font-bold text-emerald-800">{product.price}</span>
            </div>

            <div className="pt-3 border-t border-stone-200/60 grid grid-cols-2 gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                <span>{product.type === 'digital' ? 'Acesso Google Drive' : 'Envio com Rastreio'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                <span>Pagamento via PIX</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                <span>Material Oficial ALBA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                <span>Suporte Institucional</span>
              </div>
            </div>
          </div>

          {/* Descrição Completa do Produto */}
          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>📄</span>
              <span>Descrição Completa</span>
            </h3>
            <div className="text-stone-700 text-sm md:text-base leading-relaxed whitespace-pre-line bg-stone-50/60 p-5 rounded-2xl border border-stone-100 font-normal">
              {product.description || 'Nenhuma descrição detalhada informada para este produto.'}
            </div>
          </div>

          {/* Aviso sobre a entrega */}
          {product.type === 'digital' ? (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-xs text-teal-900 flex items-start gap-3">
              <span className="text-lg">✨</span>
              <div className="leading-relaxed">
                <strong>Liberação Digital Segura:</strong> Ao concluir o pagamento via PIX, o pedido é registrado e o link de acesso aos arquivos no Google Drive será disponibilizado para o seu e-mail cadastrado.
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <span className="text-lg">📦</span>
              <div className="leading-relaxed">
                <strong>Envio Físico pelos Correios:</strong> Ao clicar em comprar, você preencherá seu endereço completo de entrega. Nosso time preparará seu pacote com todo o cuidado.
              </div>
            </div>
          )}

        </div>

        {/* Rodapé Fixo com Botão Comprar */}
        <div className="p-6 bg-white border-t border-stone-200 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">Total</span>
            <div className="text-2xl font-bold font-serif text-emerald-800">{product.price}</div>
          </div>

          <button 
            type="button"
            onClick={() => onBuy(product)}
            className="cursor-pointer flex-1 bg-emerald-700 text-white py-3.5 px-6 rounded-xl font-bold hover:bg-emerald-800 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <span>Comprar Agora</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};
