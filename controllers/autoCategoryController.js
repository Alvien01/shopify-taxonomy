const ShopifyClient = require('../utils/shopifyClient');
const { findBestCategory, generateFashionMetafields } = require('../utils/taxonomyMatcher');

/**
 * Auto-Categorize Controller
 * 
 * Handles webhook events from Shopify when products are created/updated.
 * Automatically assigns taxonomy categories and metafields to products
 * imported by BrandsGateway - FashionDropship.
 */

let shopTokens = {};
if (process.env.SHOPIFY_SHOP_DOMAIN && process.env.SHOPIFY_ACCESS_TOKEN) {
    shopTokens[process.env.SHOPIFY_SHOP_DOMAIN] = process.env.SHOPIFY_ACCESS_TOKEN;
}

/**
 * Set a shop's access token (called during OAuth callback)
 */
function setShopToken(shopDomain, accessToken) {
    shopTokens[shopDomain] = accessToken;
}

/**
 * Get a shop's access token
 */
function getShopToken(shopDomain) {
    return shopTokens[shopDomain] || process.env.SHOPIFY_ACCESS_TOKEN;
}

// ═══════════════════════════════════════════════════════════════════════════
// WEBHOOK HANDLER: products/create
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Handle products/create webhook from Shopify
 * Triggered when BrandsGateway imports a new product.
 * 
 * Flow:
 * 1. Receive product data from webhook
 * 2. Check if product needs categorization (no category assigned yet)
 * 3. Match product to taxonomy category using keywords
 * 4. Update product with category via GraphQL
 * 5. Set category metafields
 */
const handleProductCreated = async (req, res) => {
    try {
        const shopDomain = req.headers['x-shopify-shop-domain'];
        const product = req.body;

        console.log('\n' + '═'.repeat(70));
        console.log(`📦 NEW PRODUCT WEBHOOK: "${product.title}"`);
        console.log(`   Shop: ${shopDomain}`);
        console.log(`   Product ID: ${product.id}`);
        console.log(`   Vendor: ${product.vendor}`);
        console.log(`   Type: ${product.product_type}`);
        console.log(`   Tags: ${product.tags}`);
        console.log('═'.repeat(70));

        // Respond to webhook immediately (Shopify expects 200 within 5s)
        res.status(200).json({ received: true });

        // Process categorization asynchronously
        await processProductCategorization(shopDomain, product);

    } catch (error) {
        console.error('❌ Webhook handler error:', error.message);
        // Still respond 200 to prevent Shopify from retrying
        if (!res.headersSent) {
            res.status(200).json({ received: true, error: error.message });
        }
    }
};

/**
 * Process product categorization (async, after webhook response)
 */
async function processProductCategorization(shopDomain, product) {
    try {
        const accessToken = getShopToken(shopDomain);

        if (!accessToken) {
            console.error(`❌ No access token found for shop: ${shopDomain}`);
            return { success: false, error: 'No access token' };
        }

        const client = new ShopifyClient(shopDomain, accessToken);
        const productGid = `gid://shopify/Product/${product.id}`;

        // Step 1: Check if product already has a category
        let existingProduct;
        try {
            existingProduct = await client.getProduct(productGid);
        } catch (err) {
            console.log('⚠️ Could not fetch product details, proceeding with webhook data');
            existingProduct = null;
        }

        if (existingProduct?.category?.id) {
            console.log(`ℹ️ Product already categorized: "${existingProduct.category.fullName}"`);
            console.log('   Skipping auto-categorization.');
            return { success: true, skipped: true, reason: 'already_categorized' };
        }

        // Step 2: Find the best category match
        const categoryMatch = findBestCategory(product);

        if (!categoryMatch) {
            console.log(`⚠️ No category match found for: "${product.title}"`);
            return { success: false, error: 'no_match' };
        }

        console.log(`\n🏷️  Category Match Found:`);
        console.log(`   Category: ${categoryMatch.fullName}`);
        console.log(`   GID: ${categoryMatch.categoryId}`);
        console.log(`   Match Score: ${categoryMatch.score}`);
        console.log(`   Match Source: ${categoryMatch.source}`);

        // Step 3: Generate metafields
        const metafields = generateFashionMetafields(product, categoryMatch);

        console.log(`   Metafields to set: ${metafields.length}`);
        metafields.forEach(mf => {
            console.log(`     - ${mf.namespace}.${mf.key} = "${mf.value}"`);
        });

        // Step 4: Update product category + metafields
        const updatedProduct = await client.categorizeProduct(
            productGid,
            categoryMatch.categoryId,
            metafields
        );

        console.log(`\n✅ AUTO-CATEGORIZATION COMPLETE`);
        console.log(`   Product: "${updatedProduct.title}"`);
        console.log(`   Category: ${updatedProduct.category?.fullName || 'set'}`);
        console.log('─'.repeat(70) + '\n');

        return {
            success: true,
            product: updatedProduct,
            category: categoryMatch,
            metafieldsSet: metafields.length
        };

    } catch (error) {
        console.error(`❌ Categorization failed for product ${product.id}:`, error.message);
        return { success: false, error: error.message };
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// WEBHOOK HANDLER: products/update
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Handle products/update webhook
 * Re-categorize if product was updated and still has no category
 */
const handleProductUpdated = async (req, res) => {
    try {
        const shopDomain = req.headers['x-shopify-shop-domain'];
        const product = req.body;

        console.log(`🔄 Product Updated: "${product.title}" (ID: ${product.id})`);

        // Respond immediately
        res.status(200).json({ received: true });

        // Only re-categorize if product has no category yet
        // (avoid infinite loop since our own updates also trigger this webhook)
        const accessToken = getShopToken(shopDomain);
        if (!accessToken) return;

        const client = new ShopifyClient(shopDomain, accessToken);
        const existingProduct = await client.getProduct(`gid://shopify/Product/${product.id}`);

        if (!existingProduct?.category?.id) {
            console.log('   No category found, triggering auto-categorization...');
            await processProductCategorization(shopDomain, product);
        } else {
            console.log(`   Already categorized: ${existingProduct.category.fullName}`);
        }

    } catch (error) {
        console.error('❌ Product update handler error:', error.message);
        if (!res.headersSent) {
            res.status(200).json({ received: true });
        }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// MANUAL CATEGORIZATION ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Manually trigger categorization for a specific product
 * POST /api/auto-category/categorize/:productId
 */
const categorizeProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const shopDomain = req.query.shop || process.env.SHOPIFY_SHOP_DOMAIN;
        const accessToken = getShopToken(shopDomain);

        if (!accessToken) {
            return res.status(401).json({ error: 'No access token for shop' });
        }

        const client = new ShopifyClient(shopDomain, accessToken);
        const product = await client.getProduct(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Convert GraphQL product to webhook-like format
        const productData = {
            id: productId.replace('gid://shopify/Product/', ''),
            title: product.title,
            product_type: product.productType,
            vendor: product.vendor,
            tags: product.tags,
            body_html: product.description,
        };

        const result = await processProductCategorization(shopDomain, productData);

        res.json({
            success: result.success,
            product: result.product,
            category: result.category,
            metafieldsSet: result.metafieldsSet,
            error: result.error
        });

    } catch (error) {
        console.error('❌ Manual categorize error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Bulk categorize all uncategorized products
 * POST /api/auto-category/bulk-categorize
 */
const bulkCategorize = async (req, res) => {
    try {
        const shopDomain = req.query.shop || process.env.SHOPIFY_SHOP_DOMAIN;
        const accessToken = getShopToken(shopDomain);

        if (!accessToken) {
            return res.status(401).json({ error: 'No access token for shop' });
        }

        const client = new ShopifyClient(shopDomain, accessToken);

        // Fetch uncategorized products (products without a category)
        const query = `
            query getUncategorizedProducts($first: Int!, $after: String) {
                products(first: $first, after: $after) {
                    edges {
                        node {
                            id
                            title
                            productType
                            vendor
                            tags
                            description
                            category {
                                id
                                name
                                fullName
                            }
                        }
                        cursor
                    }
                    pageInfo {
                        hasNextPage
                    }
                }
            }
        `;

        let hasNextPage = true;
        let after = null;
        let categorizedCount = 0;
        let skippedCount = 0;
        let failedCount = 0;
        let totalProcessed = 0;
        const results = [];
        const maxProducts = parseInt(req.query.limit) || 50;

        console.log('\n' + '═'.repeat(70));
        console.log('🔄 BULK AUTO-CATEGORIZATION STARTED');
        console.log(`   Shop: ${shopDomain}`);
        console.log(`   Max products: ${maxProducts}`);
        console.log('═'.repeat(70));

        while (hasNextPage && totalProcessed < maxProducts) {
            const batchSize = Math.min(25, maxProducts - totalProcessed);
            const data = await client.graphql(query, { first: batchSize, after });
            const products = data.products.edges;

            for (const edge of products) {
                const product = edge.node;
                totalProcessed++;

                // Skip if already categorized
                if (product.category?.id) {
                    skippedCount++;
                    continue;
                }

                // Convert to webhook format
                const productData = {
                    id: product.id.replace('gid://shopify/Product/', ''),
                    title: product.title,
                    product_type: product.productType,
                    vendor: product.vendor,
                    tags: product.tags || [],
                    body_html: product.description,
                };

                const result = await processProductCategorization(shopDomain, productData);

                if (result.success && !result.skipped) {
                    categorizedCount++;
                    results.push({
                        productId: product.id,
                        title: product.title,
                        category: result.category?.fullName,
                        score: result.category?.score
                    });
                } else if (result.error === 'no_match') {
                    failedCount++;
                } else {
                    skippedCount++;
                }

                // Rate limiting: wait 500ms between updates
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            hasNextPage = data.products.pageInfo.hasNextPage;
            if (products.length > 0) {
                after = products[products.length - 1].cursor;
            }
        }

        console.log('\n' + '═'.repeat(70));
        console.log('✅ BULK CATEGORIZATION COMPLETE');
        console.log(`   Total Processed: ${totalProcessed}`);
        console.log(`   Categorized: ${categorizedCount}`);
        console.log(`   Skipped: ${skippedCount}`);
        console.log(`   Failed: ${failedCount}`);
        console.log('═'.repeat(70) + '\n');

        res.json({
            success: true,
            summary: {
                totalProcessed,
                categorized: categorizedCount,
                skipped: skippedCount,
                failed: failedCount
            },
            results
        });

    } catch (error) {
        console.error('❌ Bulk categorize error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Preview categorization for a product (dry run, no updates)
 * GET /api/auto-category/preview/:productId
 */
const previewCategory = async (req, res) => {
    try {
        const { productId } = req.params;
        const shopDomain = req.query.shop || process.env.SHOPIFY_SHOP_DOMAIN;
        const accessToken = getShopToken(shopDomain);

        if (!accessToken) {
            return res.status(401).json({ error: 'No access token for shop' });
        }

        const client = new ShopifyClient(shopDomain, accessToken);
        const product = await client.getProduct(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const productData = {
            id: productId,
            title: product.title,
            product_type: product.productType,
            vendor: product.vendor,
            tags: product.tags || [],
            body_html: product.description,
        };

        const categoryMatch = findBestCategory(productData);
        const metafields = categoryMatch ? generateFashionMetafields(productData, categoryMatch) : [];

        res.json({
            product: {
                id: product.id,
                title: product.title,
                productType: product.productType,
                vendor: product.vendor,
                currentCategory: product.category || null,
            },
            suggestedCategory: categoryMatch,
            suggestedMetafields: metafields,
            alreadyCategorized: !!product.category?.id
        });

    } catch (error) {
        console.error('❌ Preview error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Test the category matcher with sample data (no Shopify connection needed)
 * POST /api/auto-category/test-match
 * Body: { title, product_type, vendor, tags, body_html }
 */
const testMatch = (req, res) => {
    try {
        const product = req.body;

        if (!product.title) {
            return res.status(400).json({ error: 'title is required' });
        }

        const categoryMatch = findBestCategory(product);
        const metafields = categoryMatch ? generateFashionMetafields(product, categoryMatch) : [];

        res.json({
            input: {
                title: product.title,
                product_type: product.product_type,
                vendor: product.vendor,
                tags: product.tags,
            },
            match: categoryMatch,
            metafields
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get categorization stats
 * GET /api/auto-category/stats
 */
const getStats = async (req, res) => {
    try {
        const shopDomain = req.query.shop || process.env.SHOPIFY_SHOP_DOMAIN;
        const accessToken = getShopToken(shopDomain);

        if (!accessToken) {
            return res.status(401).json({ error: 'No access token for shop' });
        }

        const client = new ShopifyClient(shopDomain, accessToken);

        const query = `
            query {
                productsCount {
                    count
                }
            }
        `;

        const data = await client.graphql(query);

        res.json({
            shop: shopDomain,
            totalProducts: data.productsCount.count,
            message: 'Use /api/auto-category/bulk-categorize to categorize uncategorized products'
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    handleProductCreated,
    handleProductUpdated,
    categorizeProduct,
    bulkCategorize,
    previewCategory,
    testMatch,
    getStats,
    setShopToken,
    getShopToken,
};
