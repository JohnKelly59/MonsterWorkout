const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = function (passport) {
  //Login in using Google
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACKURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        //new Google model
        const newGoogleUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };
        //searches google model in MongoDb atlas
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            // cadds new google user model to db
            user = await User.create(newGoogleUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
  /////////////////////////////////////////////////////////////

  // fucntion that authenticate user (authenticaeuser function is a paremeter in the local strategy)
  const authenticateUser = (email, password, done) => {
    //search user in db
    User.findOne({ email: email })
      .then((user) => {
        if (user == null) {
          return done(null, false, { message: "No user with that email" });
        } else {
          // comares password if user email is found
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        }
      })
      .catch((err) => {
        return done(null, false, { message: err });
      });
  };
  //local strategey that is called on login page
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  // seralizes user session by id
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // deserializes user by id
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
