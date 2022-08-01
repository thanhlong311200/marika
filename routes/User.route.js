const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/Users.controller');
const {memberMiddleware, adminMiddleware} = require("../middleware/RoleMiddleware");
const multer = require('multer');
const {adminHandlerInfo, changePassword} = require("../validators/Profile.validator");
const upload = multer();

router.put('/change-password', upload.none(), adminMiddleware, changePassword, UserCtrl.changePass);
router.get('/list', adminMiddleware, UserCtrl.listUsers);
router.delete('/', memberMiddleware, UserCtrl.deleteUser);
router.put('/:id', adminMiddleware, UserCtrl.updateStatus);
router.delete('/:userId', adminMiddleware, adminHandlerInfo, UserCtrl.deleteUser);

module.exports = router;
