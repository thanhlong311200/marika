const {Schema, model} = require('mongoose');

const RecipesCategorySchema = new Schema({
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

const RecipesCategoryModel = model("RecipesCategory", RecipesCategorySchema);
module.exports = RecipesCategoryModel
