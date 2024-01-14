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
    const { originalUrl, ttl } = req.body;
    const userId = req.userId; // Use req.userId, which is set by the authentication middleware

    // Check if the URL is valid
    if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        let userUrl;

        // Check if the user is logged in
        if (userId) {
            // If logged in, find the URL for the logged-in user
            userUrl = await UrlModel.findOne({ user: userId, originalUrl });

            // If the URL is found, return it
            if (userUrl) {
                return res.status(200).json(userUrl);
            }else {
                // If the URL is not found, create a new one
                const shortCode = generateShortCode();
                const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
                const url = new UrlModel({
                    user: userId,
                    originalUrl,
                    shortUrl,
                    shortCode,
                    ttl,
                });
                await url.save();
                return res.status(201).json(url);
            }
        } else {
            // If not logged in, find the URL for non-logged-in users
            userUrl = await UrlModel.findOne({ user: null, originalUrl });

            // If the URL is found, return it
            if (userUrl) {
                return res.status(200).json(userUrl);
            } else {
                // If the URL is not found, create a new one
                const shortCode = generateShortCode();
                const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
                const url = new UrlModel({
                    user: null,
                    originalUrl,
                    shortUrl,
                    shortCode,
                    ttl,
                });
                await url.save();
                return res.status(201).json(url);
            }
        }


    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
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
