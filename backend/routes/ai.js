const express = require('express');
const router = express.Router();
const { askCopilot, getConversations } = require('../controllers/aiCopilotController');
const { protect } = require('../middlewares/auth');

router.post('/copilot', protect, askCopilot);
router.get('/conversations', protect, getConversations);

module.exports = router;
