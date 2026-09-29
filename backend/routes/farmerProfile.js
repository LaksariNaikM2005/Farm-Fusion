const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile } = require('../controllers/farmerProfileController');
const { protect } = require('../middlewares/auth');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);

module.exports = router;
