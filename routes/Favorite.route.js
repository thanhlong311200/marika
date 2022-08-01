const express = require("express");
const router = express.Router();
const Favorite = require("../controllers/Favorite.controller");
const { favorite } = require("../validators");
const multer = require("multer");
const upload = multer();

router.get("/", Favorite.fetch);

router.post("/", upload.none(), favorite.validateOnCreate, Favorite.create);

module.exports = router;
