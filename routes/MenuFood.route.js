const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {commonMiddleware, memberMiddleware, rolesMiddleware} = require("../middleware/RoleMiddleware");
const {menuFood} = require("../validators");
const MenuFoodCtrl = require("../controllers/MenuFood.controller");

router.get('/list', commonMiddleware, MenuFoodCtrl.fetchMenuOfUser);
router.post('/recipes', commonMiddleware, upload.none(), menuFood.createList, MenuFoodCtrl.createByArray);
router.post('/meal-plan', memberMiddleware, upload.none(), menuFood.mealPlan, MenuFoodCtrl.upListMenuByMealPlan);
router.get('/:id', rolesMiddleware, MenuFoodCtrl.fetch);

router.put('/:id', commonMiddleware, upload.none(), menuFood.update, MenuFoodCtrl.change);
router.delete('/:id', memberMiddleware, MenuFoodCtrl.deleteMenuFood);
router.post('/', commonMiddleware, upload.none(), menuFood.update, menuFood.create, MenuFoodCtrl.create);

module.exports = router;
