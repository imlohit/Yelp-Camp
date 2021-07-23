const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Hey there!');
})
app.listen(3000, (req, res) => {
    console.log('Listening from port 3000!!!');
})