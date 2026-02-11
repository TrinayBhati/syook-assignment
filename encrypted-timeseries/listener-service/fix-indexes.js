import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

async function dropIndexes() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();
        const collection = db.collection('timeseries_data');

        console.log('Dropping existing indexes...');
        await collection.dropIndex('minute_1').catch(() => console.log('Index minute_1 not found'));

        console.log('Creating new combined index...');
        await collection.createIndex(
            { minute: 1 },
            { unique: true, expireAfterSeconds: 604800 }
        );

        console.log('✅ Indexes fixed successfully!');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await client.close();
    }
}

dropIndexes();
