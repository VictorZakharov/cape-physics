import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    cssMinify: 'lightningcss',
    reportCompressedSize: true,
    // Three.js is deliberately shipped as one cacheable engine chunk. The
    // compressed production payload remains small; this avoids a noisy warning.
    chunkSizeWarningLimit: 700,
  },
  server: {
    strictPort: true,
  },
});
