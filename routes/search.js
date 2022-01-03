const express = require("express");
const router = express.Router();
const axios = require("axios").default;

var workout = [];

// search route
router.get("/search", function (req, res) {
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
  workout = [];
  const bodyPart = req.body.bodyPart;
  const equipment = req.body.equipment;
  const target = req.body.target;
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
      const json = response.data;
      console.log(bodyPart);
      console.log(equipment);
      console.log(target);
      //console.log(json);
      if (equipment === "" && target === "" && bodyPart === "") {
        console.log("1 " + json);
        workout.push(json);
      } else if (bodyPart === "" && target === "") {
        const result = json.filter(
          (exercise) => exercise.equipment === equipment
        );
        console.log("2 " + result);
        workout.push(result);
      } else if (equipment === "" && bodyPart === "") {
        const result = json.filter((exercise) => exercise.target === target);
        console.log("3 " + result);
        workout.push(result);
      } else if (equipment === "" && target === "") {
        const result = json.filter(
          (exercise) => exercise.bodyPart === bodyPart
        );
        console.log("4 " + result);
        workout.push(result);
      } else if (bodyPart === "") {
        const result = json.filter(
          (exercise) =>
            exercise.target === target && exercise.equipment === equipment
        );
        console.log("5 " + result);
        workout.push(result);
      } else if (target === "") {
        const result = json.filter(
          (exercise) =>
            exercise.bodyPart === bodyPart && exercise.equipment === equipment
        );
        console.log("6 " + result);
        workout.push(result);
      } else if (equipment === "") {
        console.log("7 " + json);
        const result = json.filter(
          (exercise) =>
            exercise.bodyPart === bodyPart && exercise.target === target
        );
        workout.push(result);
      } else if (equipment != "" && target != "" && bodyPart != "") {
        const result = json.filter(
          (exercise) =>
            exercise.target === target &&
            exercise.equipment === equipment &&
            exercise.bodyPart === bodyPart
        );
        console.log("8" + result);
        workout.push(result);
      }
      res.redirect("/search");
    })
    .catch(function (error) {
      //console.log(options);
      console.error(error);
      res.redirect("/");
    });
});

module.exports = router;
