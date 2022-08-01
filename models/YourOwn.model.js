const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const YourOwnsSchema = new Schema({
  userId: String,
  // menu: Array,
  food: String,
  hub: String,
  mind: String,
  stress: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const YourOwns = mongoose.model("YourOwn", YourOwnsSchema);
module.exports = YourOwns
