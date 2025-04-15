import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Include .js files that contain JSX
      include: "**/*.{jsx,js}",
    })
  ],
  server: {
    port: 3000,
    open: true,
  },
  // basepath for deployment
  base: './',
  // Handle JSX in .js files
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
