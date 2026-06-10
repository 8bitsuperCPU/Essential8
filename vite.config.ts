import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4545,
    host: true,
    allowedHosts: ['e8.8bitcpu.win'],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {},
  },
});
