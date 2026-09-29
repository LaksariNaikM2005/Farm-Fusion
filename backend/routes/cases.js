const express = require('express');
const router = express.Router();
const { getCases, createCase, submitStudentAnalysis, validateCaseByExpert } = require('../controllers/caseController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getCases);
router.post('/', protect, createCase);
router.post('/:id/analyze', protect, submitStudentAnalysis);
router.post('/:id/validate', protect, authorize('expert', 'admin'), validateCaseByExpert);

module.exports = router;
