"use client";

import React from 'react';

export default function BackupSiteAntigoPage() {
  return (
    <div className="w-full h-full flex flex-col animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-stone-900">Site Antigo (Modo Arquivo)</h2>
        <p className="text-stone-500 mt-1">
          Acesse o painel do WordPress anterior de forma segura.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] border border-stone-200 p-10 shadow-sm mb-6 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-stone-900 mb-4">Painel de Administração Antigo</h3>
        <p className="text-stone-500 max-w-md mb-8 leading-relaxed">
          Para garantir a segurança e evitar bloqueios do navegador, o painel do WordPress antigo deve ser acessado em uma aba separada.
        </p>
        <a 
          href="https://www.ayurvedica.org/site_backup/wp-admin" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-emerald-800 transition-all active:scale-95 shadow-md"
        >
          Acessar Painel Original
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-shrink-0">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-orange-800 mb-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h4 className="font-bold">Aviso Importante</h4>
          </div>
          <p className="text-orange-900 text-sm leading-relaxed">
            Certifique-se de ter modificado o arquivo <strong>wp-config.php</strong> na pasta de backup para que o WordPress reconheça o novo endereço.
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
