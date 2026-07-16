import React from 'react';
import ArtigoDetailClient from './ArtigoDetailClient';

export default function ArtigoDetalhePage({ params }: { params: { id: string } }) {
  return <ArtigoDetailClient id={params.id} />;
}

export async function generateStaticParams() {
  return Array.from({ length: 100 }).map((_, idx) => ({
    id: (idx + 1).toString(),
  }));
}
