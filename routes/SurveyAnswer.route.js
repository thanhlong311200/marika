const express = require("express");
const router = express.Router();
const SurveyAnswer = require("../controllers/SurveyAnswer.controller");
const { surveyAnswer } = require("../validators");
const {
  adminMiddleware,
  memberMiddleware,
  commonMiddleware,
  surveyMiddleware,
} = require("../middleware/RoleMiddleware");
const multer = require("multer");
const upload = multer();

router.post(
  "/",
  surveyMiddleware,
  upload.none(),
  surveyAnswer.checkDoSurvey,
  SurveyAnswer.create
);

router.post(
  "/verify",
  upload.none(),
  surveyAnswer.checkDoSurveyVerify,
  SurveyAnswer.verifyOtp
);

router.get("/verify", SurveyAnswer.verifyCode);

router.get(
  "/list",
  adminMiddleware,
  SurveyAnswer.fetchSurveyAnswer
);

router.get("/report", adminMiddleware, SurveyAnswer.fetchReport);

router.get("/:surveyAnswerId", memberMiddleware, SurveyAnswer.fetchResult);

router.get("/report/:surveyAnswerId", commonMiddleware, SurveyAnswer.fetchReportBySurveyAnswerId);

module.exports = router;
