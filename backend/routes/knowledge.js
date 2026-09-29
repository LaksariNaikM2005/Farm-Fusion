const express = require('express');
const router = express.Router();
const { getKnowledgeDocs, createKnowledgeDoc } = require('../controllers/knowledgeController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getKnowledgeDocs);
router.post('/', protect, authorize('admin'), createKnowledgeDoc);

module.exports = router;
