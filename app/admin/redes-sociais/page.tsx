"use client";

import React, { useState, useEffect } from 'react';

export default function RedesSociaisAdmin() {
  const [links, setLinks] = useState({
    facebook: 'https://www.facebook.com/alba.associacao/',
    instagram: 'https://www.instagram.com/alba_ayurvedica/',
    youtube: 'https://www.youtube.com/channel/UCJV-oPhprAjoHzuC59RvCYg',
    whatsapp: 'https://wa.me/351919075904'
  });
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('alba_social_links');
    if (saved) {
      setLinks(JSON.parse(saved));
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('alba_social_links', JSON.stringify(links));
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-stone-900 mb-2">Redes Sociais</h1>
          <p className="text-stone-500">Acesse rapidamente suas redes ou atualize os links do rodapé do site.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Card: Acesso Rápido */}
        <div className="bg-white rounded-[2rem] border border-stone-100 p-8 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-stone-900 mb-6">Acesso Rápido</h2>
          <div className="flex flex-col gap-4">
            <a 
              href={links.facebook || "https://facebook.com"} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-stone-100 hover:border-[#1877F2] hover:bg-[#1877F2]/5 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </div>
              <div>
                <p className="font-bold text-stone-900 group-hover:text-[#1877F2]">Facebook</p>
                <p className="text-xs text-stone-500">Abrir página no Facebook</p>
              </div>
            </a>

            <a 
              href={links.instagram || "https://instagram.com"} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-stone-100 hover:border-[#E1306C] hover:bg-[#E1306C]/5 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-[#E1306C]/10 flex items-center justify-center text-[#E1306C] group-hover:bg-[#E1306C] group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.46 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </div>
              <div>
                <p className="font-bold text-stone-900 group-hover:text-[#E1306C]">Instagram</p>
                <p className="text-xs text-stone-500">Abrir perfil no Instagram</p>
              </div>
            </a>

            <a 
              href={links.youtube || "https://youtube.com"} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-stone-100 hover:border-[#FF0000] hover:bg-[#FF0000]/5 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-[#FF0000]/10 flex items-center justify-center text-[#FF0000] group-hover:bg-[#FF0000] group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M21.582 6.186a2.535 2.535 0 00-1.786-1.792C18.221 4 12 4 12 4s-6.221 0-7.796.394A2.535 2.535 0 002.418 6.186C2 7.77 2 12 2 12s0 4.23.418 5.814a2.535 2.535 0 001.786 1.792C5.779 20 12 20 12 20s6.221 0 7.796-.394a2.535 2.535 0 001.786-1.792C22 16.23 22 12 22 12s0-4.23-.418-5.814zM9.8 15V9l6.2 3-6.2 3z" clipRule="evenodd" /></svg>
              </div>
              <div>
                <p className="font-bold text-stone-900 group-hover:text-[#FF0000]">YouTube</p>
                <p className="text-xs text-stone-500">Abrir canal no YouTube</p>
              </div>
            </a>
          </div>
        </div>

        {/* Card: Configuração de Links do Footer */}
        <div className="bg-white rounded-[2rem] border border-stone-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center justify-between">
            Links do Rodapé (Site)
            {savedMessage && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Salvo!</span>}
          </h2>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Link do Facebook</label>
              <input 
                type="url" 
                value={links.facebook}
                onChange={(e) => setLinks({...links, facebook: e.target.value})}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                placeholder="https://facebook.com/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Link do Instagram</label>
              <input 
                type="url" 
                value={links.instagram}
                onChange={(e) => setLinks({...links, instagram: e.target.value})}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                placeholder="https://instagram.com/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Link do YouTube</label>
              <input 
                type="url" 
                value={links.youtube}
                onChange={(e) => setLinks({...links, youtube: e.target.value})}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                placeholder="https://youtube.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Link do WhatsApp</label>
              <input 
                type="url" 
                value={links.whatsapp}
                onChange={(e) => setLinks({...links, whatsapp: e.target.value})}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                placeholder="https://wa.me/..."
              />
            </div>

            <button type="submit" className="cursor-pointer w-full mt-4 bg-stone-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors">
              Salvar Links
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
