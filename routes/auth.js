const express = require("express");
const passport = require("passport");
const router = express.Router();
// Auth with Google

//GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

//GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/home");
  }
);

// /auth/login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Logout user
// /auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
