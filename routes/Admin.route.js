const express = require('express');
const router = express.Router();

router.get('/', () => {
  console.log("Admin....")
})

module.exports = router;
