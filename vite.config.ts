import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: false, // Set to true if you need HTTPS for camera access
    host: true, // Allow access from network
  },
  build: {
    target: 'es2015', // Ensure compatibility with AR.js
  },
  optimizeDeps: {
    exclude: ['ar.js'] // Exclude AR.js from pre-bundling
  }
})
