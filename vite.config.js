import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        allowedHosts: ['app-rnd01.therapbd.net']
    },
    // Add the base option to specify the subdirectory
    base: '/learnhub/'
})