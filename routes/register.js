const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");
//checks to see if user is logged in
const { ensureAuth } = require("../middleware/auth");

//register route
router.get("/register", ensureAuth, function (req, res) {
  //checks if user name is found
  if (req.user != null) {
    console.log(req.user);
    let username = req.user.firstName;
    res.render("register", { message: null, name: username });
  } else {
    let username = "";
    res.render("register", { message: null, name: username });
  }
});

router.post("/register", async function (req, res, done) {
  // retrieves name and email from user
  const name = req.body.name;
  const email = req.body.email;

  try {
    // retrieves password and hashes it
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    // creats new user model from retrieved data
    const newNormalUser = {
      firstName: name,
      email: email,
      password: hashPassword,
    };
    //looks through database to make sure the emial hasn't been used
    let user = await User.findOne({ email: email });
    if (user) {
      done(null, user, { message: "User with that email already exist" });
      res.render("register", { message: "User with that email already exist" });
    } else {
      //creates new user
      user = await User.create(newNormalUser);
      done(null, user);
      res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
