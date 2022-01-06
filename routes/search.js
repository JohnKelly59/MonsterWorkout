const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const Favorite = require("../models/Favorites");
const Daily = require("../models/Daily");

//array to hold data from api call
var workout = [];

// search route
router.get("/search", function (req, res) {
  //checks if user name is found
  if (req.user != null) {
    console.log(req.user);
    let username = req.user.firstName;

    res.render("search", {
      workout: workout,
      name: username,
    });
  } else {
    let username = "";
    res.render("search", { workout: workout, name: username });
  }
});

router.post("/search", function (req, res) {
  //erases array that holds data retrieved from api
  workout = [];
  //reteives front-end data
  const bodyPart = req.body.bodyPart;
  const equipment = req.body.equipment;
  const target = req.body.target;
  // api options
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
    .then(function (response) {
      // logging data retrieved from api
      const json = response.data;
      // logging all data retrieved from front-end
      console.log(bodyPart);
      console.log(equipment);
      console.log(target);

      let result = [];
      //statements to deteremine what data to filter
      if (equipment === "" && target === "" && bodyPart === "") {
        console.log("1 " + json);
        //push data to array
        workout.push(json);
      } else if (bodyPart === "" && target === "") {
        result = json.filter((exercise) => exercise.equipment === equipment);
        console.log("2 " + result);
      } else if (equipment === "" && bodyPart === "") {
        result = json.filter((exercise) => exercise.target === target);
        console.log("3 " + result);
      } else if (equipment === "" && target === "") {
        result = json.filter((exercise) => exercise.bodyPart === bodyPart);
        console.log("4 " + result);
      } else if (bodyPart === "") {
        result = json.filter(
          (exercise) =>
            exercise.target === target && exercise.equipment === equipment
        );
        console.log("5 " + result);
      } else if (target === "") {
        result = json.filter(
          (exercise) =>
            exercise.bodyPart === bodyPart && exercise.equipment === equipment
        );
        console.log("6 " + result);
      } else if (equipment === "") {
        console.log("7 " + json);
        result = json.filter(
          (exercise) =>
            exercise.bodyPart === bodyPart && exercise.target === target
        );
      } else if (equipment != "" && target != "" && bodyPart != "") {
        result = json.filter(
          (exercise) =>
            exercise.target === target &&
            exercise.equipment === equipment &&
            exercise.bodyPart === bodyPart
        );
        console.log("8" + result);
      }
      workout.push(result);
      res.redirect("/search");
    })
    .catch(function (error) {
      //console.log(options);
      console.error(error);
      res.redirect("/");
    });
});

router.post("/searchFavorites", async function (req, res) {
  //get favorite button value
  let favBtn = req.body.favoriteBtn;
  // get value of card of button that was pressed
  let favBtnData = workout[0][favBtn];
  console.log(favBtnData);
  try {
    //add card id to favorites db
    const newFavorite = {
      id: favBtnData.id,
      UserId: req.user.id,
    };
    //redirect favorite
    await Favorite.create(newFavorite);
    res.redirect("/search");
  } catch (err) {
    console.error(err);
  }
});

router.post("/searchDaily", async function (req, res) {
  //get favorite button value
  let dailyBtn = req.body.dailyBtn;
  // get value of card of button that was pressed
  let dailyBtnData = workout[0][dailyBtn];
  console.log(dailyBtnData);
  try {
    //add card id to favorites db
    const newDaily = {
      id: dailyBtnData.id,
      UserId: req.user.id,
    };
    //redirect favorite
    await Daily.create(newDaily);
    res.redirect("/search");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
