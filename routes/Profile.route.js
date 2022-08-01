const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/Users.controller');
const {adminMiddleware, userMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {profile} = require("../validators");
const multer = require('multer');
const configMulter = require("../config/MulterAvatar");
const {checkRefreshToken} = require("../middleware/VeryRefreshToken");

const uploadAvatar = multer(configMulter);
const upload = multer();

router.post('/avatar', commonMiddleware, uploadAvatar.single('file'), UserCtrl.upAvatar);
router.post('/cancel-subscription', userMiddleware, checkRefreshToken, UserCtrl.cancelSubscription);
router.get('/count', adminMiddleware, UserCtrl.countMember);
router.get('/:userId', adminMiddleware, profile.adminHandlerInfo, UserCtrl.readProfile);

router.post('/', upload.none(), userMiddleware, profile.updateInfo, profile.requireInfo, UserCtrl.createProfile);
router.put('/', userMiddleware, upload.none(), profile.updateInfo, UserCtrl.changeProfile);
router.get('/', userMiddleware, UserCtrl.readProfile);
router.delete('/', userMiddleware, UserCtrl.deleteProfile);

// Dashboard
router.delete('/:userId', adminMiddleware, profile.adminHandlerInfo, UserCtrl.deleteProfile);
router.put('/update-info', adminMiddleware, profile.updateInfo, UserCtrl.changeProfileByAdmin);

module.exports = router;
