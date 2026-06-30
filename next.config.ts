import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Ativa a exportação estática (gera a pasta 'out')
  output: 'export',
  
  // 2. Desativa a otimização de imagens padrão (obrigatório para exportação estática no GitHub Pages)
  images: {
    unoptimized: true,
  },
  
  // 3. Define o caminho base. Substitua 'alba' pelo nome exato do repositório no GitHub
  // Exemplo: se o seu repositório se chama 'alba-site', mude para '/alba-site'
  basePath: '/alba',
};

export default nextConfig;
