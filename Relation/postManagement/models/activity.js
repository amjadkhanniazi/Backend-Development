const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  activity: {
    type: String,
    required: true,
  },
  user: {
    type: String, // optional: to track user-related activities
    required: false,
  },
});

const ActivityModel = mongoose.model('Activity', activitySchema);

module.exports = ActivityModel;
