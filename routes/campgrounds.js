const express = require("express");
const router = express.Router();
const campGround = require("../models/campground");
const { campgroundSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { isLoggedin } = require("../middleware");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await campGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
router.get("/new", isLoggedin, (req, res) => {
  res.render("campgrounds/new");
});
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await campGround
      .findById({ _id: id })
      .populate("reviews");
    if (!campgrounds) {
      req.flash("error", "Cannot find the campground!!");
      return res.redirect("/campground");
    }
    res.render("campgrounds/show", { campgrounds });
  })
);
router.post(
  "/",
  isLoggedin,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new campGround(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campground/${campground._id}`);
  })
);
router.get(
  "/:id/edit",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await campGround.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find the campground!!");
      return res.redirect("/campground");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedin,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await campGround.findByIdAndUpdate(
      id,
      req.body.campground
    );
    req.flash("success", "Successfully Updated the campground");
    res.redirect(`/campground/${campground._id}`);
  })
);
router.delete(
  "/:id",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletecampground = await campGround.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground");
    res.redirect(`/campground`);
  })
);
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campground");
});
module.exports = router;
