const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// GET /api/v1/student/dashboard
const getStudentDashboard = async (req, res) => {
  const studentId = req.user._id;

  const [courses, quizzes, attempts] = await Promise.all([
    Course.find(),
    Quiz.find().populate('course', 'title code'),
    QuizAttempt.find({ student: studentId }).populate('quiz', 'title subject difficulty').sort({ createdAt: -1 }),
  ]);

  const totalQuizzesTaken = attempts.length;
  const avgScore = totalQuizzesTaken > 0 ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalQuizzesTaken) : 0;
  const passedCount = attempts.filter((a) => a.passed).length;

  res.json({
    success: true,
    stats: {
      enrolledCoursesCount: courses.length,
      totalQuizzesTaken,
      avgScore,
      passedCount,
    },
    courses: courses.slice(0, 4),
    recentQuizzes: quizzes.slice(0, 4),
    recentAttempts: attempts.slice(0, 5),
  });
};

// GET /api/v1/student/courses
const getCourses = async (req, res) => {
  let courses = await Course.find();
  if (courses.length === 0) {
    const seedCourses = [
      {
        title: 'Advanced Agronomy & Integrated Nutrient Management (INM)',
        code: 'AGRO-301',
        category: 'Agronomy',
        description: 'Comprehensive study of nutrient cycles, fertilizer use efficiency, 4R stewardship, green manuring, and precision nitrogen management.',
        level: 'Undergraduate (B.Sc Agri/BVSc)',
        instructor: 'Dr. M. S. Swaminathan Chair, UAS Bangalore',
        thumbnail: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500',
        syllabus: [
          {
            title: '1. Fundamentals of Soil Fertility & Soil Testing',
            duration: '25 mins',
            contentMarkdown: '### Soil Fertility vs Productivity\nSoil fertility is the inherent capacity of soil to supply essential plant nutrients in adequate amounts. Soil testing using Mehlich-3 or Bray-1 methods helps determine available N, P, K.',
            keyTakeaways: ['NPK stoichiometric balance', 'Soil organic carbon (SOC) dynamics'],
            referenceSource: 'ICAR e-Course in Agronomy',
          },
          {
            title: '2. Bio-fertilizers & Nitrogen Fixing Bacteria',
            duration: '30 mins',
            contentMarkdown: '### Microbial Inoculants\nRhizobium sp. for legumes, Azotobacter / Azospirillum for cereals, and Phosphate Solubilizing Bacteria (PSB) enhance nutrient bio-availability.',
            keyTakeaways: ['Symbiotic vs free-living fixation', 'VAM mycorrhizal symbiosis'],
            referenceSource: 'ICAR-IARI Division of Microbiology',
          },
        ],
      },
      {
        title: 'Diagnostic Plant Pathology & Molecular Disease Identification',
        code: 'PATH-402',
        category: 'Plant Pathology & Entomology',
        description: 'Clinical identification of fungal, bacterial, and viral crop pathogens with emphasis on symptoms, Koch postulates, and IPM strategies.',
        level: 'Undergraduate (B.Sc Agri/BVSc)',
        instructor: 'ICAR-IIHR Plant Pathology Faculty',
        thumbnail: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=500',
        syllabus: [
          {
            title: '1. Oomycetes & Late Blight in Solanaceous Crops',
            duration: '35 mins',
            contentMarkdown: '### Phytophthora infestans Biology\nSporangia germination occurs at 10-15°C with high relative humidity (>90%). Water-soaked necrotic lesions appear on leaf margins with white downy growth on abaxial surface.',
            keyTakeaways: ['Early vs Late Blight differences', 'Systemic vs contact fungicides (Metalaxyl vs Mancozeb)'],
            referenceSource: 'ICAR-Central Potato Research Institute (CPRI)',
          },
        ],
      },
    ];
    await Course.insertMany(seedCourses);
    courses = await Course.find();
  }
  res.json({ success: true, courses });
};

// GET /api/v1/student/quizzes
const getQuizzes = async (req, res) => {
  let quizzes = await Quiz.find();
  if (quizzes.length === 0) {
    const seedQuizzes = [
      {
        title: 'ICAR Agronomy & Crop Production Assessment',
        subject: 'Agronomy',
        difficulty: 'Intermediate',
        durationMinutes: 10,
        passingScorePercentage: 60,
        questions: [
          {
            questionText: 'Which nutrient is primarily responsible for root development and energy transfer (ATP) in crops?',
            options: ['Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)', 'Zinc (Zn)'],
            correctOptionIndex: 1,
            explanation: 'Phosphorus is critical for energy transfer via ADP/ATP bonds and stimulates early root growth.',
            academicSource: 'Principles of Agronomy - Reddy & Reddy',
          },
          {
            questionText: 'What is the optimum soil pH range for most field vegetable crops to maximize nutrient availability?',
            options: ['3.5 - 4.5', '6.0 - 7.5', '8.5 - 9.5', '10.0 - 11.0'],
            correctOptionIndex: 1,
            explanation: 'Between pH 6.0 and 7.5, primary macronutrients and micronutrients exhibit optimal bioavailability without toxicity.',
            academicSource: 'ICAR Soil Science Handbook',
          },
          {
            questionText: 'Which crop rotation sequence is recommended to restore nitrogen in cereal-based farming?',
            options: ['Paddy - Wheat - Maize', 'Tomato - Chilli - Potato', 'Paddy - Chickpea / Moong - Maize', 'Cotton - Cotton - Cotton'],
            correctOptionIndex: 2,
            explanation: 'Incorporating leguminous crops (Chickpea/Moong) fixes atmospheric nitrogen into the root rhizosphere.',
            academicSource: 'UAS Bangalore Agronomy Bulletin',
          },
        ],
      },
    ];
    await Quiz.insertMany(seedQuizzes);
    quizzes = await Quiz.find();
  }
  res.json({ success: true, quizzes });
};

// POST /api/v1/student/quizzes/:id/submit
const submitQuiz = async (req, res) => {
  const { answers, timeTakenSeconds } = req.body;
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

  let correctCount = 0;
  const selectedAnswers = [];

  quiz.questions.forEach((q, idx) => {
    const chosen = answers?.[idx];
    const isCorrect = chosen === q.correctOptionIndex;
    if (isCorrect) correctCount++;
    selectedAnswers.push({
      questionIndex: idx,
      chosenOptionIndex: chosen,
      isCorrect,
    });
  });

  const totalQuestions = quiz.questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= quiz.passingScorePercentage;

  const attempt = await QuizAttempt.create({
    student: req.user._id,
    quiz: quiz._id,
    score: correctCount,
    totalQuestions,
    percentage,
    passed,
    selectedAnswers,
    timeTakenSeconds: timeTakenSeconds || 120,
  });

  quiz.totalAttempts += 1;
  await quiz.save();

  res.json({
    success: true,
    result: {
      score: correctCount,
      totalQuestions,
      percentage,
      passed,
      attemptId: attempt._id,
      questionsWithExplanations: quiz.questions.map((q, idx) => ({
        questionText: q.questionText,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        chosenOptionIndex: answers?.[idx],
        isCorrect: answers?.[idx] === q.correctOptionIndex,
        explanation: q.explanation,
        academicSource: q.academicSource,
      })),
    },
  });
};

module.exports = { getStudentDashboard, getCourses, getQuizzes, submitQuiz };
