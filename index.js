const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoURL =
  "mongodb+srv://dbPJ:8A9bT3j@storecluster.9boid.mongodb.net/college?retryWrites=true&w=majority";

const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const GameSchema = new Schema({
  name: String,
  rarity: String,
  description: String,
  goldPerTurn: Number,
});

const Game = mongoose.model("game_table", GameSchema);

// ----------------------------------
// express setup
// ----------------------------------
const express = require("express");
const app = express();
app.use(express.json());
const HTTP_PORT = process.env.PORT || 8080;

app.get("/api/items", (req, res) => {
    Game.find()
      .exec()
      .then((results) => {
        console.log(results);
        res.status(200).send(results);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error when getting items from database.");
      });
  });

// ----------------------------------
// Connect to database & Start Server
// ----------------------------------
const onHttpStart = () => {
  console.log(`Server has started and is listening on port ${HTTP_PORT}`);
};

// connect to the database and check that it worked
mongoose
  .connect(mongoURL, connectionOptions)
  .then(() => {
    console.log("Connected successfully to you database");
    app.listen(HTTP_PORT, onHttpStart);
  })
  .catch((err) => {
    console.log("Error connecting to the database");
    console.log(err);
  });
