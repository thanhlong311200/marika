const {Schema, model} = require("mongoose");

const systemSchema = new Schema({
  field: {type: String, required: true, unique: true},
  value: {type: String, required: true},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = model('System', systemSchema)
