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



app.get('/', function (req, res) {
  res.send('Welcome to Audio Express!');
});

app.get('/api/', function (req, res) {
  res.send('Working!');
});

app.get('/api/recordings/', async function (req, res) {
  try {
    const recordings = await Recordings.find();
    res.status(200).json(recordings);
  } catch (error) {
    console.error('Failed to fetch recordings', error);
    res.status(500).json({ message: 'Failed to fetch recordings' });
  }
});


app.post('/api/recordings/', async function (req, res) {
  const { rec_id, user_id, audio_name, audio_file, duration } = req.body;

  try {
    const recording = new Recordings({
      rec_id,
      user_id,
      audio_name,
      audio_file,
      duration
    });

    await recording.save();

    res.status(201).json({ message: 'Recording saved successfully' });
  } catch (error) {
    console.error('Failed to save recording', error);
    res.status(500).json({ message: 'Failed to save recording' });
  }
});

// Listening to server at port 5000
app.listen(8080, function () {
  console.log('server started...\nClick the url to gain access: http://localhost:8080/');
});