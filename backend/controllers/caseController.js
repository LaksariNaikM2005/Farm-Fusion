const AgriculturalCase = require('../models/AgriculturalCase');
const User = require('../models/User');

// GET /api/v1/cases
const getCases = async (req, res) => {
  const { status, category } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  let cases = await AgriculturalCase.find(filter)
    .sort({ createdAt: -1 })
    .populate('farmer', 'name email location')
    .populate('studentAnalyses.student', 'name email')
    .populate('expertValidation.expert', 'name email specialization');

  if (cases.length === 0) {
    const farmerUser = await User.findOne({ role: 'farmer' }) || req.user;
    const expertUser = await User.findOne({ role: 'expert' });

    const seedCase = await AgriculturalCase.create({
      farmer: farmerUser._id,
      title: 'Marginal Leaf Scorch and Stunted Growth in 40-day Tomato Crop',
      category: 'Plant Pathology',
      cropOrAnimal: 'Tomato (Solanum lycopersicum)',
      description: 'After recent heavy showers followed by high heat (34°C), lower and middle leaves show dark brown concentric rings with yellow halo. Stems show elongated lesions.',
      symptoms: ['Concentric ring lesions on leaves', 'Yellow chlorotic margins', 'Lower foliage drop'],
      images: ['https://images.unsplash.com/photo-1592417817098-8f3d6ef23a07?w=600'],
      location: { district: 'Mysuru', state: 'Karnataka' },
      studentAnalyses: [
        {
          student: req.user._id,
          hypothesis: 'Symptoms are characteristic of Early Blight caused by Alternaria solani. High temperature post-rain facilitates conidial germination.',
          recommendedIntervention: '1. Prune affected bottom foliage. 2. Foliar spray of Mancozeb 75% WP @ 2g/L or Azoxystrobin 23% SC @ 1ml/L. 3. Avoid overhead sprinkler irrigation.',
          referencedLiterature: 'ICAR-IIHR Tomato Disease Management Package (2025)',
          createdAt: new Date(Date.now() - 2 * 86400000),
        },
      ],
      expertValidation: expertUser
        ? {
            expert: expertUser._id,
            verdict: 'Approved',
            officialDiagnosis: 'Confirmed Alternaria solani (Early Blight) in active vegetative phase.',
            validatedActionPlan: 'Student analysis is accurate. Recommend Mancozeb contact spray immediately, followed by Trichoderma harzianum soil drenching after 5 days to prevent reinfection.',
            comments: 'Excellent diagnostic methodology and dosage reference by the student.',
            validatedAt: new Date(Date.now() - 1 * 86400000),
          }
        : undefined,
      status: expertUser ? 'Expert Validated' : 'Analysis Submitted',
    });

    cases = [seedCase];
  }

  res.json({ success: true, cases });
};

// POST /api/v1/cases (Farmer submits real field problem)
const createCase = async (req, res) => {
  const { title, category, cropOrAnimal, description, symptoms, images, location } = req.body;
  const newCase = await AgriculturalCase.create({
    farmer: req.user._id,
    title,
    category,
    cropOrAnimal,
    description,
    symptoms: Array.isArray(symptoms) ? symptoms : [symptoms],
    images: images || [],
    location: location || { state: 'Karnataka', district: 'Mysuru' },
    status: 'Open For Student Study',
  });
  res.status(201).json({ success: true, case: newCase });
};

// POST /api/v1/cases/:id/analyze (Student submits academic analysis)
const submitStudentAnalysis = async (req, res) => {
  const { hypothesis, recommendedIntervention, referencedLiterature } = req.body;
  const agriCase = await AgriculturalCase.findById(req.params.id);
  if (!agriCase) return res.status(404).json({ success: false, message: 'Case not found' });

  agriCase.studentAnalyses.push({
    student: req.user._id,
    hypothesis,
    recommendedIntervention,
    referencedLiterature,
    createdAt: new Date(),
  });

  if (agriCase.status === 'Open For Student Study') {
    agriCase.status = 'Analysis Submitted';
  }
  await agriCase.save();

  res.json({ success: true, case: agriCase, message: 'Analysis submitted for expert review' });
};

// POST /api/v1/cases/:id/validate (Expert validates student work and provides official diagnosis)
const validateCaseByExpert = async (req, res) => {
  const { verdict, officialDiagnosis, validatedActionPlan, comments } = req.body;
  const agriCase = await AgriculturalCase.findById(req.params.id);
  if (!agriCase) return res.status(404).json({ success: false, message: 'Case not found' });

  agriCase.expertValidation = {
    expert: req.user._id,
    verdict: verdict || 'Approved',
    officialDiagnosis,
    validatedActionPlan,
    comments,
    validatedAt: new Date(),
  };
  agriCase.status = 'Expert Validated';
  await agriCase.save();

  res.json({ success: true, case: agriCase, message: 'Case successfully validated by agricultural expert' });
};

module.exports = { getCases, createCase, submitStudentAnalysis, validateCaseByExpert };
