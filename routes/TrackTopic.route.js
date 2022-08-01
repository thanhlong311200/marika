const express = require('express');
const router = express.Router();
const Track = require('../controllers/Track.controller');
const multer = require('multer');
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {validCreateTrackTopic, validUpdateTrackTopic} = require("../validators/Track.validator");
const upload = multer();

router.post('/', adminMiddleware, upload.none(), validCreateTrackTopic, Track.createTrackTopic);

router.put('/:id', adminMiddleware, upload.none(), validUpdateTrackTopic, Track.updateTrackTopic);

router.delete('/:id', adminMiddleware, Track.deleteById);

router.get('/', commonMiddleware, Track.getTrackTopic);

// router.get('/:id', Track.getTrackTopicById);

module.exports = router
