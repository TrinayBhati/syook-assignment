import { config } from 'dotenv';

config();

export default {
  encryptionKey: process.env.ENCRYPTION_KEY || 'default-encryption-key',
  authToken: process.env.AUTH_TOKEN || 'default-auth-token',
  listenerHost: process.env.LISTENER_HOST || 'localhost',
  listenerPort: parseInt(process.env.LISTENER_PORT, 10) || 4000,
  emitIntervalMs: parseInt(process.env.EMIT_INTERVAL_MS, 10) || 10000,
  logLevel: process.env.LOG_LEVEL || 'info'
};
