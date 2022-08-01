const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {mediaTopic} = require("../validators");
const MediaTopicCtrl = require("../controllers/MediaTopic.controller");

// router.get('/category/:id', commonMiddleware, MediaTopicCtrl.fetchListByCategory);
router.get('/list', commonMiddleware, MediaTopicCtrl.fetchList);
router.get('/:id', commonMiddleware, MediaTopicCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), mediaTopic.update, MediaTopicCtrl.change);
router.delete('/:id', adminMiddleware, MediaTopicCtrl.deleteMediaTopic);
router.post('/', adminMiddleware, upload.none(), mediaTopic.update, mediaTopic.create, MediaTopicCtrl.create);


module.exports = router;
