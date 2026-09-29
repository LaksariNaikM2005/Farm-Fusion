const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String, required: true },
  academicSource: { type: String, default: 'ICAR / State Agricultural University Curriculum' },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    subject: {
      type: String,
      enum: ['Agronomy', 'Soil Science', 'Plant Pathology', 'Veterinary Science', 'Horticulture', 'Agricultural Engineering'],
      required: true,
    },
    difficulty: { type: String, enum: ['Basic', 'Intermediate', 'Advanced / Competitive (ICAR JRF/SRF)'], default: 'Intermediate' },
    durationMinutes: { type: Number, default: 15 },
    passingScorePercentage: { type: Number, default: 60 },
    questions: [quizQuestionSchema],
    totalAttempts: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
