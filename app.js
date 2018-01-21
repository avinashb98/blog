const express = require('express');
const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const mongoose = require('mongoose');
const Post = require('./models/post-model');
const keys = require('./config/keys');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const postRoutes = require('./routes/post-routes');

//set up view engine
app.set('view engine', 'ejs');

//static folder
app.use('/', express.static(path.join(__dirname, 'public')));

//cookie config
app.use(cookieSession({
  maxAge: 24*60*60*1000, //One day
  keys: [keys.session.cookieKey]
}));

app.use(cookieParser());


//passport passport
app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
mongoose.connect(keys.mongodb.dbURI, ()=> {
    console.log('connected to database');
});
mongoose.Promise = global.Promise;

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/post', postRoutes);

//home route
app.get('/', (req, res)=> {
  Post.find().then((posts)=> {
    res.render('home', {posts: posts, user: req.user})
  })
});

app.listen(3000, ()=> {
    console.log('server listening on port 3000...');
});
