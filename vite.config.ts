import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    cssMinify: 'lightningcss',
    reportCompressedSize: true,
    // WebGPU and its node/compute modules are lazy chunks; keep the warning
    // focused on unexpected growth in either renderer path.
    chunkSizeWarningLimit: 1_100,
  },
  server: {
    strictPort: true,
  },
});
