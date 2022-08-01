const express = require('express');
const router = express.Router();
const PromoCode = require('../controllers/PromoCode.controller');
const {checkCreatePromo, checkUpdatePromo} = require("../validators/Promo.validator");
const multer = require('multer');
const {adminMiddleware,  rolesMiddleware} = require("../middleware/RoleMiddleware");
const upload = multer();

router.post('/', upload.none(), adminMiddleware, checkCreatePromo, PromoCode.createPromoCode);

router.put('/:id', upload.none(), adminMiddleware, checkUpdatePromo, PromoCode.updatePromoCode);

router.delete('/:id', adminMiddleware, PromoCode.deletePromoCodeById);

router.get('/',rolesMiddleware, PromoCode.getPromoCodes);

// router.get('/', memberMiddleware, PromoCode.getPromoCodeById);

module.exports = router
