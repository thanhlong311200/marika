const {Schema, model} = require('mongoose');

const MenuFoodSchema = new Schema({
  userId: Schema.ObjectId,
  date: Date,
  swap: Boolean,
  mealId: {type: Schema.ObjectId, required: true},
  recipe: Schema.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const MenuFoodModel = model("MenuFood", MenuFoodSchema);
module.exports = MenuFoodModel
