"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProfissionalData {
  headerBadge: string;
  headerTitle: string;
  headerDescription: string;
  name: string;
  spiritualName: string;
  roleBadge: string;
  photo: string;
  contactEmail: string;
  contactPhone?: string;
  bioBadge: string;
  bioTitle: string;
  quote: string;
  bioText: string;
  specialtiesTitle: string;
  specialtiesDescription: string;
  specialtiesList: string[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonEmail: string;
}

const defaultProfissional: ProfissionalData = {
  headerBadge: "Corpo Docente & Responsável Técnico",
  headerTitle: "Profissional Responsável",
  headerDescription: "Conheça a trajetória e formação do fundador da Associação Luso-Brasileira de Ayurveda (ALBA).",
  name: "Valter Carlos Cardim",
  spiritualName: "(Swami Gyanesh)",
  roleBadge: "Fundador & Mestre Ayurvédico",
  photo: "/images/profissional/valter.jpeg",
  contactEmail: "info@ayurvedica.org",
  contactPhone: "",
  bioBadge: "Biografia & Trajetória",
  bioTitle: "Valter Carlos Cardim (Swami Gyanesh)",
  quote: "Dedicação contínua ao estudo e à aplicação prática das artes corporais e da Medicina Ayurvédica desde 1970.",
  bioText: "Valter Carlos Cardim (Swami Gyanesh) dedica-se ao estudo de técnicas que trabalham o corpo desde 1970. Em 1980 é iniciado pessoalmente pelo seu mestre Osho (Bagwan Shree Rajneesh). Em 1981 viaja para os Estados Unidos onde permanece e participa do Festival Vida Internacional na comunidade do seu mestre.\n\nEm 1989 viaja para a Índia onde aprofunda os seus conhecimentos sobre Ayurvédica em Poona. Participou em vários workshops na Rajneesh Foundation International nos Estados Unidos e na Índia. Estudou no Instituto Corpo de São Paulo, no Instituto Soma de São Paulo, e na Escola de Massagens Amor.\n\nPossui curso de Medicina Ayurvédica, com pós-graduação pela Universidade de Maimónides, com certificação pela Universidade de Gujarat, Índia. Concluiu pós-doutorado em Cultura e Comunicação, onde estudou a aplicação da Medicina Ayurvédica na Cultura Contemporânea.",
  specialtiesTitle: "Áreas de Atendimento & Especialidades",
  specialtiesDescription: "Atendimentos na área da arte da massagem corporal Ayurvédica, Nutrição e Estilo de Vida segundo a Ayurveda e Naturopatia Ayurvédica. Também possui conhecimento sobre análise do sangue vivo.",
  specialtiesList: [
    "Massagem Corporativa Ayurvédica",
    "Nutrição & Estilo de Vida",
    "Naturopatia Ayurvédica",
    "Análise do Sangue Vivo"
  ],
  ctaTitle: "Deseja agendar um atendimento ou solicitar mais informações?",
  ctaSubtitle: "Entre em contacto direto através do nosso suporte oficial por e-mail.",
  ctaButtonText: "Enviar E-mail",
  ctaButtonEmail: "info@ayurvedica.org"
};

const API_URL = '/api/profissionais.php';

export default function AdminProfissionaisPage() {
  const [formData, setFormData] = useState<ProfissionalData>(defaultProfissional);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Helper para preview de imagem
  const getImagePath = (path: string) => {
    if (!path) return '/images/profissional/valter.jpeg';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.replace(/^\//, '');
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (window.location.hostname.includes('github.io') || pathname.startsWith('/ALBA')) {
        return `/ALBA/${clean}`;
      }
    }
    return `/${clean}`;
  };

  // Carregar dados existentes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(API_URL, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json && json.name) {
            setFormData(json);
            localStorage.setItem('alba_profissionais_data', JSON.stringify(json));
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Erro ao carregar dados do servidor, tentando localStorage.', e);
      }

      const saved = localStorage.getItem('alba_profissionais_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.name) {
            setFormData(parsed);
          }
        } catch (err) {}
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Upload de foto do computador
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem é muito grande. O tamanho máximo permitido é 10MB.');
      return;
    }

    setIsUploadingPhoto(true);
    const body = new FormData();
    body.append('photo', file);

    try {
      const res = await fetch(`${API_URL}?action=upload_photo`, {
        method: 'POST',
        body
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, photo: data.url }));
        setFeedback({ type: 'success', message: 'Foto enviada com sucesso!' });
      } else {
        alert('Erro no envio: ' + (data.error || 'Falha ao processar arquivo'));
      }
    } catch (err) {
      alert('Erro ao enviar imagem. Verifique a conexão com o servidor.');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  // Adicionar Especialidade
  const handleAddSpecialty = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSpecialty.trim();
    if (!trimmed) return;
    if (formData.specialtiesList.includes(trimmed)) {
      alert('Esta especialidade já foi adicionada.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      specialtiesList: [...prev.specialtiesList, trimmed]
    }));
    setNewSpecialty('');
  };

  // Remover Especialidade
  const handleRemoveSpecialty = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      specialtiesList: prev.specialtiesList.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Salvar no servidor e no localStorage
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    // Salva cópia imediata no localStorage
    localStorage.setItem('alba_profissionais_data', JSON.stringify(formData));

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFeedback({
          type: 'success',
          message: 'Página de Profissionais atualizada com sucesso no servidor!'
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'As alterações foram salvas localmente, mas houve um erro ao enviar ao servidor.'
        });
      }
    } catch (err) {
      setFeedback({
        type: 'success',
        message: 'Alterações salvas localmente! (Servidor temporariamente inacessível)'
      });
    } finally {
      setIsSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-stone-500 text-sm">Carregando dados da página de Profissionais...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-16">
      
      {/* Cabeçalho da Gestão */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <div>
              <h2 className="text-3xl font-serif text-stone-900 font-bold">Gestão de Profissionais</h2>
              <p className="text-stone-500 text-sm mt-0.5">
                Altere todos os itens exibidos na página oficial de Profissionais da ALBA.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/profissionais"
            target="_blank"
            className="cursor-pointer px-4 py-2.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <span>Ver Página no Site</span>
            <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="cursor-pointer px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Salvar Alterações</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Banner de Feedback */}
      {feedback && (
        <div className={`p-4 rounded-2xl flex items-center justify-between border ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : 'bg-red-50 text-red-900 border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{feedback.type === 'success' ? '✓' : '⚠️'}</span>
            <p className="text-sm font-medium">{feedback.message}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setFeedback(null)} 
            className="text-stone-400 hover:text-stone-700 cursor-pointer font-bold text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Formulário Completo */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 1. SEÇÃO: CABEÇALHO DA PÁGINA */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">Seção 1</span>
            <h3 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <span>🏛️</span>
              <span>Cabeçalho da Página (/profissionais)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Textos que aparecem na faixa superior inicial da página.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Tag Superior Pequena
              </label>
              <input
                type="text"
                value={formData.headerBadge}
                onChange={e => setFormData({ ...formData, headerBadge: e.target.value })}
                placeholder="Ex: Corpo Docente & Responsável Técnico"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Título Principal da Página *
              </label>
              <input
                type="text"
                required
                value={formData.headerTitle}
                onChange={e => setFormData({ ...formData, headerTitle: e.target.value })}
                placeholder="Ex: Profissional Responsável"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-serif font-bold text-lg text-stone-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Subtítulo / Descrição da Página
              </label>
              <textarea
                rows={2}
                value={formData.headerDescription}
                onChange={e => setFormData({ ...formData, headerDescription: e.target.value })}
                placeholder="Breve resumo introdutório que aparece abaixo do título principal..."
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 2. SEÇÃO: IDENTIFICAÇÃO DO PROFISSIONAL & FOTO */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">Seção 2</span>
            <h3 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <span>👤</span>
              <span>Identificação do Profissional Responsável</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Foto de perfil, nome, título espiritual e dados de contato direto.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Foto e Upload */}
            <div className="md:col-span-4 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                Foto do Profissional
              </label>

              <div className="relative rounded-2xl overflow-hidden border-2 border-stone-200 shadow-sm bg-stone-100 aspect-[3/4] flex items-center justify-center group">
                <img
                  src={getImagePath(formData.photo)}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/profissional/valter.jpeg';
                  }}
                />

                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white gap-2">
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-bold">Enviando foto...</span>
                  </div>
                )}
              </div>

              {/* Botões de Ação para Foto */}
              <div className="space-y-2">
                <label className="cursor-pointer w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Enviar Foto do Computador</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                  />
                </label>

                <div className="space-y-1">
                  <span className="text-[11px] text-stone-500 font-medium">Ou cole a URL da imagem:</span>
                  <input
                    type="text"
                    value={formData.photo}
                    onChange={e => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="/images/... ou https://..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Campos de Nome, Cargo e Contato */}
            <div className="md:col-span-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Valter Carlos Cardim"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-base font-serif font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                    Nome Espiritual / Título Secundário
                  </label>
                  <input
                    type="text"
                    value={formData.spiritualName}
                    onChange={e => setFormData({ ...formData, spiritualName: e.target.value })}
                    placeholder="Ex: (Swami Gyanesh)"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                    Tag / Cargo sobre a Foto
                  </label>
                  <input
                    type="text"
                    value={formData.roleBadge}
                    onChange={e => setFormData({ ...formData, roleBadge: e.target.value })}
                    placeholder="Ex: Fundador & Mestre Ayurvédico"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-emerald-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                    E-mail Oficial para Agendamentos e Informações *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="info@ayurvedica.org"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* 3. SEÇÃO: BIOGRAFIA & TRAJETÓRIA */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">Seção 3</span>
            <h3 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <span>📖</span>
              <span>Biografia & Trajetória</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Texto em formato de artigo que relata a história, formações e trajetória do profissional.
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Tag da Seção Biográfica
                </label>
                <input
                  type="text"
                  value={formData.bioBadge}
                  onChange={e => setFormData({ ...formData, bioBadge: e.target.value })}
                  placeholder="Ex: Biografia & Trajetória"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Título do Artigo Biográfico
                </label>
                <input
                  type="text"
                  value={formData.bioTitle}
                  onChange={e => setFormData({ ...formData, bioTitle: e.target.value })}
                  placeholder="Ex: Valter Carlos Cardim (Swami Gyanesh)"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Frase em Destaque / Citação Marcante
              </label>
              <textarea
                rows={2}
                value={formData.quote}
                onChange={e => setFormData({ ...formData, quote: e.target.value })}
                placeholder="Ex: Dedicação contínua ao estudo e à aplicação prática das artes corporais e da Medicina Ayurvédica desde 1970."
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm italic font-serif text-emerald-950 focus:outline-none focus:border-emerald-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2 flex items-center justify-between">
                <span>Texto da Biografia (Parágrafos) *</span>
                <span className="text-[11px] text-stone-400 normal-case font-normal">
                  Pressione Enter duas vezes para criar um novo parágrafo
                </span>
              </label>
              <textarea
                rows={8}
                required
                value={formData.bioText}
                onChange={e => setFormData({ ...formData, bioText: e.target.value })}
                placeholder="Escreva aqui a trajetória completa do profissional em parágrafos..."
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm leading-relaxed text-stone-800 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* 4. SEÇÃO: ÁREAS DE ATENDIMENTO & ESPECIALIDADES */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">Seção 4</span>
            <h3 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <span>🌿</span>
              <span>Áreas de Atendimento & Especialidades</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Card escuro de destaque com a descrição e tags das áreas de atuação.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Título do Bloco de Especialidades
              </label>
              <input
                type="text"
                value={formData.specialtiesTitle}
                onChange={e => setFormData({ ...formData, specialtiesTitle: e.target.value })}
                placeholder="Ex: Áreas de Atendimento & Especialidades"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Descrição das Atuações
              </label>
              <textarea
                rows={3}
                value={formData.specialtiesDescription}
                onChange={e => setFormData({ ...formData, specialtiesDescription: e.target.value })}
                placeholder="Ex: Atendimentos na área da arte da massagem corporal Ayurvédica, Nutrição e Estilo de Vida..."
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm leading-relaxed text-stone-800 focus:outline-none focus:border-emerald-600 resize-none"
              />
            </div>

            {/* Gerenciador de Tags de Especialidade */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Tags de Especialidades Cadastradas ({formData.specialtiesList.length})
              </label>

              {/* Lista Atual de Tags */}
              <div className="flex flex-wrap gap-2 mb-4 p-4 bg-stone-900 rounded-2xl min-h-[60px] items-center">
                {formData.specialtiesList.length === 0 ? (
                  <span className="text-xs text-stone-400 italic">Nenhuma especialidade adicionada ainda.</span>
                ) : (
                  formData.specialtiesList.map((spec, idx) => (
                    <span
                      key={idx}
                      className="bg-stone-800 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-700 flex items-center gap-2 group"
                    >
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(idx)}
                        className="text-stone-400 hover:text-red-400 cursor-pointer font-bold text-xs"
                        title="Remover especialidade"
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Input para adicionar nova tag */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={e => setNewSpecialty(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSpecialty();
                    }
                  }}
                  placeholder="Digitar nova especialidade e clicar em Adicionar (ex: Panchakarma)..."
                  className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={handleAddSpecialty}
                  className="cursor-pointer px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  + Adicionar Tag
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. SEÇÃO: BLOCO DE CONTATO / AGENDAMENTO (CTA) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">Seção 5</span>
            <h3 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <span>📩</span>
              <span>Chamada para Ação & Agendamento (Fim da Página)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Bloco verde ao final da página que convida o usuário a entrar em contato.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Título do Convite
              </label>
              <input
                type="text"
                value={formData.ctaTitle}
                onChange={e => setFormData({ ...formData, ctaTitle: e.target.value })}
                placeholder="Ex: Deseja agendar um atendimento ou solicitar mais informações?"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Texto de Apoio
              </label>
              <input
                type="text"
                value={formData.ctaSubtitle}
                onChange={e => setFormData({ ...formData, ctaSubtitle: e.target.value })}
                placeholder="Ex: Entre em contacto direto através do nosso suporte oficial por e-mail."
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Texto do Botão
              </label>
              <input
                type="text"
                value={formData.ctaButtonText}
                onChange={e => setFormData({ ...formData, ctaButtonText: e.target.value })}
                placeholder="Ex: Enviar E-mail"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-emerald-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                E-mail Destino do Botão
              </label>
              <input
                type="email"
                value={formData.ctaButtonEmail}
                onChange={e => setFormData({ ...formData, ctaButtonEmail: e.target.value })}
                placeholder="info@ayurvedica.org"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Botão de Salvar Rodapé */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-stone-200">
          <Link
            href="/profissionais"
            target="_blank"
            className="cursor-pointer px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm rounded-xl transition-all"
          >
            Visualizar no Site
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Salvando alterações...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Salvar Todas as Alterações</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
