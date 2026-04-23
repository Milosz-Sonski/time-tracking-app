const mongoose = require('mongoose');

const TimeRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  actionType: { type: String, enum: ['START', 'STOP'], required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: {
    ipAddress: String,
    deviceInfo: String
  },
  workMode: {
    type: String,
    enum: ['STACJONARNA', 'ZADANIOWA', 'HYBRYDOWA', 'ZDALNA', 'ZMIANOWA', 'NOCNA'],
    default: 'STACJONARNA'
  }
});

module.exports = mongoose.model('TimeRecord', TimeRecordSchema);