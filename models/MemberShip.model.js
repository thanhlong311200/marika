const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const MembershipsSchema = new Schema({
  name: {type: String, required: true},
  type: {
    type: String,
    enum: ['hour', 'day', 'week', 'month', "year"],
    default: 'hour',
    index: true
  },
  time: {
    type: Number,
    required: true
  },
  price: {type: Number, required: true},
  amountOfSaving: {type: Number, default: 0},
  typeMembershipId: String,
  productId: String,
  proPriceId: String,
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

const Memberships = mongoose.model("Memberships", MembershipsSchema);
module.exports = Memberships
