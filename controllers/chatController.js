const express = require('express');
const router  = express.Router();
const Message    = require('../models/message');
const User    = require('../models/user');

router.get('/', (req, res) => {
  res.render('chat/index.ejs');
});

module.exports = router;