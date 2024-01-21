const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        // Check if user exists and the password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Send the token back to the client
        res.json({ message: "User logged in successfully", token, user: ({ _id: user._id, email: user.email }) });
    } catch (error) {
        console.error("Error in loginUser:", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.registerUser = async (req, res) => {

    try {

        // Check if the user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate the password
        const validatePassword = (password) => {
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
            if (!passwordRegex.test(password)) {
                throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
            }
            return password;
        }

        try {
            validatePassword(req.body.password);
        }   catch (error) {
            return res.status(400).json({ message: error.message });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let user = new User({
            ...req.body,
            password: hashedPassword
        });

        // Save user to the database
        const savedUser = await user.save();

        // Create a token for the new user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Send back the user data and token
        res.status(201).json({ message: "User created successfully", user: savedUser, token });
    } catch (error) {
        console.error("Error in registerUser:", error.message);
        res.status(500).json({ message: error.message });
    }
};

