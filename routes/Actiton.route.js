require('dotenv').config();
const express = require('express');
const router = express.Router();
const upload = require("../middleware/MiddlewareUploadFileExcel");
const ImportExportCtrl = require("../controllers/ImportExport.controller");
const {adminMiddleware} = require("../middleware/RoleMiddleware");
const {exportCollections} = require("../validators/Common.validator");

// EXPORT DATA
router.get('/export-excel', adminMiddleware, ImportExportCtrl.exportDatabase);
router.post('/export-excel', adminMiddleware, exportCollections , ImportExportCtrl.exportDatabase);
router.get('/collections', adminMiddleware , ImportExportCtrl.getCollections);

// IMPORT DATA
router.post('/import-excel', upload.single("file"), ImportExportCtrl.importDatabase);

module.exports = router;
