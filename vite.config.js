import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub project page: https://<user>.github.io/3d-models-website/
  base: "/3d-models-website/",
})
