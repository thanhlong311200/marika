const express = require('express');
const router = express.Router();
const Payment = require('../controllers/Payment.controller');
const multer = require('multer');
const {checkUpdate, checkCreate} = require("../validators/Payment.validator");
const {userMiddleware, adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const upload = multer();

router.get('/list', adminMiddleware, Payment.getPaymentsByAdmin);
router.get('/revenue', adminMiddleware, Payment.revenue);

router.get('/:id', commonMiddleware, Payment.getPaymentById);

router.put('/:id', adminMiddleware, upload.none(), checkUpdate, Payment.updatePayment);

router.post('/', userMiddleware, upload.none(), checkCreate, Payment.createPayment);

router.get('/', userMiddleware, Payment.getPayments);

module.exports = router
