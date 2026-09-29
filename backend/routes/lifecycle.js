const express = require('express');
const router = express.Router();
const { getCropCycles, createCropCycle, updateStage } = require('../controllers/lifecycleController');
const { protect } = require('../middlewares/auth');

router.get('/', protect, getCropCycles);
router.post('/', protect, createCropCycle);
router.put('/:id/stage', protect, updateStage);

module.exports = router;
