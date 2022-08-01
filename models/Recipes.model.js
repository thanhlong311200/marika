const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const RecipesSchema = new Schema({
  name: {type: String, required: true},
  mealId: {type: String, required: true},
  price: {type: Number, required: true},
  typeId: {type: String},
  tags: [Schema.ObjectId],
  dietary: [String],
  categoryId: {type: String},
  ingredients: [{_id: String, qty: Number, displayQty: String}],
  size: {type: Number},
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
  nutritionInformation: [{field: String, value: String}],
  method: [{step: Number, content: String}],
  mediaId: String,
  mediaMobileId: String,
  description: String,
  note: String,
  time: String,
  serves: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

const Recipes = mongoose.model("Recipes", RecipesSchema);
module.exports = Recipes
