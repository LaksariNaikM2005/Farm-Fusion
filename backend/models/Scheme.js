const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    authority: { type: String, default: 'Ministry of Agriculture & Farmers Welfare, GoI' },
    description: { type: String, required: true },
    eligibility: { type: String, required: true },
    benefits: { type: String, default: '' },
    howToApply: { type: String, default: '' },
    deadline: { type: Date },
    link: { type: String, default: '' },
    officialSourceUrl: { type: String, default: '' },
    category: {
      type: String,
      enum: ['subsidy', 'loan', 'insurance', 'training', 'equipment', 'crop_support', 'market', 'other'],
      default: 'other',
    },
    state: { type: String, default: 'All India' },
    applicableStates: [{ type: String, default: 'All India' }],
    applicableCrops: [{ type: String, default: 'All' }],
    applicableFarmingMethods: [{ type: String, default: 'All' }],
    maxLandLimitAcres: { type: Number, default: 999 },
    minLandLimitAcres: { type: Number, default: 0 },
    requiredDocuments: [{ type: String }],
    lastVerifiedDate: { type: Date, default: Date.now },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scheme', schemeSchema);
