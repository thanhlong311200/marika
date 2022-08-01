const {Schema, model} = require('mongoose');

const RecipesTypeSchema = new Schema({
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

const RecipesTypeModel = model("RecipesType", RecipesTypeSchema);
module.exports = RecipesTypeModel
