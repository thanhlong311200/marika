const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {common} = require("../validators");
const IngredientsCategoryCtrl = require("../controllers/IngredientsCategory.controller");

router.get('/list', commonMiddleware, IngredientsCategoryCtrl.fetchList);
router.get('/:id', commonMiddleware, IngredientsCategoryCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), common.update, IngredientsCategoryCtrl.change);
router.delete('/:id', adminMiddleware, IngredientsCategoryCtrl.deleteIngredientsCategory);
router.post('/', adminMiddleware, upload.none(), common.update, common.create, IngredientsCategoryCtrl.create);

module.exports = router;
