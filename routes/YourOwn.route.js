const express = require('express');
const router = express.Router();
const YourOwn = require('../controllers/YourOwn.controller');
const multer = require('multer');
const upload = multer();

router.post('/', upload.none(), YourOwn.createYourOwn);

router.put('/:id', upload.none(), YourOwn.updateYourOwn);

router.delete('/:id', YourOwn.deleteById);

router.get('/', YourOwn.getYourOwns);

router.get('/:id', YourOwn.getById);

module.exports = router
