const mongoose = require('mongoose');

const UserSettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Using String since testUserId is a string in the current setup
  email: { type: String, default: '' },
  notifyMail: { type: Boolean, default: true },
  notifyPush: { type: Boolean, default: false },
  notifyWeekly: { type: Boolean, default: true },
  name: { type: String, default: 'Milosz' },
  position: { type: String, default: 'Inzynier Systemu' }
});

module.exports = mongoose.model('UserSettings', UserSettingsSchema);
