const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  deviceId: String,
  lat: Number,
  lng: Number,
  speed: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Location', locationSchema);

