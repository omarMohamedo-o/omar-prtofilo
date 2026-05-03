#!/usr/bin/env node
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import net from 'net';
import { resolve } from 'path';
import process from 'process';

const backendCmd = 'node';
const backendArgs = ['../backend/server.js'];

let viteProcess = null;
let backendProcess = null;
let backendEnv = null;

function startVite() {
    if (viteProcess) return;
    console.log('[launcher] Starting Vite dev server...');
    viteProcess = spawn('npx', ['vite'], { stdio: 'inherit', shell: true, env: backendEnv });

    viteProcess.on('exit', (code) => {
        console.log(`[vite] exited with ${code}`);
        // If vite exits, terminate backend as well
        try { backendProcess?.kill(); } catch (e) { }
        process.exit(code || 0);
    });
}

function safeExit(code) {
    try { backendProcess?.kill(); } catch (e) { }
    try { viteProcess?.kill(); } catch (e) { }
    process.exit(code);
}

async function getFreePort() {
    return new Promise((resolvePort, rejectPort) => {
        const server = net.createServer();
        server.unref();
        server.on('error', rejectPort);
        server.listen(0, '127.0.0.1', () => {
            const address = server.address();
            const port = typeof address === 'object' && address ? address.port : null;
            server.close(() => {
                if (port) {
                    resolvePort(port);
                } else {
                    rejectPort(new Error('Unable to determine free port'));
                }
            });
        });
    });
}

async function main() {
    // Prepare environment for backend using the repo's real SMTP settings.
    backendEnv = { ...process.env };
    backendEnv.PORT = process.env.BACKEND_PORT || String(await getFreePort());
    backendEnv.BACKEND_PORT = backendEnv.PORT;

    console.log('[launcher] Starting backend server...');
    backendProcess = spawn(backendCmd, backendArgs, { shell: true, env: backendEnv });

    backendProcess.stdout.on('data', (chunk) => {
        const text = String(chunk);
        process.stdout.write(`[backend] ${text}`);
        const listeningMatch = text.match(/listening on port (\d+)/i);
        if (listeningMatch) {
            backendEnv.PORT = listeningMatch[1];
            backendEnv.BACKEND_PORT = listeningMatch[1];
            try {
                writeFileSync(resolve(process.cwd(), '.backend-port'), `${listeningMatch[1]}\n`, 'utf8');
            } catch (error) {
                console.warn('[launcher] Unable to write .backend-port file:', error.message);
            }
        }
        const readySignals = ['listening on port'];
        if (readySignals.some(s => text.includes(s))) {
            startVite();
        }
    });

    backendProcess.stderr.on('data', (chunk) => {
        const text = String(chunk);
        process.stderr.write(`[backend:error] ${text}`);
    });

    backendProcess.on('exit', (code) => {
        console.log(`[backend] exited with ${code}`);
        if (!viteProcess) safeExit(code || 1);
    });

    process.on('SIGINT', () => safeExit(0));
    process.on('SIGTERM', () => safeExit(0));
}

main().catch((error) => {
    console.error('[launcher] Failed to start:', error);
    safeExit(1);
});
