const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const bcrypt  = require('bcryptjs');

//login
router.get('/login', (req, res) => {
  let message = "";
  if(req.session){
    if(req.session.message){
      message = req.session.message;
    }
  }
  res.render('auth/login.ejs', {
    message: message
  });
});
//register
router.post('/register', async (req, res) => {
    console.log(req.body)
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(2));

  const userEntry = {};
  userEntry.username = req.body.username;
  userEntry.password = passwordHash;

  const user = await User.create(userEntry)
    console.log(`the user info is ${user}`);
    req.session.user = user;
    req.session.logged   = true;
    req.session.message  = '';
    res.redirect('/');
});

//login
router.post('/login', async (req, res) => {
  try {
      console.log(req.session, 'req.session');
          const foundUser = await User.findOne({username: req.body.username});
          console.log(foundUser, 'found user')
          if(foundUser){
            console.log(foundUser.password);
            if(bcrypt.compareSync(req.body.password, foundUser.password)){
              console.log('compare checked out')
              req.session.user = {};
              req.session.logged = true;
              req.session.user.username = foundUser.username;
              req.session.user.password = foundUser.password;
              req.session.user._id = foundUser._id;
              req.session.message  = '';
              res.redirect('/')
            } else {
              console.log('compare false')
              req.session.message = 'Username or Password is Wrong';
              res.redirect('/auth/login')
            }
        } else {
              req.session.message = 'Username or Password is Wrong';
              res.redirect('/auth/login')
            }
    } catch(err) {
    res.send('error')
  }
});
//logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err){
      res.send(err);
    } else {
      res.redirect('/')
    }
  });
});


module.exports = router;
