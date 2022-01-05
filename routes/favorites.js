const express = require("express");
const Favorite = require("../models/Favorites");
const router = express.Router();
const { ensureAuthInfo } = require("../middleware/auth");
const mongoose = require("mongoose");

router.get("/favorites", ensureAuthInfo, function (req, res) {
  console.log(req.user);
  let username = req.user.firstName;
  let userid = req.user.id;
  const favData = Favorite.find({ UserId: userid }, function (err, data) {
    if (err) {
      console.log(err);
      return;
    } else if (data.length == 0) {
      console.log("No record found");
      res.render("favorites", { message: null, name: username, fav: "" });
      return;
    } else {
      res.render("favorites", { message: null, name: username, fav: data });
      return data;
    }
  });
});
router.post("/remove", function (req, res) {
  let userid = req.user.id;
  let removeButton = req.body.removeBtn;
  console.log(removeButton);
  Favorite.deleteOne(
    { userId: userid, id: removeButton },
    function (err, data) {
      if (err) {
        console.log(err);
        return;
      } else if (data.length == 0) {
        console.log("No record found");
        res.redirect("/favorites");
        return;
      } else {
        res.redirect("/favorites");
      }
    }
  );
});

module.exports = router;
