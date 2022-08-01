const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {mediaTag} = require("../validators");
const MediaTagCtrl = require("../controllers/MediaTag.controller");

router.get('/list', commonMiddleware, MediaTagCtrl.fetchList);
router.get('/:id', commonMiddleware, MediaTagCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), mediaTag.update, MediaTagCtrl.change);
router.delete('/:id', adminMiddleware, MediaTagCtrl.deleteMediaTag);
router.post('/', adminMiddleware, upload.none(), mediaTag.update, mediaTag.create, MediaTagCtrl.create);

module.exports = router;
