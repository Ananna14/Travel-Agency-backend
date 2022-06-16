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
    const bookingCollection = database.collection('booking');
      const usersCollection = database.collection('users');

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
 
   //BOOKING_sERVICE_POST
   app.post('/confirmOrder', async(req, res)=>{
    //  const cards = req.body;
     const result = await bookingCollection.insertOne(req.body);
    //  console.log(result);
     res.send(result);
   })

   //my Orders
   app.get('/myOrders', async(req, res) =>{
    const email = req.query.email;
    const query = { email: email }
    console.log(query);
    const cursor = bookingCollection.find(query);
    const booking = await cursor.toArray();
    res.json(booking);
  })


   // DELETE-API
   app.delete('/services/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id) };
    const result = await bookingCollection.deleteOne(query);
    // console.log('deleted product',)
    res.json(result);
  })
   // user get api
//    app.get('/users/:email', async (req, res) => {
//     const email = req.params.email;
//     const query = { email: email };
//     const user = await usersCollection.findOne(query);
   
//     res.json(user);
// });

  // user Post Api
  app.post('/users', async (req, res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    console.log(result);
    res.json(result);
});

   // user Post Api
     app.put('/users', async (req, res) => {
        const user = req.body;
        // console.log('put', user);
        const filter ={ email: user.email };
        const options = { upsert: true };
        const updateDoc = { $set: user };
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.json(result);
    });

// MAKE_ADMIN
app.put('/users/admin', async(req, res)=>{
const user = req.body;
console.log('put', req.headers.authorization);
const filter = {email: user.email};
const updateDoc = {$set: {role: 'admin'}};
const result = await usersCollection.updateOne(filter, updateDoc);
res.json(result);
})

// MAKE_ADMIN_EMAIL
app.get('/users/:email', async(req, res)=>{
  const email = req.params.email;
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  let isAdmin = false;
  if(user?.role === 'admin'){
    isAdmin = true;
  }
  res.json({admin: isAdmin});
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