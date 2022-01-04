const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorites");
const { ensureAuthInfo } = require("../middleware/auth");
let mod = require("./random.js");
let array = mod.rworkout;

router.get("/favorites", ensureAuthInfo, function (req, res) {
  let fav = [];
  if (req.user != null) {
    console.log(req.user);
    let fav = [];
    let username = req.user.firstName;
    async function findFavorites() {
      //searches google model in MongoDb atlas
      try {
        let userFav = await Favorite.findOne({ UserId: req.user.id });

        if (userFav) {
          fav.push(userFav);
        } else {
          // cadds new google user model to db
          console.log("Fail");
        }
      } catch (err) {
        console.error(err);
      }
    }
    findFavorites();
    res.render("favorites", { message: null, name: username, fav: fav });
  } else {
    let username = "";
    res.render("favorites", { message: null, name: username, fav: fav });
  }
});

router.post("/favorites", async function (req, res, done) {
  favoriteDataClicked = array.find((element) => element === req.body.button);
  try {
    const newFavorite = {
      bodyPart: favoriteDataClicked.bodyPart,
      equipment: favoriteDataClicked.equipment,
      id: favoriteDataClicked.id,
      gifUrl: favoriteDataClicked.gifUrl,
      name: favoriteDataClicked.name,
      target: favoriteDataClicked.target,
      UserId: req.user.id,
    };

    let user = await Favorite.findOne({ email: email });
    if (user) {
      done(null, user, { message: "User with that email already exist" });
      res.render("register", { message: "User with that email already exist" });
    } else {
      user = await User.create(newNormalUser);
      done(null, user);
      res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
