const {Schema, model} = require('mongoose');

const LogsSchema = new Schema({
  type: {
    type: String,
    enum: ['payment', 'tracking', 'aia', 'promo', 'other'],
    default: 'other'
  },
  typeId: String, // payment_id || tracking_id || promoCode_id || other_id
  userId: String,
  paymentId: String,
  promoCodeId: String,
  aiaCodeId: String,
  data: Object,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const Logs = model("Logs", LogsSchema);
module.exports = Logs
