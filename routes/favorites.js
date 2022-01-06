const express = require("express");
const Favorite = require("../models/Favorites");
const router = express.Router();
const { ensureAuthInfo } = require("../middleware/auth");
const mongoose = require("mongoose");
const axios = require("axios").default;

router.get("/favorites", ensureAuthInfo, function (req, res) {
  console.log(req.user);
  let username = req.user.firstName;
  let userid = req.user.id;
  var fav = [];
  const favData = Favorite.find({ UserId: userid }, function (err, data) {
    if (err) {
      console.log(err);
      return;
    } else if (data.length == 0) {
      console.log("No record found");
      res.render("favorites", { message: null, name: username, fav: "" });
      return;
    } else {
      var options = {
        method: "GET",
        url: "https://exercisedb.p.rapidapi.com/exercises",
        headers: {
          "x-rapidapi-host": "exercisedb.p.rapidapi.com",
          "x-rapidapi-key": process.env.MY_KEY,
        },
      };
      axios.request(options).then(function (response) {
        // logging data retrieved from api
        const json = response.data;

        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < json.length; j++) {
            if (json[j].id === data[i].id) {
              fav.push(json[j]);
            }
          }
        }

        console.log(fav);
        res.render("favorites", {
          message: null,
          name: username,
          fav: fav,
        });
        return data;
      });
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
