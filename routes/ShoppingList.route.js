const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {commonMiddleware, memberMiddleware, rolesMiddleware, adminMiddleware} = require("../middleware/RoleMiddleware");
const {shoppingList} = require("../validators");
const ShoppingListCtrl = require("../controllers/ShoppingList.controller");

router.put('/buy-status/:id', ShoppingListCtrl.handleBuyStatus);
router.get('/list', adminMiddleware, ShoppingListCtrl.fetchShoppingListOfUser);
router.get('/', rolesMiddleware, ShoppingListCtrl.fetch);

router.delete('/', commonMiddleware, ShoppingListCtrl.deleteShoppingList);
router.post('/', memberMiddleware, upload.none(), shoppingList.update, ShoppingListCtrl.handleShoppingList);

module.exports = router;
