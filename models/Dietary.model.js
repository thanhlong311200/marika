const {Schema, model} = require('mongoose');

const DietarySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const DietaryModel = model("Dietary", DietarySchema);
module.exports = DietaryModel
