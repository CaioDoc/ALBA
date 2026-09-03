"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Login form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const authData = localStorage.getItem('alba_admin_auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed && parsed.authenticated === true) {
          setIsAuthenticated(true);
          return;
        }
      } catch (e) {}
    }
    setIsAuthenticated(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (username.trim() === 'AyurvedaAD' && password === 'As@n@AD26') {
        localStorage.setItem(
          'alba_admin_auth',
          JSON.stringify({
            authenticated: true,
            user: 'AyurvedaAD',
            timestamp: Date.now(),
          })
        );
        setIsAuthenticated(true);
      } else {
        setErrorMsg('Usuário ou senha incorretos. Por favor, verifique os dados.');
      }
      setIsSubmitting(false);
    }, 400);
  };

  const handleLogout = () => {
    localStorage.removeItem('alba_admin_auth');
    setIsAuthenticated(false);
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Associados', path: '/admin/associados', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Cursos', path: '/admin/cursos', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
    { name: 'Artigos', path: '/admin/artigos', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { name: 'Agenda', path: '/admin/agenda', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Promoções (WhatsApp)', path: '/admin/promocoes', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { name: 'Mensagens / Leads', path: '/admin/leads', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Redes Sociais', path: '/admin/redes-sociais', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { name: 'Loja & Pedidos', path: '/admin/loja', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { name: 'Site Antigo (Backup)', path: '/admin/backup', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
  ];

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center font-sans text-stone-600">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Verificando autorização...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 font-sans text-stone-800">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-stone-800 relative overflow-hidden">
          {/* Barra decorativa no topo */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-800"></div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-800 shadow-inner">
              <img src="https://www.ayurvedica.org/wp-content/uploads/2019/05/miniLogo.png" alt="ALBA" className="h-9 w-auto" />
            </div>
            <h1 className="text-2xl font-serif text-stone-900 font-bold">Painel Administrativo</h1>
            <p className="text-xs text-stone-500 mt-1">Acesso exclusivo para administradores da ALBA</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Usuário de Acesso</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Informe seu login"
                  className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-stone-900 transition-all text-sm font-medium"
                />
                <svg className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Senha de Segurança</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-stone-900 transition-all text-sm font-medium"
                />
                <svg className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.05 10.05 0 013.682-.713c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.692-4.692a3 3 0 00-4.243-4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-emerald-900 active:scale-[0.99] transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <Link href="/" className="text-xs font-semibold text-stone-500 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 cursor-pointer">
              &larr; Voltar para a página inicial do site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans text-stone-800">
      
      <aside className={`bg-stone-900 text-stone-300 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} fixed md:relative z-50 h-screen shadow-2xl`} aria-label="Barra lateral de administração">
        <div className="h-20 flex items-center justify-between px-4 border-b border-stone-800 flex-shrink-0">
          {isSidebarOpen ? (
            <img src="https://www.ayurvedica.org/wp-content/uploads/2019/05/miniLogo.png" alt="ALBA Admin" className="h-8 w-auto" />
          ) : (
            <div className="w-8 h-8 bg-emerald-800 rounded-full flex items-center justify-center text-white font-serif text-sm">A</div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Fechar menu" className="cursor-pointer text-stone-400 hover:text-white md:hidden">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-3 hide-scrollbar" aria-label="Menu de administração">
          {menuItems.map((item) => {
            const isActive = item.path === '/admin' 
              ? pathname === '/admin'
              : pathname === item.path || pathname.startsWith(`${item.path}/`);

            return (
              <Link key={item.path} href={item.path} className={`cursor-pointer flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${isActive ? 'bg-emerald-800 text-white shadow-md' : 'hover:bg-stone-800 hover:text-white'}`}>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {isSidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-800">
          <button
            onClick={handleLogout}
            aria-label="Sair do painel"
            className="cursor-pointer flex items-center gap-3 text-stone-400 hover:text-red-400 transition-colors w-full px-3 py-2 text-left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarOpen && <span className="text-sm font-medium">Sair do Painel</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-stone-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Alternar menu lateral" className="cursor-pointer text-stone-500 hover:text-emerald-700 hidden md:block">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-xl text-stone-900 font-bold">Painel de Gestão</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="cursor-pointer text-sm font-medium text-emerald-700 hover:text-emerald-800 hidden sm:flex items-center gap-1">
              Ver site <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </Link>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 font-bold border border-emerald-200" title="AyurvedaAD (Administrador)">
              AD
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-stone-50">
          {children}
        </div>
      </main>

    </div>
  );
}
