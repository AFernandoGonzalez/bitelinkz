// authMiddleware.js
const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
    try {
        const tokenHeader = req.headers.authorization;

        if (!tokenHeader) {
            // If no Authorization header is provided, treat the user as non-logged-in
            req.userId = null;
            console.log('No Authorization header provided. User is treated as non-logged-in.');
            return next();
        }

        const token = tokenHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        console.log('User authenticated. UserId:', req.userId);

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};
