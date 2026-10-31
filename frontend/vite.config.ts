import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// En build de produccion, cualquier import de environments/environment
// se resuelve a environments/environment.prod
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: mode === 'production'
      ? [{
          find: /.*\/environments\/environment$/,
          replacement: '/src/environments/environment.prod.ts'
        }]
      : []
  },
  server: {
    port: 4200,
    host: '0.0.0.0'
  }
}));
