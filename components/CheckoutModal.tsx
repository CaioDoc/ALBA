"use client";

import React, { useState, useMemo } from 'react';

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  type: 'digital' | 'fisico';
  price: string;
  priceNumber?: number;
  image: string;
  description: string;
  digitalUrl?: string;
  status: string;
}

interface CheckoutModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Helpers fora do componente ──────────────────────────────────────────────

const formatCPF = (v: string) =>
  v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').slice(0, 14);

const formatPhone = (v: string) => {
  const c = v.replace(/\D/g, '');
  return c.length <= 10
    ? c.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    : c.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').slice(0, 15);
};

const formatCEP = (v: string) =>
  v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);

const getImagePath = (src: string) => {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const clean = src.replace(/^\//, '');
  if (typeof window !== 'undefined' &&
    (window.location.hostname.includes('github.io') || window.location.pathname.startsWith('/ALBA'))) {
    return `/ALBA/${clean}`;
  }
  return `/${clean}`;
};

const PIX_CPF_RAW = '00750851864';
const PIX_CPF_FMT = '007.508.518-64';

const buildPixPayload = (amount: number): string => {
  const crc16 = (str: string) => {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  };
  const tlv = (tag: string, val: string) => tag + val.length.toString().padStart(2, '0') + val;
  const acct = tlv('00', 'br.gov.bcb.pix') + tlv('01', PIX_CPF_RAW);
  const raw =
    tlv('00', '01') +
    tlv('26', acct) +
    tlv('52', '0000') +
    tlv('53', '986') +
    tlv('54', amount.toFixed(2)) +
    tlv('58', 'BR') +
    tlv('59', 'ALBA AYURVEDA') +
    tlv('60', 'SAO PAULO') +
    tlv('62', tlv('05', 'ALBA' + Math.floor(1000 + Math.random() * 9000))) +
    '6304';
  return raw + crc16(raw);
};

// ─── Componente ───────────────────────────────────────────────────────────────

type Step = 'form' | 'pix' | 'success';

export const CheckoutModal = ({ product, isOpen, onClose }: CheckoutModalProps) => {
  // ── Todos os hooks SEMPRE no topo ──
  const [step, setStep] = useState<Step>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<'payload' | 'cpf' | null>(null);
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [pixTimer, setPixTimer] = useState(0);

  const [customer, setCustomer] = useState({ name: '', cpf: '', email: '', phone: '' });
  const [address, setAddress] = useState({
    cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: ''
  });

  const pixPayload = useMemo(
    () => buildPixPayload(product?.priceNumber ?? 20),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [product?.id]
  );

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(pixPayload)}&size=240x240&margin=8`;

  // ── Early return depois de todos os hooks ──
  if (!isOpen || !product) return null;

  // ── Handlers ──────────────────────────────

  const handleClose = () => {
    setStep('form');
    setCompletedOrder(null);
    setCustomer({ name: '', cpf: '', email: '', phone: '' });
    setAddress({ cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' });
    setCopyFeedback(null);
    onClose();
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(pixPayload).catch(() => {});
    setCopyFeedback('payload');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleCopyCpf = () => {
    navigator.clipboard.writeText(PIX_CPF_RAW).catch(() => {});
    setCopyFeedback('cpf');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleCepBlur = async () => {
    const raw = address.cep.replace(/\D/g, '');
    if (raw.length !== 8) return;
    setIsSearchingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const d = await res.json();
      if (!d.erro) {
        setAddress(p => ({ ...p, street: d.logradouro || '', neighborhood: d.bairro || '', city: d.localidade || '', state: d.uf || '' }));
      }
    } catch {}
    finally { setIsSearchingCep(false); }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('pix');
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    const payload = {
      customer: { ...customer, address: product.type === 'fisico' ? address : null },
      product: {
        id: product.id,
        title: product.title,
        category: product.category,
        type: product.type,
        price: product.price,
        digitalUrl: product.digitalUrl || ''
      },
      payment: { method: 'pix' }
    };

    try {
      const res = await fetch('/api/loja.php?action=create_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setCompletedOrder(data.success && data.order ? data.order : { id: `PED-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, ...payload });
    } catch {
      setCompletedOrder({ id: `PED-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, ...payload });
    } finally {
      setIsSubmitting(false);
      setStep('success');
    }
  };

  // ── Barra de progresso ────────────────────
  const steps: Step[] = ['form', 'pix', 'success'];
  const stepIndex = steps.indexOf(step);
  const stepLabels = ['Seus Dados', 'Pagamento PIX', 'Confirmação'];

  // ── Render ────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-stone-200">

        {/* Barra topo */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-800" />

        {/* Botão Fechar */}
        <button
          type="button"
          onClick={handleClose}
          className="cursor-pointer absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors z-10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header produto */}
        <div className="px-6 pt-6 pb-4 border-b border-stone-100 flex items-center gap-3 pr-16">
          {product.image && (
            <img
              src={getImagePath(product.image)}
              alt={product.title}
              className="w-14 h-14 rounded-xl object-cover border border-stone-200 flex-shrink-0"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              {product.type === 'digital' ? '✨ E-book Digital' : '📦 Livro Físico'}
            </p>
            <h2 className="text-sm font-bold text-stone-900 leading-tight line-clamp-2">{product.title}</h2>
            <p className="text-emerald-700 font-bold text-base mt-0.5">{product.price}</p>
          </div>
        </div>

        {/* Barra de progresso */}
        {step !== 'success' && (
          <div className="px-6 py-3 bg-stone-50 border-b border-stone-100">
            <div className="flex items-center justify-between">
              {stepLabels.slice(0, 2).map((label, i) => (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      stepIndex >= i ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-500'
                    }`}>
                      {stepIndex > i ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (i + 1)}
                    </div>
                    <span className={`text-xs font-semibold ${stepIndex >= i ? 'text-emerald-800' : 'text-stone-400'}`}>{label}</span>
                  </div>
                  {i < 1 && (
                    <div className={`flex-1 h-0.5 mx-3 rounded transition-all ${stepIndex > i ? 'bg-emerald-600' : 'bg-stone-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* ── ETAPA 1: FORMULÁRIO ── */}
        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-stone-700 mb-3">Seus Dados Pessoais</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1">Nome Completo *</label>
                  <input
                    type="text" required placeholder="Ex: Maria Silva"
                    value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">CPF *</label>
                    <input
                      type="text" required placeholder="000.000.000-00"
                      value={customer.cpf} onChange={e => setCustomer({ ...customer, cpf: formatCPF(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">WhatsApp *</label>
                    <input
                      type="tel" required placeholder="(00) 00000-0000"
                      value={customer.phone} onChange={e => setCustomer({ ...customer, phone: formatPhone(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1">E-mail *</label>
                  <input
                    type="email" required placeholder="seuemail@exemplo.com"
                    value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    {product.type === 'digital'
                      ? '📩 O link de acesso ao material será enviado para este e-mail após o pagamento.'
                      : '📩 O código de rastreio será enviado por aqui.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Endereço — somente físico */}
            {product.type === 'fisico' && (
              <div className="pt-2 border-t border-stone-100">
                <h3 className="text-sm font-bold text-stone-700 mb-3">Endereço de Entrega</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">CEP *</label>
                      <div className="relative">
                        <input
                          type="text" required placeholder="00000-000"
                          value={address.cep}
                          onChange={e => setAddress({ ...address, cep: formatCEP(e.target.value) })}
                          onBlur={handleCepBlur}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                        />
                        {isSearchingCep && <div className="absolute right-3 top-3 w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Rua *</label>
                      <input
                        type="text" required placeholder="Av. Paulista"
                        value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Número *</label>
                      <input
                        type="text" required placeholder="123"
                        value={address.number} onChange={e => setAddress({ ...address, number: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Complemento</label>
                      <input
                        type="text" placeholder="Apto 42"
                        value={address.complement} onChange={e => setAddress({ ...address, complement: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Bairro *</label>
                      <input
                        type="text" required placeholder="Centro"
                        value={address.neighborhood} onChange={e => setAddress({ ...address, neighborhood: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Cidade *</label>
                      <input
                        type="text" required placeholder="São Paulo"
                        value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">UF *</label>
                      <input
                        type="text" required maxLength={2} placeholder="SP"
                        value={address.state} onChange={e => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all uppercase text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botão avançar */}
            <div className="pt-2">
              <button
                type="submit"
                className="cursor-pointer w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-2xl font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Continuar para Pagamento</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
        )}

        {/* ── ETAPA 2: PIX ── */}
        {step === 'pix' && (
          <div className="p-6 space-y-5">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                Pagamento via PIX
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-2">Escaneie o QR Code</h3>
              <p className="text-xs text-stone-500 mt-1">
                Abra o aplicativo do seu banco e aponte a câmera, ou copie o código abaixo.
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-white border-2 border-teal-200 rounded-2xl p-3 shadow-md inline-flex">
                <img
                  src={qrCodeUrl}
                  alt="QR Code PIX"
                  className="w-44 h-44 object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Info PIX */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-teal-800 font-semibold">Chave PIX (CPF):</span>
                <span className="font-mono font-bold text-teal-950">{PIX_CPF_FMT}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-teal-800 font-semibold">Favorecido:</span>
                <span className="font-bold text-teal-950">ALBA Ayurveda</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-teal-800 font-semibold">Valor:</span>
                <span className="font-bold text-emerald-700 text-base">{product.price}</span>
              </div>
            </div>

            {/* Botões copiar */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleCopyPayload}
                className="cursor-pointer bg-teal-700 hover:bg-teal-800 active:scale-95 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {copyFeedback === 'payload' ? '✓ Copiado!' : 'Copiar Código PIX'}
              </button>
              <button
                type="button"
                onClick={handleCopyCpf}
                className="cursor-pointer bg-white hover:bg-teal-50 active:scale-95 text-teal-900 border border-teal-300 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                {copyFeedback === 'cpf' ? '✓ Copiado!' : 'Copiar Chave CPF'}
              </button>
            </div>

            {/* Aviso */}
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Após efetuar o pagamento</strong>, clique no botão abaixo para confirmar e liberar seu acesso.
                {product.type === 'digital' && ' O link do Google Drive será exibido na tela e enviado ao seu e-mail.'}
              </p>
            </div>

            {/* Botão confirmar pagamento */}
            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Confirmando pagamento...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Já fiz o pagamento — Confirmar</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('form')}
              className="cursor-pointer w-full text-center text-xs text-stone-400 hover:text-stone-600 transition-colors py-1"
            >
              ← Voltar e editar dados
            </button>
          </div>
        )}

        {/* ── ETAPA 3: SUCESSO ── */}
        {step === 'success' && (
          <div className="p-8 text-center">
            {/* Ícone */}
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Pagamento Confirmado!
            </span>
            <h2 className="text-2xl font-serif text-stone-900 mt-3 mb-1">Obrigado, {customer.name.split(' ')[0]}!</h2>
            <p className="text-stone-500 text-sm max-w-xs mx-auto mb-6">
              Um e-mail de confirmação foi enviado para <strong className="text-stone-700">{customer.email}</strong>.
            </p>

            {/* Produto digital — acesso imediato */}
            {product.type === 'digital' && product.digitalUrl && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Acesso Liberado!</p>
                    <p className="text-xs text-emerald-700">Clique abaixo para baixar seu material.</p>
                  </div>
                </div>
                <a
                  href={product.digitalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer mt-3 w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md active:scale-95"
                >
                  <span>Acessar Material no Google Drive</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Produto físico — confirmação de envio */}
            {product.type === 'fisico' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
                <p className="text-sm font-bold text-amber-900 mb-2">📦 Seu pedido será despachado para:</p>
                <div className="text-xs text-stone-600 space-y-0.5 bg-white rounded-xl p-3 border border-amber-100">
                  <p><strong>Nome:</strong> {customer.name}</p>
                  <p><strong>Endereço:</strong> {address.street}, {address.number}{address.complement ? ` (${address.complement})` : ''}</p>
                  <p><strong>Bairro:</strong> {address.neighborhood} — {address.city}/{address.state}</p>
                  <p><strong>CEP:</strong> {address.cep}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all"
            >
              Voltar para a Loja
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
