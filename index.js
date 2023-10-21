const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
app.use(cors())
app.use(express.json())
// technology
// 2Up7EjGHdPYMhJbz


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ktupw59.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

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
        const technologyCollection = client.db("technologyDB").collection("technology")
        const brandCollection = client.db("technologyDB").collection("brand")
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        app.get('/technology/brand/:brandName', async (req, res) => {
           const brand=req.params.brandName
            const cursor = technologyCollection.find({brand:brand})
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/technology/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const user = await technologyCollection.findOne(query)
            res.send(user)
        })
        app.post('/technology', async (req, res) => {
            const newProduct = req.body
            console.log(newProduct)
            const result = await technologyCollection.insertOne(newProduct)
            res.send(result)
        })
        app.put('/technology/:id', async (req, res) => {
            const id = req.params.id
            const updateData = req.body
            console.log(updateData)
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatetechnology = {
                $set: {
                    name: updateData.name,
                    brand: updateData.brand,
                    price: updateData.price,
                    category: updateData.category,
                    description: updateData.description,
                    rating: updateData.rating,
                    photo_url: updateData.photo_url,
                }
            }
            const result = await technologyCollection.updateOne(filter, updatetechnology, options)
            res.send(result)
        })
        // brand
        app.get('/brand', async (req, res) => {
            const cursor = brandCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/brand', async (req, res) => {
            const brand = req.body
            console.log(brand)
            const result = await brandCollection.insertOne(brand)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})