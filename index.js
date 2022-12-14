const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// DB_USER=to-do-app
// DB_PASS=HKNHOoe6BoraZ3m5

// app.use(cors({ origin: "https://cycle-parts-hut.web.app" }))
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@to-do.m8d2f.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        console.log('database connected');

        const taskCollection = client.db('to_do_app').collection('users');


        app.get('/user/all', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const user = await cursor.toArray();
            res.send(user);
        });

        app.get('/user/all/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleTask = await taskCollection.findOne(query);
            res.send(singleTask);
        });

        //post user data

        app.post('/user/all', async (req, res) => {
            const newUser = req.body;
            const result = await taskCollection.insertOne(newUser);
            res.send(result);
        });

        //update a user
        app.put("/user/all/:id", async (req, res) => {
            const data = req.body;
            // console.log("updated info", data);

            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    First_Name: data.First_Name,
                    Last_Name: data.Last_Name,
                    Email: data.Email,
                    Phone: data.Phone,
                    Roles: data.Roles,
                    State: data.State
                },
            };
            const options = { upsert: true };

            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });


        app.delete('/user/all/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from Intern task')
})

app.listen(port, () => {
    console.log(`listening to Intern task ${port}`)
})