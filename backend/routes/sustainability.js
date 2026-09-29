const express = require('express');
const router = express.Router();
const { getSustainabilityScore } = require('../controllers/sustainabilityController');
const { protect } = require('../middlewares/auth');

router.get('/score', protect, getSustainabilityScore);

module.exports = router;
