"use client";

import React from 'react';

export default function BackupSiteAntigoPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-stone-900">Site Antigo (Modo Arquivo)</h2>
        <p className="text-stone-500 mt-1">
          Acesse os dados, publicações e históricos do site anterior.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm mb-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Acesso ao Acervo Antigo</h3>
            <p className="text-stone-600 mb-6 leading-relaxed">
              O site antigo continua rodando de forma independente no servidor cPanel para garantir que nenhuma informação (como leads antigos, histórico de alunos ou matérias de blog passadas) seja perdida. 
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://ayurvedica.org/wp-admin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors shadow-md"
              >
                Acessar Painel Antigo
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              <a 
                href="https://ayurvedica.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-stone-100 text-stone-700 px-6 py-3 rounded-xl font-bold hover:bg-stone-200 transition-colors"
              >
                Ver Site Antigo Público
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-orange-800 mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h4 className="font-bold">Aviso sobre o Domínio</h4>
          </div>
          <p className="text-orange-900 text-sm leading-relaxed">
            Quando o novo site for publicado oficialmente (e o domínio <strong>ayurvedica.org</strong> passar a apontar para ele), o site antigo ficará acessível através de um subdomínio (como <em>antigo.ayurvedica.org</em>) ou pelo endereço direto do servidor (<em>cp140.webserver.pt</em>).
          </p>
        </div>

        <div className="bg-stone-100 border border-stone-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-stone-800 mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <h4 className="font-bold">Acesso ao Servidor</h4>
          </div>
          <p className="text-stone-600 text-sm leading-relaxed mb-3">
            Para gerenciar os arquivos brutos ou banco de dados do site antigo, o cliente pode acessar diretamente o cPanel original.
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
