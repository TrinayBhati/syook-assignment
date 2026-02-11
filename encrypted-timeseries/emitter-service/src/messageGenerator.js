import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createHash, encrypt } from './encryption.js';
import appConfig from './config.js';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let sourceData;

try {
    const dataPath = join(__dirname, '..', 'data.json');
    sourceData = JSON.parse(readFileSync(dataPath, 'utf8'));
} catch (error) {
    logger.error(`Failed to load data.json: ${error.message}`);
    process.exit(1);
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function generateMessage() {
    return {
        name: randomChoice(sourceData.names),
        origin: randomChoice(sourceData.origins),
        destination: randomChoice(sourceData.destinations)
    };
}

export function generateMessageBatch(count) {
    const messages = [];

    for (let i = 0; i < count; i++) {
        const message = generateMessage();
        const secretKey = createHash(message);
        const sumCheckMessage = { ...message, secret_key: secretKey };
        const encryptedMessage = encrypt(JSON.stringify(sumCheckMessage), appConfig.encryptionKey);
        messages.push(encryptedMessage);
    }

    return messages;
}
