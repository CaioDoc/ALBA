"use client";

import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 pt-20 pb-8 px-4 border-t border-stone-800 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Coluna 1: Logo e Redes Sociais */}
        <div className="space-y-6">
          <Link href="/" className="cursor-pointer inline-block bg-white p-3 rounded-2xl shadow-lg transition-transform hover:scale-105">
            <img 
              src="https://www.ayurvedica.org/wp-content/uploads/2019/05/miniLogo.png" 
              alt="Logo ALBA" 
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="text-sm leading-relaxed text-stone-400">
            Associação Luso-Brasileira de Ayurveda. Promovendo o conhecimento milenar para a saúde integral no Brasil e na Europa.
          </p>
          
          {/* Redes Sociais */}
          <div className="flex gap-4 pt-2">
            <a href="#" target="_blank" rel="noreferrer" className="cursor-pointer w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-emerald-800 hover:text-white transition-all shadow-md" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://wa.me/351919075904" target="_blank" rel="noreferrer" className="cursor-pointer w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-emerald-800 hover:text-white transition-all shadow-md" aria-label="WhatsApp">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.031 2.007a9.96 9.96 0 00-7.07 2.926 9.96 9.96 0 00-2.927 7.07c-.004 1.764.444 3.498 1.302 5.02L2.007 22l5.12-1.332a9.932 9.932 0 004.904 1.291h.005c5.503 0 9.975-4.476 9.978-9.978a9.96 9.96 0 00-2.927-7.07 9.957 9.957 0 00-7.056-2.904zm.005 16.29a8.212 8.212 0 01-4.186-1.143l-.3-.178-3.112.81.828-3.033-.195-.311a8.216 8.216 0 01-1.258-4.385c-.002-4.542 3.696-8.24 8.24-8.242a8.217 8.217 0 015.826 2.41 8.216 8.216 0 012.408 5.827c-.002 4.542-3.696 8.24-8.24 8.241zM16.55 13.91c-.247-.124-1.463-.723-1.69-.806-.228-.083-.394-.124-.56.124-.165.247-.641.806-.786.971-.144.165-.29.186-.537.062-.247-.124-1.045-.385-1.99-1.23-.736-.658-1.232-1.47-1.376-1.718-.144-.248-.016-.381.108-.505.111-.11.247-.288.37-.432.124-.144.165-.248.247-.413.083-.165.041-.31-.02-.434-.062-.124-.56-1.352-.767-1.85-.201-.482-.405-.417-.56-.425-.144-.007-.31-.008-.475-.008-.165 0-.434.062-.66.31-.228.247-.868.847-.868 2.065 0 1.218.89 2.395 1.014 2.56.124.165 1.745 2.663 4.228 3.676.591.24 1.052.384 1.412.492.593.189 1.134.162 1.56.098.476-.071 1.463-.598 1.67-1.176.206-.578.206-1.074.144-1.176-.062-.103-.228-.165-.475-.29z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Coluna 2: Contatos */}
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Fale Conosco</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@ayurvedica.org" className="cursor-pointer hover:text-white transition-colors">info@ayurvedica.org</a>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div className="flex flex-col gap-1">
                <a href="tel:+351919075904" className="cursor-pointer hover:text-white transition-colors">(+351) 919 075 904</a>
                <a href="tel:+351212467740" className="cursor-pointer hover:text-white transition-colors">(+351) 212 467 740</a>
              </div>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Links Rápidos */}
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Acesso Rápido</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/quem-somos" className="cursor-pointer hover:text-emerald-500 transition-colors">Quem Somos</Link></li>
            <li><Link href="/cursos" className="cursor-pointer hover:text-emerald-500 transition-colors">Cursos e Formações</Link></li>
            <li><Link href="/atividades" className="cursor-pointer hover:text-emerald-500 transition-colors">Atividades e Serviços</Link></li>
            <li><Link href="/profissionais" className="cursor-pointer hover:text-emerald-500 transition-colors">Encontrar Terapeuta</Link></li>
          </ul>
        </div>

        {/* Coluna 4: Formulário de Contato Direto */}
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Envie uma Mensagem</h4>
          {/* Action "mailto" abre o cliente de email do usuário preenchendo os dados automaticamente */}
          <form 
            action="mailto:info@ayurvedica.org" 
            method="POST" 
            encType="text/plain" 
            className="flex flex-col gap-3"
          >
            <input 
              type="text" 
              name="Nome"
              placeholder="Seu nome" 
              required
              className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder:text-stone-500 transition-all"
            />
            <textarea 
              name="Mensagem"
              placeholder="Como podemos ajudar?" 
              rows={2}
              required
              className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder:text-stone-500 transition-all resize-none"
            ></textarea>
            <button 
              type="submit"
              className="cursor-pointer w-full bg-emerald-700 hover:bg-emerald-600 px-5 py-3 rounded-xl text-white font-bold transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2 text-sm"
            >
              Enviar Mensagem
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>

      </div>
      
      {/* Barra Inferior: Direitos */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-stone-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 Associação Luso-Brasileira de Ayurveda. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <a href="https://www.ayurvedica.eu/" target="_blank" rel="noreferrer" className="cursor-pointer hover:text-white transition-colors">ALBA Europeia</a>
          <Link href="/associe-se" className="cursor-pointer hover:text-white transition-colors">Seja um Associado</Link>
        </div>
      </div>
    </footer>
  );
};
