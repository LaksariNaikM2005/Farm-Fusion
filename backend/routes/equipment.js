const express = require('express');
const router = express.Router();
const { getAllEquipment, bookEquipment, getMyBookings } = require('../controllers/equipmentController');
const { protect } = require('../middlewares/auth');

router.get('/', getAllEquipment);
router.post('/bookings', protect, bookEquipment);
router.get('/bookings/my', protect, getMyBookings);

module.exports = router;
