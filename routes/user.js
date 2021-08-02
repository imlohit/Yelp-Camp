const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");

router.get("/register", (req, res) => {
  res.render("user/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        else {
          req.flash("success", "Welcome to Yelpcamp");
          res.redirect("/campground");
        }
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Successfully logged in");
    const redirectUrl = req.session.returnTo || "/campground";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campground");
});
module.exports = router;
