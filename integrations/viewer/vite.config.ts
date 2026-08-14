import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
const ENGINE_URL = process.env.BASE_URL ?? 'http://localhost:8080/~Developer-case-map-test-project';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000
  },
  server: {
    port: 3003,
    proxy: {
      '/dev-workflow-ui': {
        target: ENGINE_URL,
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@axonivy/case-map-editor': resolve(import.meta.dirname, '../../packages/case-map-editor/src'),
      '@axonivy/case-map-editor-protocol': resolve(import.meta.dirname, '../../packages/protocol/src')
    }
  },
  base: './'
});
