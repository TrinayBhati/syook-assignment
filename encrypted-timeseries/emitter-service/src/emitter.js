import net from 'net';
import { generateMessageBatch } from './messageGenerator.js';
import appConfig from './config.js';
import logger from './logger.js';

let client = null;
let authenticated = false;
let emitInterval = null;
let reconnectTimeout = null;

function getRandomBatchSize() {
    return Math.floor(Math.random() * (499 - 49 + 1)) + 49;
}

function emitMessages() {
    if (!authenticated) {
        logger.warn('Cannot emit messages: not authenticated');
        return;
    }

    const batchSize = getRandomBatchSize();
    logger.info(`Generating ${batchSize} encrypted messages`);

    try {
        const messages = generateMessageBatch(batchSize);
        const payload = `DATA:${messages.join('|')}\n`;
        client.write(payload);
        logger.info(`Sent ${batchSize} messages to listener`);
    } catch (error) {
        logger.error(`Failed to generate or send messages: ${error.message}`);
    }
}

function startEmitting() {
    if (emitInterval) {
        clearInterval(emitInterval);
    }

    emitInterval = setInterval(emitMessages, appConfig.emitIntervalMs);
    emitMessages();
}

function stopEmitting() {
    if (emitInterval) {
        clearInterval(emitInterval);
        emitInterval = null;
    }
}

function handleData(data) {
    const message = data.toString().trim();

    if (message === 'AUTH_OK') {
        logger.info('Authentication successful');
        authenticated = true;
        startEmitting();
    } else if (message === 'AUTH_FAIL') {
        logger.error('Authentication failed');
        client.destroy();
    }
}

function connectToListener() {
    if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
    }

    logger.info(`Connecting to listener at ${appConfig.listenerHost}:${appConfig.listenerPort}`);

    client = new net.Socket();
    authenticated = false;

    client.on('connect', () => {
        logger.info('Connected to listener');
        client.write(`AUTH:${appConfig.authToken}\n`);
    });

    client.on('data', handleData);

    client.on('error', (error) => {
        logger.warn(`Connection error: ${error.message}`);
        scheduleReconnect();
    });

    client.on('close', () => {
        logger.warn('Connection closed');
        authenticated = false;
        stopEmitting();
        scheduleReconnect();
    });

    client.connect(appConfig.listenerPort, appConfig.listenerHost);
}

function scheduleReconnect() {
    if (reconnectTimeout) {
        return;
    }

    logger.info('Scheduling reconnect in 5 seconds');
    reconnectTimeout = setTimeout(() => {
        connectToListener();
    }, 5000);
}

export function startEmitter() {
    connectToListener();
}
