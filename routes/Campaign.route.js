const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const {adminMiddleware, rolesMiddleware} = require("../middleware/RoleMiddleware");
const {common} = require("../validators");
const Campaign = require("../controllers/Campaign.controller");

router.post('/', adminMiddleware, upload.none(), common.campaignCreate, Campaign.createCampaign);
router.put('/:id', adminMiddleware, upload.none(), common.campaignUpdate, Campaign.updateCampaign);
router.delete('/:id', adminMiddleware, Campaign.deleteCampaign);
router.get('/list', adminMiddleware , Campaign.fetchList);
router.get('/:id', adminMiddleware, Campaign.fetchById);

module.exports = router;
