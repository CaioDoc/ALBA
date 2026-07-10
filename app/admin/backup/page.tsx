"use client";

import React from 'react';

export default function BackupSiteAntigoPage() {
  return (
    <div className="w-full h-full flex flex-col animate-fade-in-up">
      <div className="mb-6 flex justify-between items-end flex-shrink-0">
        <div>
          <h2 className="text-3xl font-serif text-stone-900">Site Antigo (Modo Arquivo)</h2>
          <p className="text-stone-500 mt-1">
            Navegue pelo painel do site anterior diretamente por aqui.
          </p>
        </div>
        <a 
          href="https://antigo.ayurvedica.org/wp-admin" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-800 transition-colors shadow-md"
        >
          Abrir em Nova Aba
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </div>

      <div className="bg-white rounded-[2rem] border border-stone-200 p-2 shadow-sm flex-grow flex flex-col overflow-hidden mb-6 min-h-[700px]">
        {/* Barra de Navegação Falsa (Browser mock) */}
        <div className="bg-stone-100 px-4 py-2 flex items-center gap-2 rounded-t-[1.5rem] border-b border-stone-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="mx-auto bg-white px-4 py-1 rounded-md text-xs text-stone-500 font-mono shadow-sm flex items-center gap-2 border border-stone-200">
            <svg className="w-3 h-3 text-stone-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            https://antigo.ayurvedica.org/wp-admin
          </div>
        </div>
        
        {/* O Iframe que carrega o site antigo */}
        <iframe 
          src="https://antigo.ayurvedica.org/wp-admin" 
          className="w-full h-full flex-grow bg-stone-50 rounded-b-[1.5rem]"
          title="Painel do Site Antigo"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-shrink-0">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-orange-800 mb-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h4 className="font-bold">Aviso Importante</h4>
          </div>
          <p className="text-orange-900 text-sm leading-relaxed">
            Se o quadro acima aparecer em branco, é possível que o site antigo ainda não tenha sido movido para o subdomínio <strong>antigo.ayurvedica.org</strong> lá no cPanel, ou que o site bloqueie conexões embutidas. Nesse caso, use o botão "Abrir em Nova Aba".
          </p>
        </div>

        <div className="bg-stone-100 border border-stone-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-stone-800 mb-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
            <h4 className="font-bold">Acesso ao Servidor (cPanel)</h4>
          </div>
          <p className="text-stone-600 text-sm leading-relaxed mb-3">
            Para gerenciar os arquivos brutos ou banco de dados.
          </p>
          <a 
            href="https://cp140.webserver.pt:2083" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-800 text-sm font-bold flex items-center gap-1"
          >
            Acessar cPanel Original
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
