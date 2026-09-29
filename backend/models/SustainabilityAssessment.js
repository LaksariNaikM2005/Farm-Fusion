const mongoose = require('mongoose');

const sustainabilityAssessmentSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    waterEfficiencyScore: { type: Number, required: true, min: 0, max: 100 },
    soilHealthScore: { type: Number, required: true, min: 0, max: 100 },
    cropDiversityScore: { type: Number, required: true, min: 0, max: 100 },
    inputManagementScore: { type: Number, required: true, min: 0, max: 100 },
    wasteManagementScore: { type: Number, required: true, min: 0, max: 100 },
    strengths: [{ type: String }],
    recommendationsForImprovement: [{ type: String }],
    scoringMethodologyVersion: { type: String, default: 'FarmFusion-EcoIndex-v2.0' },
    assessmentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SustainabilityAssessment', sustainabilityAssessmentSchema);
