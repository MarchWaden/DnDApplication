const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const bcrypt  = require('bcryptjs');

router.get('/new', (req, res) => {
  console.log('request recieved');
  res.render('user/new');
});

module.exports = router;
