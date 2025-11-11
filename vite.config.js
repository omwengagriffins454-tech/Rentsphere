import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

<<<<<<< HEAD
// https://vitejs.dev/config/
export default defineConfig({
  root: 'public',
  plugins: [react()],
  server: {
    port: 5173,           // You can change this if needed
    open: true,           // Auto-open browser on npm run dev
  },
  build: {
    outDir: '../dist',       // Folder for production files
    sourcemap: true,      // Helpful for debugging build errors
  },
  resolve: {
    alias: {
      '@': '/src',        // Allows imports like import Nav from "@/components/Navbar"
    },
  },
=======
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
>>>>>>> 2bbf238fddf8dcc51097de239bae9fcddff9d07f
})