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

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campground', async (req, res) => {
    const camp = new campGround({ title: 'My terrace', description: 'gaze at stars' });
    await camp.save();
    res.send(camp);
})
app.listen(3000, (req, res) => {
    console.log('Listening from port 3000!!!');
})