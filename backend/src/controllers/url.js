const UrlModel = require('../models/url');
const validUrl = require('valid-url');
const shortid = require('shortid');
const qr = require('qrcode');

// const normalizeUrl = (url) => {
//     // If the URL does not start with 'http://' or 'https://', add 'http://'
//     if (!url.startsWith('http://') && !url.startsWith('https://')) {
//         url = 'http://' + url;
//     }
//     return url;
// }

const isValidUrl = (url) => {
    // url = normalizeUrl(url);
    return validUrl.isUri(url);
};

const generateShortCode = () => {
    return shortid.generate();
};


const shortenUrl = async (req, res) => {
    const { originalUrl } = req.body;
    const userId = req.userId;
    const guestUserId = req.headers['guest-user-id'];

    console.log('guestUserId', guestUserId);

    if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ error: 'Invalid URL It should start with HTTP or HTTPS' });
    }

    const isBaseUrl = process.env.BASE_URL;
    if (originalUrl.startsWith(isBaseUrl)) {
        return res.status(400).json({ error: `URL cannot contain ${isBaseUrl}` });
    }

    try {
        let existingUrl;

        if (userId) {
            existingUrl = await UrlModel.findOne({ user: userId, originalUrl });
        } else {
            existingUrl = await UrlModel.findOne({ user: null, originalUrl, guestUserId });
        }

        let MAX_URLS = 5;

        let totalUrls = await UrlModel.find({ user: null, guestUserId });

        if (totalUrls.length >= MAX_URLS) {
            return res.status(400).json({ error: 'You have reached the maximum number of URLs' });
        }

        if (existingUrl && userId) {
            // If the URL already exists, return the existing short URL
            return res.status(200).json({ url: existingUrl, qrCode: null });
        }

        // Generate a short code
        const shortCode = generateShortCode();
        // Construct the shortened URL
        const shortenedUrl = `${process.env.BASE_URL}/${shortCode}`;
        console.log('shortenedUrl', process.env.BASE_URL);

        // Generate QR code
        const qrCodeData = `${process.env.BASE_URL}/${shortCode}`;
        const qrCode = await qr.toDataURL(qrCodeData);

        // Parse expiration date if provided
        const expirationDate = req.body.expiresAt ? new Date(req.body.expiresAt) : null;

        // Create a new URL document
        const newUrl = new UrlModel({
            originalUrl,
            shortCode,
            shortUrl: shortenedUrl,
            user: userId || null,
            guestUserId: guestUserId || null,
            qrCode,
            expiresAt: expirationDate
        });

        // Save the new URL document to the database
        await newUrl.save();

        // Return the shortened URL and QR code data in the response
        return res.status(201).json(newUrl);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};


const redirectToOriginalUrl = async (req, res) => {
    const shortCode = req.params.shortCode;

    try {
        // Find the URL in the database based on the short code
        const url = await UrlModel.findOneAndUpdate({ shortCode }, { $inc: { visits: 1 } }, { new: true });

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Check if the URL has expired
        if (url.expiresAt && new Date() > url.expiresAt) {
            return res.status(400).json({ error: 'URL has expired' });
        }

        // Redirect to the original URL
        return res.redirect(url.originalUrl);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const shortUrlByUser = async (req, res) => {
    const userId = req.userId;
    const guestUserId = req.headers['guest-user-id'];
    console.log('backend : guestUserId', guestUserId);

    try {
        let urls;

        if (userId) {
            urls = await UrlModel.find({ user: userId });
        } else {
            urls = await UrlModel.find({ user: null, guestUserId });
        }

        if (!urls) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Return information without redirection
        return res.status(200).json(urls);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

const updateUrl = async (req, res) => {
    const { urlId } = req.params;
    const { originalUrl, expiresAt } = req.body;
    const userId = req.userId;

    if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const url = await UrlModel.findOne({ _id: urlId, user: userId});

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

    


        url.originalUrl = originalUrl;

        // Parse expiration date if provided
        const newExpiresAt = expiresAt ? new Date(expiresAt) : null;

        // Update the expiration date
        url.expiresAt = newExpiresAt;

        await url.save();

        return res.status(200).json(url);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

const deleteUrl = async (req, res) => {
    const { urlId } = req.params;
    const userId = req.userId;

    try {

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const url = await UrlModel.findOne({ _id: urlId, user: userId });

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Check if the URL has expired and delete it
        if(url.expiresAt && new Date() > url.expiresAt) {
            await url.deleteOne();
            return res.status(400).json({ error: 'URL has expired' });
        }

        await url.deleteOne();

        return res.status(200).json({ message: 'URL deleted successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};  


const bulkDeleteUrls = async (req, res) => {
    const { urlIds } = req.body;
    const userId = req.userId;

    console.log('urlIds', urlIds);

    try {
        // Ensure user is authenticated
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Extract _id values from the array of objects
        const extractedIds = urlIds.map((url) => url._id);

        // Find and delete URLs based on the provided IDs
        const deletedUrls = await UrlModel.deleteMany({ _id: { $in: extractedIds }, user: userId });

        if (deletedUrls.deletedCount === 0) {
            return res.status(404).json({ error: 'URLs not found or not authorized' });
        }

        return res.status(200).json({ message: 'URLs deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};




module.exports = { shortenUrl, redirectToOriginalUrl, shortUrlByUser, updateUrl, deleteUrl, bulkDeleteUrls };
