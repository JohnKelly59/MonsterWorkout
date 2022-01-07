const express = require("express");
const Logs = require("../models/Logs");
const router = express.Router();
const { ensureAuthInfo } = require("../middleware/auth");
const mongoose = require("mongoose");
const axios = require("axios").default;

router.get("/log", ensureAuthInfo, function (req, res) {
  console.log(req.user);
  var logs = [];
  let username = req.user.firstName;
  let userid = req.user.id;
  const LogData = Logs.find({ UserId: userid }, function (err, data) {
    // check error
    logs.push(data);
    console.log();
    res.render("log", {
      message: null,
      name: username,
      logs: logs,
    });
    return data;
  });
});

router.post("/addLog", async function (req, res) {
  // retrieves name and email from user
  let title = req.body.newLogTitle;
  let body = req.body.newLogBody;
  const user = req.user.id;
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  console.log(title, body);
  try {
    const newLog = {
      title: title,
      body: body,
      UserId: user,
      date: month + "/" + day + "/" + year,
    };
    //creates new log
    await Logs.create(newLog);
    res.redirect("/log");
  } catch (err) {
    console.error(err);
  }
});

router.post("/removeLog", function (req, res) {
  // get user id
  let userid = req.user.id;
  // get value of remove button
  let removeButton = req.body.removeBtn;
  console.log(removeButton);
  // delete favorite exercise from favorite db
  Logs.deleteOne(
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
        res.redirect("/log");
        return;
      } else {
        res.redirect("/log");
      }
    }
  );
});

router.post("/editLog", async function (req, res) {
    // retrieves name and email from user
    let title = req.body.newLogTitle;
    let editButton = req.data.editBtn;
    let body = req.body.newLogBody;
    const user = req.user.id;
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    console.log(title, body);
    try {
      const filter = {
        title: title,
        body: body,
        UserId: user,
        date: month + "/" + day + "/" + year,
      };

      const
      //creates new log
      await Logs.findOneAndUpdate(new);
      res.redirect("/log");
    } catch (err) {
      console.error(err);
    }
  });

module.exports = router;
