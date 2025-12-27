import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/fluid.js/', 
  root: 'demo',
  
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true
  },
  
  resolve: {
    alias: {
      '/src': resolve(__dirname, 'src')
    }
  }
});