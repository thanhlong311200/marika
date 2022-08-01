const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const QuestionSchema = new Schema({
  question: String,
  options: [String],
  numberOfAnswers: Number,
  sortOrder: Number
});

const SurveysSchema = new Schema({
  userId: Schema.ObjectId,
  questions: [QuestionSchema],
  name: String,
  startDate: Date,
  endDate: Date,
  status: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const Surveys = mongoose.model("Surveys", SurveysSchema);
module.exports = Surveys
