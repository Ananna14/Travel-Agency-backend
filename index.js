const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.ojutr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db('travel_client')
      const addServiceCollection = database.collection('services')
      const singleServiceCollection = database.collection('singleService');
      const usersCollection = database.collection('users');
    //   const detailsCollection = database.collection('details')

      //services GET
      app.get('/services', async(req, res)=>{
          const coursor = addServiceCollection.find({});
          const service = await coursor.toArray();
         res.send(service);
        })
        //services  POST
        app.post('/services', async(req, res)=>{
            const service = req.body;
            // console.log('hit the post');
            const result = await addServiceCollection.insertOne(service);
            // console.log(result);
            res.json(result)
            // res.send('post hitted')
      })
   //single-service-load
   app.get('/services/:id', async(req, res)=>{
       const id = req.params.id;
       console.log('get load single service', id);
       const query = {_id: ObjectId(id)};
       const service = await addServiceCollection.findOne(query);
       res.json(service);
   })

      
    } finally {
        //   await client.close();
        }
      }
      run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('This is home');
});

app.get('/test', (req, res) => {
    res.send('This is test');
});

app.listen(port, () => {
    console.log('server is up and running at', port);
})