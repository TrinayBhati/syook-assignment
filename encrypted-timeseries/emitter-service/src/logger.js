import winston from 'winston';
import appConfig from './config.js';

const logger = winston.createLogger({
    level: appConfig.logLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'emitter' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, service }) => {
                    return `${timestamp} [${service}] ${level}: ${message}`;
                })
            )
        })
    ]
});

export default logger;
