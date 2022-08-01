const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {mediaCategory} = require("../validators");
const MediaCategoryCtrl = require("../controllers/MediaCategory.controller");

router.get('/list', commonMiddleware, MediaCategoryCtrl.fetchList);
router.get('/:id', commonMiddleware, MediaCategoryCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), mediaCategory.update, MediaCategoryCtrl.change);
router.delete('/:id', adminMiddleware, MediaCategoryCtrl.deleteMediaCategory);
router.post('/', adminMiddleware, upload.none(), mediaCategory.update, mediaCategory.create, MediaCategoryCtrl.create);

module.exports = router;
