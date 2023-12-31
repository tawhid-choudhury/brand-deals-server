require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
const cors = require("cors");
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
    // await client.connect();

    const productCollection = client
      .db("a10Database")
      .collection("a10Products");
    const cartCollection = client.db("a10Database").collection("a10UserCarts");

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

    app.put("/updateProduct/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          name: updatedProduct.name,
          img: updatedProduct.img,
          brand: updatedProduct.brand,
          type: updatedProduct.type,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    //24 product data added
    app.post("/products", async (req, res) => {
      newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // CART FUNCTIONS
    app.get("/carts/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: `${email}` };
      const cursor = cartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/carts", async (req, res) => {
      newAdd = req.body;
      console.log(newAdd);
      const result = await cartCollection.insertOne(newAdd);
      res.send(result);
    });

    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
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
