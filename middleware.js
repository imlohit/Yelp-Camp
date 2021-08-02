module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Must be Signed in first");
    return res.redirect("/login");
  }
  next();
};
