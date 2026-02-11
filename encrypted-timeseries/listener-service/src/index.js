import { connectToDatabase } from './database.js';
import { startSocketServer } from './socketServer.js';
import { startFrontendSocket } from './frontendSocket.js';
import logger from './logger.js';

async function start() {
    try {
        logger.info('Starting listener service');

        await connectToDatabase();
        startFrontendSocket();
        startSocketServer();

        logger.info('Listener service started successfully');
    } catch (error) {
        logger.error(`Failed to start listener service: ${error.message}`);
        process.exit(1);
    }
}

start();
