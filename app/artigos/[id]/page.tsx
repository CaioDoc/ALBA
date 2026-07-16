import React from 'react';
import ArtigoDetailClient from './ArtigoDetailClient';
import { initialArticles } from '../../../data/artigos';

export default function ArtigoDetalhePage({ params }: { params: { id: string } }) {
  return <ArtigoDetailClient id={params.id} />;
}

export async function generateStaticParams() {
  const existingIds = initialArticles.map((a: any) => ({ id: a.id.toString() }));
  
  const maxId = initialArticles.length > 0 ? Math.max(...initialArticles.map((a: any) => a.id)) : 0;
  
  const futureIds = Array.from({ length: 100 }).map((_, idx) => ({
    id: (maxId + idx + 1).toString(),
  }));

  return [...existingIds, ...futureIds];
}
