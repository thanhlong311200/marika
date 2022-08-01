const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const TrackingAnswerSchema = new Schema({
  userId: String,
  topicId: String,
  answer: Number,
  date: {
    type: Date,
    default: Date.now
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

const TrackingAnswers = mongoose.model("TrackingAnswers", TrackingAnswerSchema);
module.exports = TrackingAnswers
