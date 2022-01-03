const express = require("express");
const router = express.Router();

//cover page route
router.get("/", function (req, res) {
  //erases data from arrays
  if (req.user != null) {
    console.log(req.user);
    let username = req.user.firstName;
    res.render("cover", { name: username });
  } else {
    let username = "";
    res.render("cover", { name: username });
  }
});

module.exports = router;
