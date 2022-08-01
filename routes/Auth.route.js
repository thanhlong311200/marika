const express = require('express');
const router = express.Router();
const Auth = require('../controllers/Auth.controller');
const Validation = require('../middleware/Validator');
const authMiddleware = require("../middleware/firebase-middleware");
const multer  = require('multer');
const upload = multer();

router.post('/login', upload.none(), Validation.login, Auth.userLogin);

// router.post('/google', upload.none(), Validation.authSocial, Auth.googleLogin);

// router.post('/facebook', upload.none(), Validation.authSocial, Auth.facebookLogin);

router.post('/admin-login', upload.none(), Validation.login, Auth.adminLogin);

router.post('/register', upload.none(), Validation.register, Auth.userRegister);

router.post('/firebase', upload.none(), authMiddleware, Auth.firebaseLogin)

module.exports = router
