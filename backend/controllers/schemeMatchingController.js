const Scheme = require('../models/Scheme');
const FarmerProfile = require('../models/FarmerProfile');

// POST /api/v1/schemes/match
const matchSchemes = async (req, res) => {
  let profile = null;
  if (req.user) {
    profile = await FarmerProfile.findOne({ user: req.user._id });
  }

  const {
    state = profile?.location?.state || 'Karnataka',
    landArea = profile?.farmDetails?.totalLandArea || 2.5,
    crop = profile?.currentCrops?.[0] || 'Tomato',
    farmingMethod = profile?.farmDetails?.farmingMethod || 'Conventional',
    irrigationType = profile?.farmDetails?.irrigationType || 'Drip',
  } = req.body;

  const schemes = await Scheme.find({ isActive: true });

  const evaluatedSchemes = schemes.map((s) => {
    let score = 50; // base score
    const matched = [];
    const missingOrUnmet = [];

    // Check location
    if (s.state === 'All' || s.state === 'All India' || s.applicableStates?.includes('All India') || s.applicableStates?.includes(state) || s.state === state) {
      score += 20;
      matched.push(`Location eligible for ${state}`);
    } else {
      score -= 20;
      missingOrUnmet.push(`Requires residency in ${s.state}`);
    }

    // Check land size limits
    const maxLand = s.maxLandLimitAcres || 999;
    const minLand = s.minLandLimitAcres || 0;
    if (landArea >= minLand && landArea <= maxLand) {
      score += 15;
      matched.push(`Landholding of ${landArea} acres qualifies (Limit: ${minLand}-${maxLand === 999 ? 'No limit' : maxLand} acres)`);
    } else {
      score -= 15;
      missingOrUnmet.push(`Landholding exceeds scheme limit of ${maxLand} acres`);
    }

    // Check crop applicability
    if (!s.applicableCrops || s.applicableCrops.length === 0 || s.applicableCrops.includes('All') || s.applicableCrops.some((c) => c.toLowerCase() === crop.toLowerCase())) {
      score += 10;
      matched.push(`Crop (${crop}) is supported under scheme`);
    }

    // Category specific matching
    if (s.category === 'equipment' && (profile?.machinery?.length === 0 || req.body.needEquipment)) {
      score += 10;
      matched.push('High priority for farm mechanization upgrade');
    }
    if (s.category === 'insurance' && crop) {
      score += 8;
      matched.push(`Crop risk protection for ${crop}`);
    }
    if (s.category === 'subsidy' && (irrigationType.includes('Drip') || irrigationType.includes('Sprinkler'))) {
      if (s.title.toLowerCase().includes('drip') || s.title.toLowerCase().includes('irrigation') || s.title.toLowerCase().includes('kusum')) {
        score += 12;
        matched.push('Matches micro-irrigation and solar pump subsidy eligibility');
      }
    }

    const finalMatchPercent = Math.min(Math.max(Math.round(score), 35), 98);

    return {
      _id: s._id,
      title: s.title,
      authority: s.authority || 'Ministry of Agriculture, GoI',
      category: s.category,
      description: s.description,
      eligibility: s.eligibility,
      benefits: s.benefits,
      howToApply: s.howToApply,
      link: s.link,
      officialSourceUrl: s.officialSourceUrl || s.link,
      requiredDocuments: s.requiredDocuments?.length > 0 ? s.requiredDocuments : ['Aadhaar Card', 'Land Pahani (RTC)', 'Bank Passbook', 'Crop Sowing Certificate'],
      matchPercentage: finalMatchPercent,
      matchedConditions: matched,
      unmetConditions: missingOrUnmet,
      whyRecommended: `Recommended based on your ${landArea}-acre landholding in ${state} cultivating ${crop}.`,
      lastVerifiedDate: s.lastVerifiedDate || '2026-04-15',
    };
  });

  // Sort descending by match percentage
  evaluatedSchemes.sort((a, b) => b.matchPercentage - a.matchPercentage);

  res.json({
    success: true,
    farmerCriteria: { state, landArea, crop, farmingMethod, irrigationType },
    matchedSchemes: evaluatedSchemes,
  });
};

module.exports = { matchSchemes };
