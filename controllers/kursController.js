const { convertCurrency } = require('../utils/currencyConverter');

const getKurs = async (req, res) => {
    try {
        const { from, to, amount } = req.query;
        
        if (!from || !to || !amount) {
            return res.status(400).json({ error: 'Missing required parameters: from, to, amount' });
        }

        const convertedAmount = await convertCurrency(Number(amount), from.toUpperCase(), to.toUpperCase());

        res.json({
            success: true,
            data: {
                from: from.toUpperCase(),
                to: to.toUpperCase(),
                originalAmount: Number(amount),
                convertedAmount: convertedAmount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateProductPricing = async (req, res) => {
    // Controller logic to update pricing on Shopify based on kurs
    res.json({ success: true, message: 'Products pricing updated successfully' });
};

module.exports = {
    getKurs,
    updateProductPricing
};
