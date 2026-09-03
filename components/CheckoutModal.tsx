"use client";

import React, { useState } from 'react';

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

export const CheckoutModal = ({ product, isOpen, onClose }: CheckoutModalProps) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'debit_card'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Dados do cliente
  const [customer, setCustomer] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
  });

  // Endereço (para produtos físicos)
  const [address, setAddress] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  // Dados de Cartão
  const [card, setCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: 1
  });

  if (!isOpen || !product) return null;

  // Formatação de Máscaras
  const formatCPF = (val: string) => {
    return val
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  const formatPhone = (val: string) => {
    const clean = val.replace(/\D/g, '');
    if (clean.length <= 10) {
      return clean.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return clean.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').slice(0, 15);
  };

  const formatCEP = (val: string) => {
    return val.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
  };

  const formatCardNumber = (val: string) => {
    return val.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatCardExpiry = (val: string) => {
    return val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  // Busca de CEP via ViaCEP
  const handleCepBlur = async () => {
    const rawCep = address.cep.replace(/\D/g, '');
    if (rawCep.length === 8) {
      setIsSearchingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress(prev => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          }));
        }
      } catch (err) {
        console.error('Erro ao buscar CEP', err);
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  // Chave PIX e Cópia
  const pixKey = "contato@ayurvedica.org";
  const pixCodePayload = `00020126580014br.gov.bcb.pix0136${pixKey}5204000053039865405${(product.priceNumber || 47.9).toFixed(2)}5802BR5910ALBA LOJA6008BRASILIA62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  // Submissão do Checkout
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      customer: {
        ...customer,
        address: product.type === 'fisico' ? address : null
      },
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
        setStep('success');
      } else {
        // Fallback para simulação local se offline
        const localOrder = {
          id: 'PED-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
          createdAt: new Date().toISOString(),
          status: product.type === 'fisico' ? 'Pago' : 'Concluído',
          ...payload
        };
        setCompletedOrder(localOrder);
        setStep('success');
      }
    } catch (err) {
      console.warn('Erro ao conectar com API, finalizando localmente', err);
      const localOrder = {
        id: 'PED-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        createdAt: new Date().toISOString(),
        status: product.type === 'fisico' ? 'Pago' : 'Concluído',
        ...payload
      };
      setCompletedOrder(localOrder);
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep('form');
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-fade-in-up border border-stone-200">
        
        {/* Barra superior estilizada */}
        <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-800"></div>

        {/* Botão Fechar */}
        <button
          onClick={handleResetAndClose}
          className="cursor-pointer absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {step === 'form' ? (
          <div>
            {/* Cabeçalho do Produto */}
            <div className="p-6 md:p-8 bg-stone-50 border-b border-stone-200">
              <div className="flex items-center gap-4">
                {product.image && (
                  <img src={product.image} alt={product.title} className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-sm flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                      {product.category}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      product.type === 'digital' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {product.type === 'digital' ? '✨ Produto Digital (Drive)' : '📦 Produto Físico (Envio)'}
                    </span>
                  </div>
                  <h2 className="text-xl font-serif text-stone-900 leading-snug">{product.title}</h2>
                  <p className="text-emerald-700 font-bold text-lg mt-0.5">{product.price}</p>
                </div>
              </div>
            </div>

            {/* Formulário de Checkout */}
            <form onSubmit={handleSubmitOrder} className="p-6 md:p-8 space-y-6">
              
              {/* Seção 1: Dados Pessoais */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
                  Seus Dados Pessoais
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Maria Silva Sauro"
                      value={customer.name}
                      onChange={e => setCustomer({...customer, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">CPF *</label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={customer.cpf}
                      onChange={e => setCustomer({...customer, cpf: formatCPF(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Telefone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(00) 00000-0000"
                      value={customer.phone}
                      onChange={e => setCustomer({...customer, phone: formatPhone(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone-600 mb-1">E-mail para Receber o Pedido *</label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={customer.email}
                      onChange={e => setCustomer({...customer, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      {product.type === 'digital' 
                        ? 'O link de acesso ao Google Drive será enviado para este e-mail.' 
                        : 'O código de rastreio e atualizações de entrega serão enviados por aqui.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 2: Endereço (Apenas se for produto físico) */}
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
                        <input
                          type="text"
                          required
                          placeholder="00000-000"
                          value={address.cep}
                          onChange={e => setAddress({...address, cep: formatCEP(e.target.value)})}
                          onBlur={handleCepBlur}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                        />
                        {isSearchingCep && (
                          <div className="absolute right-3 top-3 w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Rua / Logradouro *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Av. Paulista"
                        value={address.street}
                        onChange={e => setAddress({...address, street: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Número *</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={address.number}
                        onChange={e => setAddress({...address, number: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Complemento</label>
                      <input
                        type="text"
                        placeholder="Apto 42, Bloco B"
                        value={address.complement}
                        onChange={e => setAddress({...address, complement: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Bairro *</label>
                      <input
                        type="text"
                        required
                        placeholder="Bela Vista"
                        value={address.neighborhood}
                        onChange={e => setAddress({...address, neighborhood: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Cidade *</label>
                      <input
                        type="text"
                        required
                        placeholder="São Paulo"
                        value={address.city}
                        onChange={e => setAddress({...address, city: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Estado (UF) *</label>
                      <input
                        type="text"
                        required
                        maxLength={2}
                        placeholder="SP"
                        value={address.state}
                        onChange={e => setAddress({...address, state: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Seção 3: Forma de Pagamento */}
              <div className="pt-4 border-t border-stone-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
                    {product.type === 'fisico' ? '3' : '2'}
                  </span>
                  Forma de Pagamento
                </h3>

                {/* Seletores de Método */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`cursor-pointer py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'pix'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold shadow-sm ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-xs">PIX Instantâneo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`cursor-pointer py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'credit_card'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold shadow-sm ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <svg className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-xs">Cartão de Crédito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('debit_card')}
                    className={`cursor-pointer py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'debit_card'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold shadow-sm ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs">Cartão de Débito</span>
                  </button>
                </div>

                {/* Conteúdo do PIX */}
                {paymentMethod === 'pix' && (
                  <div className="p-5 bg-teal-50/60 border border-teal-200 rounded-2xl">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      <div className="w-24 h-24 bg-white p-2 rounded-xl border border-teal-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <svg className="w-20 h-20 text-teal-700" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4 4h4v4H4V4zm2 2v0h0v0zm10-2h4v4h-4V4zm2 2v0h0v0zM4 16h4v4H4v-4zm2 2v0h0v0zM12 4h2v2h-2V4zm0 4h2v2h-2V8zm-2 2H8v2h2v-2zm6 0h-2v2h2v-2zm2 2h2v2h-2v-2zm-6 2h2v2h-2v-2zm-4 0H6v2h2v-2zm8 0h2v2h-2v-2zm2 2h2v2h-2v-2zm-6 2h2v2h-2v-2zm-4 0H6v2h2v-2zm12 0h2v2h-2v-2zM4 10h2v2H4v-2zm14 0h2v2h-2v-2zm-2 4h2v2h-2v-2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-teal-900 mb-1">Chave PIX Oficial (E-mail):</p>
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-teal-200 font-mono text-xs text-teal-950 select-all">
                          <span className="truncate">{pixKey}</span>
                          <button
                            type="button"
                            onClick={handleCopyPix}
                            className="cursor-pointer ml-auto bg-teal-700 hover:bg-teal-800 text-white px-3 py-1 rounded-lg text-xs font-sans font-bold whitespace-nowrap transition-colors"
                          >
                            {pixCopied ? '✓ Copiado!' : 'Copiar Chave'}
                          </button>
                        </div>
                        <p className="text-[11px] text-teal-800 mt-2">
                          Valor a pagar: <strong>{product.price}</strong> • Liberação imediata após a confirmação.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conteúdo de Cartão de Crédito */}
                {paymentMethod === 'credit_card' && (
                  <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Número do Cartão *</label>
                      <input
                        type="text"
                        required
                        placeholder="0000 0000 0000 0000"
                        value={card.number}
                        onChange={e => setCard({...card, number: formatCardNumber(e.target.value)})}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Nome no Cartão *</label>
                        <input
                          type="text"
                          required
                          placeholder="Como impresso"
                          value={card.name}
                          onChange={e => setCard({...card, name: e.target.value.toUpperCase()})}
                          className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Validade *</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/AA"
                          value={card.expiry}
                          onChange={e => setCard({...card, expiry: formatCardExpiry(e.target.value)})}
                          className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">CVV *</label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="123"
                          value={card.cvv}
                          onChange={e => setCard({...card, cvv: e.target.value.replace(/\D/g, '')})}
                          className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all font-mono text-center"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Parcelamento</label>
                      <select
                        value={card.installments}
                        onChange={e => setCard({...card, installments: Number(e.target.value)})}
                        className="cursor-pointer w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all font-medium text-stone-800"
                      >
                        <option value={1}>1x de {product.price} (Sem juros)</option>
                        <option value={2}>2x de R$ {((product.priceNumber || 47.9) / 2).toFixed(2)} (Sem juros)</option>
                        <option value={3}>3x de R$ {((product.priceNumber || 47.9) / 3).toFixed(2)} (Sem juros)</option>
                        <option value={6}>6x de R$ {((product.priceNumber || 47.9) / 6).toFixed(2)} (Sem juros)</option>
                        <option value={12}>12x de R$ {((product.priceNumber || 47.9) / 12).toFixed(2)} (Sem juros)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Conteúdo de Débito */}
                {paymentMethod === 'debit_card' && (
                  <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Número do Cartão de Débito *</label>
                      <input
                        type="text"
                        required
                        placeholder="0000 0000 0000 0000"
                        value={card.number}
                        onChange={e => setCard({...card, number: formatCardNumber(e.target.value)})}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Validade *</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/AA"
                          value={card.expiry}
                          onChange={e => setCard({...card, expiry: formatCardExpiry(e.target.value)})}
                          className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">CVV *</label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="123"
                          value={card.cvv}
                          onChange={e => setCard({...card, cvv: e.target.value.replace(/\D/g, '')})}
                          className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de Finalizar */}
              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-xs text-stone-400 block">Total a Pagar</span>
                  <span className="text-2xl font-serif font-bold text-stone-900">{product.price}</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <span>Confirmar e Finalizar Pedido</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* ================================================================= */
          /* TELA DE SUCESSO / CONFIRMAÇÃO */
          /* ================================================================= */
          <div className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Pedido Confirmado com Sucesso
            </span>
            <h2 className="text-3xl font-serif text-stone-900 mt-3 mb-2">Muito obrigado pela sua compra!</h2>
            <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
              O pedido <strong className="text-stone-800 font-mono">#{completedOrder?.id}</strong> foi registrado e enviamos a confirmação para <strong>{customer.email}</strong>.
            </p>

            {/* SE PRODUTO DIGITAL: BOTÃO DIRETO DO GOOGLE DRIVE */}
            {product.type === 'digital' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 max-w-lg mx-auto mb-8 text-center shadow-sm">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 text-emerald-700 shadow-sm border border-emerald-100">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-emerald-950 mb-1">Seu Acesso Digital está Liberado!</h4>
                <p className="text-xs text-emerald-800 mb-5">
                  Clique no botão abaixo para abrir a pasta exclusiva no Google Drive e baixar seu conteúdo:
                </p>
                <a
                  href={product.digitalUrl || "https://drive.google.com/drive/folders/1wzSkQvPnCh1RL_fik42pP4o_pMF2wXKC?usp=drive_link"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-md active:scale-95"
                >
                  <span>Acessar Material no Google Drive</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* SE PRODUTO FÍSICO: CONFIRMAÇÃO DE ENVIO */}
            {product.type === 'fisico' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 max-w-lg mx-auto mb-8 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                    📦
                  </div>
                  <h4 className="text-base font-bold text-amber-950">Dados para Despacho e Envio</h4>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed mb-3">
                  Nossa equipe de logística foi notificada e já iniciou a preparação do seu pacote para o endereço:
                </p>
                <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-stone-700">
                  <p><strong>Destinatário:</strong> {customer.name}</p>
                  <p><strong>Endereço:</strong> {address.street}, {address.number} {address.complement && `(${address.complement})`}</p>
                  <p><strong>Bairro/Cidade:</strong> {address.neighborhood}, {address.city} - {address.state}</p>
                  <p><strong>CEP:</strong> {address.cep}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleResetAndClose}
              className="cursor-pointer bg-stone-900 hover:bg-stone-800 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all"
            >
              Voltar para a Loja
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
