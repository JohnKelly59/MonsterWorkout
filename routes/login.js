const express = require("express");
const router = express.Router();

// checks if user is logged in
const { ensureAuth } = require("../middleware/auth");

//login route
router.get("/login", ensureAuth, function (req, res) {
  //checks if user name is found
  if (req.user != null) {
    console.log(req.user);
    let username = req.user.firstName;
    res.render("login", { name: username });
  } else {
    let username = "";
    res.render("login", { name: username });
  }
});

module.exports = router;
