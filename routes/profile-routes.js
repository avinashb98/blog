const router = require('express').Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const authCheck = (req, res, next)=> {
  if(!req.user) {
    console.log('authcheck ran..');
    //User not logged in
    res.sendStatus(403);
  } else {
    //User logged in
    next();
  }
}

const verifyJWT = (req, res, next)=> {
  let token = '';

  //extract token from the cookie
  (()=> {
    let cookie = req.headers.cookie;
    let temp = cookie.split(';')[0].split('');
    temp.splice(0, 13);
    token = temp.join('');
  })();

  console.log('token: '+token);
  if(token) {
    jwt.verify(token, keys.jwt.secret, (err, decoded)=> {
      if(err){

      }else {
        next();
      }
    })
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

router.get('/', authCheck, (req, res)=> {
  res.render('profile', {user: req.user});
});

// router.get('/posts', verifyJWT, (req, res)=> {
//   res.send('Blogs...');
// });

module.exports = router;
