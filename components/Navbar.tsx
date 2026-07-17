"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/quem-somos', label: 'Quem Somos' },
    { path: '/atividades', label: 'Atividades' },
    { path: '/cursos', label: 'Cursos' },
    { path: '/loja', label: 'Loja', isSpecial: true },
    { path: '/artigos', label: 'Artigos' },
    { path: '/profissionais', label: 'Profissionais' },
  ];

  const getDesktopClass = (path: string, isSpecial?: boolean) => {
    const isActive = pathname === path;
    if (isSpecial) {
      return isActive 
        ? 'cursor-pointer text-emerald-300 font-bold' 
        : 'cursor-pointer hover:text-white transition-colors text-emerald-400 font-bold';
    }
    return isActive 
      ? 'cursor-pointer text-white font-bold' 
      : 'cursor-pointer text-stone-300 hover:text-white transition-colors font-medium';
  };

  const getMobileClass = (path: string, isSpecial?: boolean) => {
    const isActive = pathname === path;
    if (isSpecial) {
      return isActive 
        ? 'cursor-pointer text-emerald-300 font-bold text-lg py-2 border-b border-stone-800' 
        : 'cursor-pointer text-emerald-400 hover:text-emerald-300 font-bold text-lg py-2 border-b border-stone-800';
    }
    return isActive 
      ? 'cursor-pointer text-white font-bold text-lg py-2 border-b border-stone-800' 
      : 'cursor-pointer text-stone-300 hover:text-white font-medium text-lg py-2 border-b border-stone-800';
  };

  return (
    <>
      <nav className="w-full bg-stone-900/95 backdrop-blur-md border-b border-stone-800 sticky top-0 z-50" aria-label="Navegação principal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Oficial com Link para a Home */}
          <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer transition-transform hover:scale-105">
            <img 
              src="/logo_alba_magenta.svg" 
              alt="Logo Associação Luso-Brasileira de Ayurveda"
              className="h-14 w-auto object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </Link>
          
          {/* Links da Navegação Desktop */}
          <div className="hidden md:flex gap-6 lg:gap-8 text-sm">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} className={getDesktopClass(item.path, item.isSpecial)}>
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Botão de Ação Desktop */}
          <Link href="/associe-se" className="cursor-pointer bg-white text-emerald-900 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-stone-100 transition-all active:scale-95 shadow-md hidden md:block">
            Associe-se
          </Link>
          
          {/* Botão Hamburger para Mobile */}
          <button 
            className="cursor-pointer md:hidden text-stone-300 p-2 focus:outline-none hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Alternar menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>
      </nav>

      {/* Overlay do Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-stone-950/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute top-20 left-0 w-full bg-stone-900 border-b border-stone-800 shadow-2xl flex flex-col py-4 px-6 space-y-4 animate-fade-in-down"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={getMobileClass(item.path, item.isSpecial)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/associe-se" onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer w-full mt-4 bg-white text-emerald-900 px-6 py-4 rounded-xl text-base font-bold hover:bg-stone-100 transition-colors text-center block">
              Associe-se Agora
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
