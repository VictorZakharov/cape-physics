import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    // Three.js addons import the bare `three` package. Resolve that specifier
    // to the universal node build so addons and our WebGPU renderer share one
    // class graph instead of bundling the legacy renderer beside it.
    alias: [{ find: /^three$/, replacement: 'three/webgpu' }],
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    cssMinify: 'lightningcss',
    reportCompressedSize: true,
    // The universal Three.js engine contains both backends in one cacheable
    // chunk. Keep the warning focused on growth beyond the expected payload.
    chunkSizeWarningLimit: 1_100,
  },
  server: {
    strictPort: true,
  },
});
