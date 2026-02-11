import net from 'net';
import { decrypt } from './decryption.js';
import { validateMessage } from './validator.js';
import { saveMessage, incrementInvalidCount } from './database.js';
import { broadcastNewMessage, updateStats } from './frontendSocket.js';
import appConfig from './config.js';
import logger from './logger.js';

async function processMessage(encryptedMessage) {
    try {
        const decryptedText = decrypt(encryptedMessage, appConfig.encryptionKey);
        const decryptedObj = JSON.parse(decryptedText);

        const { isValid, message } = validateMessage(decryptedObj);

        if (isValid) {
            await saveMessage(message);
            broadcastNewMessage(message);
            updateStats(true);
        } else {
            await incrementInvalidCount();
            updateStats(false);
            logger.warn('Invalid message: secret_key validation failed');
        }
    } catch (error) {
        await incrementInvalidCount();
        updateStats(false);
        logger.warn(`Failed to process message: ${error.message}`);
    }
}

async function handleDataMessage(data) {
    const payload = data.slice(5).trim();
    const messages = payload.split('|');

    logger.info(`Received ${messages.length} encrypted messages`);

    for (const encryptedMessage of messages) {
        await processMessage(encryptedMessage);
    }
}

export function startSocketServer() {
    const server = net.createServer((socket) => {
        logger.info(`Client connected from ${socket.remoteAddress}:${socket.remotePort}`);

        let authenticated = false;
        let buffer = '';

        socket.on('data', async (data) => {
            buffer += data.toString();

            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.trim()) continue;

                if (line.startsWith('AUTH:')) {
                    const token = line.slice(5).trim();

                    if (token === appConfig.authToken) {
                        authenticated = true;
                        socket.write('AUTH_OK\n');
                        logger.info('Client authenticated successfully');
                    } else {
                        socket.write('AUTH_FAIL\n');
                        logger.warn('Client authentication failed');
                        socket.destroy();
                    }
                } else if (line.startsWith('DATA:')) {
                    if (!authenticated) {
                        logger.warn('Received data from unauthenticated client');
                        socket.destroy();
                        return;
                    }

                    await handleDataMessage(line);
                }
            }
        });

        socket.on('error', (error) => {
            logger.error(`Socket error: ${error.message}`);
        });

        socket.on('close', () => {
            logger.info('Client disconnected');
        });
    });

    server.listen(appConfig.socketPort, () => {
        logger.info(`Listener TCP server running on port ${appConfig.socketPort}`);
    });

    server.on('error', (error) => {
        logger.error(`Server error: ${error.message}`);
        process.exit(1);
    });
}
