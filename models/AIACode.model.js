const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const AIACodeSchema = new Schema({
  code: {type: String, required: true, unique: true},
  email: {type: String, default: true, unique: true},
  status: {type: Number, default: 0,}, //{1:active, 0:inactive}
  percent: {type: Number, default: 0,},
  couponId: {type: String, required: true},
  codeId: {type: String, required: true},
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const AIACodes = mongoose.model("AIACodes", AIACodeSchema);
module.exports = AIACodes
