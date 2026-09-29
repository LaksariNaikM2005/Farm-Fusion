const express = require('express');
const router = express.Router();
const { detectDisease } = require('../controllers/diseaseProxyController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/detect', protect, upload.single('file'), detectDisease);

module.exports = router;
