import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ALBA", // Lembre-se de deixar o nome exato do seu repositório
  
  // O images fica aqui na raiz, fora de qualquer "experimental"
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
