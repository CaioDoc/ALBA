import React from 'react';
import ArtigoDetailClient from './ArtigoDetailClient';
import { initialArticles } from '../../../data/artigos';

export default async function ArtigoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ArtigoDetailClient id={resolvedParams.id} />;
}

export async function generateStaticParams() {
  const existingIds = initialArticles.map((a: any) => ({ id: a.id.toString() }));
  
  const maxId = initialArticles.length > 0 ? Math.max(...initialArticles.map((a: any) => a.id)) : 0;
  
  const futureIds = Array.from({ length: 100 }).map((_, idx) => ({
    id: (maxId + idx + 1).toString(),
  }));

  return [...existingIds, ...futureIds];
}
