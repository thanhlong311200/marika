const express = require('express');
const router = express.Router();
const PaymentSubcription = require('../controllers/PaymentSubcription.controller');
const multer = require('multer');
const {checkUpdate, checkCreate} = require("../validators/Payment.validator");
const upload = multer();

router.post('/', upload.none(), checkCreate, PaymentSubcription.createPaymentSub);

router.put('/:id', upload.none(), checkUpdate, PaymentSubcription.updatePaymentSub);

router.get('/list', PaymentSubcription.getPaymentSubs);

module.exports = router
