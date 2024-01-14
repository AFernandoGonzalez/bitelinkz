// models/url.js
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Reference to the User model
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date, index: { expires: '1d' }, default: function () {
      return this.user ? null : Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    },
  }, // TTL index set to 1 day
});

const UrlModel = mongoose.model('Url', urlSchema);

module.exports = UrlModel;
