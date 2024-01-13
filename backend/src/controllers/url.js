const UrlModel = require('../models/url');
const validUrl = require('valid-url');
const shortid = require('shortid');

const normalizeUrl = (url) => {
    // If the URL does not start with 'http://' or 'https://', add 'http://'
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url;
    }
    return url;
}

const isValidUrl = (url) => {
    url = normalizeUrl(url);
    return validUrl.isUri(url);
};

const generateShortCode = () => {
    return shortid.generate();
};

const shortenUrl = async (req, res) => {
    const { originalUrl } = req.body;

    // Check if the URL is valid
    if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        // Check if the URL has already been shortened
        let url = await UrlModel.findOne({ originalUrl });

        if (url) {
            return res.status(400).json({ error: 'URL has already been shortened', existingUrl: url });
        }

        // Generate a short code
        const shortCode = generateShortCode();

        // Construct the short URL
        const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

        // Create the URL
        url = new UrlModel({
            originalUrl,
            shortUrl,
            shortCode,
            createdAt: new Date()
        });

        // Save the URL
        await url.save();

        return res.status(201).json(url);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const redirectToOriginalUrl = async (req, res) => {
    const shortCode = req.params.shortCode;

    try {
        // Find the URL in the database based on the short code
        const url = await UrlModel.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Redirect to the original URL
        return res.redirect(url.originalUrl);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const redirectToOriginalUrlInfo = async (req, res) => {
    const shortCode = req.params.shortCode;

    try {
        // Find the URL in the database based on the short code
        const url = await UrlModel.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Return information without redirection
        return res.status(200).json(url);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = { shortenUrl, redirectToOriginalUrl, redirectToOriginalUrlInfo };
