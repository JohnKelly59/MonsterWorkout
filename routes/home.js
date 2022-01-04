const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

// home page route
router.get("/home", function (req, res) {
  console.log(req.user);
  //checks if user is logged in or not
  if (req.user != null) {
    console.log(req.user);
    let username = req.user.firstName;
    res.render("home", { name: username });
  } else {
    let username = "";
    res.render("home", { name: username });
  }
});

module.exports = router;
