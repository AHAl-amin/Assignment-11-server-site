const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app =express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());







// const uri = "mongodb+srv://<username>:<password>@cluster0.ye8t7hu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ye8t7hu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const blogCollection = client.db('blogDB').collection('blog');
    const wishListCollection = client.db('blogDB').collection('wishList');
    // ................................
    
    // blog collection
    app.get('/blog',async(req,res) =>{
      const {search} = req.query;
      console.log(search);
      let query = {}
      if(search){
        query = {
          title: {$regex: search, $options: 'i'}
        };
      }
      const cursor =blogCollection.find(query);
      const result =await cursor.toArray();
      res.send(result)

    })
    app.get('/feature',async(req,res) =>{
      const cursor =blogCollection.find();
      const result =await cursor.toArray();
      res.send(result)

    })

    app.get('/blog/:id',async(req, res) =>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result =await blogCollection.findOne(query)
      res.send(result);
    })


    app.post('/blog',async(req,res) =>{
        const newBlog =req.body;
        console.log(newBlog)
        const result = await blogCollection.insertOne(newBlog);
        res.send(result);
      })
      // wish list collection
      app.post('/wishList',async(req,res) =>{
        const newBlog =req.body;
        console.log(newBlog)
        const newObj ={...newBlog,timestamp:Date.now()}
        const result = await wishListCollection.insertOne(newObj);
        res.send(result);
      })

      app.get('/wishList/:email', async(req ,res) =>{
        console.log(req.params.email);
        const result = await wishListCollection.find({email:req.params.email}).toArray();
        res.send(result);
      })

      app.get('/wishList',async(req,res) =>{
        const cursor =wishListCollection.find();
        const result =await cursor.toArray();
        res.send(result)
  
      })

      app.delete(`/wishList/:id`,async (req ,res) =>{
        const id =req.params.id;
        const query ={_id: new ObjectId(id)}
        const result = await wishListCollection.deleteOne(query)
        res.send(result);
      })


    

    // ............................
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req ,res) =>{
    res.send('Assaignment eleven server is running')
 })

 app.listen(port,() =>{
    console.log(`Assaignment eleven server is running:${port}`)
 })
