const express = require('express');
const router = express.Router();
const { getFarmAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/auth');

router.get('/overview', protect, getFarmAnalytics);

module.exports = router;
