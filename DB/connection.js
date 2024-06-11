const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/message")
  .then(() => {
    console.log("Connection Success!");
  })
  .catch((e) => {
    console.error("No connection", e);
  });
