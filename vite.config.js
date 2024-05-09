import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   host: 'qms-monitor.opensource-dev.com',
  //   port: 8080
  // },

  plugins: [react()],
  resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
        '@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@utilities': fileURLToPath(new URL('./src/utilities', import.meta.url)),
        '@modals': fileURLToPath(new URL('./src/modals', import.meta.url)),
        '@constants': fileURLToPath(new URL('./src/constants', import.meta.url))
    },
  }
})
