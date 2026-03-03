/**
 * Shopify Standard Product Taxonomy Matcher
 * Maps fashion product keywords to Shopify Taxonomy Category GIDs
 * 
 * Based on: https://shopify.github.io/product-taxonomy/releases/2025-12/
 * 
 * BrandsGateway imports fashion products (clothing, shoes, bags, accessories, etc.)
 * This matcher uses product title, type, vendor keywords to find the best category.
 */

// ─── FASHION TAXONOMY CATEGORY MAP ──────────────────────────────────────────
// Each entry: keyword patterns -> { categoryId (GID), fullName, metafields[] }
// GIDs are from Shopify Standard Product Taxonomy

const CATEGORY_RULES = [
    // ═══════════════════════════════════════════════════════════════
    // BAGS & LUGGAGE
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['backpack', 'rucksack'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-3-1',
        fullName: 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags',
        shopifyCategory: 'Backpacks',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Backpack', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['tote bag', 'tote', 'shopping bag'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-5-5-1',
        fullName: 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags',
        shopifyCategory: 'Tote Bags',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Tote Bag', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['crossbody', 'cross body', 'cross-body', 'messenger bag'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-5-5-1',
        fullName: 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags',
        shopifyCategory: 'Cross Body Bags',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Crossbody Bag', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['shoulder bag'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-5-5-1',
        fullName: 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags',
        shopifyCategory: 'Shoulder Bags',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Shoulder Bag', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['clutch', 'evening bag', 'minaudiere'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-5-5-1',
        fullName: 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags',
        shopifyCategory: 'Clutch Bags',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Clutch Bag', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['handbag', 'hand bag', 'purse', 'satchel'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-5-5-1',
        fullName: 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags',
        shopifyCategory: 'Handbags',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Handbag', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['duffel', 'duffle', 'gym bag', 'weekender bag', 'travel bag'],
        categoryId: 'gid://shopify/TaxonomyCategory/lb-6',
        fullName: 'Luggage & Bags > Duffel Bags',
        shopifyCategory: 'Duffel Bags',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Duffel Bag', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['belt bag', 'bum bag', 'fanny pack', 'waist bag', 'hip bag'],
        categoryId: 'gid://shopify/TaxonomyCategory/lb-7',
        fullName: 'Luggage & Bags > Fanny Packs',
        shopifyCategory: 'Fanny Packs',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Belt Bag', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // WALLETS & SMALL LEATHER GOODS
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['wallet', 'billfold', 'card holder', 'cardholder', 'card case', 'money clip'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-5-5-2',
        fullName: 'Apparel & Accessories > Handbags, Wallets & Cases > Wallets & Money Clips',
        shopifyCategory: 'Wallets & Money Clips',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Wallet', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['coin purse', 'key case', 'key holder', 'key pouch'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-5-5-2',
        fullName: 'Apparel & Accessories > Handbags, Wallets & Cases > Wallets & Money Clips',
        shopifyCategory: 'Wallets & Money Clips',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Small Leather Good', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // SHOES / FOOTWEAR
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['sneaker', 'sneakers', 'trainer', 'trainers', 'running shoe'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-8-8',
        fullName: 'Apparel & Accessories > Shoes > Sneakers',
        shopifyCategory: 'Sneakers',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Sneakers', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['boot', 'boots', 'ankle boot', 'chelsea boot', 'combat boot', 'hiking boot'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-8-3',
        fullName: 'Apparel & Accessories > Shoes > Boots',
        shopifyCategory: 'Boots',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Boots', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['sandal', 'sandals', 'flip flop', 'slide', 'slides'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-8-6',
        fullName: 'Apparel & Accessories > Shoes > Sandals',
        shopifyCategory: 'Sandals',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Sandals', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['heel', 'heels', 'pump', 'pumps', 'stiletto'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-8-5',
        fullName: 'Apparel & Accessories > Shoes > Heels',
        shopifyCategory: 'Heels',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Heels', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['loafer', 'loafers', 'moccasin', 'moccasins', 'flat', 'flats', 'ballet flat', 'espadrille'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-8-4',
        fullName: 'Apparel & Accessories > Shoes > Flats',
        shopifyCategory: 'Flats',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Flats', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['slipper', 'slippers'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-8-7',
        fullName: 'Apparel & Accessories > Shoes > Slippers',
        shopifyCategory: 'Slippers',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Slippers', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['athletic shoe', 'sport shoe', 'running shoe'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-8-1',
        fullName: 'Apparel & Accessories > Shoes > Athletic Shoes',
        shopifyCategory: 'Athletic Shoes',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Athletic Shoes', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CLOTHING – TOPS
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['t-shirt', 'tshirt', 't shirt', 'tee'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-3-10',
        fullName: 'Apparel & Accessories > Clothing > Clothing Tops > T-Shirts',
        shopifyCategory: 'T-Shirts',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'T-Shirt', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['polo', 'polo shirt'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-3-7',
        fullName: 'Apparel & Accessories > Clothing > Clothing Tops > Polos',
        shopifyCategory: 'Polos',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Polo', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['shirt', 'button-down', 'button down', 'dress shirt', 'oxford'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-3-8',
        fullName: 'Apparel & Accessories > Clothing > Clothing Tops > Shirts',
        shopifyCategory: 'Shirts',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Shirt', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['blouse'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-3-1',
        fullName: 'Apparel & Accessories > Clothing > Clothing Tops > Blouses',
        shopifyCategory: 'Blouses',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Blouse', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['sweater', 'jumper', 'pullover', 'knitwear', 'knit'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-3-9',
        fullName: 'Apparel & Accessories > Clothing > Clothing Tops > Sweaters',
        shopifyCategory: 'Sweaters',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Sweater', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['hoodie', 'hoody', 'hooded'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-3-4',
        fullName: 'Apparel & Accessories > Clothing > Clothing Tops > Hoodies',
        shopifyCategory: 'Hoodies',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Hoodie', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['sweatshirt', 'crew neck', 'crewneck'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-3-10-1',
        fullName: 'Apparel & Accessories > Clothing > Clothing Tops > Sweatshirts',
        shopifyCategory: 'Sweatshirts',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Sweatshirt', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['cardigan'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-3-3',
        fullName: 'Apparel & Accessories > Clothing > Clothing Tops > Cardigans',
        shopifyCategory: 'Cardigans',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Cardigan', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['tank top', 'vest top', 'camisole'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-3-11',
        fullName: 'Apparel & Accessories > Clothing > Clothing Tops > Tank Tops',
        shopifyCategory: 'Tank Tops',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Tank Top', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CLOTHING – BOTTOMS
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['jeans', 'denim pant', 'denim jean'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-11-3',
        fullName: 'Apparel & Accessories > Clothing > Pants > Jeans',
        shopifyCategory: 'Jeans',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Jeans', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['trouser', 'trousers', 'chino', 'chinos', 'pant', 'pants', 'slacks'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-11-7',
        fullName: 'Apparel & Accessories > Clothing > Pants > Trousers',
        shopifyCategory: 'Trousers',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Trousers', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['jogger', 'joggers', 'sweatpant', 'sweatpants', 'track pant'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-11-5',
        fullName: 'Apparel & Accessories > Clothing > Pants > Joggers',
        shopifyCategory: 'Joggers',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Joggers', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['legging', 'leggings'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-11-6',
        fullName: 'Apparel & Accessories > Clothing > Pants > Leggings',
        shopifyCategory: 'Leggings',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Leggings', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['shorts', 'short'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-12',
        fullName: 'Apparel & Accessories > Clothing > Shorts',
        shopifyCategory: 'Shorts',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Shorts', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['skirt'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-13',
        fullName: 'Apparel & Accessories > Clothing > Skirts',
        shopifyCategory: 'Skirts',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Skirt', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CLOTHING – DRESSES
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['dress', 'gown', 'maxi dress', 'mini dress', 'midi dress', 'cocktail dress'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-4',
        fullName: 'Apparel & Accessories > Clothing > Dresses',
        shopifyCategory: 'Dresses',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Dress', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CLOTHING – OUTERWEAR
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['jacket', 'blazer', 'sport coat', 'bomber', 'parka', 'windbreaker', 'anorak', 'gilet'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-9-2',
        fullName: 'Apparel & Accessories > Clothing > Outerwear > Coats & Jackets',
        shopifyCategory: 'Coats & Jackets',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Jacket', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['coat', 'overcoat', 'trench coat', 'peacoat', 'topcoat', 'raincoat', 'duster'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-9-2',
        fullName: 'Apparel & Accessories > Clothing > Outerwear > Coats & Jackets',
        shopifyCategory: 'Coats & Jackets',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Coat', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['down jacket', 'puffer', 'puffer jacket', 'padded jacket', 'quilted jacket'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-9-2',
        fullName: 'Apparel & Accessories > Clothing > Outerwear > Coats & Jackets',
        shopifyCategory: 'Coats & Jackets',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Puffer Jacket', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['vest', 'waistcoat'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-9-5',
        fullName: 'Apparel & Accessories > Clothing > Outerwear > Vests',
        shopifyCategory: 'Vests',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Vest', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CLOTHING – SUITS
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['suit', 'tuxedo'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-17',
        fullName: 'Apparel & Accessories > Clothing > Suits',
        shopifyCategory: 'Suits',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Suit', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CLOTHING – SWIMWEAR
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['swimwear', 'swimsuit', 'bikini', 'swim trunk', 'swim short', 'bathing suit'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-18',
        fullName: 'Apparel & Accessories > Clothing > Swimwear',
        shopifyCategory: 'Swimwear',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Swimwear', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CLOTHING – UNDERWEAR & LINGERIE
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['underwear', 'boxer', 'briefs', 'underpants'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-7',
        fullName: 'Apparel & Accessories > Clothing > Men\'s Undergarments',
        shopifyCategory: 'Men\'s Undergarments',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Underwear', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['bra', 'lingerie', 'bodysuit'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-5',
        fullName: 'Apparel & Accessories > Clothing > Lingerie',
        shopifyCategory: 'Lingerie',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Lingerie', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CLOTHING – SLEEPWEAR
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['pajama', 'pyjama', 'nightwear', 'robe', 'bathrobe', 'loungewear', 'sleepwear'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-15',
        fullName: 'Apparel & Accessories > Clothing > Sleepwear & Loungewear',
        shopifyCategory: 'Sleepwear & Loungewear',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Sleepwear', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CLOTHING – SOCKS
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['sock', 'socks'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-16',
        fullName: 'Apparel & Accessories > Clothing > Socks',
        shopifyCategory: 'Socks',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Socks', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CLOTHING – ACTIVEWEAR
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['tracksuit', 'track suit', 'athleisure', 'activewear', 'sportswear'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-1-1',
        fullName: 'Apparel & Accessories > Clothing > Activewear',
        shopifyCategory: 'Activewear',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Activewear', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // ACCESSORIES – BELTS
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['belt'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-2-6',
        fullName: 'Apparel & Accessories > Clothing Accessories > Belts',
        shopifyCategory: 'Belts',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Belt', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // ACCESSORIES – HATS & HEADWEAR
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['hat', 'cap', 'beanie', 'beret', 'fedora', 'bucket hat', 'visor', 'headband'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-2-19',
        fullName: 'Apparel & Accessories > Clothing Accessories > Hats',
        shopifyCategory: 'Hats',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Hat', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // ACCESSORIES – SCARVES
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['scarf', 'scarves', 'shawl', 'stole', 'wrap', 'pashmina', 'poncho'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-2-27',
        fullName: 'Apparel & Accessories > Clothing Accessories > Scarves & Shawls',
        shopifyCategory: 'Scarves & Shawls',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Scarf', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // ACCESSORIES – GLOVES
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['glove', 'gloves', 'mitten', 'mittens'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-2-14',
        fullName: 'Apparel & Accessories > Clothing Accessories > Gloves & Mittens',
        shopifyCategory: 'Gloves & Mittens',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Gloves', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // ACCESSORIES – TIES
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['tie', 'necktie', 'bow tie', 'bowtie'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-2-24',
        fullName: 'Apparel & Accessories > Clothing Accessories > Neckties',
        shopifyCategory: 'Neckties',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Tie', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // ACCESSORIES – SUNGLASSES & EYEWEAR
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['sunglasses', 'sunglass', 'eyewear', 'glasses', 'optical', 'spectacles'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-2-28',
        fullName: 'Apparel & Accessories > Clothing Accessories > Sunglasses',
        shopifyCategory: 'Sunglasses',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Sunglasses', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // JEWELRY
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['necklace', 'chain necklace', 'pendant necklace', 'choker'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-6-8',
        fullName: 'Apparel & Accessories > Jewelry > Necklaces',
        shopifyCategory: 'Necklaces',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Necklace', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['bracelet', 'bangle', 'cuff bracelet'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-6-3',
        fullName: 'Apparel & Accessories > Jewelry > Bracelets',
        shopifyCategory: 'Bracelets',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Bracelet', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['earring', 'earrings', 'ear ring', 'stud earring', 'hoop earring', 'drop earring'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-6-6',
        fullName: 'Apparel & Accessories > Jewelry > Earrings',
        shopifyCategory: 'Earrings',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Earrings', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['ring', 'signet ring', 'engagement ring', 'cocktail ring'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-6-9',
        fullName: 'Apparel & Accessories > Jewelry > Rings',
        shopifyCategory: 'Rings',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Ring', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['brooch', 'pin', 'lapel pin'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-6-4',
        fullName: 'Apparel & Accessories > Jewelry > Brooches & Lapel Pins',
        shopifyCategory: 'Brooches & Lapel Pins',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Brooch', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['charm', 'pendant'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-6-5',
        fullName: 'Apparel & Accessories > Jewelry > Charms & Pendants',
        shopifyCategory: 'Charms & Pendants',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Charm/Pendant', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // WATCHES
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['watch', 'wristwatch', 'timepiece', 'chronograph'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-6-12',
        fullName: 'Apparel & Accessories > Jewelry > Watches',
        shopifyCategory: 'Watches',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Watch', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // COSMETICS & BEAUTY
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['perfume', 'fragrance', 'eau de toilette', 'eau de parfum', 'cologne', 'edt', 'edp'],
        categoryId: 'gid://shopify/TaxonomyCategory/hb-3-2',
        fullName: 'Health & Beauty > Personal Care > Cosmetics',
        shopifyCategory: 'Fragrances',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Fragrance', type: 'single_line_text_field' }
        ]
    },
    {
        keywords: ['lipstick', 'mascara', 'foundation', 'concealer', 'eyeshadow', 'makeup', 'cosmetic'],
        categoryId: 'gid://shopify/TaxonomyCategory/hb-3-2',
        fullName: 'Health & Beauty > Personal Care > Cosmetics',
        shopifyCategory: 'Cosmetics',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Cosmetics', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // TRAVEL / LUGGAGE
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['suitcase', 'luggage', 'trolley', 'cabin bag', 'carry-on'],
        categoryId: 'gid://shopify/TaxonomyCategory/lb-13',
        fullName: 'Luggage & Bags > Suitcases',
        shopifyCategory: 'Suitcases',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Suitcase', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // KEYCHAINS & SMALL ACCESSORIES
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['keychain', 'key chain', 'keyring', 'key ring', 'key fob'],
        categoryId: 'gid://shopify/TaxonomyCategory/aa-4-1',
        fullName: 'Apparel & Accessories > Handbag & Wallet Accessories > Keychains',
        shopifyCategory: 'Keychains',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Keychain', type: 'single_line_text_field' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // PHONE CASES & TECH ACCESSORIES
    // ═══════════════════════════════════════════════════════════════
    {
        keywords: ['phone case', 'iphone case', 'smartphone case', 'mobile case', 'phone cover'],
        categoryId: 'gid://shopify/TaxonomyCategory/el-7-4-13',
        fullName: 'Electronics > Electronics Accessories > Computer Accessories > Handheld Device Accessories',
        shopifyCategory: 'Phone Cases',
        metafields: [
            { namespace: 'custom', key: 'product_type_detail', value: 'Phone Case', type: 'single_line_text_field' }
        ]
    },
];

// ─── FALLBACK: Product Type Based Matching ──────────────────────────────────
// Maps BrandsGateway product types to categories
const PRODUCT_TYPE_MAP = {
    'bags': { categoryId: 'gid://shopify/TaxonomyCategory/aa-5-5-1', fullName: 'Handbags' },
    'handbags': { categoryId: 'gid://shopify/TaxonomyCategory/aa-5-5-1', fullName: 'Handbags' },
    'wallets': { categoryId: 'gid://shopify/TaxonomyCategory/aa-5-5-2', fullName: 'Wallets & Money Clips' },
    'shoes': { categoryId: 'gid://shopify/TaxonomyCategory/aa-8-8', fullName: 'Sneakers' },
    'sneakers': { categoryId: 'gid://shopify/TaxonomyCategory/aa-8-8', fullName: 'Sneakers' },
    'boots': { categoryId: 'gid://shopify/TaxonomyCategory/aa-8-3', fullName: 'Boots' },
    'clothing': { categoryId: 'gid://shopify/TaxonomyCategory/aa-1', fullName: 'Clothing' },
    'tops': { categoryId: 'gid://shopify/TaxonomyCategory/aa-1-3', fullName: 'Clothing Tops' },
    'bottoms': { categoryId: 'gid://shopify/TaxonomyCategory/aa-1-11', fullName: 'Pants' },
    'dresses': { categoryId: 'gid://shopify/TaxonomyCategory/aa-1-4', fullName: 'Dresses' },
    'outerwear': { categoryId: 'gid://shopify/TaxonomyCategory/aa-1-9', fullName: 'Outerwear' },
    'jackets': { categoryId: 'gid://shopify/TaxonomyCategory/aa-1-9-2', fullName: 'Coats & Jackets' },
    'coats': { categoryId: 'gid://shopify/TaxonomyCategory/aa-1-9-2', fullName: 'Coats & Jackets' },
    'accessories': { categoryId: 'gid://shopify/TaxonomyCategory/aa-2', fullName: 'Clothing Accessories' },
    'sunglasses': { categoryId: 'gid://shopify/TaxonomyCategory/aa-2-28', fullName: 'Sunglasses' },
    'eyewear': { categoryId: 'gid://shopify/TaxonomyCategory/aa-2-28', fullName: 'Sunglasses' },
    'jewelry': { categoryId: 'gid://shopify/TaxonomyCategory/aa-6', fullName: 'Jewelry' },
    'watches': { categoryId: 'gid://shopify/TaxonomyCategory/aa-6-12', fullName: 'Watches' },
    'belts': { categoryId: 'gid://shopify/TaxonomyCategory/aa-2-6', fullName: 'Belts' },
    'scarves': { categoryId: 'gid://shopify/TaxonomyCategory/aa-2-27', fullName: 'Scarves & Shawls' },
    'hats': { categoryId: 'gid://shopify/TaxonomyCategory/aa-2-19', fullName: 'Hats' },
    'fragrance': { categoryId: 'gid://shopify/TaxonomyCategory/hb-3-2', fullName: 'Cosmetics' },
    'perfume': { categoryId: 'gid://shopify/TaxonomyCategory/hb-3-2', fullName: 'Cosmetics' },
    'swimwear': { categoryId: 'gid://shopify/TaxonomyCategory/aa-1-18', fullName: 'Swimwear' },
    'lingerie': { categoryId: 'gid://shopify/TaxonomyCategory/aa-1-5', fullName: 'Lingerie' },
    'socks': { categoryId: 'gid://shopify/TaxonomyCategory/aa-1-16', fullName: 'Socks' },
    'activewear': { categoryId: 'gid://shopify/TaxonomyCategory/aa-1-1', fullName: 'Activewear' },
    'sportswear': { categoryId: 'gid://shopify/TaxonomyCategory/aa-1-1', fullName: 'Activewear' },
    'suits': { categoryId: 'gid://shopify/TaxonomyCategory/aa-1-17', fullName: 'Suits' },
    'luggage': { categoryId: 'gid://shopify/TaxonomyCategory/lb-13', fullName: 'Suitcases' },
    'backpacks': { categoryId: 'gid://shopify/TaxonomyCategory/aa-3-1', fullName: 'Backpacks' },
};

/**
 * Find the best matching taxonomy category for a product
 * 
 * @param {Object} product - Shopify product data
 * @param {string} product.title - Product title
 * @param {string} product.product_type - Product type
 * @param {string} product.vendor - Product vendor
 * @param {string[]} product.tags - Product tags
 * @param {string} product.body_html - Product description HTML
 * @returns {Object|null} - { categoryId, fullName, shopifyCategory, metafields } or null
 */
function findBestCategory(product) {
    const title = (product.title || '').toLowerCase();
    const productType = (product.product_type || '').toLowerCase();
    const vendor = (product.vendor || '').toLowerCase();
    const tags = (product.tags || []).map(t => (typeof t === 'string' ? t : '').toLowerCase());
    const description = (product.body_html || product.description || '').toLowerCase().replace(/<[^>]*>/g, ' ');

    // Combine all text for searching
    const searchText = `${title} ${productType} ${tags.join(' ')} ${description}`;

    // ── Strategy 1: Match product title against keyword rules (most specific) ──
    let bestMatch = null;
    let bestScore = 0;

    for (const rule of CATEGORY_RULES) {
        let score = 0;

        for (const keyword of rule.keywords) {
            const keywordLower = keyword.toLowerCase();

            // Title match is highest priority (score: 10)
            if (title.includes(keywordLower)) {
                score += 10;
            }
            // Product type match (score: 8)
            if (productType.includes(keywordLower)) {
                score += 8;
            }
            // Tags match (score: 5)
            if (tags.some(tag => tag.includes(keywordLower))) {
                score += 5;
            }
            // Description match (score: 2)
            if (description.includes(keywordLower)) {
                score += 2;
            }
        }

        // Prefer longer keyword matches (more specific)
        if (score > bestScore) {
            bestScore = score;
            bestMatch = rule;
        }
    }

    if (bestMatch && bestScore >= 5) {
        console.log(`🎯 Matched category: "${bestMatch.shopifyCategory}" (score: ${bestScore})`);
        return {
            categoryId: bestMatch.categoryId,
            fullName: bestMatch.fullName,
            shopifyCategory: bestMatch.shopifyCategory,
            metafields: bestMatch.metafields || [],
            score: bestScore,
            source: 'keyword_match'
        };
    }

    // ── Strategy 2: Fallback to productType mapping ──
    if (productType && PRODUCT_TYPE_MAP[productType]) {
        const fallback = PRODUCT_TYPE_MAP[productType];
        console.log(`📋 Fallback to product type: "${productType}" -> "${fallback.fullName}"`);
        return {
            categoryId: fallback.categoryId,
            fullName: fallback.fullName,
            shopifyCategory: productType,
            metafields: [
                { namespace: 'custom', key: 'product_type_detail', value: productType, type: 'single_line_text_field' }
            ],
            score: 3,
            source: 'product_type_fallback'
        };
    }

    // ── Strategy 3: Generic fashion/apparel fallback ──
    // If BrandsGateway product and no match, default to "Apparel & Accessories"
    const isFashionVendor = ['brandsgateway', 'fashiondropship'].some(v => vendor.includes(v));
    
    if (isFashionVendor) {
        console.log(`⚠️ No specific match, defaulting to Apparel & Accessories for vendor: ${vendor}`);
        return {
            categoryId: 'gid://shopify/TaxonomyCategory/aa',
            fullName: 'Apparel & Accessories',
            shopifyCategory: 'Apparel & Accessories',
            metafields: [],
            score: 1,
            source: 'vendor_fallback'
        };
    }

    console.log(`❌ No category match found for product: "${product.title}"`);
    return null;
}

/**
 * Generate common metafields for fashion products
 */
function generateFashionMetafields(product, categoryMatch) {
    const metafields = [...(categoryMatch.metafields || [])];

    // Add vendor/brand as metafield
    if (product.vendor) {
        metafields.push({
            namespace: 'custom',
            key: 'brand',
            value: product.vendor,
            type: 'single_line_text_field'
        });
    }

    // Add auto-categorization info
    metafields.push({
        namespace: 'custom',
        key: 'auto_categorized',
        value: 'true',
        type: 'single_line_text_field'
    });

    metafields.push({
        namespace: 'custom',
        key: 'category_match_source',
        value: categoryMatch.source,
        type: 'single_line_text_field'
    });

    metafields.push({
        namespace: 'custom',
        key: 'category_match_score',
        value: String(categoryMatch.score),
        type: 'number_integer'
    });

    return metafields;
}

module.exports = {
    findBestCategory,
    generateFashionMetafields,
    CATEGORY_RULES,
    PRODUCT_TYPE_MAP
};
