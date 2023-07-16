const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const mongoose = require('mongoose');
const Recordings = require("../models/recordings.models");
const app = express();
const multer = require('multer');
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"))

//mongoose.connect('mongodb://127.0.0.1:27017/Voice-Notes');

// Configure Multer
const upload = multer({ dest: 'uploads/' }); // Specify the destination folder for uploaded files

app.get('/api/', function (req, res) {
  res.send('Working!');
});

app.get('/api/recordings/', function (req, res) {
  res.send('Recordings...\n');
});

app.post('/api/recordings/', upload.single('audio_file'), function (req, res) {
  console.log('Received audio file:', req.file); // Log the received file

  // Save the received file to MongoDB or perform other operations

  res.send(req.file); // Send a success response
});

// Listening to server at port 5000
app.listen(8080, function () {
  console.log('server started...\nClick the url to gain access: http://localhost:8080/');
});