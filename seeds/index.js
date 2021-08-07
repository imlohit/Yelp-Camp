const mongoose = require("mongoose");
const campGround = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const seedDB = async () => {
  await campGround.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 30);
    const camp = new campGround({
      author: "6107af7e8ce71b3524f5a7ef",
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dj9bnbirn/image/upload/v1628319106/yelpCamp/fwoqd8tynpfrhkgnnh42.jpg",
          filename: "yelpCamp/fwoqd8tynpfrhkgnnh42",
        },
        {
          url: "https://res.cloudinary.com/dj9bnbirn/image/upload/v1628319106/yelpCamp/gfvpp6ci1oey5xwbt6sb.jpg",
          filename: "yelpCamp/gfvpp6ci1oey5xwbt6sb",
        },
      ],

      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia, iste.",
      price: randomPrice,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
