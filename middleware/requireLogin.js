module.exports = function(req,res,next){
    if(!req.session.user._id){
      req.session.message = "You must be logged in to perform that action!";
      res.redirect('/auth/login');
    }else{
      next();
    }
}
