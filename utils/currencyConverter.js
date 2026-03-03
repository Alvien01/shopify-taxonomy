const axios = require('axios');

const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const response = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        const rates = response.data.rates;

        if (!rates || !rates[toCurrency]) {
            throw new Error(`Unsupported destination currency: ${toCurrency}`);
        }
        return rates[toCurrency];
    } catch (error) {
        throw new Error('Failed to fetch real-time exchange rates: ' + error.message);
    }
};

const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
        const rate = await getExchangeRate(fromCurrency, toCurrency);
        return amount * rate;
    } catch (error) {
        throw new Error('Currency conversion failed: ' + error.message);
    }
};

const calculateSellingPrice = (supplierPriceEUR, msrpIDR) => {
    // 1. Calculate the "True Cost" (The Baseline) Supplier Price + €40 Shipping, safe exchange rate of Rp 20.000, and 40% tax buffer
    const fixedShippingEUR = 40;
    const exchangeRate = 20000;
    const taxMultiplier = 1.4; // -> 1 + 40% Tax Buffer
    const landedCostIDR = (supplierPriceEUR + fixedShippingEUR) * exchangeRate * taxMultiplier;
    
    // 2. The "Customer Deal" Goal
    const targetDealPrice = msrpIDR * 0.75; // at least 25% off MSRP
    
    // 3. The Sliding Profit Scale & 4. The Safety Net (Fallback)
    let finalPrice;
    if (landedCostIDR * 3 <= targetDealPrice) {
        finalPrice = landedCostIDR * 3;
    } else if (landedCostIDR * 2.5 <= targetDealPrice) {
        finalPrice = landedCostIDR * 2.5;
    } else if (landedCostIDR * 2 <= targetDealPrice) {
        finalPrice = landedCostIDR * 2;
    } else if (landedCostIDR * 1.5 <= targetDealPrice) {
        finalPrice = landedCostIDR * 1.5;
    } else {
        // Fallback: default to simple 10% discount off MSRP
        finalPrice = msrpIDR * 0.90;
    }
    
    // 5. Professional Polish, Round to the nearest Rp 1,000
    finalPrice = Math.round(finalPrice / 1000) * 1000;
    
    // 6. Inclusion Rule
    // If final selling price is at or above retail price, do not include 
    // Also consider not including if the item landed cost already exceeds MSRP to prevent unviable products
    if (finalPrice >= msrpIDR || landedCostIDR >= msrpIDR) {
        return null; 
    }
    
    return finalPrice;
};

module.exports = {
    getExchangeRate,
    convertCurrency,
    calculateSellingPrice
};
