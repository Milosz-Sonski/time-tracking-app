const mongoose = require('mongoose');

const TimeRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { type: String, enum: ['START', 'STOP'], required: true },
  // Server-side timestamping: czas jest generowany przez serwer, nie klienta! 
  timestamp: { type: Date, default: Date.now }, 
  metadata: {
    ipAddress: String,
    deviceInfo: String
  }
});

module.exports = mongoose.model('TimeRecord', TimeRecordSchema);