const router = require('express').Router();
const passport = require('passport');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');

const authCheck = (req, res, next)=> {
  if(req.user) {
    res.sendStatus(403);
  } else {
    next();
  }
}

//auth login
router.get('/login', authCheck, (req, res)=> {
    res.render('login', {user: req.user});
});

//auth logout
router.get('/logout', (req, res)=> {
    req.logout();
    res.redirect('/');
});

//auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res)=> {
    // console.log(req.user);
    jwt.sign({user: req.user}, keys.jwt.secret, {expiresIn: "2 days"}, (err, token)=> {
      //Store the token in a cookie
      res.cookie('access_token', token, {httpOnly: true });
      res.redirect('/');
    });
});

module.exports = router;
