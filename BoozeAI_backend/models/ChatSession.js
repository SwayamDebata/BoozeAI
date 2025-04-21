// models/ChatSession.js
const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: String,
  isMatched: { type: Boolean, default: false },
  matchedWith: { type: String, default: null },
  groupId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now, expires: 180 }
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
