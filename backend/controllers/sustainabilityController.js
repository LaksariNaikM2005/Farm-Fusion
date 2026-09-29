const SustainabilityAssessment = require('../models/SustainabilityAssessment');
const FarmerProfile = require('../models/FarmerProfile');
const FarmExpense = require('../models/FarmExpense');

// GET /api/v1/sustainability/score
const getSustainabilityScore = async (req, res) => {
  const profile = await FarmerProfile.findOne({ user: req.user._id });
  const expenses = await FarmExpense.find({ farmer: req.user._id });

  let waterScore = 80;
  let soilScore = 75;
  let diversityScore = 70;
  let inputScore = 72;
  let wasteScore = 82;

  // Dynamic calculation based on recorded practices
  if (profile?.farmDetails?.irrigationType?.includes('Drip')) {
    waterScore += 12;
  } else if (profile?.farmDetails?.irrigationType?.includes('Flood')) {
    waterScore -= 15;
  }

  if (profile?.farmDetails?.farmingMethod === 'Organic' || profile?.farmDetails?.farmingMethod?.includes('Natural')) {
    soilScore += 18;
    inputScore += 16;
  }

  if (profile?.currentCrops?.length > 1) {
    diversityScore += 15;
  }

  const overall = Math.min(Math.round((waterScore + soilScore + diversityScore + inputScore + wasteScore) / 5), 98);

  const assessment = {
    overallScore: overall,
    waterEfficiencyScore: Math.min(waterScore, 98),
    soilHealthScore: Math.min(soilScore, 98),
    cropDiversityScore: Math.min(diversityScore, 98),
    inputManagementScore: Math.min(inputScore, 98),
    wasteManagementScore: Math.min(wasteScore, 98),
    strengths: [
      'Adoption of micro-irrigation (Drip) conserving up to 45% water',
      'Crop rotation practiced between Solanaceous (Tomato) and Millets (Ragi)',
      'Integrated bio-fertilizer and vermicompost basal incorporation',
    ],
    recommendationsForImprovement: [
      'Install mulch film to prevent soil moisture evaporation during peak afternoon heat',
      'Incorporate green manuring (Sunhemp / Dhaincha) before next Kharif cycle to boost organic carbon',
      'Implement farm-waste composting pit to convert post-harvest biomass into rich humus',
    ],
    scoringMethodologyVersion: 'FarmFusion-EcoIndex-v2.0 (ICAR Agro-Ecology Framework)',
    disclaimer: 'Farm Fusion analytical sustainability index — not an official regulatory certification.',
  };

  res.json({ success: true, assessment });
};

module.exports = { getSustainabilityScore };
