import type { NextConfig } from "next";
import path from 'path'

const nextConfig: NextConfig = {
  // Garantir que o root do tracing seja o diretório do projeto
  outputFileTracingRoot: path.join(__dirname),
  eslint: {
    // Permite concluir o build mesmo com erros de ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
