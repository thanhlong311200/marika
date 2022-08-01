const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const QuestionAnswerSchema = new Schema({
  questionId: String,
  answer: [Number],
});

const SurveyAnswerSchema = new Schema({
  email: String,
  surveyId: Schema.ObjectId,
  result: [QuestionAnswerSchema],
  isSuccess: {type: Boolean, default: false},
  date: {
    type: Date,
    default: Date.now,
  },
  mealPlan: String
});

const SurveyAnswer = mongoose.model("SurveyAnswer", SurveyAnswerSchema);
module.exports = SurveyAnswer;
