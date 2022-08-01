const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {common} = require("../validators");
const RecipesDietaryCtrl = require("../controllers/RecipesDietary.controller");

router.get('/list', commonMiddleware, RecipesDietaryCtrl.fetchList);
router.get('/:id', commonMiddleware, RecipesDietaryCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), common.update, RecipesDietaryCtrl.change);
router.delete('/:id', adminMiddleware, RecipesDietaryCtrl.deleteRecipesDietary);
router.post('/', adminMiddleware, upload.none(), common.update, common.create, RecipesDietaryCtrl.create);

module.exports = router;
