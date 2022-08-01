const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {common} = require("../validators");
const RecipesTypeCtrl = require("../controllers/RecipesType.controller");

router.get('/list', commonMiddleware, RecipesTypeCtrl.fetchList);
router.get('/:id', commonMiddleware, RecipesTypeCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), common.update, RecipesTypeCtrl.change);
router.delete('/:id', adminMiddleware, RecipesTypeCtrl.deleteRecipesType);
router.post('/', adminMiddleware, upload.none(), common.update, common.create, RecipesTypeCtrl.create);

module.exports = router;
