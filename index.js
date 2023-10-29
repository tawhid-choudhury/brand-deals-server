const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// MIDDLE_WARES
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eecllat.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client
      .db("a10Database")
      .collection("a10Products");

    // get all product from same brand
    app.get("/products/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: `${brand}` };
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get one product
    app.get("/productDetail/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      console.log(id);
      res.send(result);
    });

    //24 product data added
    app.post("/products", async (req, res) => {
      newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ASSIGNMENT 10 SERVER IS RUNNING)");
});

app.listen(port, () => {
  console.log(`Server running on port no: ${port}`);
});
