const mongoose = require("mongoose");
const express = require("express");
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

const Game = mongoose.model("game_tables", GameSchema);

// ----------------------------------
// express setup
// ----------------------------------
const app = express();
app.use(express.json());
const HTTP_PORT = process.env.PORT || 8080;

//View A List of items from Game Table
app.get("/api/items", (req, res) => {
  Game.find()
    .exec()
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error when getting items from database.");
    });
});

//View a single Item from Game Table
app.get("/api/items/:item_name", (req, res) => {
  Game.findOne({ name: req.params.item_name })
    .exec()
    .then((results) => {
      if (results === null) {
        const msg = {
          statusCode: 404,
          msg: "Record not found",
        };
        res.status(404).send(msg);
      } else {
        res.status(200).send(results);
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      const msg = {
        statusCode: 500,
        msg:
          "Error when getting item with the name: " +
          req.params.item_name +
          " from database.",
      };
      res.status(500).send(msg);
    });
});

//Add a new Item into Game Table
app.post("/api/items", (req, res) => {
  Game.create(req.body)
    .then(() => {
      const msg = {
        statusCode: 201,
        msg: "New Item Created",
      };
      res.status(201).send(msg);
    })
    .catch((err) => {
      console.log(err);
      const msg = {
        statusCode: 500,
        msg: "Error when creating Item",
      };
      res.status(500).send(msg);
    });
});

//Delete a Item from Game Table
app.delete("/api/items/:item_name", (req, res) => {
  Game.findOneAndDelete({ name: req.params.item_name })
    .exec()
    .then((deletedItem) => {
      if (deletedItem === null) {
        res.status(404).send("Could not find the Item in the database");
      } else {
        res.status(200).send(deletedItem);
      }
    })
    .catch((err) => {
      console.log(err);
      const msg = {
        statusCode: 500,
        msg: "Error when deleting Item",
      };
      res.status(500).send(msg);
    });
});

//Update a Item from Game Table
app.put("/api/items/:item_id", (req, res) => {
  Game.findOneAndUpdate({ _id: req.params.item_id }, req.body, { new: true })
    .exec()
    .then((updatedItem) => {
      if (updatedItem === null) {
        res.status(404).send("Could not find the Item in the database");
      } else {
        res.status(200).send(updatedItem);
      }
    })
    .catch((err) => {
      console.log(err);
      const msg = {
        statusCode: 500,
        msg: "Error when updating Item",
      };
      res.status(500).send(msg);
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
