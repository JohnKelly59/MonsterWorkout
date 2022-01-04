// checks to see if user is logged in or not
module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      return next();
    }
  },
  ensureAuthInfo: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
};
