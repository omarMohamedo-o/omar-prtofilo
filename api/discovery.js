import backendDiscoveryHandler from '../backend/discovery.js';

export default async function handler(req, res) {
    return backendDiscoveryHandler(req, res);
}
