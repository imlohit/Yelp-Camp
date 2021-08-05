const express = require("express");
const router = express.Router({ mergeParams: true });
const campGround = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware");

const { reviewSchema } = require("../schemas");

router.post("/", isLoggedin, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
