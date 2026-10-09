"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminAssociadosRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/profissionais');
  }, [router]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
      <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mb-4 animate-bounce">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
      <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Redirecionando para Profissionais...</h3>
      <p className="text-stone-500 text-sm mb-6 max-w-sm">
        A área de Associados foi unificada e atualizada para a gestão de Profissionais da ALBA.
      </p>
      <Link
        href="/admin/profissionais"
        className="px-6 py-3 bg-emerald-800 text-white rounded-xl text-sm font-bold hover:bg-emerald-900 transition-all shadow-md"
      >
        Acessar Gestão de Profissionais →
      </Link>
    </div>
  );
}
