const express = require("express");
const router = express.Router({ mergeParams: true });
const campGround = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware");

const { reviewSchema } = require("../schemas");

router.post(
  "/",
  isLoggedin,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await campGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    review.save();
    campground.save();
    req.flash("success", "Successfully added a new review");
    res.redirect(`/campground/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await campGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review");
    res.redirect(`/campground/${id}`);
  })
);

module.exports = router;
