import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'at-ui': resolve(__dirname, '../src')
    },
    // Preserve symlinks to help resolve relative imports correctly
    preserveSymlinks: false,
    // Ensure directory imports resolve correctly
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css']
  },
  server: {
    port: 3366,
    open: true,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  }
})

