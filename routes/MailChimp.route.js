const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer();
const MailChimpCtrl = require("../controllers/MailChimp.controller");
const {adminMiddleware} = require("../middleware/RoleMiddleware");

router.post('/', adminMiddleware, upload.none(), MailChimpCtrl.configMailChimp);

module.exports = router;
