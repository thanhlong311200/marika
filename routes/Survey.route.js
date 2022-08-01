const express = require("express");
const router = express.Router();
const SurveyCtrl = require("../controllers/Survey.controller");
const { adminMiddleware, rolesMiddleware } = require("../middleware/RoleMiddleware");
const { survey } = require("../validators");
const multer = require("multer");
const upload = multer();

router.post("/", adminMiddleware, upload.none(), survey.update, survey.create, SurveyCtrl.create);
router.put("/:id", adminMiddleware, upload.none(), survey.update, SurveyCtrl.update);
router.delete("/:id", adminMiddleware, SurveyCtrl.deleteById);
router.get("/", rolesMiddleware, SurveyCtrl.fetch);
router.get("/:id", SurveyCtrl.fetchById);

// router.get("/report", Survey.fetchReport);

module.exports = router;
