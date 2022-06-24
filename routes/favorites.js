const express = require("express");
const Favorite = require("../models/Favorites");
const router = express.Router();
const { ensureAuthInfo } = require("../middleware/auth");
const mongoose = require("mongoose");
const axios = require("axios").default;

router.get("/favorites", function (req, res) {
  console.log(req.user);
  // get username
  let username = req.user.firstName;
  // get user id
  let userid = req.user.id;
  // hold favorite data in array
  var fav = [];
  // get saved favorites from database
  const favData = Favorite.find({ UserId: userid }, function (err, data) {
    // check error
    if (err) {
      console.log(err);
      return;
      //check if db is empty
    } else if (data.length == 0) {
      console.log("No record found");
      res.render("favorites", { message: null, name: username, fav: "" });
      return;
    } else {
      //get all exercises from api
      var options = {
        method: "GET",
        url: "https://exercisedb.p.rapidapi.com/exercises",
        headers: {
          "x-rapidapi-host": "exercisedb.p.rapidapi.com",
          "x-rapidapi-key": process.env.MY_KEY,
        },
      };
      axios.request(options).then(function (response) {
        // saving data retrieved from api
        const json = response.data;
        //compare each api id object to each favorite id in db
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < json.length; j++) {
            if (json[j].id === data[i].id) {
              //push data that matched to fav array
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
  // get user id
  let userid = req.user.id;
  // get value of remove button
  let removeButton = req.body.removeBtn;
  console.log(removeButton);
  // delete favorite exercise from favorite db
  Favorite.deleteOne(
    // see if user id and exercise id match
    { userId: userid, id: removeButton },
    function (err, data) {
      // log error
      if (err) {
        console.log(err);
        return;
        //check if favorite db is empty
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
