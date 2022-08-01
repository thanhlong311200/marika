const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {common} = require("../validators");
const MyProgramCtrl = require("../controllers/MyProgram.controller");

router.get('/list', commonMiddleware, MyProgramCtrl.fetchList);
router.get('/:id', commonMiddleware, MyProgramCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), common.update, MyProgramCtrl.change);
router.delete('/:id', adminMiddleware, MyProgramCtrl.deleteMyProgram);
router.post('/', adminMiddleware, upload.none(), common.update, common.create, MyProgramCtrl.create);

module.exports = router;
