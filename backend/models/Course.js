const mongoose = require('mongoose');

const courseLessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, default: '15 mins' },
  contentMarkdown: { type: String, required: true },
  keyTakeaways: [{ type: String }],
  videoUrl: { type: String, default: '' },
  referenceSource: { type: String, default: 'ICAR e-Course / Agri MOOC' },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['Agronomy', 'Soil Science', 'Plant Pathology & Entomology', 'Veterinary & Animal Science', 'Horticulture', 'Agri-Economics'],
      required: true,
    },
    description: { type: String, required: true },
    level: { type: String, enum: ['Undergraduate (B.Sc Agri/BVSc)', 'Postgraduate', 'Diploma & Practical'], default: 'Undergraduate (B.Sc Agri/BVSc)' },
    thumbnail: { type: String, default: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500' },
    instructor: { type: String, default: 'Farm Fusion Academic Board' },
    syllabus: [courseLessonSchema],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    rating: { type: Number, default: 4.8 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
