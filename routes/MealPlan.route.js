const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {mealPlan} = require("../validators");
const MealPlanCtrl = require("../controllers/MealPlan.controller");

router.get('/names', commonMiddleware, MealPlanCtrl.listName);
router.get('/list', commonMiddleware, MealPlanCtrl.fetchList);
router.get('/:id', commonMiddleware, MealPlanCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), mealPlan.update, MealPlanCtrl.change);
router.delete('/:id', adminMiddleware, MealPlanCtrl.deleteMealPlan);
router.post('/', adminMiddleware, upload.none(), mealPlan.update, mealPlan.create, MealPlanCtrl.create);

module.exports = router;
