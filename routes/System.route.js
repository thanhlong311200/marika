const express = require("express");
const router = express.Router();
const { adminMiddleware } = require("../middleware/RoleMiddleware");
const multer = require("multer");
const upload = multer();
const {system} = require("../validators")
const SystemCtrl = require("../controllers/System.controller");

router.get('/list', adminMiddleware, SystemCtrl.fetchList);
router.get('/:field', adminMiddleware, SystemCtrl.fetch);

router.put('/:field', adminMiddleware, upload.none(), system.update, SystemCtrl.change);
router.delete('/:field', adminMiddleware, SystemCtrl.deleteSystem);
router.post('/', adminMiddleware, upload.none(), system.update, system.create, SystemCtrl.create);

module.exports = router;
