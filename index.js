const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectID;
const port = process.env.PORT || 5000;
require("dotenv").config()
const { MongoClient } = require('mongodb');

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json({
    limit: '50mb',
    parameterLimit: 100000
}))

app.get('/', (req, res) => {
    res.send("connect")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvvgh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const userCollection = client.db("userInfo").collection("userDeta");
    // create
    app.post('/addUser', (req, res) =>{
        const newUser = req.body;
        userCollection.insertOne(newUser)
            .then(result => {
                res.send(result.insertedCount > 0)
                // res.redirect('/')
            })
    })
    //get
    app.get("/getTotalUser", (req, res) =>{
        userCollection.find()
            .toArray((err, result) => {
                res.send(result)
            })
    })
    //get by id
    app.get("/getSingleUser/:id", (req, res) =>{
        userCollection.find({_id: ObjectId(req.params.id)})
            .toArray((err, document) =>{
                res.send(document[0])
            })
    })
    //update 
    app.patch('/updateUserInfo/:id', (req, res) => {
        userCollection.updateOne({_id: ObjectId(req.params.id)},
        { $set: {name: req.body.name, email: req.body.email}})
            .then(result => {
                res.send(result.matchedCount > 0)
            })
    })
    //delete user
    app.delete("/deleteUser/:id", (req, res) => {
        userCollection.deleteOne({ _id: ObjectId(req.params.id)})
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

});

app.listen(port, () => {
    console.log(`https://localhost:${port}`)
})