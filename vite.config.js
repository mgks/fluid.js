import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // 1. Build Settings (For the Library)
  build: {
    // Escape the 'demo' folder so dist/ lands in the project root
    outDir: '../dist', 
    emptyOutDir: true, // Clears the folder before building
    
    lib: {
      // Correctly find the entry file from the project root
      entry: resolve(__dirname, 'src/index.js'), 
      name: 'FluidJS',
      fileName: (format) => `fluid.js.${format}.js`
    },
    rollupOptions: {
      external: ['dat.gui'],
      output: {
        globals: {
          'dat.gui': 'dat.gui'
        }
      }
    }
  },
  
  // 2. Dev Server Settings (For the Playground)
  root: 'demo', 
  
  // 3. Resolve imports so the demo can find the source code
  resolve: {
    alias: {
      '/src': resolve(__dirname, 'src')
    }
  }
});