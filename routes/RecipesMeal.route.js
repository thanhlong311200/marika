const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {recipesMeal} = require("../validators");
const RecipesMealCtrl = require("../controllers/RecipesMeal.controller");

router.get('/all', commonMiddleware, RecipesMealCtrl.fetchAll);
router.get('/list', commonMiddleware, RecipesMealCtrl.fetchList);
router.get('/:id', commonMiddleware, RecipesMealCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), recipesMeal.update, RecipesMealCtrl.change);
router.delete('/:id', adminMiddleware, RecipesMealCtrl.deleteRecipesMeal);
router.post('/', adminMiddleware, upload.none(), recipesMeal.update, recipesMeal.create, RecipesMealCtrl.create);

module.exports = router;
