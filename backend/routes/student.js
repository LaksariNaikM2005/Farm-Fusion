const express = require('express');
const router = express.Router();
const { getStudentDashboard, getCourses, getQuizzes, submitQuiz } = require('../controllers/studentController');
const { protect } = require('../middlewares/auth');

router.get('/dashboard', protect, getStudentDashboard);
router.get('/courses', protect, getCourses);
router.get('/quizzes', protect, getQuizzes);
router.post('/quizzes/:id/submit', protect, submitQuiz);

module.exports = router;
