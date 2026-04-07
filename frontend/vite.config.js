import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import imagemin from 'vite-plugin-imagemin';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [
        react(),
        imagemin({
            mozjpeg: { quality: 70, progressive: true },
            pngquant: { quality: [0.6, 0.8] },
            webp: { quality: 75 },
            svg: { multipass: true }
        })
    ],
    publicDir: 'public',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: 'terser',
        sourcemap: false,
        // More aggressive code splitting
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    motion: ['framer-motion'],
                    icons: ['react-icons', 'lucide-react']
                }
            }
        },
        // Asset optimization
        assetsInlineLimit: 4096,
        chunkSizeWarningLimit: 1000,
        terserOptions: {
            compress: {
                drop_console: true
            }
        }
    },
    server: {
        port: 5173
    }
});
