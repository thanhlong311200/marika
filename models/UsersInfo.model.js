const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const userInfoSchema = new Schema({
  name: String,
  isSubscription: {
    type: Boolean,
    default: false
  },
  schedule: {
    type: Boolean,
    default: false
  },
  scheduleId: String,
  nickname: String,
  avatar: String,
  email: String,
  phone: String,
  birthday: String,
  address: String,
  city: String,
  postcode: String,
  state: String,
  sex: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },
  customField: [{field: String, value: String}],
  isDelete: Boolean,
  memberId: String,
  paymentCustomerId: String,
  membershipId: Schema.ObjectId,
  myProgram: {
    type: Number,
    default: 1
  },
  mealPlan: String,
  dietary: Schema.ObjectId,
  showNutritional: {
    type: Number,
    enum: [0, 1],
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
}, {collection: 'profiles'});

const UsersInfo = mongoose.model("Profiles", userInfoSchema);
module.exports = UsersInfo
