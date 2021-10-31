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
        const boookingCollection = database.collection('booking')

        // GET API for Tour Servics
        app.get('/TourService', async (req, res) => {
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        // POST API for Tour services
        app.post('/TourService', async(req, res) =>{
            const service = req.body
            const results = await serviceCollection.insertOne(service)
            res.send(results)
        })

        // GET API for single service
        app.get('/TourService/booking/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service)

        })

        // POST API one item
        app.post('/TourService/booking', async (req, res) => {
           const booking = req.body
           const result = await boookingCollection.insertOne(booking)
           res.send(result)
           
        })

        // GET API for manage orders
        app.get('/TourService/booking', async (req, res) =>{
            const cursor = boookingCollection.find({})
            const bookingOrder = await cursor.toArray()
            res.send(bookingOrder)
        })

        // DELETE API for booking order
        app.delete('/TourService/booking/:id', async (req, res) =>{
            const id = req.params.id
            const query = { _id : ObjectId(id)}
            const results = await boookingCollection.deleteOne(query) 
            res.send(results)
          
        })

        // PUT API for update pending status
        app.post('/TourService/booking/:id', async(req, res) =>{
            const id = req.params.id
            const updateStatus = req.body
            const filter = { _id : ObjectId(id)}
            const options = {upsert : true}
            const updateDoc = {
                $set :{
                    status : updateStatus.status
                }
            }
            const result = await boookingCollection.updateOne(filter, updateDoc, options)
            res.send(result)
            
        })

    }
    finally {
        // await client.close
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running Travel server working succesfully')
})

app.listen(port, () => {
    console.log('Running server on port', port)
})