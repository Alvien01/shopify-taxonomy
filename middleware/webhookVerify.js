const crypto = require('crypto');

/**
 * Verify Shopify webhook HMAC signature
 * Ensures the webhook actually came from Shopify
 */
const verifyShopifyWebhookHMAC = (req, res, next) => {
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET || process.env.SHOPIFY_API_SECRET;

    if (!hmacHeader) {
        console.warn('⚠️ Webhook received without HMAC header');
        // In development, allow requests without HMAC
        if (process.env.NODE_ENV === 'development' || process.env.SKIP_WEBHOOK_VERIFY === 'true') {
            return next();
        }
        return res.status(401).json({ error: 'Missing HMAC signature' });
    }

    if (!secret) {
        console.error('❌ SHOPIFY_API_SECRET not configured');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // req.rawBody must be available (set via express middleware)
    const rawBody = req.rawBody;
    if (!rawBody) {
        console.error('❌ rawBody not available - ensure raw body middleware is configured');
        // Fallback: skip verification in development
        if (process.env.NODE_ENV === 'development') {
            return next();
        }
        return res.status(400).json({ error: 'Raw body not available for verification' });
    }

    const generatedHmac = crypto
        .createHmac('sha256', secret)
        .update(rawBody, 'utf8')
        .digest('base64');

    const isValid = crypto.timingSafeEqual(
        Buffer.from(hmacHeader),
        Buffer.from(generatedHmac)
    );

    if (!isValid) {
        console.error('❌ Invalid webhook HMAC signature');
        return res.status(401).json({ error: 'Invalid HMAC signature' });
    }

    console.log('✅ Webhook HMAC verified');
    next();
};

module.exports = { verifyShopifyWebhookHMAC };
