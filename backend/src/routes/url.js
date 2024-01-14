// routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url');
const { requireAuth } = require('../auth/auth');


router.post('/shorten', requireAuth , urlController.shortenUrl);

router.get('/:shortCode', urlController.redirectToOriginalUrl);
router.get('/info/:shortCode', urlController.redirectToOriginalUrlInfo);

module.exports = router;
