const {Schema, model} = require('mongoose');

const ShoppingListSchema = new Schema({
  data: [{
    date: String,
    mealId: String,
    ingredients: [{
      _id: String,
      qty: Number,
      displayQty: String,
      status: Boolean,
      buyStatus: Boolean,
      order: Number
    }],
    totalIngredients: Number,
  }],
  status: {
    type: String,
    enum: ['private', 'published'],
    default: 'private',
  },
  totalIngredients: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const ShoppingListModel = model("ShoppingList", ShoppingListSchema);
module.exports = ShoppingListModel
