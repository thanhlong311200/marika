const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {common} = require("../validators");
const DietaryCtrl = require("../controllers/Dietary.controller");

router.get('/list', commonMiddleware, DietaryCtrl.fetchList);
router.get('/:id', commonMiddleware, DietaryCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), common.update, DietaryCtrl.change);
router.delete('/:id', adminMiddleware, DietaryCtrl.deleteDietary);
router.post('/', adminMiddleware, upload.none(), common.update, common.create, DietaryCtrl.create);

module.exports = router;
