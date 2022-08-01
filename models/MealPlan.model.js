const {Schema, model} = require('mongoose');

const MealPlanSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  data: [
    {day: String, menuFood: [Schema.ObjectId]}
  ],
  dietaryId: {
    type: Schema.ObjectId,
    required: true,
  },
  numberOfSnack: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const MealPlanModel = model("MealPlan", MealPlanSchema);
module.exports = MealPlanModel


// +ID
// +name
// +list menu food (array recipes)
// - - Array recipes
// date
// meal recipes
// id recipes (return object recipes nếu get list)
// - - end array
// +ID dietary preferrence
