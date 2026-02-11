import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://temp_db_db_user:TQI3M3aMg096OdoX@temp-db.fely4gz.mongodb.net/encrypted_timeseries?retryWrites=true&w=majority&appName=Temp-DB';

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
