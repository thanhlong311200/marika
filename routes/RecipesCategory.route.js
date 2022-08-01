const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {common} = require("../validators");
const RecipesCategoryCtrl = require("../controllers/RecipesCategory.controller");

router.get('/list', commonMiddleware, RecipesCategoryCtrl.fetchList);
router.get('/:id', commonMiddleware, RecipesCategoryCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), common.update, RecipesCategoryCtrl.change);
router.delete('/:id', adminMiddleware, RecipesCategoryCtrl.deleteRecipesCategory);
router.post('/', adminMiddleware, upload.none(), common.update, common.create, RecipesCategoryCtrl.create);

module.exports = router;
