const express = require('express');
const router = express.Router();
const Track = require('../controllers/Track.controller');
const multer = require('multer');
const {validCreateTrackAnswer, validUpdateTrackAnswer} = require("../validators/Track.validator");
const {adminMiddleware, memberMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const upload = multer();

router.get('/report', adminMiddleware, upload.none(), Track.reportTrackingAnswers);

router.post('/', memberMiddleware, upload.none(), validCreateTrackAnswer, Track.createTrackAnswer);

router.put('/:id', memberMiddleware, upload.none(), validUpdateTrackAnswer, Track.updateTrackAnswer);

router.delete('/:id', memberMiddleware, Track.deleteAnswerById);

// router.get('/list', adminMiddleware, Track.getTrackAnswersByAdmin);

router.get('/', commonMiddleware, Track.getTrackAnswers);

router.get('/:id', memberMiddleware, Track.getTrackAnswerById);

module.exports = router
