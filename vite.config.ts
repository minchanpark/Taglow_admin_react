import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://vote.newdawnsoi.site',
        changeOrigin: true,
        secure: true,
        configure(proxy) {
          proxy.on('proxyRes', (proxyRes) => {
            const cookies = proxyRes.headers['set-cookie'];
            if (!Array.isArray(cookies)) return;
            proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
              cookie
                .replace(/;\s*Secure/gi, '')
                .replace(/;\s*SameSite=None/gi, '; SameSite=Lax'),
            );
          });
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
