const  express = require('express');
const  cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000 ;


app.use(cors()); 
app.use(express.json());

 
// console.log(process.env.DB_PSSSWORD) 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSSSWORD}@cluster0.b1f0ncj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const productCollections = client.db('EcommerceDB').collection('products')
    const reviewsCollections = client.db('EcommerceDB').collection('reviews')
    

    app.get('/productlist', async(req, res) => { 
       const cursor = productCollections.find();
       const result = await cursor.toArray();
       res.send(result);
     }) 

    app.get('/products', async(req, res) => {
      const search = req.query.search;
      // console.log(search)
      const query = {
         name: { $regex: search, $options: 'i'}}
      const option= { sort: {'price': 1}} 

       const cursor = productCollections.find(query,option);
       const result = await cursor.toArray();
       res.send(result);
    })

    app.get('/productlist/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollections.findOne(query)
      console.log(result)
      res.send(result)
})

app.post('/reviews' , async(req, res) => {
    const reviews = req.body;
   //  console.log(reviews)
    const result = await reviewsCollections.insertOne(reviews);
    res.send(result) 
})

app.get('/reviews', async (req,res) => {
   const result = await reviewsCollections.find().toArray();
   res.send(result)
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   //  await client.close();
  } 
}
run().catch(console.dir);



app.get('/', (req, res) => {
   res.send('server is running')
})

app.listen(port, () => {
   console.log(`e-commerce server running:${port}`)
})