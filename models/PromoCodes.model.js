const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const PromoCodesSchema = new Schema({
  userId: String,
  autoGenerate: {type: Boolean, default: true},
  promoCode: {type: String, required: true, unique: true},
  percent: {type: Number, default: 0},
  price: {type: Number, default: 0},
  numberOfUse: {type: Number, default: 0, required: true},
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

const PromoCodes = mongoose.model("PromoCodes", PromoCodesSchema);
module.exports = PromoCodes
