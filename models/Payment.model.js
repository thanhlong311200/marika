const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const PaymentsSchema = new Schema({
  userId: String,
  // orderId: {type: String, required: true, unique: true},
  orders: Object,
  membershipId: String,
  price: Number,
  promoCode: String,
  aiaCode: String,
  note: String,
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'reject'],
    default: 'pending'
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

const Payments = mongoose.model("Payments", PaymentsSchema);
module.exports = Payments
