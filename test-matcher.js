/**
 * Test script for the taxonomy matcher
 * Run: node test-matcher.js
 */
const { findBestCategory, generateFashionMetafields } = require('./utils/taxonomyMatcher');

const testProducts = [
    {
        title: 'Gucci GG Marmont Small Shoulder Bag',
        product_type: 'bags',
        vendor: 'Gucci',
        tags: ['luxury', 'designer', 'shoulder bag'],
        body_html: 'Small quilted leather shoulder bag with GG hardware'
    },
    {
        title: 'Nike Air Max 90 Sneakers',
        product_type: 'shoes',
        vendor: 'Nike',
        tags: ['sneakers', 'sportswear'],
        body_html: 'Classic Nike sneakers with Air Max cushioning'
    },
    {
        title: 'Balenciaga Triple S Trainer',
        product_type: 'sneakers',
        vendor: 'Balenciaga',
        tags: [],
        body_html: 'Oversized trainer with triple sole design'
    },
    {
        title: 'Prada Re-Nylon Bomber Jacket',
        product_type: 'outerwear',
        vendor: 'Prada',
        tags: ['jacket', 'bomber'],
        body_html: 'Sustainable recycled nylon bomber jacket'
    },
    {
        title: 'Versace Medusa Head Belt',
        product_type: 'belts',
        vendor: 'Versace',
        tags: ['belt', 'accessories'],
        body_html: 'Leather belt with Medusa head buckle'
    },
    {
        title: 'Ray-Ban Aviator Sunglasses',
        product_type: 'sunglasses',
        vendor: 'Ray-Ban',
        tags: ['eyewear'],
        body_html: 'Classic aviator style metal frame sunglasses'
    },
    {
        title: 'Rolex Submariner Watch',
        product_type: 'watches',
        vendor: 'Rolex',
        tags: ['luxury watch'],
        body_html: 'Professional dive watch with date display'
    },
    {
        title: 'Saint Laurent Loulou Small Puffer Chain Bag',
        product_type: 'bags',
        vendor: 'Saint Laurent',
        tags: ['crossbody', 'luxury'],
        body_html: 'Quilted leather crossbody bag with chain strap'
    },
    {
        title: 'Dior Jadore Eau de Parfum',
        product_type: 'fragrance',
        vendor: 'Dior',
        tags: ['perfume'],
        body_html: 'Floral fragrance with notes of jasmine and rose'
    },
    {
        title: 'Burberry Classic Check Scarf',
        product_type: 'scarves',
        vendor: 'Burberry',
        tags: ['scarf', 'cashmere'],
        body_html: 'Cashmere scarf with iconic Burberry check pattern'
    },
    {
        title: 'Valentino Garavani Rockstud Heels',
        product_type: 'shoes',
        vendor: 'Valentino',
        tags: ['heels', 'pumps'],
        body_html: 'Pointed toe pumps with signature rockstud detail'
    },
    {
        title: 'Moncler Maya Puffer Jacket',
        product_type: 'outerwear',
        vendor: 'Moncler',
        tags: ['puffer', 'down jacket'],
        body_html: 'Iconic quilted down puffer jacket'
    },
    {
        title: 'Cartier Love Bracelet',
        product_type: 'jewelry',
        vendor: 'Cartier',
        tags: ['bracelet', 'gold'],
        body_html: '18k gold love bracelet with screwdriver'
    },
    {
        title: 'Louis Vuitton Monogram Wallet',
        product_type: 'wallets',
        vendor: 'Louis Vuitton',
        tags: ['wallet', 'leather goods'],
        body_html: 'Classic monogram canvas long wallet'
    },
    {
        title: 'Dolce & Gabbana Slim Fit Jeans',
        product_type: 'clothing',
        vendor: 'Dolce & Gabbana',
        tags: ['jeans', 'denim'],
        body_html: 'Slim fit stretch denim jeans in dark wash'
    },
];

console.log('\n' + '='.repeat(70));
console.log('  AUTO-CATEGORY MATCHER TEST RESULTS');
console.log('='.repeat(70) + '\n');

let matched = 0;
let failed = 0;

testProducts.forEach((product, i) => {
    const match = findBestCategory(product);
    const metafields = match ? generateFashionMetafields(product, match) : [];

    console.log(`${i + 1}. "${product.title}"`);
    console.log(`   Vendor: ${product.vendor} | Type: ${product.product_type}`);

    if (match) {
        matched++;
        console.log(`   \u2705 Category: ${match.shopifyCategory}`);
        console.log(`   Path: ${match.fullName}`);
        console.log(`   GID: ${match.categoryId}`);
        console.log(`   Score: ${match.score} | Source: ${match.source}`);
        console.log(`   Metafields: ${metafields.length}`);
        metafields.forEach(mf => {
            console.log(`     - ${mf.namespace}.${mf.key} = "${mf.value}" (${mf.type})`);
        });
    } else {
        failed++;
        console.log(`   \u274C No match found`);
    }
    console.log('');
});

console.log('='.repeat(70));
console.log(`  SUMMARY: ${matched}/${testProducts.length} matched, ${failed} failed`);
console.log('='.repeat(70) + '\n');
