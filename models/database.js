/**
 * The above code exports a MongoDB client and a function to connect to a MongoDB database using the
 * provided connection string and database name.
 */
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const Grid = require('gridfs-stream');
const multer = require('multer');

dotenv.config();

const DB_CONN = process.env.DB_CONN;
const DB_NAME = process.env.DB_NAME;

// MongoDB connection
const client = new MongoClient(DB_CONN);
let database;

// GridFS connection
let gfs;

// Middleware for handling multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Connect to MongoDB and initialize GridFS stream
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // Initialize GridFS stream after connecting to the database
        const db = client.db(DB_NAME);
        gfs = Grid(db, MongoClient);
        gfs.collection('uploads');

        database = db; // Store the database instance for other modules if needed

    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

module.exports = {
    client,
    connectToMongoDB,
    database, // Export the database instance if needed in other modules
    gfs, // Export GridFS stream instance
    DB_NAME,
    upload, // Export multer upload middleware
};

