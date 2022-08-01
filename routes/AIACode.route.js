const express = require('express');
const router = express.Router();
const AIACodeCtrl = require('../controllers/AIACode.controller');
const {adminMiddleware, memberMiddleware} = require("../middleware/RoleMiddleware");
const {requireAiaCode} = require("../validators/Promo.validator");
const multer = require('multer');
const upload = multer();

router.post('/', adminMiddleware, upload.none(), requireAiaCode, AIACodeCtrl.createCode);

router.get('/confirm', AIACodeCtrl.confirmAiaCode);

router.get('/list', adminMiddleware, AIACodeCtrl.getCodeByAdmin);

router.post('/renew-code', adminMiddleware, upload.none(), requireAiaCode, AIACodeCtrl.replaceCode);

router.put('/:id', adminMiddleware, upload.none(), AIACodeCtrl.updateCode);

router.delete('/:id', adminMiddleware, AIACodeCtrl.deleteCodeById);

router.get('/:id', adminMiddleware, AIACodeCtrl.getCodeById);

module.exports = router
