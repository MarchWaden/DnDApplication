const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('board/index.ejs')
;});



module.exports = router;
