const express = require('express');
const userAuth = require('../controllers/userAuth');


const router = express.Router();

// Register user
router.post('/register', userAuth.registerUser);

// Login user
router.post('/login',userAuth.loginUser );

// Logout user
// router.post('/logout', userAuth.logoutUser);

module.exports = router;