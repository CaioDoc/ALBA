import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      
      <div>
        <h2 className="text-3xl font-serif text-stone-900">Visão Geral</h2>
        <p className="text-stone-500 mt-1">Bem-vindo ao painel administrativo da ALBA. Aqui está o resumo de hoje.</p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4 border-l-4 border-l-emerald-600">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Associados Ativos</p>
            <p className="text-2xl font-bold text-stone-900">412</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4 border-l-4 border-l-blue-600">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /></svg>
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Cursos Publicados</p>
            <p className="text-2xl font-bold text-stone-900">8</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4 border-l-4 border-l-orange-600">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Eventos na Agenda</p>
            <p className="text-2xl font-bold text-stone-900">3</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4 border-l-4 border-l-purple-600">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Artigos no Blog</p>
            <p className="text-2xl font-bold text-stone-900">45</p>
          </div>
        </div>
      </div>

      {/* Atalhos e Mensagens */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-stone-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Ações Rápidas
          </h3>
          
          {/* CORREÇÃO: Botões de Ações Rápidas agora são Links reais e funcionais */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/associados" className="cursor-pointer bg-stone-50 border border-stone-200 p-4 rounded-2xl text-left hover:bg-emerald-50 hover:border-emerald-200 transition-colors group block">
              <span className="block font-bold text-stone-800 group-hover:text-emerald-800 mb-1">Novo Associado</span>
              <span className="text-xs text-stone-500">Cadastrar terapeuta</span>
            </Link>
            
            <Link href="/admin/artigos" className="cursor-pointer bg-stone-50 border border-stone-200 p-4 rounded-2xl text-left hover:bg-emerald-50 hover:border-emerald-200 transition-colors group block">
              <span className="block font-bold text-stone-800 group-hover:text-emerald-800 mb-1">Escrever Artigo</span>
              <span className="text-xs text-stone-500">Usar assistente IA</span>
            </Link>
            
            <Link href="/admin/promocoes" className="cursor-pointer bg-stone-50 border border-stone-200 p-4 rounded-2xl text-left hover:bg-emerald-50 hover:border-emerald-200 transition-colors group block">
              <span className="block font-bold text-stone-800 group-hover:text-emerald-800 mb-1">Disparo WhatsApp</span>
              <span className="text-xs text-stone-500">Promover cursos</span>
            </Link>
            
            <Link href="/admin/agenda" className="cursor-pointer bg-stone-50 border border-stone-200 p-4 rounded-2xl text-left hover:bg-emerald-50 hover:border-emerald-200 transition-colors group block">
              <span className="block font-bold text-stone-800 group-hover:text-emerald-800 mb-1">Adicionar Evento</span>
              <span className="text-xs text-stone-500">Atualizar Agenda</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-stone-900 mb-6">Últimos Leads (Interessados)</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <p className="font-bold text-stone-800 text-sm">Mariana Silva</p>
                <p className="text-xs text-stone-500">mariana@exemplo.com • Há 2 horas</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-lg">Estudante</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <p className="font-bold text-stone-800 text-sm">João Pedro Costa</p>
                <p className="text-xs text-stone-500">joao.terapeuta@exemplo.com • Há 5 horas</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-lg">Profissional</span>
            </div>
            
            {/* CORREÇÃO: "Ver todas as mensagens" agora redireciona perfeitamente para a caixa de entrada */}
            <Link href="/admin/leads" className="cursor-pointer w-full text-center text-sm font-bold text-emerald-700 hover:text-emerald-800 pt-2 block">
              Ver todas as mensagens
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
