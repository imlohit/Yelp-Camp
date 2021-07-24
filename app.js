const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const campGround = require('./models/campground');
const app = express();

mongoose.connect('mongodb://localhost:27017/yelpCamp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campground', async (req, res) => {
    const campgrounds = await campGround.find({});
    res.render('campgrounds/index', { campgrounds });
});
app.get('/campground/new', (req, res) => {
    res.render('campgrounds/new');
})
app.get('/campground/:id', async (req, res) => {
    const { id } = req.params;
    const campgrounds = await campGround.findById({ _id: id });
    res.render('campgrounds/show', { campgrounds });
});
app.post('/campground', async (req, res) => {
    const campground = new campGround(req.body.campground);
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
})

app.listen(3000, (req, res) => {
    console.log('Listening from port 3000!!!');
})