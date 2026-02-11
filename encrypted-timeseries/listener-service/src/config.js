import { config } from 'dotenv';

config();

export default {
    encryptionKey: process.env.ENCRYPTION_KEY || 'default-encryption-key',
    authToken: process.env.AUTH_TOKEN || 'default-auth-token',
    socketPort: parseInt(process.env.SOCKET_PORT, 10) || 4000,
    frontendSocketPort: parseInt(process.env.FRONTEND_SOCKET_PORT, 10) || 5000,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/encrypted_timeseries',
    logLevel: process.env.LOG_LEVEL || 'info',
    ttlDays: parseInt(process.env.TTL_DAYS, 10) || 7
};
