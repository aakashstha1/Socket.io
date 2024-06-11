const mongoose = require("mongoose");

// Creating a schema
const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Creating a model
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
