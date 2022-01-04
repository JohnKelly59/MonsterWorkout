const express = require("express");
const router = express.Router();
const axios = require("axios").default;

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
      //statements to deteremine what data to filter
      if (equipment === "" && target === "" && bodyPart === "") {
        console.log("1 " + json);
        //push data to array
        workout.push(json);
      } else if (bodyPart === "" && target === "") {
        const result = json.filter(
          (exercise) => exercise.equipment === equipment
        );
        console.log("2 " + result);
      } else if (equipment === "" && bodyPart === "") {
        const result = json.filter((exercise) => exercise.target === target);
        console.log("3 " + result);
      } else if (equipment === "" && target === "") {
        const result = json.filter(
          (exercise) => exercise.bodyPart === bodyPart
        );
        console.log("4 " + result);
      } else if (bodyPart === "") {
        const result = json.filter(
          (exercise) =>
            exercise.target === target && exercise.equipment === equipment
        );
        console.log("5 " + result);
      } else if (target === "") {
        const result = json.filter(
          (exercise) =>
            exercise.bodyPart === bodyPart && exercise.equipment === equipment
        );
        console.log("6 " + result);
      } else if (equipment === "") {
        console.log("7 " + json);
        const result = json.filter(
          (exercise) =>
            exercise.bodyPart === bodyPart && exercise.target === target
        );
      } else if (equipment != "" && target != "" && bodyPart != "") {
        const result = json.filter(
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

module.exports = router;
