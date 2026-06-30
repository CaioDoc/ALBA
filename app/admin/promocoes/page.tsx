"use client";

import React, { useState } from 'react';

export default function PromocoesWhatsAppPage() {
  const [nomeCampanha, setNomeCampanha] = useState('');
  const [destino, setDestino] = useState('');
  const [mensagem, setMensagem] = useState(
    'Olá! Tudo bem?\n\nAs inscrições para a Formação em Terapeuta Ayurvédico estão abertas.\n\nGaranta sua vaga com condição especial respondendo esta mensagem!'
  );
  const [imagemAnexo, setImagemAnexo] = useState('');
  const [isImproving, setIsImproving] = useState(false);

  // Simula a IA reescrevendo o texto com gatilhos mentais e emojis
  const handleMelhorarComIA = () => {
    setIsImproving(true);
    setTimeout(() => {
      setMensagem(
        '✨ *Olá! Tudo bem?* ✨\n\nTemos uma novidade incrível: as inscrições para a nossa *Formação em Terapeuta Ayurvédico* acabaram de abrir! 🌿\n\nNão perca a chance de transformar a sua vida e a de outras pessoas através da medicina milenar. \n\n🚀 *Responda a esta mensagem* agora mesmo e garanta sua vaga com uma condição super especial!'
      );
      setIsImproving(false);
    }, 1500);
  };

  // Pede a URL da imagem e adiciona no state para exibir no preview
  const handleAdicionarImagemURL = () => {
    const url = window.prompt("Cole a URL da imagem que deseja anexar:", "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=400&auto=format&fit=crop");
    if (url) {
      setImagemAnexo(url);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagemAnexo(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Pede o link e injeta no final da mensagem atual
  const handleAdicionarLink = () => {
    const link = window.prompt("Insira o link de inscrição ou do curso:", "https://ayurvedica.org/cursos/formacao");
    if (link) {
      setMensagem((prev) => prev + `\n\nAcesse aqui: ${link}`);
    }
  };

  const handleSalvarRascunho = () => {
    alert(`Rascunho "${nomeCampanha || 'Sem nome'}" salvo com sucesso no banco de dados!\n\nEle ficará armazenado para você continuar editando e disparar mais tarde.`);
  };

  const handleDisparar = () => {
    if (!destino) {
      alert('Por favor, informe o número de celular ou link do grupo de destino.');
      return;
    }
    alert(`Disparo iniciado para: ${destino}\n\nAcompanhe o progresso na aba de relatórios.`);
  };

  // Função simples para interpretar os asteriscos do WhatsApp como negrito no HTML
  const formatarMensagem = (texto: string) => {
    const partes = texto.split(/(\*.*?\*)/g);
    return partes.map((parte, index) => {
      if (parte.startsWith('*') && parte.endsWith('*') && parte.length > 2) {
        return <strong key={index}>{parte.slice(1, -1)}</strong>;
      }
      return parte;
    });
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-stone-900">WhatsApp</h2>
        <p className="text-stone-500 mt-1">
          Envie mensagens diretas ou promova eventos em grupos específicos.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* Coluna Esquerda: Controles (Ocupa 3 colunas) */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-stone-200 shadow-sm">
            <h3 className="text-lg font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">Configuração da Campanha</h3>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Nome da Campanha */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Nome de Controle (Interno)</label>
                <input 
                  type="text" 
                  value={nomeCampanha}
                  onChange={(e) => setNomeCampanha(e.target.value)}
                  placeholder="Ex: Lançamento Formação Março 2027"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Destino Único (Celular ou Grupo) */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Destino (Número ou Link do Grupo)</label>
                <input 
                  type="text" 
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  placeholder="Ex: +351 919 075 904 ou https://chat.whatsapp.com/..."
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-mono"
                />
                <p className="text-xs text-stone-500 mt-2">
                  O sistema identificará automaticamente se é um disparo para contato direto ou para um grupo.
                </p>
              </div>

              {/* Mensagem e Ferramentas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-stone-700">Conteúdo da Mensagem</label>
                  <button 
                    type="button" 
                    onClick={handleMelhorarComIA}
                    disabled={isImproving || !mensagem}
                    className="cursor-pointer text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    {isImproving ? 'Reescrevendo...' : '✨ Melhorar com IA'}
                  </button>
                </div>
                
                <textarea 
                  rows={8}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Escreva sua mensagem aqui..."
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none"
                ></textarea>
                
                <div className="flex gap-2 mt-3 flex-wrap">
                  <label className="cursor-pointer text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Upload Imagem
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                  <button 
                    type="button" 
                    onClick={handleAdicionarImagemURL}
                    className="cursor-pointer text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    Imagem Externa (URL)
                  </button>
                  <button 
                    type="button" 
                    onClick={handleAdicionarLink}
                    className="cursor-pointer text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    Inserir Link
                  </button>
                  {imagemAnexo && (
                    <button 
                      type="button" 
                      onClick={() => setImagemAnexo('')}
                      className="cursor-pointer text-xs font-bold text-red-600 hover:text-red-700 px-3 py-2 transition-colors flex items-center gap-1"
                    >
                      Remover Anexo
                    </button>
                  )}
                </div>
              </div>

            </form>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleSalvarRascunho}
              className="cursor-pointer flex-1 bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all active:scale-[0.98] shadow-md"
            >
              Salvar Rascunho
            </button>
            <button 
              onClick={handleDisparar}
              className="cursor-pointer flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Disparar Mensagem
            </button>
          </div>

        </div>

        {/* Coluna Direita: Preview (Ocupa 2 colunas) */}
        <div className="lg:col-span-2">
          <div className="sticky top-8">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4 text-center">Simulador de Celular</h3>
            
            {/* Mockup do Celular */}
            <div className="w-[300px] h-[600px] mx-auto bg-stone-900 rounded-[3rem] p-3 shadow-2xl relative border-4 border-stone-800">
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-stone-900 rounded-b-2xl z-20"></div>
              
              <div className="bg-[#EFEAE2] w-full h-full rounded-[2rem] overflow-hidden flex flex-col relative">
                
                {/* Header do WhatsApp */}
                <div className="bg-[#008069] text-white px-4 py-3 flex items-center gap-3 pt-8 z-10 shadow-sm">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <img src="https://www.ayurvedica.org/wp-content/uploads/2019/05/miniLogo.png" alt="ALBA" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-none truncate max-w-[150px]">
                      {destino.includes('chat.whatsapp') ? 'Grupo Ayurveda' : destino || 'Cliente (Destino)'}
                    </p>
                    <p className="text-[10px] text-emerald-100 opacity-80">Online</p>
                  </div>
                </div>

                {/* Área de Chat */}
                <div className="flex-1 p-4 overflow-y-auto hide-scrollbar bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-cover bg-center">
                  
                  {/* Balão de Mensagem Renderizado */}
                  {(mensagem || imagemAnexo) && (
                    <div className="bg-white p-1.5 rounded-2xl rounded-tl-none shadow-sm max-w-[92%] relative mt-2">
                      
                      {/* Se houver imagem anexa, exibe no topo do balão */}
                      {imagemAnexo && (
                        <div className="mb-2 bg-stone-100 rounded-xl overflow-hidden aspect-video border border-stone-100 relative">
                          <img src={imagemAnexo} alt="Preview Anexo" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Texto da Mensagem */}
                      {mensagem && (
                        <div className="px-2 pb-1 text-[13px] text-stone-800 leading-relaxed whitespace-pre-wrap">
                          {formatarMensagem(mensagem)}
                        </div>
                      )}

                      <span className="block text-right text-[10px] text-stone-400 px-2 pb-1 mt-1">Agora</span>
                      
                      {/* Seta verde do balão */}
                      <div className="absolute top-0 left-[-8px] w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>
                    </div>
                  )}

                </div>

                {/* Input falso do WhatsApp */}
                <div className="bg-white p-2 px-4 flex items-center gap-3">
                  <div className="flex-1 bg-stone-100 rounded-full h-10 px-4 flex items-center text-stone-400 text-sm">
                    Mensagem
                  </div>
                  <div className="w-10 h-10 bg-[#008069] rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-md">
                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                  </div>
                </div>

              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
