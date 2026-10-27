import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'AtUI',
      // dist/at.es.js, dist/at.umd.cjs and dist/at.css
      fileName: (format) => (format === 'es' ? 'at.es.js' : 'at.umd.cjs'),
      cssFileName: 'at',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
      output: {
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOMClient',
          'react/jsx-runtime': 'ReactJSXRuntime'
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // The vendored at-ui-style sources use the legacy Sass dialect
        // (@import, slash division, global built-ins).
        silenceDeprecations: ['import', 'global-builtin', 'slash-div', 'color-functions']
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.{js,jsx}'],
    css: false
  }
})
