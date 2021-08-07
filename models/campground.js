const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

campgroundSchema.post("findOneAndDelete", async (docs) => {
  if (docs) {
    await Review.deleteMany({
      _id: {
        $in: docs.reviews,
      },
    });
  }
});
module.exports = mongoose.model("Campground", campgroundSchema);
