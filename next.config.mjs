/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }, { protocol: 'http', hostname: '**' }],
  },
  /**
   * En desarrollo, desactivar la caché de Webpack evita `.next` corrupto (chunks 404,
   * `layout.css` / `main-app.js` inexistentes) que en Windows + OneDrive es bastante frecuente.
   * El arranque puede ser algo más lento; en producción (`next build`) la caché sigue activa.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
