const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const TrackingTopicSchema = new Schema({
  name: String,
  index: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['input', 'radio', 'checkbox'],
    default: 'radio'
  },
  question: String,
  options: [{
    index: Number,
    value: String
  }],
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

const TrackingTopic = mongoose.model("TrackingTopic", TrackingTopicSchema);
module.exports = TrackingTopic
