/**
 * The above code exports a MongoDB client and a function to connect to a MongoDB database using the
 * provided connection string and database name.
 */
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const DB_CONN = process.env.DB_CONN;
const DB_NAME = process.env.DB_NAME;

const client = new MongoClient(DB_CONN);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

module.exports = {
    client, 
    connectToMongoDB,
    DB_NAME, 
};
