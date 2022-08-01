const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, commonMiddleware} = require("../middleware/RoleMiddleware");
const {common} = require("../validators");
const MembershipTypeCtrl = require("../controllers/MembershipType.controller");

router.get('/list', commonMiddleware, MembershipTypeCtrl.fetchList);
router.get('/:id', commonMiddleware, MembershipTypeCtrl.fetch);

router.put('/:id', adminMiddleware, upload.none(), common.update, MembershipTypeCtrl.change);
router.delete('/:id', adminMiddleware, MembershipTypeCtrl.deleteMembershipType);
router.post('/', adminMiddleware, upload.none(), common.update, common.create, MembershipTypeCtrl.create);

module.exports = router;
