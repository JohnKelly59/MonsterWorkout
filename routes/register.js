const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");
const { ensureAuth } = require("../middleware/auth");

//register route
router.get("/register", ensureAuth, function (req, res) {
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
  const name = req.body.name;
  const email = req.body.email;

  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newNormalUser = {
      firstName: name,
      email: email,
      password: hashPassword,
    };

    let user = await User.findOne({ email: email });
    if (user) {
      done(null, user, { message: "User with that email already exist" });
      res.render("register", { message: "User with that email already exist" });
    } else {
      user = await User.create(newNormalUser);
      done(null, user);
      res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
