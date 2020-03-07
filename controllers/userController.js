const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const Game    = require('../models/game');
const bcrypt  = require('bcryptjs');

router.get('/new', (req, res) => {
  res.render('user/new');
});

router.get('/view' , async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        let games = [];
        for(let i=0;i<user.games.length;i++){
          let game = await Game.findById(user.games[i]);
          games.push(game);
        };
        res.render('user/view.ejs', {user, games});
    } catch(err){
        res.send(err);
    }
})
router.delete('/', async (req, res) => {
    try{
        const user = await User.findById(req.session.user._id);
        for (let i = 0; i < user.games.length; i++){
            await Game.findByIdAndDelete(user.games[i]._id);
        }
        await User.findByIdAndDelete(req.session.user._id)
        req.session.destroy();
        res.redirect('/')
    }catch(err){
        res.send(err);
    }
})
router.put('/', async (req, res) => {
    try {
        const passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(2));
        let user = await User.findById(req.session.user._id)
        user.password = passwordHash;
        await user.save()
        req.session.user = user;
        res.redirect('/user/view')
    } catch(err){
        res.send(err);
    }
})

module.exports = router;
