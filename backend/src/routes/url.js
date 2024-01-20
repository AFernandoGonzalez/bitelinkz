// routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url');
const { requireAuth } = require('../auth/auth');


router.get('/:shortCode', urlController.redirectToOriginalUrl);
router.get('/info/userUrls', requireAuth , urlController.shortUrlByUser);
router.post('/shorten', requireAuth , urlController.shortenUrl);
router.put('/update/:urlId', requireAuth, urlController.updateUrl);
router.post('/delete/bulkDelete', requireAuth, urlController.bulkDeleteUrls);
router.delete('/delete/:urlId', requireAuth, urlController.deleteUrl);


module.exports = router;
