import { Server } from 'socket.io';
import appConfig from './config.js';
import logger from './logger.js';

let io = null;
let stats = {
    totalReceived: 0,
    totalValid: 0,
    totalInvalid: 0
};

export function startFrontendSocket() {
    io = new Server(appConfig.frontendSocketPort, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        logger.info(`Frontend client connected: ${socket.id}`);

        socket.emit('stats:update', {
            ...stats,
            successRate: stats.totalReceived > 0
                ? ((stats.totalValid / stats.totalReceived) * 100).toFixed(2)
                : 0
        });

        socket.on('disconnect', () => {
            logger.info(`Frontend client disconnected: ${socket.id}`);
        });
    });

    logger.info(`Frontend Socket.IO server running on port ${appConfig.frontendSocketPort}`);
}

export function broadcastNewMessage(message) {
    if (!io) return;

    const { name, origin, destination, receivedAt } = message;
    io.emit('message:new', { name, origin, destination, receivedAt });
}

export function updateStats(isValid) {
    stats.totalReceived++;

    if (isValid) {
        stats.totalValid++;
    } else {
        stats.totalInvalid++;
    }

    if (!io) return;

    const successRate = stats.totalReceived > 0
        ? ((stats.totalValid / stats.totalReceived) * 100).toFixed(2)
        : 0;

    io.emit('stats:update', {
        ...stats,
        successRate: parseFloat(successRate)
    });
}
