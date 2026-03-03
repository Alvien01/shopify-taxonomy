const verifyShopifyWebhook = (req, res, next) => {
    // Placeholder - Normally you'd verify using crypto and req.headers['x-shopify-hmac-sha256']
    console.log('Verifying Shopify Request...');
    next();
};

const requireApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== process.env.SHOPIFY_API_KEY) {
        return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
    }
    
    next();
};

module.exports = {
    verifyShopifyWebhook,
    requireApiKey
};
