const express = require('express');
const router = express.Router();
const { recommendCrops, estimateCropProfit } = require('../controllers/cropIntelligenceController');
const { protect } = require('../middlewares/auth');

router.post('/recommend', protect, recommendCrops);
router.post('/profit-estimate', protect, estimateCropProfit);

module.exports = router;
