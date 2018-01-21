const router = require('express').Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const Post = require('../models/post-model');
const User = require('../models/user-model');
const Comment = require('../models/comment-model');

const verifyJWT = (req, res, next)=> {
  let token = '';

  //extract token from the cookie
  (()=> {
    let cookie = req.headers.cookie;
    let temp = cookie.split(';')[0].split('');
    temp.splice(0, 13);
    token = temp.join('');
  })();

  if(token) {

    jwt.verify(token, keys.jwt.secret, (err, decoded)=> {
      if(err){
        res.send(err);
      }else {
        next();
      }
    });

  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

const verifyAdmin = (req, res, next)=> {
  if(req.user.isAdmin) {
    next();
  } else {
    let response = {
      message: 'Not authorized'
    }
    res.status(403).send(response);
  }
}

router.post('/', verifyJWT, (req, res)=> {

  const post = {
    title: req.body.title,
    content: req.body.content,
    date: Date.now(),
    author: req.user.id
  }

  Post.create(post).then((post)=> {
    res.send('Post created successfully');
    console.log('post created');
  }).catch((err)=> {
    res.send(err);
  });

});

//Get a single post
router.get('/:id', (req, res)=> {
  Post.findOne({_id: req.params.id}).then((post)=> {
    User.findOne({_id: post.author}).then((author)=> {
      post.author = author.username;
      res.render('post', {post: post, user: req.user});
    })
  }).catch((err)=> {
    res.status(404).send(err);
  });
});

//delete a single post
router.delete('/:id',verifyJWT, (req, res)=> {
  Post.findByIdAndRemove(req.params.id, (err, post)=> {
    let response = {
      message: "Post successfully deleted",
      id: post._id
    }
    res.status(200).send(response);
  }).catch((err)=> {
    res.status(404).send(err);
  });;
});


//Comment on a post
// router.post('/:id/comment', (req, res)=> {
//
//   Post.findById(req.params.id, (err, post)=> {
//     if(err) {
//       res.status(500).send(err);
//     } else {
//       let comments = post.comments;
//       let newComment = {
//         posted: Date.now(),
//         author: req.user.id,
//         content: req.body.content,
//         post: req.params.id
//       };
//       Comment.create(newComment, (err, comment)=> {
//         console.log(comment.content);
//         let updatedPost = post;
//         updatedPost.comments.push(comment._id)
//         updatedPost.save((err, savedPost)=> {
//
//           User.findById(updatedPost.author, (err, user)=> {
//             savedPost.author = user.username;
//
//             savedPost.comments.map((commentId)=> {
//               let commentContent = '';
//               Comment.findById(commentId, (err, _comment)=> {
//                 // console.log(_comment);
//                 commentContent = _comment.content;
//                 // console.log(commentContent);
//               })
//               return commentContent;
//             });
//
//             res.render('post', {post: savedPost, user: req.user});
//             console.log(comment);
//           })
//
//         })
//       })
//     }
//   })
// });


router.get('/new/create', (req, res)=> {
  res.render('new-post', {user: req.user});
});

module.exports = router;
