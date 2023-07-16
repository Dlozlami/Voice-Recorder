const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    rec_id:{ type: String, required: true, unique: true},
    user_id:{ type: String, required: true},
    audio_name:{ type: String, required: true, unique: true},
    audio_file: { type: Object, required: true },
    duration:{ type: String, required: true},
})

module.exports = mongoose.model('Recordings',recordSchema);
