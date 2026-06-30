"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Associados', path: '/admin/associados', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Artigos', path: '/admin/artigos', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { name: 'Cursos', path: '/admin/cursos', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
    { name: 'Agenda', path: '/admin/agenda', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Promoções (WhatsApp)', path: '/admin/promocoes', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { name: 'Mensagens / Leads', path: '/admin/leads', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans text-stone-800">
      
      <aside className={`bg-stone-900 text-stone-300 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} fixed md:relative z-50 h-screen shadow-2xl`}>
        <div className="h-20 flex items-center justify-between px-4 border-b border-stone-800 flex-shrink-0">
          {isSidebarOpen ? (
            <img src="https://www.ayurvedica.org/wp-content/uploads/2019/05/miniLogo.png" alt="ALBA Admin" className="h-8 w-auto" />
          ) : (
            <div className="w-8 h-8 bg-emerald-800 rounded-full flex items-center justify-center text-white font-serif text-sm">A</div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="cursor-pointer text-stone-400 hover:text-white md:hidden">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-3 hide-scrollbar">
          {menuItems.map((item) => {
            // CORREÇÃO AQUI: Se for a home do admin, valida a igualdade exata para não conflitar com sub-pastas
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
          <Link href="/" className="cursor-pointer flex items-center gap-3 text-stone-400 hover:text-red-400 transition-colors w-full px-3 py-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {isSidebarOpen && <span className="text-sm font-medium">Sair</span>}
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-stone-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="cursor-pointer text-stone-500 hover:text-emerald-700 hidden md:block">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-xl text-stone-900 font-bold">Painel de Gestão</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="cursor-pointer text-sm font-medium text-emerald-700 hover:text-emerald-800 hidden sm:flex items-center gap-1">
              Ver site <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </Link>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 font-bold border border-emerald-200">
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
