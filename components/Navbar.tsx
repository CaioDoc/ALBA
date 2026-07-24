"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const languages = [
  {
    code: 'pt',
    name: 'Português',
    flag: (
      <svg viewBox="0 0 100 100" className="w-5 h-5 rounded-full">
        <circle cx="50" cy="50" r="50" fill="#009b3a" />
        <polygon points="50,15 85,50 50,85 15,50" fill="#fedf00" />
        <circle cx="50" cy="50" r="20" fill="#002776" />
      </svg>
    )
  },
  {
    code: 'en',
    name: 'English',
    flag: (
      <svg viewBox="0 0 100 100" className="w-5 h-5 rounded-full">
        <clipPath id="flag-en">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        <g clipPath="url(#flag-en)">
          <rect width="100" height="100" fill="#00247d" />
          <path d="M0,0 L100,100 M100,0 L0,100" stroke="#fff" strokeWidth="15" />
          <path d="M0,0 L100,100 M100,0 L0,100" stroke="#cf142b" strokeWidth="6" />
          <path d="M50,0 V100 M0,50 H100" stroke="#fff" strokeWidth="25" />
          <path d="M50,0 V100 M0,50 H100" stroke="#cf142b" strokeWidth="15" />
        </g>
      </svg>
    )
  },
  {
    code: 'es',
    name: 'Español',
    flag: (
      <svg viewBox="0 0 100 100" className="w-5 h-5 rounded-full">
        <clipPath id="flag-es">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        <g clipPath="url(#flag-es)">
          <rect width="100" height="100" fill="#c60b1e" />
          <rect y="25" width="100" height="50" fill="#ffc400" />
        </g>
      </svg>
    )
  },
  {
    code: 'fr',
    name: 'Français',
    flag: (
      <svg viewBox="0 0 100 100" className="w-5 h-5 rounded-full">
        <clipPath id="flag-fr">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        <g clipPath="url(#flag-fr)">
          <rect width="33.3" height="100" fill="#002395" />
          <rect x="33.3" width="33.4" height="100" fill="#fff" />
          <rect x="66.7" width="33.3" height="100" fill="#ed2939" />
        </g>
      </svg>
    )
  }
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('pt');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSocialDropdownOpen, setIsSocialDropdownOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://www.facebook.com/alba.associacao/',
    instagram: 'https://www.instagram.com/alba_ayurvedica/',
    youtube: 'https://www.youtube.com/channel/UCJV-oPhprAjoHzuC59RvCYg',
    whatsapp: 'https://wa.me/351919075904'
  });
  const pathname = usePathname();

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/pt\/([a-z]{2})/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    }

    const savedLinks = localStorage.getItem('alba_social_links');
    if (savedLinks) {
      setSocialLinks(JSON.parse(savedLinks));
    }
  }, []);

  const changeLanguage = (lang: string) => {
    if (lang === 'pt') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + location.hostname + "; path=/;";
    } else {
      document.cookie = `googtrans=/pt/${lang}; path=/`;
      document.cookie = `googtrans=/pt/${lang}; domain=${location.hostname}; path=/`;
    }
    window.location.reload();
  };

  const currentLangDetails = languages.find(l => l.code === currentLang) || languages[0];

  interface NavItem {
    path: string;
    label: string;
    isSpecial?: boolean;
  }

  const navItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/quem-somos', label: 'Quem Somos' },
    { path: '/atividades', label: 'Atividades' },
    { path: '/cursos', label: 'Cursos' },
    { path: '/artigos', label: 'Artigos' },
    { path: '/profissionais', label: 'Profissionais' },
    { path: '/loja', label: 'Loja' },
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
              src="/logo_mini.png" 
              alt="Logo Associação Luso-Brasileira de Ayurveda"
              className="h-14 w-auto object-contain"
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
          
          {/* Elementos Desktop: Idioma, Redes e Botão Contato */}
          <div className="hidden md:flex items-center gap-3">
            {/* Seletor de Idioma Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="cursor-pointer flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-stone-850"
                aria-expanded={isLangDropdownOpen}
                aria-haspopup="true"
              >
                {currentLangDetails.flag}
                <span className="uppercase text-[10px]">{currentLangDetails.code}</span>
                <svg className={`w-3 h-3 text-stone-400 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLangDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-40 bg-stone-900 border border-stone-800 rounded-2xl shadow-xl py-2 z-20 animate-fade-in-up">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-bold transition-colors ${
                          currentLang === lang.code 
                            ? 'text-white bg-emerald-900/30' 
                            : 'text-stone-400 hover:text-white hover:bg-stone-800'
                        }`}
                      >
                        {lang.flag}
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Redes Sociais Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsSocialDropdownOpen(!isSocialDropdownOpen)}
                className="cursor-pointer flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-stone-850"
                aria-expanded={isSocialDropdownOpen}
                aria-haspopup="true"
              >
                <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Redes</span>
                <svg className={`w-3 h-3 text-stone-400 transition-transform ${isSocialDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isSocialDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSocialDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-40 bg-stone-900 border border-stone-800 rounded-2xl shadow-xl py-2 z-20 animate-fade-in-up">
                    {socialLinks.instagram && (
                      <a href={socialLinks.instagram} target="_blank" rel="noreferrer" onClick={() => setIsSocialDropdownOpen(false)} className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-bold text-stone-400 hover:text-white hover:bg-stone-800 transition-colors">
                        <svg className="w-4 h-4 text-[#E1306C]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        <span>Instagram</span>
                      </a>
                    )}
                    {socialLinks.youtube && (
                      <a href={socialLinks.youtube} target="_blank" rel="noreferrer" onClick={() => setIsSocialDropdownOpen(false)} className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-bold text-stone-400 hover:text-white hover:bg-stone-800 transition-colors">
                        <svg className="w-4 h-4 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        <span>AlbaTV</span>
                      </a>
                    )}
                    {socialLinks.facebook && (
                      <a href={socialLinks.facebook} target="_blank" rel="noreferrer" onClick={() => setIsSocialDropdownOpen(false)} className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-bold text-stone-400 hover:text-white hover:bg-stone-800 transition-colors">
                        <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        <span>Facebook</span>
                      </a>
                    )}
                    {socialLinks.whatsapp && (
                      <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" onClick={() => setIsSocialDropdownOpen(false)} className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-bold text-stone-400 hover:text-white hover:bg-stone-800 transition-colors">
                        <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 2.7 1.4 4.6 1.4 5.3 0 9.7-4.3 9.7-9.7 0-2.6-1-5-2.8-6.9-1.8-1.9-4.3-2.9-6.9-2.9-5.4 0-9.8 4.3-9.8 9.7 0 2 .5 3.5 1.4 5.1l-.9 3.5 3.7-.9zm12-4.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.3-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.4l.3-.4c.1-.1.1-.2.2-.3.1-.1.1-.2 0-.3-.1-.2-.5-1.2-.7-1.7-.2-.5-.4-.4-.5-.4h-.4c-.2 0-.5.1-.7.3-.2.2-.8.8-.8 2 0 1.2.9 2.4 1 2.6.1.2 1.8 2.7 4.3 3.8.6.3 1.1.4 1.5.6.6.2 1.1.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.3z"/></svg>
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>

            <Link href="/associe-se" className="cursor-pointer bg-white text-emerald-900 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-stone-100 transition-all active:scale-95 shadow-md">
              Contato
            </Link>
          </div>
          
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
            {/* Seletor de Idioma Mobile */}
            <div className="border-t border-stone-800 pt-4 mt-2">
              <p className="text-xs text-stone-500 font-bold uppercase tracking-wider mb-3">Idioma / Language</p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                      currentLang === lang.code 
                        ? 'bg-emerald-900/20 border-emerald-500 text-white' 
                        : 'bg-stone-800/50 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {lang.flag}
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Redes Sociais Mobile */}
            <div className="border-t border-stone-800 pt-4 mt-2">
              <p className="text-xs text-stone-500 font-bold uppercase tracking-wider mb-3">Redes Sociais</p>
              <div className="grid grid-cols-2 gap-2">
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-800 bg-stone-800/50 text-stone-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#E1306C]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    <span>Instagram</span>
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-800 bg-stone-800/50 text-stone-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    <span>AlbaTV</span>
                  </a>
                )}
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-800 bg-stone-800/50 text-stone-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span>Facebook</span>
                  </a>
                )}
                {socialLinks.whatsapp && (
                  <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-800 bg-stone-800/50 text-stone-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 2.7 1.4 4.6 1.4 5.3 0 9.7-4.3 9.7-9.7 0-2.6-1-5-2.8-6.9-1.8-1.9-4.3-2.9-6.9-2.9-5.4 0-9.8 4.3-9.8 9.7 0 2 .5 3.5 1.4 5.1l-.9 3.5 3.7-.9zm12-4.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.3-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.4l.3-.4c.1-.1.1-.2.2-.3.1-.1.1-.2 0-.3-.1-.2-.5-1.2-.7-1.7-.2-.5-.4-.4-.5-.4h-.4c-.2 0-.5.1-.7.3-.2.2-.8.8-.8 2 0 1.2.9 2.4 1 2.6.1.2 1.8 2.7 4.3 3.8.6.3 1.1.4 1.5.6.6.2 1.1.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.3z"/></svg>
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            <Link href="/associe-se" onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer w-full bg-white text-emerald-900 px-6 py-4 rounded-xl text-base font-bold hover:bg-stone-100 transition-colors text-center block">
              Contato
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
