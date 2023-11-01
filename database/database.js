const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();
const DB_CONN = process.env.DB_CONN;
const DB_NAME = process.env.DB_NAME;

const client = new MongoClient(DB_CONN);

async function connectToMongo(callback) {
    client.connect(( err, client ) => {
        if (err || !client) {
            return callback(err);
        }

        return callback();
    });
};

async function getDb (dbName = DB_NAME) {
    return client.db(dbName);
}

// async function retrieveAllRecords(db_name, client) {
//     const db = client.db(db_name);
//     const collection = db.collection('users');
//     const cursor = collection.find({});
//     const results = await cursor.toArray();
//     // console.log(results);
//     return results;
// }

// async function setupAndRetrieveRecords() {
//     dotenv.config();
//     const conn = "mongodb+srv://matthewwassmer:ccapdev@reddit-clone.kqn3zsq.mongodb.net/";
//     const client = new MongoClient(conn);

//     try {
//         await client.connect();
//         const results = await retrieveAllRecords('reddit-clone', client);
//         return results;
//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }

module.exports = {
    // setupAndRetrieveRecords
    connectToMongo,
    getDb
};
