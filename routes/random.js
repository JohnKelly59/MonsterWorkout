const path = require("path");
const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const Favorite = require("../models/Favorites");
//array that holds selected data from api call
var rworkout = [];
//randomizer route
router.get("/random", function (req, res) {
  if (req.user != null) {
    console.log(req.user);
    let username = req.user.firstName;
    res.render("random", {
      rworkout: rworkout,
      name: username,
    });
  } else {
    let username = "";
    res.render("random", { rworkout: rworkout, name: username });
  }
});
router.post("/random", function (req, res) {
  //erases array that holds data retrieved from api
  rworkout = [];
  //gets input data from forms
  const bodyPart = req.body.bodyPart;
  const number = req.body.num;
  //api options
  var options = {
    method: "GET",
    url: "https://exercisedb.p.rapidapi.com/exercises",
    headers: {
      "x-rapidapi-host": "exercisedb.p.rapidapi.com",
      "x-rapidapi-key": process.env.MY_KEY,
    },
  };

  axios
    .request(options)
    //success request
    .then(function (response) {
      const json = response.data;
      console.log(bodyPart);
      //result array to hold filtered data api
      let result = [];
      //statements to deteremine what data to filter
      if (bodyPart === "arms") {
        result = json.filter(
          (exercise) =>
            exercise.bodyPart === "lower arms" ||
            exercise.bodyPart === "upper arms"
        );
        console.log("1 " + result);
      } else if (bodyPart === "legs") {
        result = json.filter(
          (exercise) =>
            exercise.bodyPart === "lower legs" ||
            exercise.bodyPart === "upper legs"
        );
        console.log("2 " + result);
      } else if (bodyPart === "shoulders") {
        result = json.filter(
          (exercise) =>
            exercise.bodyPart === "shoulders" || exercise.bodyPart === "neck"
        );
        console.log("3 " + result);
      } else {
        result = json.filter((exercise) => exercise.bodyPart === bodyPart);
        console.log("4 " + result);
      }
      //push result array to rworkout array
      rworkout.push(result);
      // Shuffle array
      const shuffled = result.sort(() => 0.5 - Math.random());

      rworkout = shuffled.slice(0, number);
      console.log(rworkout + " work");
      res.redirect("/random");
    })
    //catch errors
    .catch(function (error) {
      //console.log(options);
      console.error(error);
      res.redirect("/");
    });
});

router.post("/randomFavorites", async function (req, res) {
  let favBtn = req.body.favoriteBtn;
  let favBtnData = rworkout[favBtn];
  console.log(favBtnData);
  try {
    const newFavorite = {
      id: favBtnData.id,
      UserId: req.user.id,
    };

    await Favorite.create(newFavorite);
    res.send("/random");
  } catch (err) {
    console.error(err);
  }
  res.redirect("/random");
});

module.exports = router;
