const {Schema, model} = require('mongoose');

const RecipesTagsSchema = new Schema({
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

const RecipesTagsModel = model("RecipesTags", RecipesTagsSchema);
module.exports = RecipesTagsModel
