const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const SurveyAnswerTempSchema = new Schema({
  email: String,
  surveyId: String,
  otpCode: String,
  result: Array,
  date: {
    type: Date,
    default: Date.now,
  },
});

const SurveyAnswerTemp = mongoose.model("SurveyAnswerTemp", SurveyAnswerTempSchema);
module.exports = SurveyAnswerTemp;
