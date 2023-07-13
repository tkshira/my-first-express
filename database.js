const {MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://myuser:5coRHR9f1FCBVTnI@my-first-mongodb.wv6yush.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const database = client.db("my-first-mongodb");
const databaseAdmin = client.db("user-admin");

async function run(){
    try {
        await client.connect();

        await client.db("my-first-mongodb").command({ ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB");

        // try {
        //     const insertManyResult = await collection.insertMany(nippou)
        //     console.log(`${insertManyResult.insertedCount} documents successfully inserted`)
        // }
        // catch(err){
        //     console.log(`Something went very wrong: ${err}`);
        // }
    }
    finally{
        await client.close();
    }
}

run().catch(console.dir);

module.exports = { database, databaseAdmin, client };