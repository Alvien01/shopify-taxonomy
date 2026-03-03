const express = require('express');
const router = express.Router();
const autoCategoryController = require('../controllers/autoCategoryController');
const { verifyShopifyWebhookHMAC } = require('../middleware/webhookVerify');
const { requireApiKey } = require('../middleware/auth');

// ═══════════════════════════════════════════════════════════════════════════
// WEBHOOK ROUTES (called by Shopify)
// ═══════════════════════════════════════════════════════════════════════════

// Webhook: products/create - triggered when BrandsGateway imports a new product
router.post('/webhooks/products/create', verifyShopifyWebhookHMAC, autoCategoryController.handleProductCreated);

// Webhook: products/update - triggered when a product is updated
router.post('/webhooks/products/update', verifyShopifyWebhookHMAC, autoCategoryController.handleProductUpdated);

// ═══════════════════════════════════════════════════════════════════════════
// MANUAL / API ROUTES (called by admin or scripts)
// ═══════════════════════════════════════════════════════════════════════════

// Preview category suggestion (dry run, no changes)
// GET /api/auto-category/preview/:productId?shop=mystore.myshopify.com
router.get('/preview/:productId', requireApiKey, autoCategoryController.previewCategory);

// Manually categorize a single product
// POST /api/auto-category/categorize/:productId?shop=mystore.myshopify.com
router.post('/categorize/:productId', requireApiKey, autoCategoryController.categorizeProduct);

// Bulk categorize all uncategorized products
// POST /api/auto-category/bulk-categorize?shop=mystore.myshopify.com&limit=50
router.post('/bulk-categorize', requireApiKey, autoCategoryController.bulkCategorize);

// Test category matching with sample data (no Shopify connection needed)
// POST /api/auto-category/test-match
// Body: { title: "Gucci GG Marmont Bag", product_type: "bags", vendor: "Gucci" }
router.post('/test-match', autoCategoryController.testMatch);

// Get categorization stats
// GET /api/auto-category/stats?shop=mystore.myshopify.com
router.get('/stats', requireApiKey, autoCategoryController.getStats);

module.exports = router;
