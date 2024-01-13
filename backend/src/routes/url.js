// routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url');

const validateUrl = (req, res, next) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }
    // Add more validation if needed
    next();
};

router.post('/shorten', validateUrl, urlController.shortenUrl);
router.get('/:shortCode', urlController.redirectToOriginalUrl);
router.get('/info/:shortCode', urlController.redirectToOriginalUrlInfo);

module.exports = router;
