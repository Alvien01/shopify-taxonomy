const express = require('express');
const router = express.Router();
const kursController = require('../controllers/kursController');
const { requireApiKey } = require('../middleware/auth');

// Public route to check current kurs
router.get('/', kursController.getKurs);

// Secured endpoint to update pricing based on current kurs
router.post('/update-pricing', requireApiKey, kursController.updateProductPricing);

module.exports = router;
