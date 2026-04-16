const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  otp:        { type: String, required: true },
  expiresAt:  { type: Date,   required: true }
});

// TTL index: MongoDB auto-deletes the document once expiresAt is passed
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OtpStore", otpSchema);
