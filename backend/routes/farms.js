const express = require('express');
const router = express.Router();
const { getFarms, createFarm, updateFarm, addPlot } = require('../controllers/farmController');
const { protect } = require('../middlewares/auth');

router.get('/', protect, getFarms);
router.post('/', protect, createFarm);
router.put('/:id', protect, updateFarm);
router.post('/:id/plots', protect, addPlot);

module.exports = router;
