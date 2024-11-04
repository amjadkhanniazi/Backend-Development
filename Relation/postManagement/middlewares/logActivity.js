const ActivityModel = require('../models/activity'); // adjust path as needed

async function logActivity(activity, user = null) {
  try {
    await ActivityModel.create({ activity, user });
    console.log('Activity logged:', activity);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

module.exports = logActivity;
