import os

fpath = r'F:\Antigravity\Alba\ALBA\app\admin\agenda\page.tsx'

with open(fpath, 'r', encoding='utf-8') as f:
    text = f.read()

# Check if handleGenerateAIDescription is already present
if 'handleGenerateAIDescription' not in text:
    ai_function_code = '''
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiNotice, setAiNotice] = useState('');

  const handleGenerateAIDescription = () => {
    if (!formData.title.trim()) {
      alert('Por favor, preencha o "Título do Evento" primeiro para que a IA possa gerar a descrição adequada!');
      return;
    }

    setIsGeneratingAI(true);
    setAiNotice('');

    setTimeout(() => {
      const titleLower = formData.title.toLowerCase();
      const eventType = formData.type || 'Palestra';
      
      let generatedText = '';

      if (titleLower.includes('champi') || titleLower.includes('head') || titleLower.includes('cabeca') || titleLower.includes('cabeça')) {
        generatedText = `Neste ${eventType.toLowerCase()} exclusivo, iremos explorar as técnicas ancestrais da Indian Head Massage (Champi).

• Fundamentos anatômicos e energéticos da cabeça, ombros e pescoço.
• Aplicação prática de óleos vegetais aquecidos adaptados a cada Dosha.
• Alívio do estresse mental, insônia e tensões acumuladas.

Voltado para terapeutas, estudantes e praticantes interessados na saúde holística.`;
      } else if (titleLower.includes('agni') || titleLower.includes('digestao') || titleLower.includes('nutricao') || titleLower.includes('alimentacao')) {
        generatedText = `Junte-se a nós neste ${eventType.toLowerCase()} dedicado à saúde digestiva sob a ótica da Medicina Ayurvédica.

• O papel fundamental de Agni (fogo digestivo) na prevenção de doenças e vitalidade (Ojas).
• Combinações alimentares compatíveis e rotinas nutricionais sazonais (Ritucharya).
• Dicas práticas e receitas ayurvédicas para equilibrar a digestão diária.

Evento aberto a todos que buscam transformar sua relação com a nutrição integral.`;
      } else if (titleLower.includes('dosha') || titleLower.includes('vata') || titleLower.includes('pitta') || titleLower.includes('kapha')) {
        generatedText = `Um encontro imperdível para compreender a teoria dos Tridoshas (Vata, Pitta e Kapha) e sua aplicação na vida cotidiana.

• Como identificar seu biotipo constitucional (Prakriti) e desequilíbrios momentâneos (Vikriti).
• Estratégias de autocuidado, estilo de vida (Dinacharya) e rotinas para cada estação.
• Práticas recomendadas para manter a mente e o corpo em total sintonia.

Ideal para associados, alunos e simpatizantes da sabedoria Ayurvédica.`;
      } else if (titleLower.includes('yoga') || titleLower.includes('meditacao') || titleLower.includes('asana') || titleLower.includes('pranayama')) {
        generatedText = `Uma imersão dedicada à união do Yoga e da Meditação como ferramentas de expansão de consciência e cura.

• Prática guiada de Asanas (posturas) e Pranayamas (exercícios respiratórios).
• Integração do movimento com a calma mental e regulação do sistema nervoso.
• Espaço aberto para dúvidas e partilha de experiências entre os participantes.

Traga roupas confortáveis e seu tapete de prática. Todos os níveis de experiência são bem-vindos!`;
      } else {
        generatedText = `Seja muito bem-vindo ao evento "${formData.title}". Uma realização oficial da Associação Luso-Brasileira de Ayurveda (ALBA).

• Apresentação dos conceitos fundamentais e aplicações práticas do tema.
• Discussão técnica e cases com especialistas e docentes convidados.
• Momento dedicado para perguntas, networking e troca de saberes entre os participantes.

Ganta sua vaga com antecedência. Encontro aberto a associados e comunidade geral.`;
      }

      setFormData(prev => ({ ...prev, description: generatedText }));
      setIsGeneratingAI(false);
      setAiNotice('✨ Descrição gerada com IA com sucesso!');
      setTimeout(() => setAiNotice(''), 4000);
    }, 600);
  };
'''

    # Insert state and function right after useState declarations
    target_insert = "  const [editingId, setEditingId] = useState<number | null>(null);"
    text = text.replace(target_insert, target_insert + "\n" + ai_function_code)

    # Insert UI block for Description field with AI button
    old_desc_block = '''            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">Descrição / Pauta do Evento</label>
              <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none" placeholder="Detalhes sobre quem vai falar, cronograma, etc..."></textarea>
            </div>'''

    new_desc_block = '''            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-stone-700">Descrição / Pauta do Evento</label>
                <button 
                  type="button" 
                  onClick={handleGenerateAIDescription}
                  disabled={isGeneratingAI}
                  className="cursor-pointer bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                  title="Gerar texto automático baseado no título do evento"
                >
                  {isGeneratingAI ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Gerando com IA...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>✨ Gerar Descrição com IA</span>
                    </>
                  )}
                </button>
              </div>
              
              {aiNotice && (
                <div className="mb-2 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in-up">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{aiNotice}</span>
                </div>
              )}

              <textarea 
                rows={5} 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none font-sans leading-relaxed text-stone-800" 
                placeholder="Digite os detalhes sobre o evento ou clique no botão acima para gerar uma descrição completa com IA baseada no título..."
              />
            </div>'''

    text = text.replace(old_desc_block, new_desc_block)

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(text)
    print("SUCCESS: Added AI description generator to app/admin/agenda/page.tsx!")
