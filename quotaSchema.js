const mongoose = require("mongoose");

const quotaSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  requestsRemaining: {
    type: Number,
    required: true,
    default: 10
  }
});

const Quota = mongoose.model('Quota', quotaSchema);

module.exports = Quota;
