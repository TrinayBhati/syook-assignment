import { MongoClient } from 'mongodb';
import appConfig from './config.js';
import logger from './logger.js';

let db = null;
let collection = null;

export async function connectToDatabase() {
    try {
        const client = new MongoClient(appConfig.mongodbUri);
        await client.connect();

        db = client.db();
        collection = db.collection('timeseries_data');

        const ttlSeconds = appConfig.ttlDays * 24 * 60 * 60;
        await collection.createIndex(
            { minute: 1 },
            { unique: true, expireAfterSeconds: ttlSeconds }
        );

        logger.info('MongoDB connected and indexes created');
    } catch (error) {
        logger.error(`Failed to connect to MongoDB: ${error.message}`);
        throw error;
    }
}

function getMinuteTimestamp(date) {
    return new Date(Math.floor(date.getTime() / 60000) * 60000);
}

export async function saveMessage(validMessage) {
    try {
        const minute = getMinuteTimestamp(validMessage.receivedAt);

        await collection.updateOne(
            { minute },
            {
                $push: { records: validMessage },
                $inc: { totalReceived: 1, totalValid: 1 },
                $setOnInsert: { createdAt: new Date() },
                $set: { updatedAt: new Date() }
            },
            { upsert: true }
        );
    } catch (error) {
        logger.error(`Failed to save message to database: ${error.message}`);
        throw error;
    }
}

export async function incrementInvalidCount() {
    try {
        const minute = getMinuteTimestamp(new Date());

        await collection.updateOne(
            { minute },
            {
                $inc: { totalReceived: 1, totalInvalid: 1 },
                $setOnInsert: {
                    createdAt: new Date(),
                    records: [],
                    totalValid: 0
                },
                $set: { updatedAt: new Date() }
            },
            { upsert: true }
        );
    } catch (error) {
        logger.error(`Failed to increment invalid count: ${error.message}`);
    }
}
