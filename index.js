require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

//set the collections path
const { PORT = 3333, MONGODB_URI = "mongodb://localhost:27017/cars5" } =
  process.env;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

console.log("hello world");

//adding it to the 'connection string'
(async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    // console.log("🚀 ~ file: index.js ~ line 21 ~ conn", conn);
    mongoose.connection.on("error", (err) => {
      console.log(err);
    });
  } catch (err) {
    console.log(`Connection error`, err);
  }
})();

app.use((req, res, next) => {
  console.log(req.hostname);
  next();
});

//define a car schema and model
const { Schema } = mongoose;
const carSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  bhp: {
    type: Number,
    required: true,
  },
  avatar_url: {
    type: String,
    default: "https://static.thenounproject.com/png/449586-200.png",
  },
});

const Car = mongoose.model("Car", carSchema);

// const cars = [];

app.get("/api/v1/cars", (req, res, next) => {
  Car.find({}).exec((err, cars) => {
    if (err) return res.status(500).send(err);

    res.status(200).json(cars);
  });
});

app.post("/api/v1/cars", (req, res, next) => {
  console.log(req.body);
  const newCar = new Car(req.body);

  newCar.save((err, car) => {
    if (err) return res.status(500).send(err);
    res.status(201).json(car);
  });
});

app.put("/api/v1/cars/:id", (req, res, next) => {
  const carId = req.params.id;
  const updates = req.body;

  Car.updateOne({ _id: carId }, updates, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.delete("/api/v1/cars/:id?", (req, res, next) => {
  console.log(req.params.id);
  const carId = req.params.id;
  Car.remove({ _id: carId }, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});

app.get("/redirect", (req, res) => {
  res.redirect("/about.html");
});

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
