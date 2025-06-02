import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": "/src",
      "@assets": "/src/assets",
      "@fonts": "/src/assets/fonts",
      "@icons": "/src/assets/icons",
      "@images": "/src/assets/images",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@data": "/src/data",
      "@hooks": "/src/hooks",
      "@routes": "/src/routes",
      "@sections": "/src/sections",
      "@styles": "/src/styles",
      "@utils": "/src/utils",
      "@store": "/src/store",
      "@services": "/src/services",
      "@context": "/src/context",
      '@api': "/src/api",
      '@models': "/src/models"

    }, 
  },
})
