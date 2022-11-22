//Dependencies
require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const methodOverride = require("method-override")
const mongoose = require("mongoose")

const PORT = process.env.PORT
const app = express()

//Database Connection
//Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

//Establish Connection
mongoose.connect(DATABASE_URL, CONFIG)

//Events for when connection opens/disconnects/errors
mongoose.connection
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected from Mongoose"))
  .on("error", (error) => console.log(error))

//Pull schema and model from mongoose
const { Schema, model } = mongoose

//Make animals schema
const animalsSchema = new Schema({
  name: String,
  species: String,
  extinct: Boolean,
  location: String,
  lifeExpectancy: Number,
  image: String
})

//Make animal model
const Animal = model("Animal", animalsSchema)

//Middleware
app.use(morgan("tiny"))
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

//Routes
app.get('/', (req, res) => {
  res.send("Server is working!")
})

app.get("/animals/seed", (req, res) => {
  //Array of starter animals
  const startAnimals = [
    { name: "Lion", species: "Panthera Leo", extinct: false, location: "Africa", lifeExpectancy: 15, image: "https://i.imgur.com/o4wLBQq.jpeg" },
    { name: "Tiger", species: "Panthera Tigris", extinct: false, location: "Asia", lifeExpectancy: 25, image: "https://i.imgur.com/GleAY3f.jpeg" },
    { name: "Grizzly Bear", species: "Ursus Arctos Horriblis", extinct: false, location: "North America", lifeExpectancy: 25, image: "https://i.imgur.com/CcyRKI4.jpeg" },
    { name: "Polar Bear", species: "Ursus Maritimus", extinct: false, location: "North America", lifeExpectancy: 30, image: "https://i.imgur.com/3Xkv00y.jpeg" },
    { name: "Seal", species: "Phoca Vitulina", extinct: false, location: "Ocean", lifeExpectancy: 25, image: "https://i.imgur.com/zGHNzyG.jpeg" },
    { name: "Dog", species: "Canis Familiaris", extinct: false, location: "Everywhere", lifeExpectancy: 13, image: "https://i.imgur.com/N3BEoO4.jpeg" },
  ]

  //Delete all animals
  Animal.remove({}, (err, data) => {
    //Seed starter animals
    Animal.create(startAnimals, (err, data) => {
      //Send created animals as response to confirm creation
      res.json(data);
    }
    )
  })
})

//Index route
app.get("/animals", async (req, res) => {
  const animals = await Animal.find({})
  res.render("index.ejs", { animals })
})

//New route
app.get("/animals/new", (req, res) => {
  res.render("new.ejs")
})

//Update route
app.put("/animals/:id", async (req, res) => {
  
  req.body.readyToEat = req.body.readyToEat === "on" ? true : false

  await Animal.findByIdAndUpdate(id, req.body, {new: true}, (err, fruit) => {
  
      res.redirect("/animals")
  })
})

//Create route
app.post("/animals", async (req, res) => {
  req.body.extinct = Boolean(req.body.extinct)
  await Animal.create(req.body)
  res.redirect("/animals")
})

//EDIT ROUTE - GET - Get the edit form
app.get("animals/:id/edit", async (req, res) => {
  const soda = await Animal.findById[req.params.id]
  res.render("edit.ejs", {animals})
})

//Show route
app.get("/animals/:id", async (req, res) => {
  const animal = await Animal.findById(req.params.id)
  res.render("show.ejs", { animal })
})



app.listen(PORT, () => console.log(`Server is listening to port: ${PORT}`))


//I need an edit button, my update and edit routes to work, and to add a delete route.
//Then I will add a public folder with style.css and do very minimal styling
//Then I await refactoring