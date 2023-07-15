const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    rec_id:{ type: String, required: true, unique: true},
    user_id:{ type: String, required: true},
    audio_name:{ type: String, required: true},
    audio_file: { type: Buffer, required: true }
})

module.exports = mongoose.model('Recordings',recordSchema);
