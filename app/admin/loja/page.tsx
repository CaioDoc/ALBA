"use client";

import React, { useState, useEffect } from 'react';

const API_URL = 'https://ayurvedica.org/api/loja.php';

// Interface do Produto
interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  image: string;
  description: string;
  hotmartLink: string;
  status: string;
}

export default function AdminLojaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado do formulário
  const [formData, setFormData] = useState<Product>({
    id: '',
    title: '',
    category: 'E-book',
    price: '',
    image: '',
    description: '',
    hotmartLink: '',
    status: 'Ativo'
  });

  // Carregar produtos da API MySQL ao iniciar
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(err => {
        console.error('Erro ao buscar da API', err);
        // Fallback apenas para não ficar tela em branco se a API ainda não existir
        setProducts([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if(confirm('Tem certeza que deseja deletar este produto? Ele não aparecerá mais na Loja pública.')) {
      try {
        await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        console.error('Erro ao deletar', err);
        alert('Erro ao tentar deletar o produto no servidor.');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setView('form');
  };

  const handleAddNew = () => {
    setFormData({
      id: '',
      title: '',
      category: 'E-book',
      price: '',
      image: '',
      description: '',
      hotmartLink: '',
      status: 'Ativo'
    });
    setView('form');
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = { ...formData };
    if (!productData.id) {
      productData.id = 'prod-' + Date.now().toString();
    }
    
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (formData.id) {
        setProducts(products.map(p => p.id === formData.id ? productData : p));
      } else {
        setProducts([productData, ...products]);
      }
      
      alert('Produto salvo com sucesso no Banco de Dados cPanel!');
      setView('list');
    } catch (err) {
      console.error('Erro ao salvar', err);
      alert('Erro ao conectar com o banco de dados. Verifique a API.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-stone-900">Integração Hotmart (Loja)</h2>
          <p className="text-stone-500 mt-1">
            Gerencie e-books, ferramentas e produtos digitais no banco de dados cPanel conectados à Hotmart.
          </p>
        </div>
        
        {view === 'list' ? (
          <button 
            onClick={handleAddNew}
            className="cursor-pointer bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all active:scale-95 shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Adicionar Produto
          </button>
        ) : (
          <button 
            onClick={() => setView('list')}
            className="cursor-pointer bg-stone-200 text-stone-700 px-6 py-3 rounded-xl font-bold hover:bg-stone-300 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar para a Lista
          </button>
        )}
      </div>

      {/* VIEW: LISTA DE PRODUTOS */}
      {view === 'list' && (
        <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm flex flex-col">
          
          {/* Barra de Busca */}
          <div className="p-6 border-b border-stone-100 bg-stone-50/50">
            <div className="relative w-full max-w-md">
              <input 
                type="text" 
                placeholder="Buscar produto por nome ou categoria..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
              />
              <svg className="w-5 h-5 text-stone-400 absolute left-4 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white border-b border-stone-200 text-stone-500 text-sm">
                  <th className="p-6 font-medium">Produto</th>
                  <th className="p-6 font-medium">Preço</th>
                  <th className="p-6 font-medium">Hotmart Link</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-stone-500">
                       Carregando banco de dados... (Pode falhar se a API não estiver no ar ainda)
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-stone-500">Nenhum produto cadastrado no banco de dados.</td>
                  </tr>
                ) : filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-stone-200 overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 max-w-xs truncate" title={product.title}>
                          {product.title}
                        </div>
                        <div className="text-stone-500 text-xs mt-0.5">{product.category}</div>
                      </div>
                    </td>
                    <td className="p-6 text-emerald-700 font-bold">
                      {product.price}
                    </td>
                    <td className="p-6 text-stone-500 text-xs">
                      <a href={product.hotmartLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 max-w-[150px] truncate">
                        {product.hotmartLink || "Não definido"}
                      </a>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                        product.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-6 flex items-center justify-end gap-3">
                      <button onClick={() => handleEdit(product)} className="cursor-pointer text-stone-400 hover:text-blue-600 transition-colors" title="Editar Produto">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="cursor-pointer text-stone-400 hover:text-red-500 transition-colors" title="Excluir Produto">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: FORMULÁRIO DE CADASTRO/EDIÇÃO */}
      {view === 'form' && (
        <form onSubmit={handleSalvar} className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm">
          <h3 className="text-xl font-serif text-stone-900 mb-6 border-b border-stone-100 pb-4">
            {formData.id ? 'Editar Produto (MySQL)' : 'Cadastrar Novo Produto Hotmart (MySQL)'}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">Nome do Produto</label>
              <input 
                type="text" 
                required 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" 
                placeholder="Ex: E-book Ayurveda Diário" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Categoria</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option>E-book</option>
                <option>Mentoria</option>
                <option>Ferramenta / Planner</option>
                <option>Comunidade</option>
                <option>Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Preço Exibido na Loja</label>
              <input 
                type="text" 
                required
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-bold text-emerald-800" 
                placeholder="Ex: R$ 97,00" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">Resumo / Descrição do Produto</label>
              <textarea 
                rows={3} 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none" 
                placeholder="Uma breve descrição para atrair o comprador..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">URL da Imagem do Produto</label>
              <input 
                type="url" 
                required
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all" 
                placeholder="https://..." 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" /></svg>
                Link de Checkout da Hotmart
              </label>
              <input 
                type="url" 
                required
                value={formData.hotmartLink}
                onChange={e => setFormData({...formData, hotmartLink: e.target.value})}
                className="w-full px-4 py-3 bg-stone-50 border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-all" 
                placeholder="Ex: https://pay.hotmart.com/XXXXXX" 
              />
              <p className="text-xs text-stone-400 mt-2">O cliente será enviado para este link quando clicar em "Comprar".</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="cursor-pointer w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option>Ativo</option>
                <option>Inativo / Oculto</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-stone-100 pt-6">
            <button type="button" onClick={() => setView('list')} className="cursor-pointer px-6 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="cursor-pointer px-8 py-3 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 transition-colors shadow-md">
              Salvar Produto na Loja
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
