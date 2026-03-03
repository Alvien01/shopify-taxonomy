require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Raw body capture for webhook HMAC verification ────────────────────────
// This must come BEFORE express.json() to capture the raw body
app.use((req, res, next) => {
    if (req.path.includes('/webhooks/')) {
        let rawData = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => { rawData += chunk; });
        req.on('end', () => {
            req.rawBody = rawData;
            try {
                req.body = JSON.parse(rawData);
            } catch (e) {
                req.body = {};
            }
            next();
        });
    } else {
        next();
    }
});

// ─── Standard Middleware ───────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const kursRoutes = require('./routes/kurs');
const autoCategoryRoutes = require('./routes/autoCategory');

// Route middlewares
app.use('/api/auth', authRoutes);
app.use('/api/kurs', kursRoutes);
app.use('/api/auto-category', autoCategoryRoutes);

// ─── Health check endpoint ────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        app: 'Shopify Kurs App + Auto Categorizer',
        status: 'running',
        version: '2.0.0',
        endpoints: {
            auth: '/api/auth',
            kurs: '/api/kurs',
            autoCategory: {
                description: 'Auto-categorize BrandsGateway products',
                webhooks: {
                    productsCreate: 'POST /api/auto-category/webhooks/products/create',
                    productsUpdate: 'POST /api/auto-category/webhooks/products/update',
                },
                api: {
                    testMatch:      'POST /api/auto-category/test-match',
                    preview:        'GET  /api/auto-category/preview/:productId',
                    categorize:     'POST /api/auto-category/categorize/:productId',
                    bulkCategorize: 'POST /api/auto-category/bulk-categorize?limit=50',
                    stats:          'GET  /api/auto-category/stats',
                }
            }
        }
    });
});

// ─── Start Server ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🚀 Shopify Kurs App + Auto Categorizer');
    console.log(`  ✅ Server running on port ${PORT}`);
    console.log(`  🌐 App URL: ${process.env.APP_URL || `http://localhost:${PORT}`}`);
    console.log('');
    console.log('  📋 Available Endpoints:');
    console.log('  ─────────────────────────────────────────────────────');
    console.log('  POST /api/auto-category/webhooks/products/create');
    console.log('  POST /api/auto-category/webhooks/products/update');
    console.log('  POST /api/auto-category/test-match');
    console.log('  GET  /api/auto-category/preview/:productId');
    console.log('  POST /api/auto-category/categorize/:productId');
    console.log('  POST /api/auto-category/bulk-categorize');
    console.log('  GET  /api/auto-category/stats');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
});
