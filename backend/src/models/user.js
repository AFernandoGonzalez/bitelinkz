// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, // Trims whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // Converts to lowercase
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
