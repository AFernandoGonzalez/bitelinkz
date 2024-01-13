// Import required modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.DB_CLUSTER_ID}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = connectDB;
