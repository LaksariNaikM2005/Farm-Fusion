const express = require('express');
const router = express.Router();
const { getMyAnimals, addAnimal, getHealthRecords, addHealthRecord, checkAnimalSymptoms } = require('../controllers/veterinaryController');
const { protect } = require('../middlewares/auth');

router.get('/animals', protect, getMyAnimals);
router.post('/animals', protect, addAnimal);
router.get('/records', protect, getHealthRecords);
router.post('/records', protect, addHealthRecord);
router.post('/ai-symptom-check', protect, checkAnimalSymptoms);

module.exports = router;
