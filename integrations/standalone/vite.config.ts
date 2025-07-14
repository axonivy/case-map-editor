import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
    rollupOptions: { input: { index: './index.html', mock: './mock.html' } }
  },
  server: {
    port: 3002,
    proxy: {
      '/api': {
        target: 'http://localhost:8081/designer',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api')
      }
    }
  },
  resolve: {
    alias: {
      '@axonivy/case-map-editor': resolve(__dirname, '../../packages/case-map-editor/src'),
      '@axonivy/case-map-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
    }
  },
  base: './'
});
