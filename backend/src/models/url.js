// models/url.js
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  shortUrl: { type: String, required: true, unique: true },
});

const UrlModel = mongoose.model('Url', urlSchema);

module.exports = UrlModel;
