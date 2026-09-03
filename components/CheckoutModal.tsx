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
  hotmartLink?: string;
  status: string;
}

interface CheckoutModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Helpers fora do componente (sem problema de hooks) ──────────────────────

const formatCPF = (val: string) =>
  val.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').slice(0, 14);

const formatPhone = (val: string) => {
  const c = val.replace(/\D/g, '');
  return c.length <= 10
    ? c.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    : c.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').slice(0, 15);
};

const formatCEP = (val: string) =>
  val.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);

const formatCardNumber = (val: string) =>
  val.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);

const formatCardExpiry = (val: string) =>
  val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);

const getImagePath = (src: string) => {
  const fallback = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop';
  if (!src) return fallback;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const clean = src.replace(/^\//, '');
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('github.io') || window.location.pathname.startsWith('/ALBA')) {
      return `/ALBA/${clean}`;
    }
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
  const amtStr = (amount || 20).toFixed(2);
  const raw =
    tlv('00', '01') +
    tlv('26', acct) +
    tlv('52', '0000') +
    tlv('53', '986') +
    tlv('54', amtStr) +
    tlv('58', 'BR') +
    tlv('59', 'ALBA AYURVEDA') +
    tlv('60', 'SAO PAULO') +
    tlv('62', tlv('05', 'ALBA' + Math.floor(1000 + Math.random() * 9000))) +
    '6304';
  return raw + crc16(raw);
};

// ─── Componente principal ─────────────────────────────────────────────────────

export const CheckoutModal = ({ product, isOpen, onClose }: CheckoutModalProps) => {
  // Todos os hooks SEMPRE no topo, incondicionalmente
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'debit_card'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [copyFeedback, setCopyFeedback] = useState<'payload' | 'cpf' | null>(null);
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  const [customer, setCustomer] = useState({ name: '', cpf: '', email: '', phone: '' });
  const [address, setAddress] = useState({
    cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: ''
  });
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '', installments: 1 });

  const pixPayload = useMemo(
    () => buildPixPayload(product?.priceNumber || 20),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [product?.id] // recalcula apenas quando mudar de produto
  );

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(pixPayload)}&size=250x250&margin=6`;

  // ── Early return DEPOIS de todos os hooks ──
  if (!isOpen || !product) return null;

  // ── Handlers ──────────────────────────────
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

  const handleResetAndClose = () => {
    setStep('form');
    setCompletedOrder(null);
    setCustomer({ name: '', cpf: '', email: '', phone: '' });
    setAddress({ cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' });
    setCard({ number: '', name: '', expiry: '', cvv: '', installments: 1 });
    setPaymentMethod('pix');
    onClose();
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
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
      payment: {
        method: paymentMethod,
        installments: card.installments,
        cardLastDigits: paymentMethod === 'credit_card' ? card.number.slice(-4) : null
      }
    };

    try {
      const res = await fetch('/api/loja.php?action=create_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.order) {
        setCompletedOrder(data.order);
      } else {
        setCompletedOrder({ id: 'PED-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000), ...payload });
      }
    } catch {
      setCompletedOrder({ id: 'PED-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000), ...payload });
    } finally {
      setIsSubmitting(false);
      setStep('success');
    }
  };

  // ── Render ────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-stone-200">

        {/* Barra topo */}
        <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-800" />

        {/* Botão Fechar */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="cursor-pointer absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {step === 'form' ? (
          <div>
            {/* Cabeçalho produto */}
            <div className="p-6 md:p-8 bg-stone-50 border-b border-stone-200">
              <div className="flex items-center gap-4">
                {product.image && (
                  <img
                    src={getImagePath(product.image)}
                    alt={product.title}
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-sm flex-shrink-0"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop'; }}
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">{product.category}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${product.type === 'digital' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {product.type === 'digital' ? '✨ Produto Digital' : '📦 Produto Físico'}
                    </span>
                  </div>
                  <h2 className="text-xl font-serif text-stone-900 leading-snug">{product.title}</h2>
                  <p className="text-emerald-700 font-bold text-lg mt-0.5">{product.price}</p>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmitOrder} className="p-6 md:p-8 space-y-6">

              {/* Dados Pessoais */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
                  Seus Dados Pessoais
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Nome Completo *</label>
                    <input type="text" required placeholder="Ex: Maria Silva" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">CPF *</label>
                    <input type="text" required placeholder="000.000.000-00" value={customer.cpf} onChange={e => setCustomer({ ...customer, cpf: formatCPF(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">WhatsApp *</label>
                    <input type="tel" required placeholder="(00) 00000-0000" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: formatPhone(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone-600 mb-1">E-mail *</label>
                    <input type="email" required placeholder="seuemail@exemplo.com" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all" />
                    <p className="text-[11px] text-stone-400 mt-1">
                      {product.type === 'digital' ? 'O link de acesso ao Google Drive será enviado para este e-mail.' : 'O código de rastreio será enviado por aqui.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Endereço (físico) */}
              {product.type === 'fisico' && (
                <div className="pt-4 border-t border-stone-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">2</span>
                    Endereço de Entrega
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">CEP *</label>
                      <div className="relative">
                        <input type="text" required placeholder="00000-000" value={address.cep}
                          onChange={e => setAddress({ ...address, cep: formatCEP(e.target.value) })} onBlur={handleCepBlur}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all" />
                        {isSearchingCep && <div className="absolute right-3 top-3 w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Rua *</label>
                      <input type="text" required placeholder="Av. Paulista" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Número *</label>
                      <input type="text" required placeholder="123" value={address.number} onChange={e => setAddress({ ...address, number: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Complemento</label>
                      <input type="text" placeholder="Apto 42" value={address.complement} onChange={e => setAddress({ ...address, complement: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Bairro *</label>
                      <input type="text" required placeholder="Bela Vista" value={address.neighborhood} onChange={e => setAddress({ ...address, neighborhood: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Cidade *</label>
                      <input type="text" required placeholder="São Paulo" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Estado (UF) *</label>
                      <input type="text" required maxLength={2} placeholder="SP" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all uppercase" />
                    </div>
                  </div>
                </div>
              )}

              {/* Pagamento */}
              <div className="pt-4 border-t border-stone-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
                    {product.type === 'fisico' ? '3' : '2'}
                  </span>
                  Forma de Pagamento
                </h3>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {(['pix', 'credit_card', 'debit_card'] as const).map(method => (
                    <button key={method} type="button" onClick={() => setPaymentMethod(method)}
                      className={`cursor-pointer py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${paymentMethod === method ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold shadow-sm ring-1 ring-emerald-600' : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'}`}>
                      {method === 'pix' && <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                      {method === 'credit_card' && <svg className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                      {method === 'debit_card' && <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                      <span className="text-xs">{method === 'pix' ? 'PIX' : method === 'credit_card' ? 'Crédito' : 'Débito'}</span>
                    </button>
                  ))}
                </div>

                {/* PIX */}
                {paymentMethod === 'pix' && (
                  <div className="p-6 bg-teal-50/80 border border-teal-200 rounded-2xl">
                    <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                      <div className="w-36 h-36 bg-white p-2.5 rounded-2xl border-2 border-teal-200 flex items-center justify-center flex-shrink-0 shadow-md">
                        <img src={qrCodeUrl} alt="QR Code PIX" className="w-full h-full object-contain rounded-lg" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800 bg-teal-100/80 px-2.5 py-0.5 rounded-full">Pagamento Instantâneo</span>
                          <h4 className="text-sm font-bold text-teal-950 mt-1">Escaneie o QR Code ou use o Copia e Cola</h4>
                          <p className="text-xs text-teal-800 mt-0.5">Abra o app do seu banco e aponte a câmera para o QR Code acima.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                          <button type="button" onClick={handleCopyPayload}
                            className="cursor-pointer bg-teal-700 hover:bg-teal-800 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                            <span>{copyFeedback === 'payload' ? '✓ Copiado!' : 'Copiar Código PIX'}</span>
                          </button>
                          <button type="button" onClick={handleCopyCpf}
                            className="cursor-pointer bg-white hover:bg-teal-100 active:scale-95 text-teal-900 border border-teal-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                            <span>{copyFeedback === 'cpf' ? '✓ Copiado!' : `Copiar CPF: ${PIX_CPF_FMT}`}</span>
                          </button>
                        </div>
                        <div className="text-[11px] text-teal-900 bg-white/70 p-2.5 rounded-xl border border-teal-100 leading-snug">
                          <strong>Chave PIX (CPF):</strong> <span className="font-mono">{PIX_CPF_FMT}</span> • <strong>Valor:</strong> {product.price}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cartão de Crédito */}
                {paymentMethod === 'credit_card' && (
                  <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Número do Cartão *</label>
                      <input type="text" required placeholder="0000 0000 0000 0000" value={card.number} onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all font-mono" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Nome no Cartão *</label>
                        <input type="text" required placeholder="Como impresso" value={card.name} onChange={e => setCard({ ...card, name: e.target.value.toUpperCase() })}
                          className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all uppercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Validade *</label>
                        <input type="text" required placeholder="MM/AA" value={card.expiry} onChange={e => setCard({ ...card, expiry: formatCardExpiry(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all font-mono text-center" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">CVV *</label>
                        <input type="password" required maxLength={4} placeholder="123" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
                          className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all font-mono text-center" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Parcelamento</label>
                      <select value={card.installments} onChange={e => setCard({ ...card, installments: Number(e.target.value) })}
                        className="cursor-pointer w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all">
                        <option value={1}>1x de {product.price} (Sem juros)</option>
                        <option value={2}>2x de R$ {((product.priceNumber || 20) / 2).toFixed(2)} (Sem juros)</option>
                        <option value={3}>3x de R$ {((product.priceNumber || 20) / 3).toFixed(2)} (Sem juros)</option>
                        <option value={6}>6x de R$ {((product.priceNumber || 20) / 6).toFixed(2)} (Sem juros)</option>
                        <option value={12}>12x de R$ {((product.priceNumber || 20) / 12).toFixed(2)} (Sem juros)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Cartão de Débito */}
                {paymentMethod === 'debit_card' && (
                  <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Número do Cartão de Débito *</label>
                      <input type="text" required placeholder="0000 0000 0000 0000" value={card.number} onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Validade *</label>
                        <input type="text" required placeholder="MM/AA" value={card.expiry} onChange={e => setCard({ ...card, expiry: formatCardExpiry(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all font-mono text-center" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">CVV *</label>
                        <input type="password" required maxLength={4} placeholder="123" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
                          className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all font-mono text-center" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão Finalizar */}
              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-xs text-stone-400 block">Total a Pagar</span>
                  <span className="text-2xl font-serif font-bold text-stone-900">{product.price}</span>
                </div>
                <button type="submit" disabled={isSubmitting}
                  className="cursor-pointer w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Processando...</>
                  ) : (
                    <><span>Confirmar Pedido</span><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ── TELA DE SUCESSO ── */
          <div className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">Pedido Confirmado!</span>
            <h2 className="text-3xl font-serif text-stone-900 mt-3 mb-2">Obrigado pela sua compra!</h2>
            <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
              Confirmação enviada para <strong>{customer.email}</strong>.
            </p>

            {product.type === 'digital' && product.digitalUrl && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 max-w-lg mx-auto mb-8">
                <h4 className="text-lg font-bold text-emerald-950 mb-1">Seu Acesso Digital está Liberado! 🎉</h4>
                <p className="text-xs text-emerald-800 mb-5">Clique abaixo para acessar seu material no Google Drive:</p>
                <a href={product.digitalUrl} target="_blank" rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-md active:scale-95">
                  <span>Acessar Material no Google Drive</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            )}

            {product.type === 'fisico' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 max-w-lg mx-auto mb-8 text-left">
                <h4 className="text-base font-bold text-amber-950 mb-2">📦 Dados para Envio</h4>
                <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-stone-700 space-y-1">
                  <p><strong>Destinatário:</strong> {customer.name}</p>
                  <p><strong>Endereço:</strong> {address.street}, {address.number} {address.complement && `(${address.complement})`}</p>
                  <p><strong>Bairro/Cidade:</strong> {address.neighborhood}, {address.city} - {address.state}</p>
                  <p><strong>CEP:</strong> {address.cep}</p>
                </div>
              </div>
            )}

            <button type="button" onClick={handleResetAndClose}
              className="cursor-pointer bg-stone-900 hover:bg-stone-800 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all">
              Voltar para a Loja
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
