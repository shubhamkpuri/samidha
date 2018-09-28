var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var UserDetail = require("../models/userDetails");

//root route
router.get("/", function(req, res) {
  res.render("index.ejs");
});

// show register form
router.get("/login", function(req, res) {
  res.render("login");
});

//handle sign up logic
router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.email});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      console.log("error");
      return res.render("login");
    }
    console.log("no errors");
    passport.authenticate("local")(req, res, () => {
    res.redirect("/");

    });
  });
});

//handling login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}), function(req, res) {});

// logout route
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out!");
  // res.redirect("/campgrounds");
});

module.exports = router;
