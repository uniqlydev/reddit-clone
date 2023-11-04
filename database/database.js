const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();
const DB_CONN = process.env.DB_CONN;
const DB_NAME = process.env.DB_NAME;

const client = new MongoClient(DB_CONN);

async function connectToMongoDB() {
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        console.log("Connected to MongoDB");
        client.close();
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

module.exports = {
    connectToMongoDB
};
