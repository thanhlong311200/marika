const {Schema, model} = require('mongoose');

const RecipesDietarySchema = new Schema({
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

const RecipesDietaryModel = model("RecipesDietary", RecipesDietarySchema);
module.exports = RecipesDietaryModel
