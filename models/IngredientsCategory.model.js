const {Schema, model} = require('mongoose');

const IngredientsCategorySchema = new Schema({
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

const IngredientsCategoryModel = model("IngredientsCategory", IngredientsCategorySchema);
module.exports = IngredientsCategoryModel
