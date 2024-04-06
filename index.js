const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion} = require('mongodb');
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
        console.log(users,'us')
        res.send(users)
      })

  // Update the server-side code to include the delete user route
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
      const result = await loginusers.deleteOne({ _id: userId });
      if (result.deletedCount === 1) {
          res.status(200).json({ message: 'User deleted successfully' });
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

      app.post('/users', async (req, res) => {
        const contact = req.body;
      const result = await loginusers.insertOne(contact);
      console.log(result,'r')
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