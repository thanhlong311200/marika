const express = require('express');
const router = express.Router();
const MediaCtrl = require('../controllers/Media.controller');
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {media} = require('../validators');
const multer  = require('multer')
const configMulter = require("../config/MulterMedia");

const upload = multer(configMulter);

router.get('/random-list/:type', commonMiddleware, MediaCtrl.getRandomList);
router.get('/list/:type', commonMiddleware, MediaCtrl.getList);
router.get('/:id', commonMiddleware, MediaCtrl.getMedia);

router.post('/', adminMiddleware, upload.single('urlFile'), media.change, media.create, MediaCtrl.upMedia);
router.put('/:id', adminMiddleware, upload.single('urlFile'), media.change, MediaCtrl.changeMedia);
router.delete('/:id', adminMiddleware, MediaCtrl.deleteMedia);

module.exports = router;
