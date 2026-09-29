const mongoose = require('mongoose');

const agriculturalCaseSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Agronomy', 'Plant Pathology', 'Soil Health', 'Veterinary & Livestock', 'Irrigation & Drainage', 'Post-Harvest Loss'],
      required: true,
    },
    cropOrAnimal: { type: String, required: true },
    description: { type: String, required: true },
    symptoms: [{ type: String }],
    images: [{ type: String }],
    location: {
      district: { type: String, default: '' },
      state: { type: String, default: 'Karnataka' },
    },
    studentAnalyses: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        hypothesis: { type: String, required: true },
        recommendedIntervention: { type: String, required: true },
        referencedLiterature: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    expertValidation: {
      expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      verdict: { type: String, enum: ['Approved', 'Needs Revision', 'Alternative Diagnosis Provided'] },
      officialDiagnosis: { type: String, default: '' },
      validatedActionPlan: { type: String, default: '' },
      comments: { type: String, default: '' },
      validatedAt: { type: Date },
    },
    status: {
      type: String,
      enum: ['Open For Student Study', 'Analysis Submitted', 'Expert Validated', 'Archived As Knowledge Resource'],
      default: 'Open For Student Study',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AgriculturalCase', agriculturalCaseSchema);
