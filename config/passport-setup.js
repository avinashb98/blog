const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done)=> {
  done(null, user.id);
});

passport.deserializeUser((id, done)=> {
  User.findById(id).then((user)=> {
    done(null, user);
  })
});

passport.use(
    new GoogleStrategy({
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientId,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done)=> {
        // console.log(profile);
        User.findOne({googleID: profile.id}).then((currentUser)=> {
          if(currentUser) {
            //already have a user
            done(null, currentUser);
          } else {
            new User({
                username: profile.displayName,
                googleID: profile.id,
                thumbnail:profile._json.image.url
            }).save().then((newUser)=> {
                // console.log('new User created'+ newUser);
                done(null, newUser);
            });
          }
        })


    })
);
