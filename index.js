const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleWare
app.use(cors())
app.use(express.json()) 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ruilc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()

        const database = client.db('Travel_Master')
        const serviceCollection = database.collection('services')

        // GET API for Tour Servics
        app.get('/TourService', async (req, res) => {
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        // GET API for single service
        app.get('/TourService/booking/:id', async(req, res) =>{
            const id = req.params.id
            const query = { _id : ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
           
        })
        
    }
    finally {
        // await client.close
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running server working succesfully')
})
app.listen(port, () => {
    console.log('Running server on port', port)
})