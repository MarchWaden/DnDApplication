const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
      const user = await User.findById(req.session.user._id);
      req.body.user = res.locals.user
      const game = await Game.create(req.body);
      user.games.push(game._id);
      await user.save();
      console.log(user);
      console.log("REDIRECTING TO GAMES")
      res.redirect('/games/view');
  } catch(err){
      console.log(err);
      res.send(err);
  }
})
router.get('/play/:id', async (req, res) => {
    try {
        const game = await Game.findOne({'name': req.params.name});
        console.log(game);
        res.render('board/index.ejs', {game});
    } catch(err){
        res.send(err);
    }
})
router.get('/new', (req, res) => {
  res.render('games/new.ejs');
})
router.get('/view',  async (req, res) => {
    try {
        const games = await Game.find({});
        res.render('games/view.ejs', {games});
    } catch(err){
        res.send(err);
    }
})
router.delete('/:id', async (req,res) => {
  try {
      let game = await Game.findById(req.params.id);
      console.log(game.user);
      console.log(req.session.user._id);
      if(game.user.equals(req.session.user._id)){
        console.log('confirmed');
        let user = await User.findById(game.user);
        user.games.remove(req.params.id);
        await Game.findByIdAndDelete(req.params.id);
        await user.save();
        res.redirect("/user/view");
      }else{
        res.send(err);
      }
  } catch(err){
      res.send(err);
  }
})

module.exports = router;
