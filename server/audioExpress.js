// Importing express and cors
const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const mongoose = require('mongoose');
const Recordings = require("../models/recordings.models");
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"))

mongoose.connect('mongodb://127.0.0.1:27017/Voice-Notes');

app.get('/api/',function(req, res){
    res.send("Working!");
});

app.get('/api/recordings/',function(req, res){
    res.send("Recordings...");
});






// Listening to server at port 5000
app.listen(5000, function () {
	console.log("server started...\nClick the url to gain access: http://localhost:5000/");
})