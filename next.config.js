/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true, // habilita el directorio /app
  },
  webpack: (config, { isServer }) => {
    // Permite usar alias @
    config.resolve.alias['@'] = require('path').resolve(__dirname);

    return config;
  },
  // Opcional: evita errores por módulos nativos al desplegar en Vercel
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
