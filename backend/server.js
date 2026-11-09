import http from 'http';
import { existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import discoveryHandler from './discovery.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnvFile(filePath) {
    if (!existsSync(filePath)) return;

    const contents = readFileSync(filePath, 'utf8');
    for (const line of contents.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const equalsIndex = trimmed.indexOf('=');
        if (equalsIndex === -1) continue;

        const key = trimmed.slice(0, equalsIndex).trim();
        let value = trimmed.slice(equalsIndex + 1).trim();

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        if (process.env[key] === undefined) {
            process.env[key] = value;
        }
    }
}

loadEnvFile(resolve(__dirname, '.env'));

const PORT = Number(process.env.PORT || 8000);

function sendJson(res, statusCode, payload) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
}

function createRequestHandler() {
    return async (req, res) => {
        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

        if (req.method === 'GET' && url.pathname === '/health') {
            sendJson(res, 200, { status: 'ok' });
            return;
        }

        if (url.pathname !== '/discovery') {
            sendJson(res, 404, { error: 'Not found' });
            return;
        }

        let rawBody = '';
        for await (const chunk of req) rawBody += chunk;

        let body = undefined;
        if (rawBody) {
            try {
                body = JSON.parse(rawBody);
            } catch {
                sendJson(res, 400, { error: 'Invalid JSON body' });
                return;
            }
        }

        const reqForHandler = {
            method: req.method,
            body,
            _rawBody: rawBody,
            headers: req.headers,
        };

        const resForHandler = {
            status(code) { this.statusCode = code; return this; },
            json(payload) { sendJson(res, this.statusCode || 200, payload); }
        };

        await discoveryHandler(reqForHandler, resForHandler);
    };
}

const server = http.createServer(createRequestHandler());

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Set BACKEND_PORT or stop the conflicting process.`);
        process.exit(1);
    }

    console.error('Failed to start server:', err);
    process.exit(1);
});

server.listen(PORT, () => {
    console.log(`Backend discovery mailer listening on port ${PORT}`);
});
