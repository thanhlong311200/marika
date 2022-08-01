const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {recipes} = require("../validators");
const RecipesCtrl = require("../controllers/Recipes.controller");

router.get('/name/:id', RecipesCtrl.fetchRecipesName);
router.get('/list', commonMiddleware, RecipesCtrl.filter);
router.get('/:id', commonMiddleware, RecipesCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), recipes.update, RecipesCtrl.change);
router.delete('/:id', adminMiddleware, RecipesCtrl.deleteRecipes);
router.post('/', adminMiddleware, upload.none(), recipes.update, recipes.create, RecipesCtrl.create);


module.exports = router;
