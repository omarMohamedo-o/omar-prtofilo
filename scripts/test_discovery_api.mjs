import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
    // Load the handler
    const handlerPath = path.resolve(__dirname, '../frontend/api/discovery.js');
    const mod = await import(pathToFileURL(handlerPath).href).catch(async (e) => {
        // fallback for environments where pathToFileURL not available
        return await import('file://' + handlerPath);
    });

    const handler = mod.default;

    // Create mock request and response
    const req = {
        method: 'POST',
        body: {
            firstName: 'Test',
            lastName: 'User',
            companyName: 'ACME',
            businessEmail: 'test@example.com',
            phoneNumber: '123456789',
            serviceOfInterest: 'DevOps Consulting'
        }
    };

    let sent = null;
    const res = {
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(obj) {
            sent = { status: this.statusCode || 200, body: obj };
            return sent;
        }
    };

    // Enable test mode
    process.env.TEST_EMAIL_MODE = 'true';

    await handler(req, res);

    console.log('Test result:', sent);
}

function pathToFileURL(p) {
    try {
        return new URL('file://' + p);
    } catch (e) {
        return { href: 'file://' + p };
    }
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
