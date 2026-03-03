const express = require('express');
const router = express.Router();

// Install route
router.get('/install', (req, res) => {
    const shop = req.query.shop;
    if (!shop) {
        return res.status(400).send('Missing shop parameter');
    }

    const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SHOPIFY_SCOPES}&redirect_uri=${process.env.APP_URL}/api/auth/callback`;
    
    res.redirect(installUrl);
});

// App callback routing after user authorization
router.get('/callback', async (req, res) => {
    const { shop, hmac, code, state } = req.query;
    
    // 1. Verify HMAC
    // 2. Fetch access token from Shopify 
    // 3. Save to database
    
    res.send(`App successfully installed on ${shop}. You can close this window.`);
});

module.exports = router;
