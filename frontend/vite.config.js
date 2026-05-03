import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function resolveBackendPort() {
    if (process.env.BACKEND_PORT) return process.env.BACKEND_PORT;

    const portFile = resolve(__dirname, '.backend-port');
    if (existsSync(portFile)) {
        const value = readFileSync(portFile, 'utf8').trim();
        if (value) return value;
    }

    return '8000';
}

const backendPort = resolveBackendPort();

export default defineConfig({
    plugins: [
        react()
    ],
    publicDir: 'public',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: 'esbuild',
        sourcemap: false,
        // More aggressive code splitting
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return null;
                    if (id.includes('framer-motion')) return 'motion';
                    if (id.includes('react-icons') || id.includes('lucide-react')) return 'icons';
                    if (id.includes('react') || id.includes('react-dom')) return 'vendor';
                    return null;
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
        port: 5173,
        proxy: {
            // Forward discovery API requests to the backend mailer server
            '/api/discovery': {
                target: `http://localhost:${backendPort}`,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api\/discovery/, '/discovery')
            }
        }
    }
});
