const {Schema, model} = require('mongoose');

const IngredientsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['normal', 'toServe'],
    default: 'normal',
  },
  unit: {
    type: String,
    // required: true,
  },
  categoryId: {
    type: String,
    // required: true,
  },
  note: {
    type: String,
    // required: true,
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

const IngredientsModel = model("Ingredients", IngredientsSchema);
module.exports = IngredientsModel
