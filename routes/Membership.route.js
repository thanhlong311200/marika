const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, rolesMiddleware} = require("../middleware/RoleMiddleware");
const {membership} = require("../validators");
const MemberCtrl = require("../controllers/Membership.controller");

router.get('/list', rolesMiddleware , MemberCtrl.fetchList);
router.put('/:id', adminMiddleware, upload.none(), membership.update, MemberCtrl.change);
router.delete('/:id', adminMiddleware, MemberCtrl.deleteMembership);
router.post('/', adminMiddleware, upload.none(), membership.create, MemberCtrl.create);

router.get('/:id', MemberCtrl.fetch);

module.exports = router;
