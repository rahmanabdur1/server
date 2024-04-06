const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://loginusers:r0WJomsW9I5yCM0p@cluster0.gzkpw83.mongodb.net/?retryWrites=true&w=majority';
console.log(uri);


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db("loginusers");
    const loginusers = db.collection("loginusers");

    app.get('/users', async (req, res) => {
      const query = {};
      const users = await loginusers.find(query).toArray();
      res.send(users)
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id,'d')
      const filter = { _id: new ObjectId(id) }
      const result = await loginusers.deleteOne(filter);
      console.log(result, 'r')
      res.send(result)
    });


    app.post('/users', async (req, res) => {
      const contact = req.body;
      const result = await loginusers.insertOne(contact);
      res.send(result)
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

run().then(() => {
  app.get('/', (req, res) => {
    res.send('Doctors portal server is running');
  });

  app.listen(port, () => {
    console.log(`Doctors server listening on port ${port}`);
  });
}).catch(console.error);