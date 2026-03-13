import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
const ENGINE_URL = process.env.BASE_URL ?? 'http://localhost:8080/~Developer-case-map-test-project';

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
      '/dev-workflow-ui': {
        target: ENGINE_URL,
        changeOrigin: true,
        secure: false
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
