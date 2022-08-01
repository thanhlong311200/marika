const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware} = require("../middleware/RoleMiddleware");
const {common} = require("../validators");
const RecipesTagsCtrl = require("../controllers/RecipesTags.controller");

router.get('/list', RecipesTagsCtrl.fetchList);
router.get('/:id', RecipesTagsCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), common.update, RecipesTagsCtrl.change);
router.delete('/:id', adminMiddleware, RecipesTagsCtrl.deleteRecipesTags);
router.post('/', adminMiddleware, upload.none(), common.update, common.create, RecipesTagsCtrl.create);

module.exports = router;
