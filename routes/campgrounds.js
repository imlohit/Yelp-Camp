const express = require("express");
const router = express.Router();
const campGround = require("../models/campground");
const campgrounds = require("../controllers/campgrounds");

const catchAsync = require("../utils/catchAsync");
const { isLoggedin, isAuthor, validateCampground } = require("../middleware");

router.get("/", catchAsync(campgrounds.index));
router.get("/new", isLoggedin, campgrounds.renderNewForm);
router.get("/:id", catchAsync(campgrounds.showCampground));
router.post(
  "/",
  isLoggedin,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);
router.get(
  "/:id/edit",
  isLoggedin,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

router.put(
  "/:id",
  isLoggedin,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);
router.delete(
  "/:id",
  isAuthor,
  isLoggedin,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
