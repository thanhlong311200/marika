const {Schema, model} = require('mongoose');

const RecipesMealSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  beDuplicated: {
    type: Number,
    default: 1,
  },
  isMenuFood: {
    type: Boolean,
    default: false,
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

const RecipesMealModel = model("RecipesMeal", RecipesMealSchema);
module.exports = RecipesMealModel
