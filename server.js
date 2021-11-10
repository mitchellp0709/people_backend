///////////////////////////////
// DEPENDENCIES
////////////////////////////////

//get environmental variables
require("dotenv").config();
//pull PORT from .env, give default value of 3000
const { PORT = 3001, DATABASE_URL } = process.env;
//import express
const express = require("express");
//create app object
const app = express();
//import mongoose
const mongoose = require("mongoose");
const cors = require("cors")
const morgan = require("morgan")




/////////////////////////////////
// Database Connection
////////////////////////////////

// establish connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", () => console.log("You are disconnected from Mongo"))
.on("error", (error) => console.log(error))


/////////////////////////////////
// MODELS
////////////////////////////////

//people schema

const PeopleSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String
}, {timestamps:true}
)

const People = mongoose.model("People", PeopleSchema)


/////////////////////////////////
// MIDDLEWARE
////////////////////////////////

//prevent cors erros, opens up access for frontend
app.use(cors())
//logging
app.use(morgan("dev"))
//parse json bodies 
app.use(express.json())



///////////////////////////////
// ROUTES
////////////////////////////////

//create test route

app.get("/", (req, res) => {
  res.send("hello world")
})


//People index route
//return all people as json

app.get("/people", async (req, res) => {
  try {
    //send all people
    res.json(await People.find({}))
  } catch (error) {
    res.status(400).json({error})
  }
})


//People create route
//post request to /people. uses request body to make new people 

app.post("/people", async (req, res) => {
  
 try {
   //create a new person
   res.json(await People.create(req.body))
 } catch (error) {
   res.status(400).json({ error });
 }

})


// People update  route
// put request /people/:id, updates person based on id with request body
app.put("/people/:id", async (req, res) => {
    try {
        // update a person
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}));
      } catch (error) {
        res.status(400).json({ error });
      }
})


//destroy route
//delete request to /people/:id deletes the person specified

app.delete("/people/:id", async (req, res) => {
  try {
    res.json(await People.findByIdAndRemove(req.params.id))
  } catch (error) {
    res.status(400).json({error})
  }
})







///////////////////////////////
// LISTENER
////////////////////////////////

app.listen(PORT, () => { console.log(`listening on PORT ${PORT}`) })