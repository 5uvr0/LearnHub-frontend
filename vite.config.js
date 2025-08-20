// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0', // This is important to allow external connections
        hmr: {
            // Set the host to your remote machine's hostname
            host: 'app-rnd01.therapbd.net',
            protocol: 'ws', // Use the correct protocol
            clientPort: 443, // Often required if using HTTPS/WSS
        },
        allowedHosts: ['app-rnd01.therapbd.net']
    },
    base: '/learnhub'
});