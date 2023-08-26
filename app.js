const express = require('express')
const app = express()
const authApp = require('./apis/authApp')
const expressAsyncHandler = require('express-async-handler')
const mClient = require('mongodb').MongoClient
var url = "mongodb+srv://Openshot:Openshot@cluster0.btqyt.mongodb.net/?retryWrites=true&w=majority"
mClient.connect(url)

.then ((client)=>{
     console.log('Connetion Successful')
     const dbobj=client.db('Openshot')
     const otpCollection = dbobj.collection('otp')
     const userCollection=dbobj.collection('user')
     app.set('otpCollection',otpCollection)
     app.set('userCollection',userCollection)
})
.catch((err)=>{
    console.log("Failed to Connect"+err.message)
})
app.use('/auth',authApp)










// handling invalid paths
app.use((req,res,next)=>{
    res.send({"message":`invalid path ${req.url}`})
})

app.use((err,req,res,next)=>{
    res.send({"Error":`error is ${err.message}`})
})





app.listen(3015,()=>{
    console.log('listening.....')
})

