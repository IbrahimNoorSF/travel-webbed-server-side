const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
// MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// ASYNC FUNCTION
async function run() {
    try {
        await client.connect();
        console.log('Connected to database');
        const database = client.db("TravelWebbed");
        const serviceCollections = database.collection("services");
        const bookingCollections = database.collection("bookings");
        // CRUD OPERATIONS GOES HERE

        // GET API SERVICES
        app.get('/add-new-service', async (req, res) => {
            // RUN FIND OPERATION FOR ALL DATA FROM DATABASE COLLECTION
            const cursor = serviceCollections.find({});
            // CONVERT DATA TO AN ARRAY
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET API BOOKINGS
        app.get('/my-bookings', async (req, res) => {
            // RUN FIND OPERATION FOR ALL DATA FROM DATABASE COLLECTION
            const cursor = bookingCollections.find({});
            // CONVERT DATA TO AN ARRAY
            const bookings = await cursor.toArray();
            res.send(bookings);
        })

        // POST API SERVICES
        app.post('/add-new-service', async (req, res) => {
            const service = req.body;
            console.log('Hitting the post api');
            const result = await serviceCollections.insertOne(service);
            console.log(result);
            res.json(result);
        })
        // POST API BOOKING
        app.post('/my-bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);
            console.log('Hitting the post api');
            const result = await bookingCollections.insertOne(booking);
            console.log(result);
            res.json(result);
        })

        // PUT API
        app.put('/my-bookings/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status,
                },
            };
            const result = await bookingCollections.updateOne(filter, updateDoc, options);
            console.log('Updating Service');
            res.json(result);
        })

        // DELETE API (DELETE DATA FROM CLIENT)
        app.delete('/my-bookings/:id', async (req, res) => {
            const id = req.params.id;
            query = { _id: ObjectId(id) };
            const result = await bookingCollections.deleteOne(query);
            console.log('Delete request generated from client side for id: ', id);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
// CALL ASYNC FUNCTION TO EXECUTE
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from my node server')
});

app.listen(port, () => {
    console.log('Listening to', port)
});
