const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const { campgroundSchema, reviewSchema } = require("./schemas");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const campGround = require("./models/campground");
const Review = require("./models/review");
const app = express();

mongoose.connect("mongodb://localhost:27017/yelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campground",
  catchAsync(async (req, res) => {
    const campgrounds = await campGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
app.get("/campground/new", (req, res) => {
  res.render("campgrounds/new");
});
app.get(
  "/campground/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await campGround
      .findById({ _id: id })
      .populate("reviews");
    res.render("campgrounds/show", { campgrounds });
  })
);
app.post(
  "/campground",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new campGround(req.body.campground);
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
  })
);
app.get(
  "/campground/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await campGround.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campground/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await campGround.findByIdAndUpdate(
      id,
      req.body.campground
    );
    res.redirect(`/campground/${campground._id}`);
  })
);
app.delete(
  "/campground/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletecampground = await campGround.findByIdAndDelete(id);
    res.redirect(`/campground`);
  })
);

app.post(
  "/campground/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await campGround.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.save();
    campground.save();
    res.redirect(`/campground/${campground._id}`);
  })
);

app.delete(
  "/campground/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await campGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campground/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) error.message = "Oh no, Something went Wrong!";
  res.status(statusCode).render("error", { err });
});
app.listen(3000, (req, res) => {
  console.log("Listening from port 3000!!!");
});
