const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {common} = require("../validators");
const MediaSeriesCtrl = require("../controllers/MediaSeries.controller");

router.get('/preview', commonMiddleware, MediaSeriesCtrl.fetchListPreview);
router.get('/list', commonMiddleware, MediaSeriesCtrl.fetchList);
router.get('/:id', commonMiddleware, MediaSeriesCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), common.update, MediaSeriesCtrl.change);
router.delete('/:id', adminMiddleware, MediaSeriesCtrl.deleteMediaSeries);
router.post('/', adminMiddleware, upload.none(), common.update, common.create, MediaSeriesCtrl.create);

module.exports = router;
