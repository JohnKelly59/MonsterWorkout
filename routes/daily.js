const express = require("express");
const Daily = require("../models/Daily");
const router = express.Router();
const { ensureAuthInfo } = require("../middleware/auth");
const mongoose = require("mongoose");
const axios = require("axios").default;

router.get("/daily", ensureAuthInfo, function (req, res) {
  console.log(req.user);
  // get username
  let username = req.user.firstName;
  // get user id
  let userid = req.user.id;
  // hold favorite data in array
  var daily = [];
  // get saved favorites from database
  const dailyData = Daily.find({ UserId: userid }, function (err, data) {
    // check error
    if (err) {
      console.log(err);
      return;
      //check if db is empty
    } else if (data.length == 0) {
      console.log("No record found");
      res.render("daily", { message: null, name: username, daily: "" });
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
              daily.push(json[j]);
            }
          }
        }

        console.log(daily);
        res.render("daily", {
          message: null,
          name: username,
          daily: daily,
        });
        return data;
      });
    }
  });
});

router.post("/dailyFavorites", async function (req, res) {
  //get favorite button value
  let favBtn = req.body.favoriteBtn;
  console.log(daily);
  // get value of card of button that was pressed
  let favBtnData = daily[favBtn];
  console.log(favBtnData);
  try {
    //add card id to favorites db
    const newdaily = {
      id: favBtnData.id,
      UserId: req.user.id,
    };
    //redirect favorite
    await Daily.create(newdaily);
    res.redirect("/daily");
  } catch (err) {
    console.error(err);
  }
});

router.post("/removeWorkout", function (req, res) {
  // get user id
  let userid = req.user.id;
  // get value of remove button
  let removeButton = req.body.removeBtn;
  console.log(removeButton);
  // delete favorite exercise from favorite db
  Daily.deleteOne(
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
        res.redirect("/daily");
        return;
      } else {
        res.redirect("/daily");
      }
    }
  );
});

module.exports = router;
