const campGround = require("../models/campground");
module.exports.index = async (req, res) => {
  const campgrounds = await campGround.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new campGround(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new campground");
  res.redirect(`/campground/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campgrounds = await campGround
    .findById({ _id: id })
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campgrounds) {
    req.flash("error", "Cannot find the campground!!");
    return res.redirect("/campground");
  }
  res.render("campgrounds/show", { campgrounds });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await campGround.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find the campground!!");
    return res.redirect("/campground");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await campGround.findByIdAndUpdate(
    id,
    req.body.campground
  );
  req.flash("success", "Successfully Updated the campground");
  res.redirect(`/campground/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const deletecampground = await campGround.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the campground");
  res.redirect(`/campground`);
};
