"use client";

import React, { useState, useEffect } from 'react';
import { ProductItem } from '../../../components/CheckoutModal';

const API_URL = '/api/loja.php';

interface OrderItem {
  id: string;
  createdAt: string;
  status: 'Pendente' | 'Pago' | 'Enviado' | 'Concluído' | 'Cancelado';
  customer: {
    name: string;
    cpf: string;
    email: string;
    phone: string;
    address?: {
      cep: string;
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
    } | null;
  };
  product: {
    id: string;
    title: string;
    category: string;
    type: 'digital' | 'fisico';
    price: string;
    digitalUrl?: string;
  };
  payment: {
    method: string;
    installments?: number;
    cardLastDigits?: string;
    status: string;
  };
  trackingCode?: string;
  notes?: string;
}

const defaultProducts: ProductItem[] = [
  {
    id: 'prod-1',
    title: 'Guia Prático de Culinária Ayurvédica',
    category: 'E-book',
    type: 'digital',
    price: 'R$ 47,90',
    priceNumber: 47.9,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop',
    description: 'Aprenda a aplicar os princípios do Ayurveda na sua cozinha diária para mais saúde e vitalidade.',
    digitalUrl: 'https://drive.google.com/drive/folders/1wzSkQvPnCh1RL_fik42pP4o_pMF2wXKC?usp=drive_link',
    status: 'Ativo'
  },
  {
    id: 'prod-2',
    title: 'Manual dos Tridoshas: Vata, Pitta e Kapha',
    category: 'E-book',
    type: 'digital',
    price: 'R$ 39,00',
    priceNumber: 39.0,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
    description: 'Descubra sua constituição biológica (Prakriti) e desequilíbrios momentâneos (Vikriti).',
    digitalUrl: 'https://drive.google.com/drive/folders/1wzSkQvPnCh1RL_fik42pP4o_pMF2wXKC?usp=drive_link',
    status: 'Ativo'
  },
  {
    id: 'prod-3',
    title: 'Kit Óleos Vegetais Terapêuticos para Massagem (250ml)',
    category: 'Produtos Corporais',
    type: 'fisico',
    price: 'R$ 120,00',
    priceNumber: 120.0,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop',
    description: 'Óleo 100% puro medicado com ervas ayurvédicas para massagem Abhyanga e Champi.',
    digitalUrl: '',
    status: 'Ativo'
  }
];

export default function AdminLojaPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // Estados de Produtos
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [productView, setProductView] = useState<'list' | 'form'>('list');
  const [productFormData, setProductFormData] = useState<ProductItem>({
    id: '',
    title: '',
    category: 'E-book',
    type: 'digital',
    price: '',
    image: '',
    description: '',
    digitalUrl: '',
    status: 'Ativo'
  });

  // Estados de Pedidos
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('Todos');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [editTrackingCode, setEditTrackingCode] = useState('');
  const [editStatus, setEditStatus] = useState<any>('Pago');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Carregar dados iniciais do servidor
  const loadData = async () => {
    // 1. Carregar Produtos
    try {
      const res = await fetch(`${API_URL}?action=products`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          localStorage.setItem('alba_loja_produtos_server', JSON.stringify(data));
        } else {
          setProducts(defaultProducts);
        }
      }
    } catch (e) {
      const saved = localStorage.getItem('alba_loja_produtos_server');
      if (saved) {
        try { setProducts(JSON.parse(saved)); } catch (err) {}
      } else {
        setProducts(defaultProducts);
      }
    }

    // 2. Carregar Pedidos
    try {
      const res = await fetch(`${API_URL}?action=orders`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
          localStorage.setItem('alba_loja_pedidos_server', JSON.stringify(data));
        }
      }
    } catch (e) {
      const saved = localStorage.getItem('alba_loja_pedidos_server');
      if (saved) {
        try { setOrders(JSON.parse(saved)); } catch (err) {}
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Salvar Produtos no Servidor
  const saveProductsToServer = async (updatedProducts: ProductItem[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('alba_loja_produtos_server', JSON.stringify(updatedProducts));
    try {
      await fetch(`${API_URL}?action=save_products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProducts)
      });
    } catch (e) {
      console.warn('Erro ao salvar produtos no servidor', e);
    }
  };

  // Handlers de Produtos
  const handleAddNewProduct = () => {
    setProductFormData({
      id: '',
      title: '',
      category: 'E-book',
      type: 'digital',
      price: '',
      image: '',
      description: '',
      digitalUrl: '',
      status: 'Ativo'
    });
    setProductView('form');
  };

  const handleEditProduct = (p: ProductItem) => {
    setProductFormData(p);
    setProductView('form');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza que deseja remover este produto da Loja?')) {
      const updated = products.filter(p => p.id !== id);
      saveProductsToServer(updated);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: ProductItem[];

    // Parse do valor numérico
    const priceNum = parseFloat(productFormData.price.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
    const finalProduct = { ...productFormData, priceNumber: priceNum };

    if (productFormData.id) {
      updated = products.map(p => p.id === productFormData.id ? finalProduct : p);
    } else {
      const newProd: ProductItem = {
        ...finalProduct,
        id: 'prod-' + Date.now()
      };
      updated = [newProd, ...products];
    }

    saveProductsToServer(updated);
    alert('Produto salvo com sucesso!');
    setProductView('list');
  };

  // Handlers de Pedidos
  const handleOpenOrderDetails = (order: OrderItem) => {
    setSelectedOrder(order);
    setEditTrackingCode(order.trackingCode || '');
    setEditStatus(order.status);
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdatingOrder(true);

    const payload = {
      orderId: selectedOrder.id,
      status: editStatus,
      trackingCode: editTrackingCode
    };

    try {
      await fetch(`${API_URL}?action=update_order_status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('Erro ao atualizar status do pedido no servidor', e);
    }

    // Atualizar local
    const updated = orders.map(o => {
      if (o.id === selectedOrder.id) {
        return { ...o, status: editStatus, trackingCode: editTrackingCode };
      }
      return o;
    });

    setOrders(updated);
    localStorage.setItem('alba_loja_pedidos_server', JSON.stringify(updated));
    setSelectedOrder(null);
    setIsUpdatingOrder(false);
    alert('Pedido atualizado com sucesso!');
  };

  // Métricas
  const totalOrdersCount = orders.length;
  const pendingShipmentCount = orders.filter(o => o.product.type === 'fisico' && (o.status === 'Pago' || o.status === 'Pendente')).length;
  const completedOrdersCount = orders.filter(o => o.status === 'Concluído' || o.status === 'Enviado').length;

  // Filtros de Pedidos
  const filteredOrders = orders.filter(order => {
    const matchesStatus = orderStatusFilter === 'Todos' || order.status === orderStatusFilter;
    const matchesSearch = 
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customer.cpf.includes(orderSearch) ||
      order.product.title.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtros de Produtos
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up font-sans">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-stone-900">Loja Oficial & Pedidos</h2>
          <p className="text-stone-500 mt-1">
            Gerencie o catálogo de produtos, entregas de itens físicos e acessos a materiais digitais no Google Drive.
          </p>
        </div>

        {/* Abas Principais */}
        <div className="flex bg-stone-200/80 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => { setActiveTab('orders'); setProductView('list'); }}
            className={`cursor-pointer px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders' 
                ? 'bg-white text-stone-900 shadow-sm' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Vendas & Pedidos ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`cursor-pointer px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'products' 
                ? 'bg-white text-stone-900 shadow-sm' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Catálogo de Produtos ({products.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: VENDAS & PEDIDOS */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-8">
          
          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-bold">
                💰
              </div>
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total de Pedidos</span>
                <div className="text-2xl font-bold font-serif text-stone-900">{totalOrdersCount} vendas</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-bold">
                📦
              </div>
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Físicos a Despachar</span>
                <div className="text-2xl font-bold font-serif text-amber-900">{pendingShipmentCount} aguardando</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-2xl font-bold">
                ✨
              </div>
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Concluídos / Digitais</span>
                <div className="text-2xl font-bold font-serif text-teal-900">{completedOrdersCount} liberados</div>
              </div>
            </div>
          </div>

          {/* Lista e Filtro de Pedidos */}
          <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm">
            
            {/* Barra de Filtros */}
            <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full max-w-md">
                <input 
                  type="text" 
                  placeholder="Buscar por ID, Nome, CPF, E-mail ou Produto..." 
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
                />
                <svg className="w-5 h-5 text-stone-400 absolute left-4 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
                {['Todos', 'Pago', 'Enviado', 'Concluído', 'Pendente', 'Cancelado'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                      orderStatusFilter === st
                        ? 'bg-stone-900 text-white'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabela de Pedidos */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-white border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider">
                    <th className="p-6 font-medium">Pedido / Data</th>
                    <th className="p-6 font-medium">Comprador</th>
                    <th className="p-6 font-medium">Produto</th>
                    <th className="p-6 font-medium">Valor / Pagamento</th>
                    <th className="p-6 font-medium">Status</th>
                    <th className="p-6 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-stone-400">
                        Nenhum pedido encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="p-6">
                          <span className="font-mono font-bold text-stone-900 block text-xs">{order.id}</span>
                          <span className="text-[11px] text-stone-400">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="font-bold text-stone-900 block">{order.customer.name}</span>
                          <span className="text-xs text-stone-500 block">{order.customer.email}</span>
                          <span className="text-xs text-emerald-700 font-medium">{order.customer.phone}</span>
                        </td>
                        <td className="p-6 max-w-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              order.product.type === 'digital' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.product.type === 'digital' ? '✨ Digital' : '📦 Físico'}
                            </span>
                          </div>
                          <span className="font-medium text-stone-800 line-clamp-1" title={order.product.title}>
                            {order.product.title}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className="font-bold text-emerald-800 text-sm block">{order.product.price}</span>
                          <span className="text-[11px] text-stone-400 uppercase font-bold">
                            {order.payment.method === 'pix' ? 'PIX Instantâneo' : 'Cartão'}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                            order.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'Pago' ? 'bg-teal-100 text-teal-800' :
                            order.status === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Pendente' ? 'bg-amber-100 text-amber-800' :
                            'bg-stone-200 text-stone-600'
                          }`}>
                            {order.status}
                          </span>
                          {order.trackingCode && (
                            <span className="block text-[10px] text-stone-400 font-mono mt-1">
                              Rastreio: {order.trackingCode}
                            </span>
                          )}
                        </td>
                        <td className="p-6 text-right">
                          <button
                            onClick={() => handleOpenOrderDetails(order)}
                            className="cursor-pointer bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                          >
                            Ver Detalhes / Envio
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* MODAL DE DETALHES DO PEDIDO / DESPACHO */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
              <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 my-8 animate-fade-in-up border border-stone-200">
                
                <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
                  <div>
                    <span className="text-xs uppercase font-bold text-stone-400 tracking-wider">Detalhes da Venda</span>
                    <h3 className="text-xl font-serif text-stone-900 font-bold">Pedido #{selectedOrder.id}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="cursor-pointer text-stone-400 hover:text-stone-700 p-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6 text-sm text-stone-700">
                  
                  {/* Dados do Cliente */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2">👤 Comprador</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <p><strong>Nome:</strong> {selectedOrder.customer.name}</p>
                      <p><strong>CPF:</strong> {selectedOrder.customer.cpf}</p>
                      <p><strong>E-mail:</strong> {selectedOrder.customer.email}</p>
                      <p><strong>Telefone:</strong> {selectedOrder.customer.phone}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-200 flex gap-3">
                      <a
                        href={`https://wa.me/55${selectedOrder.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${selectedOrder.customer.name}, aqui é da ALBA sobre seu pedido #${selectedOrder.id}!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        <span>Falar no WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Endereço de Envio (se físico) */}
                  {selectedOrder.product.type === 'fisico' && selectedOrder.customer.address && (
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                      <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider mb-2">📦 Endereço Completo para Envio</h4>
                      <p><strong>Destinatário:</strong> {selectedOrder.customer.name}</p>
                      <p><strong>Rua:</strong> {selectedOrder.customer.address.street}, Nº {selectedOrder.customer.address.number} {selectedOrder.customer.address.complement && `(${selectedOrder.customer.address.complement})`}</p>
                      <p><strong>Bairro:</strong> {selectedOrder.customer.address.neighborhood}</p>
                      <p><strong>Cidade/UF:</strong> {selectedOrder.customer.address.city} - {selectedOrder.customer.address.state}</p>
                      <p><strong>CEP:</strong> {selectedOrder.customer.address.cep}</p>
                    </div>
                  )}

                  {/* Link Digital do Google Drive (se digital) */}
                  {selectedOrder.product.type === 'digital' && (
                    <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200">
                      <h4 className="font-bold text-teal-950 text-xs uppercase tracking-wider mb-2">✨ Link do Material no Google Drive</h4>
                      <p className="text-xs text-teal-900 mb-2">Link liberado para o cliente:</p>
                      <a
                        href={selectedOrder.product.digitalUrl || "https://drive.google.com/drive/folders/1wzSkQvPnCh1RL_fik42pP4o_pMF2wXKC?usp=drive_link"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-teal-800 underline break-all hover:text-teal-950"
                      >
                        {selectedOrder.product.digitalUrl || "Pasta Padrão Google Drive"}
                      </a>
                    </div>
                  )}

                  {/* Formulário de Atualização de Status & Rastreio */}
                  <div className="pt-4 border-t border-stone-100">
                    <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-3">⚙️ Atualizar Status do Pedido</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Status</label>
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value)}
                          className="cursor-pointer w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-600"
                        >
                          <option value="Pago">Pago (Aguardando Despacho)</option>
                          <option value="Enviado">Enviado (Pacote Postado)</option>
                          <option value="Concluído">Concluído / Entregue</option>
                          <option value="Pendente">Pendente</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </div>

                      {selectedOrder.product.type === 'fisico' && (
                        <div>
                          <label className="block text-xs font-semibold text-stone-600 mb-1">Código de Rastreio dos Correios</label>
                          <input
                            type="text"
                            placeholder="Ex: QB123456789BR"
                            value={editTrackingCode}
                            onChange={e => setEditTrackingCode(e.target.value)}
                            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm uppercase font-mono focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-stone-100">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="cursor-pointer px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={handleUpdateOrderStatus}
                    disabled={isUpdatingOrder}
                    className="cursor-pointer px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md"
                  >
                    {isUpdatingOrder ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: CATÁLOGO DE PRODUTOS */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <div>
          
          {productView === 'list' ? (
            <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm">
              
              {/* Barra de Busca e Botão Novo Produto */}
              <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full max-w-md">
                  <input 
                    type="text" 
                    placeholder="Buscar produto por nome ou categoria..." 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
                  />
                  <svg className="w-5 h-5 text-stone-400 absolute left-4 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <button 
                  onClick={handleAddNewProduct}
                  className="cursor-pointer bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-800 transition-all active:scale-95 shadow-md flex items-center gap-2 text-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Novo Produto
                </button>
              </div>

              {/* Tabela de Produtos */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-white border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider">
                      <th className="p-6 font-medium">Produto</th>
                      <th className="p-6 font-medium">Tipo</th>
                      <th className="p-6 font-medium">Preço</th>
                      <th className="p-6 font-medium">Link do Google Drive</th>
                      <th className="p-6 font-medium">Status</th>
                      <th className="p-6 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-6 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
                            {product.image ? (
                              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-400">
                                🛍️
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 max-w-xs truncate" title={product.title}>
                              {product.title}
                            </div>
                            <div className="text-stone-400 text-xs">{product.category}</div>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            product.type === 'digital' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {product.type === 'digital' ? '✨ Digital' : '📦 Físico'}
                          </span>
                        </td>
                        <td className="p-6 text-emerald-800 font-bold font-serif">
                          {product.price}
                        </td>
                        <td className="p-6 text-xs text-stone-500 max-w-[200px] truncate">
                          {product.type === 'digital' ? (
                            product.digitalUrl ? (
                              <a href={product.digitalUrl} target="_blank" rel="noopener noreferrer" className="text-teal-700 underline truncate block">
                                {product.digitalUrl}
                              </a>
                            ) : (
                              <span className="text-stone-400 italic">Pasta Padrão</span>
                            )
                          ) : (
                            <span className="text-stone-400">-</span>
                          )}
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            product.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="p-6 flex items-center justify-end gap-3">
                          <button onClick={() => handleEditProduct(product)} className="cursor-pointer text-stone-400 hover:text-blue-600 transition-colors" title="Editar Produto">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="cursor-pointer text-stone-400 hover:text-red-500 transition-colors" title="Excluir Produto">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ) : (
            /* Formulário de Produto */
            <form onSubmit={handleSaveProduct} className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm">
              <h3 className="text-xl font-serif text-stone-900 mb-6 border-b border-stone-100 pb-4">
                {productFormData.id ? 'Editar Produto' : 'Cadastrar Novo Produto na Loja'}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-2">Nome do Produto *</label>
                  <input 
                    type="text" 
                    required 
                    value={productFormData.title}
                    onChange={e => setProductFormData({...productFormData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" 
                    placeholder="Ex: Manual Prático de Fitoterapia Ayurvédica" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Tipo de Produto *</label>
                  <select 
                    value={productFormData.type}
                    onChange={e => setProductFormData({...productFormData, type: e.target.value as any})}
                    className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-emerald-900 focus:outline-none focus:border-emerald-500 transition-all"
                  >
                    <option value="digital">✨ Produto Digital (Libera Google Drive / Download)</option>
                    <option value="fisico">📦 Produto Físico (Requer Endereço de Envio)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Categoria</label>
                  <select 
                    value={productFormData.category}
                    onChange={e => setProductFormData({...productFormData, category: e.target.value})}
                    className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
                  >
                    <option>E-book</option>
                    <option>Livros & Apostilas</option>
                    <option>Produtos Corporais</option>
                    <option>Culinária & Ervas</option>
                    <option>Ferramenta / Planner</option>
                    <option>Mentoria & Aulas</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Preço Exibido na Loja *</label>
                  <input 
                    type="text" 
                    required
                    value={productFormData.price}
                    onChange={e => setProductFormData({...productFormData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-bold text-emerald-800" 
                    placeholder="Ex: R$ 47,90" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Status</label>
                  <select 
                    value={productFormData.status}
                    onChange={e => setProductFormData({...productFormData, status: e.target.value})}
                    className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
                  >
                    <option>Ativo</option>
                    <option>Inativo / Oculto</option>
                  </select>
                </div>

                {/* Link do Google Drive (se digital) */}
                {productFormData.type === 'digital' && (
                  <div className="md:col-span-2 p-5 bg-teal-50/70 border border-teal-200 rounded-2xl">
                    <label className="block text-sm font-bold text-teal-950 mb-1 flex items-center gap-2">
                      <svg className="w-5 h-5 text-teal-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
                      </svg>
                      Link Compartilhado do Google Drive (Acesso Exclusivo)
                    </label>
                    <input 
                      type="url" 
                      value={productFormData.digitalUrl}
                      onChange={e => setProductFormData({...productFormData, digitalUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-teal-300 rounded-xl text-sm focus:outline-none focus:border-teal-600 transition-all" 
                      placeholder="https://drive.google.com/drive/folders/..." 
                    />
                    <p className="text-xs text-teal-800 mt-2">
                      Este link será entregue ao comprador na tela de sucesso e por e-mail após a confirmação da compra.
                    </p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-2">Descrição Completa</label>
                  <textarea 
                    rows={3} 
                    value={productFormData.description}
                    onChange={e => setProductFormData({...productFormData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none" 
                    placeholder="Escreva sobre os benefícios e conteúdo deste produto..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-2">URL da Imagem de Capa</label>
                  <input 
                    type="url" 
                    value={productFormData.image}
                    onChange={e => setProductFormData({...productFormData, image: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" 
                    placeholder="https://..." 
                  />
                </div>

              </div>

              <div className="flex justify-end gap-4 border-t border-stone-100 pt-6">
                <button type="button" onClick={() => setProductView('list')} className="cursor-pointer px-6 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="cursor-pointer px-8 py-3 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 transition-colors shadow-md">
                  Salvar Produto
                </button>
              </div>
            </form>
          )}

        </div>
      )}

    </div>
  );
}
