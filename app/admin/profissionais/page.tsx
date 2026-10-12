"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export interface TeamMember {
  id: string;
  name: string;
  role: string; // Área de atuação (subtítulo)
  description: string; // Descrição
  photo: string; // Upload da foto
}

export interface ProfissionalData {
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
  outrosProfissionais?: TeamMember[];
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
  ctaButtonEmail: "info@ayurvedica.org",
  outrosProfissionais: [
    {
      id: "prof-1",
      name: "Dra. Mariana Fernandes",
      role: "Terapeuta Ayurvédica & Panchakarma",
      description: "Especialista em terapias de desintoxicação e rejuvenescimento corporal segundo os textos clássicos da Ayurveda. Atendimentos integrativos focados no alívio do estresse e reequilíbrio dos doshas.",
      photo: "https://images.unsplash.com/photo-1594824406951-31823095b27b?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "prof-2",
      name: "Carlos Alberto Mendonça",
      role: "Instrutor de Yoga & Meditação Ayurvédica",
      description: "Facilitador de práticas de Hatha Yoga e técnicas milenares de respiração (Pranayama). Integra a sabedoria védica no cultivo da clareza mental e vitalidade física diária.",
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "prof-3",
      name: "Juliana Silveira",
      role: "Nutrição Ayurvédica & Fitoterapia",
      description: "Consultoria nutricional individualizada respeitando a constituição individual (Prakriti). Orientação no uso culinário de ervas medicinais e especiarias para digestão e imunidade.",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
    }
  ]
};

const API_URL = '/api/profissionais.php';

export default function AdminProfissionaisPage() {
  const [activeTab, setActiveTab] = useState<'equipe' | 'valter'>('equipe');
  const [formData, setFormData] = useState<ProfissionalData>(defaultProfissional);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Estados para Gestão de Outros Profissionais (Grade 3x3)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberForm, setMemberForm] = useState<TeamMember>({
    id: '',
    name: '',
    role: '',
    description: '',
    photo: ''
  });
  const [isUploadingMemberPhoto, setIsUploadingMemberPhoto] = useState(false);

  // Helper para preview de imagem
  const getImagePath = (path: string) => {
    if (!path) return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop';
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
            setFormData(prev => ({
              ...defaultProfissional,
              ...json,
              outrosProfissionais: json.outrosProfissionais || prev.outrosProfissionais || []
            }));
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
            setFormData(prev => ({
              ...defaultProfissional,
              ...parsed,
              outrosProfissionais: parsed.outrosProfissionais || prev.outrosProfissionais || []
            }));
          }
        } catch (err) {}
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Salvar no servidor e no localStorage
  const saveAllData = async (updatedData: ProfissionalData) => {
    setFormData(updatedData);
    localStorage.setItem('alba_profissionais_data', JSON.stringify(updatedData));
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        setFeedback({
          type: 'success',
          message: 'Dados salvos com sucesso no servidor!'
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'Salvo localmente! Houve uma instabilidade na gravação remota.'
        });
      }
    } catch (err) {
      setFeedback({
        type: 'success',
        message: 'Alterações salvas no seu navegador com sucesso!'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // -------------------------------------------------------------
  // GESTÃO DA EQUIPE (OUTROS PROFISSIONAIS - GRADE 3x3)
  // -------------------------------------------------------------

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setMemberForm({
      id: '',
      name: '',
      role: '',
      description: '',
      photo: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setMemberForm({ ...member });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  // Upload de foto para o membro da equipe
  const handleMemberPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem é muito grande. Tamanho máximo: 10MB.');
      return;
    }

    setIsUploadingMemberPhoto(true);
    const body = new FormData();
    body.append('photo', file);

    try {
      const res = await fetch(`${API_URL}?action=upload_photo`, {
        method: 'POST',
        body
      });
      const data = await res.json();
      if (data.success && data.url) {
        setMemberForm(prev => ({ ...prev, photo: data.url }));
      } else {
        alert('Erro no envio: ' + (data.error || 'Falha ao processar arquivo'));
      }
    } catch (err) {
      alert('Erro ao enviar imagem.');
    } finally {
      setIsUploadingMemberPhoto(false);
      e.target.value = '';
    }
  };

  // Salvar Membro (Criar ou Editar)
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim() || !memberForm.role.trim()) {
      alert('Por favor, preencha o Nome e a Área de atuação.');
      return;
    }

    const currentList = formData.outrosProfissionais || [];
    let updatedList: TeamMember[];

    if (editingMember) {
      // Editar
      updatedList = currentList.map(m => m.id === editingMember.id ? { ...memberForm } : m);
    } else {
      // Adicionar
      const newMember: TeamMember = {
        ...memberForm,
        id: 'prof-' + Date.now()
      };
      updatedList = [newMember, ...currentList];
    }

    const updated = {
      ...formData,
      outrosProfissionais: updatedList
    };

    saveAllData(updated);
    handleCloseModal();
  };

  // Deletar único profissional
  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o profissional "${name}"?`)) {
      const currentList = formData.outrosProfissionais || [];
      const updatedList = currentList.filter(m => m.id !== id);
      const updated = {
        ...formData,
        outrosProfissionais: updatedList
      };
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      saveAllData(updated);
    }
  };

  // Selecionar/Deselecionar todos
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentList = formData.outrosProfissionais || [];
    if (e.target.checked) {
      setSelectedIds(currentList.map(m => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Selecionar/Deselecionar individual
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Deletar em BULK (múltiplos profissionais selecionados)
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Tem certeza que deseja excluir os ${selectedIds.length} profissionais selecionados? Esta ação não pode ser desfeita.`)) {
      const currentList = formData.outrosProfissionais || [];
      const updatedList = currentList.filter(m => !selectedIds.includes(m.id));
      const updated = {
        ...formData,
        outrosProfissionais: updatedList
      };
      setSelectedIds([]);
      saveAllData(updated);
      setFeedback({
        type: 'success',
        message: `${selectedIds.length} profissionais excluídos com sucesso!`
      });
    }
  };

  // -------------------------------------------------------------
  // GESTÃO DO PERFIL DO VALTER CARDIM
  // -------------------------------------------------------------

  const handlePhotoUploadValter = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFeedback({ type: 'success', message: 'Foto de Valter enviada com sucesso!' });
      } else {
        alert('Erro no envio: ' + (data.error || 'Falha ao processar arquivo'));
      }
    } catch (err) {
      alert('Erro ao enviar imagem.');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

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

  const handleRemoveSpecialty = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      specialtiesList: prev.specialtiesList.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSaveValter = (e: React.FormEvent) => {
    e.preventDefault();
    saveAllData(formData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-stone-500 text-sm">Carregando painel de Profissionais...</p>
      </div>
    );
  }

  const outrosList = formData.outrosProfissionais || [];
  const allSelected = outrosList.length > 0 && selectedIds.length === outrosList.length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-16">
      
      {/* Cabeçalho Superior da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            <div>
              <h2 className="text-3xl font-serif text-stone-900 font-bold">Gestão de Profissionais</h2>
              <p className="text-stone-500 text-sm mt-0.5">
                Gerencie a equipe de profissionais da grade 3x3 e o perfil do responsável técnico da ALBA.
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
            <span>Ver no Site Oficial</span>
            <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Navegação por Abas (Tabs) */}
      <div className="flex border-b border-stone-200 gap-4">
        <button
          onClick={() => setActiveTab('equipe')}
          className={`cursor-pointer pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'equipe'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>👥 Outros Profissionais (Grade 3x3)</span>
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
            {outrosList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('valter')}
          className={`cursor-pointer pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'valter'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>👑 Perfil do Valter Cardim & Cabeçalho</span>
        </button>
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

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ABA 1: GESTÃO DE OUTROS PROFISSIONAIS (LISTA & BULK DELETE) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'equipe' && (
        <div className="space-y-6">
          
          {/* Barra de Ações da Lista */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Profissionais Credenciados
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Estes profissionais aparecem na grade 3x3 no site público com foto, nome, área de atuação e descrição.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Botão de Deletar em BULK (aparece quando houver selecionados) */}
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="cursor-pointer px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 animate-fade-in"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Excluir Selecionados ({selectedIds.length})</span>
                </button>
              )}

              {/* Botão Adicionar Profissional */}
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="cursor-pointer px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Adicionar Profissional</span>
              </button>
            </div>
          </div>

          {/* Tabela / Lista de Profissionais */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            {outrosList.length === 0 ? (
              <div className="text-center py-16 px-4">
                <span className="text-5xl block mb-3">👥</span>
                <h4 className="text-lg font-serif font-bold text-stone-800 mb-1">Nenhum profissional cadastrado</h4>
                <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
                  Adicione profissionais da equipe para serem exibidos na grade 3x3 do site oficial.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="cursor-pointer px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  + Cadastrar Primeiro Profissional
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider">
                      {/* Checkbox Geral no Canto Esquerdo */}
                      <th className="p-5 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          title="Selecionar Todos"
                        />
                      </th>
                      <th className="p-5 font-semibold">Profissional</th>
                      <th className="p-5 font-semibold">Área de Atuação (Subtítulo)</th>
                      <th className="p-5 font-semibold">Descrição</th>
                      <th className="p-5 font-semibold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {outrosList.map((member) => {
                      const isSelected = selectedIds.includes(member.id);
                      return (
                        <tr 
                          key={member.id}
                          className={`hover:bg-stone-50/70 transition-colors ${
                            isSelected ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          {/* Checkbox Individual no Canto Esquerdo Atrás do Nome */}
                          <td className="p-5 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(member.id)}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              title={`Selecionar ${member.name}`}
                            />
                          </td>

                          {/* Foto e Nome */}
                          <td className="p-5 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200 shadow-xs">
                              <img
                                src={getImagePath(member.photo)}
                                alt={member.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop';
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-bold font-serif text-stone-900 text-base leading-snug">
                                {member.name}
                              </p>
                              <span className="text-[11px] text-stone-400 font-mono">ID: {member.id}</span>
                            </div>
                          </td>

                          {/* Área de Atuação */}
                          <td className="p-5">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block">
                              {member.role}
                            </span>
                          </td>

                          {/* Descrição */}
                          <td className="p-5 text-stone-600 text-xs max-w-md line-clamp-2 leading-relaxed">
                            {member.description}
                          </td>

                          {/* Ações: Editar e Deletar no Canto Direito */}
                          <td className="p-5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              {/* Botão Editar */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(member)}
                                className="cursor-pointer px-3 py-1.5 bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                                title="Editar Profissional"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Editar</span>
                              </button>

                              {/* Botão Deletar */}
                              <button
                                type="button"
                                onClick={() => handleDeleteMember(member.id, member.name)}
                                className="cursor-pointer px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                                title="Deletar Profissional"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Deletar</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ABA 2: PERFIL DO VALTER CARDIM & CABEÇALHO (MANTIDO 100%)  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'valter' && (
        <form onSubmit={handleSaveValter} className="space-y-8">
          
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

          {/* 2. SEÇÃO: IDENTIFICAÇÃO DO PROFISSIONAL (VALTER) & FOTO */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">Seção 2</span>
              <h3 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
                <span>👤</span>
                <span>Identificação do Fundador (Valter Carlos Cardim)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Foto de destaque, nome, título espiritual e dados de contato direto.
              </p>
            </div>

            <div className="grid md:grid-cols-12 gap-8 items-start">
              
              {/* Foto e Upload */}
              <div className="md:col-span-4 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Foto do Perfil Principal
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
                      onChange={handlePhotoUploadValter}
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
                      Nome Espiritual / Subtítulo
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
                      Tag sobre a Foto
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
                      E-mail Oficial para Agendamentos *
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
                  Frase em Destaque / Citação
                </label>
                <textarea
                  rows={2}
                  value={formData.quote}
                  onChange={e => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm italic font-serif text-emerald-950 focus:outline-none focus:border-emerald-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Texto da Biografia (Parágrafos) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={formData.bioText}
                  onChange={e => setFormData({ ...formData, bioText: e.target.value })}
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
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm leading-relaxed text-stone-800 focus:outline-none focus:border-emerald-600 resize-none"
                />
              </div>

              {/* Tags de Especialidade */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Tags de Especialidades ({formData.specialtiesList.length})
                </label>

                <div className="flex flex-wrap gap-2 mb-4 p-4 bg-stone-900 rounded-2xl min-h-[60px] items-center">
                  {formData.specialtiesList.map((spec, idx) => (
                    <span
                      key={idx}
                      className="bg-stone-800 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-700 flex items-center gap-2"
                    >
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(idx)}
                        className="text-stone-400 hover:text-red-400 cursor-pointer font-bold text-xs"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

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
                    placeholder="Digitar nova especialidade e clicar em Adicionar..."
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
                <span>Chamada para Ação & Agendamento</span>
              </h3>
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
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Botão de Salvar Rodapé */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-stone-200">
            <button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Salvar Dados do Perfil Principal</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL / FORMULÁRIO DE ADICIONAR / EDITAR PROFISSIONAL       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-stone-200 space-y-6 animate-scale-up my-8">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
                  Grade 3x3 do Site
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900">
                  {editingMember ? 'Editar Profissional' : 'Novo Profissional'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-5">
              
              {/* 1. Nome */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Nome do Profissional *
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.name}
                  onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="Ex: Dra. Mariana Fernandes"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* 2. Área de atuação (subtítulo) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Área de Atuação (como subtítulo) *
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.role}
                  onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                  placeholder="Ex: Terapeuta Ayurvédica & Panchakarma"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-emerald-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* 3. Descrição */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Descrição (para explicar sobre o profissional) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={memberForm.description}
                  onChange={e => setMemberForm({ ...memberForm, description: e.target.value })}
                  placeholder="Explique sobre a atuação, técnicas utilizadas, foco de atendimento e formação..."
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm leading-relaxed text-stone-800 focus:outline-none focus:border-emerald-600 resize-none"
                />
              </div>

              {/* 4. Upload da Foto */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Foto do Profissional
                </label>

                <div className="flex items-center gap-4">
                  {/* Preview da foto */}
                  <div className="w-20 h-20 rounded-2xl bg-stone-100 border-2 border-stone-200 overflow-hidden flex-shrink-0 relative">
                    <img
                      src={getImagePath(memberForm.photo)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                    {isUploadingMemberPhoto && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>Upload do Computador</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={handleMemberPhotoUpload}
                        disabled={isUploadingMemberPhoto}
                      />
                    </label>

                    <input
                      type="text"
                      value={memberForm.photo}
                      onChange={e => setMemberForm({ ...memberForm, photo: e.target.value })}
                      placeholder="Ou cole a URL da foto (https://...)"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Botões do Modal */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="cursor-pointer px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingMemberPhoto}
                  className="cursor-pointer px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {editingMember ? 'Atualizar Profissional' : 'Salvar Novo Profissional'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
