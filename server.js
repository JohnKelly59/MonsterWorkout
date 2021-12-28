const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
var https = require("https");
var axios = require("axios").default;
var config = require("./config");

app.use(express.static(path.join(__dirname + "/public")));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.set("view engine", "ejs");
var workout = [];

app
  .route("/search")
  .get(function (req, res) {
    res.render("search");
  })
  .post(function (req, res) {
    const bodyPart = req.body.bodyPart;
    const equipment = req.body.equipment;
    const target = req.body.target;
    var options = {
      method: "GET",
      url: "https://exercisedb.p.rapidapi.com/exercises",
      headers: {
        "x-rapidapi-host": "exercisedb.p.rapidapi.com",
        "x-rapidapi-key": config.MY_KEY,
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
        res.redirect("/result");
      })
      .catch(function (error) {
        //console.log(options);
        console.error(error);
        res.redirect("/");
      });
  });

app
  .route("/result")
  .get(function (req, res) {
    console.log(workout);
    res.render("results", {
      workout: workout,
    });
  })
  .post(function (req, res) {
    workout = [];
    res.redirect("/search");
  });

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log("Server is listening on: ", port);
});
