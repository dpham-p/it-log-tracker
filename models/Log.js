const mongoose = require('mongoose');

const LogSchema = mongoose.Schema({
  tech: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  attention: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

LogSchema.index({ '$**': 'text' });

module.exports = mongoose.model('log', LogSchema);
