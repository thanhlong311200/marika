const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {common} = require("../validators");
const IngredientsCtrl = require("../controllers/Ingredients.controller");

router.get('/list', commonMiddleware, IngredientsCtrl.fetchList);
router.get('/:id', commonMiddleware, IngredientsCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), common.ingredients, IngredientsCtrl.change);
router.delete('/:id', adminMiddleware, IngredientsCtrl.deleteIngredients);
router.post('/', adminMiddleware, upload.none(), common.ingredients, common.createIngredients, IngredientsCtrl.create);

module.exports = router;
