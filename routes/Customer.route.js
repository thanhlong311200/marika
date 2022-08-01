const express = require('express');
const {memberMiddleware, userMiddleware} = require("../middleware/RoleMiddleware");
const PaymentIntent = require("../controllers/Customer.controller");
const router = express.Router();


router.post('/', userMiddleware, PaymentIntent.createCard);
router.put('/:id', memberMiddleware, PaymentIntent.updateCard);
router.delete('/:id', memberMiddleware, PaymentIntent.deleteCard);
router.get('/', memberMiddleware, PaymentIntent.getCard);

module.exports = router
