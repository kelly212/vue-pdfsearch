import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Importante para SPA no Netlify

  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        input: 'index.html',
        manualChunks: {
          vendor: ['vue', 'vue-router', 'vuex']
        },
        // Organiza melhor os arquivos
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  plugins: [
    vue(),
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    open: false,
    // headers: {
    //   'Content-Type': 'application/javascript'
    // },
    // Configuração para desenvolvimento
    middlewareMode: false,
    // Configurações adicionais recomendadas:
    host: 'localhost',
    port: 5174,
    strictPort: true, // não tenta outras portas se esta estiver ocupada

    // Para Netlify Functions/local
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:60580',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/.netlify\/functions/, '')
      }
    }
  },
})
