const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const QuestionAnswersSchema = new Schema({
  userId: String,
  isQuestion: Boolean,
  content: String,
  readed: Boolean,
  repQuestionId:  String,
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const QuestionAnswers = mongoose.model("QuestionAnswers", QuestionAnswersSchema);
module.exports = QuestionAnswers
