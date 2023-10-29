const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

async function retrieveAllRecords(db_name, client) {
    const db = client.db(db_name);
    const collection = db.collection('users');
    const cursor = collection.find({});
    const results = await cursor.toArray();
    console.log(results);
    return results;
}

async function setupAndRetrieveRecords() {
    dotenv.config();
    const conn = 'mongodb://localhost:27017/';
    const client = new MongoClient(conn);

    try {
        await client.connect();
        const results = await retrieveAllRecords('reddit-clone', client);
        return results;
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

module.exports = {
    setupAndRetrieveRecords
};
