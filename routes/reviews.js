const express = require("express");
const router = express.Router({ mergeParams: true });
const campGround = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");

const { reviewSchema } = require("../schemas");
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await campGround.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.save();
    campground.save();
    req.flash("success", "Successfully added a new review");
    res.redirect(`/campground/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await campGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review");
    res.redirect(`/campground/${id}`);
  })
);

module.exports = router;
