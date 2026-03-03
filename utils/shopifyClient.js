const axios = require('axios');

class ShopifyClient {
    constructor(shopDomain, accessToken) {
        this.shopDomain = shopDomain;
        this.accessToken = accessToken;
        this.apiVersion = process.env.SHOPIFY_API_VERSION || '2024-04';
        this.graphqlUrl = `https://${shopDomain}/admin/api/${this.apiVersion}/graphql.json`;
    }

    /**
     * Execute a GraphQL query/mutation against the Shopify Admin API
     */
    async graphql(query, variables = {}) {
        try {
            const response = await axios.post(
                this.graphqlUrl,
                { query, variables },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Access-Token': this.accessToken,
                    },
                }
            );

            if (response.data.errors) {
                console.error('GraphQL Errors:', JSON.stringify(response.data.errors, null, 2));
                throw new Error(`GraphQL Error: ${response.data.errors[0].message}`);
            }

            return response.data.data;
        } catch (error) {
            if (error.response) {
                console.error('Shopify API Error:', error.response.status, error.response.data);
            }
            throw error;
        }
    }

    /**
     * Search taxonomy categories by query string
     * Returns matching TaxonomyCategory nodes
     */
    async searchTaxonomyCategories(searchQuery, first = 10) {
        const query = `
            query searchTaxonomy($first: Int!) {
                taxonomy {
                    categories(first: $first) {
                        edges {
                            node {
                                id
                                name
                                fullName
                                isRoot
                                isLeaf
                                level
                                parentId
                                ancestorIds
                            }
                        }
                    }
                }
            }
        `;

        const data = await this.graphql(query, { first: Math.min(first, 250) });
        return data.taxonomy.categories.edges.map(edge => edge.node);
    }

    /**
     * Get a specific product by ID
     */
    async getProduct(productId) {
        const gid = productId.startsWith('gid://') ? productId : `gid://shopify/Product/${productId}`;
        
        const query = `
            query getProduct($id: ID!) {
                product(id: $id) {
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
                    metafields(first: 50) {
                        edges {
                            node {
                                id
                                namespace
                                key
                                value
                                type
                            }
                        }
                    }
                }
            }
        `;

        const data = await this.graphql(query, { id: gid });
        return data.product;
    }

    /**
     * Update product category using productUpdate mutation
     */
    async updateProductCategory(productId, categoryId) {
        const gid = productId.startsWith('gid://') ? productId : `gid://shopify/Product/${productId}`;
        
        const mutation = `
            mutation productUpdate($input: ProductInput!) {
                productUpdate(input: $input) {
                    product {
                        id
                        title
                        category {
                            id
                            name
                            fullName
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        const variables = {
            input: {
                id: gid,
                category: categoryId
            }
        };

        const data = await this.graphql(mutation, variables);

        if (data.productUpdate.userErrors.length > 0) {
            console.error('Product update errors:', data.productUpdate.userErrors);
            throw new Error(`Product update failed: ${data.productUpdate.userErrors[0].message}`);
        }

        return data.productUpdate.product;
    }

    /**
     * Set metafields on a product
     */
    async setProductMetafields(productId, metafields) {
        const gid = productId.startsWith('gid://') ? productId : `gid://shopify/Product/${productId}`;

        const mutation = `
            mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
                metafieldsSet(metafields: $metafields) {
                    metafields {
                        id
                        namespace
                        key
                        value
                        type
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        const formattedMetafields = metafields.map(mf => ({
            ownerId: gid,
            namespace: mf.namespace,
            key: mf.key,
            value: mf.value,
            type: mf.type
        }));

        const data = await this.graphql(mutation, { metafields: formattedMetafields });

        if (data.metafieldsSet.userErrors.length > 0) {
            console.error('Metafield set errors:', data.metafieldsSet.userErrors);
            throw new Error(`Metafield set failed: ${data.metafieldsSet.userErrors[0].message}`);
        }

        return data.metafieldsSet.metafields;
    }

    /**
     * Update product category and set metafields in one go
     */
    async categorizeProduct(productId, categoryId, metafields = []) {
        // Step 1: Update the category
        const updatedProduct = await this.updateProductCategory(productId, categoryId);
        console.log(`✅ Category updated for "${updatedProduct.title}" -> ${updatedProduct.category?.fullName}`);

        // Step 2: Set metafields if any
        if (metafields.length > 0) {
            const setMetafields = await this.setProductMetafields(productId, metafields);
            console.log(`✅ ${setMetafields.length} metafield(s) set for "${updatedProduct.title}"`);
        }

        return updatedProduct;
    }
}

module.exports = ShopifyClient;
