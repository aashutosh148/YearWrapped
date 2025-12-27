const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  stravaId: { type: Number, index: true, unique: true },
  athleteId: Number,
  name: String,
  type: String,
  distance: Number,
  moving_time: Number,
  elapsed_time: Number,
  start_date: Date,
  summary_polyline: String,
  raw: Object,
}, { timestamps: true });

module.exports = mongoose.model('UserActivity', ActivitySchema);
