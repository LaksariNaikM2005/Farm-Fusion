const FarmerProfile = require('../models/FarmerProfile');
const Farm = require('../models/Farm');
const User = require('../models/User');

// GET /api/v1/farmer-profile/me
const getMyProfile = async (req, res) => {
  let profile = await FarmerProfile.findOne({ user: req.user._id });
  if (!profile) {
    // Initialize default profile
    profile = await FarmerProfile.create({
      user: req.user._id,
      location: {
        state: 'Karnataka',
        district: req.user.location?.split(',')?.[0]?.trim() || 'Mysuru',
        village: '',
      },
      farmDetails: {
        totalLandArea: 2.5,
        landUnit: 'acres',
        soilType: 'Red',
        soilPh: 6.8,
        nitrogen: 160,
        phosphorus: 45,
        potassium: 190,
        irrigationType: 'Borewell / Tube Well',
        waterAvailability: 'Moderate (Seasonal)',
        farmingMethod: 'Conventional',
      },
      currentCrops: ['Tomato', 'Ragi'],
      previousCrops: ['Paddy'],
      machinery: ['Tractor', 'Power Sprayer'],
      livestock: [{ animalType: 'Cattle', count: 2, breed: 'Hallikar' }],
      isProfileComplete: true,
    });
  }
  res.json({ success: true, profile });
};

// PUT /api/v1/farmer-profile/me
const updateMyProfile = async (req, res) => {
  const { personal, location, farmDetails, financial, machinery, livestock, currentCrops, previousCrops } = req.body;
  
  let profile = await FarmerProfile.findOne({ user: req.user._id });
  if (!profile) {
    profile = new FarmerProfile({ user: req.user._id });
  }

  if (personal) profile.personal = { ...profile.personal, ...personal };
  if (location) {
    profile.location = { ...profile.location, ...location };
    // also update user location string for backward compatibility
    if (location.district || location.state) {
      await User.findByIdAndUpdate(req.user._id, {
        location: `${location.district || ''}${location.state ? ', ' + location.state : ''}`.trim(),
      });
    }
  }
  if (farmDetails) profile.farmDetails = { ...profile.farmDetails, ...farmDetails };
  if (financial) profile.financial = { ...profile.financial, ...financial };
  if (machinery) profile.machinery = machinery;
  if (livestock) profile.livestock = livestock;
  if (currentCrops) profile.currentCrops = currentCrops;
  if (previousCrops) profile.previousCrops = previousCrops;

  profile.isProfileComplete = true;
  await profile.save();

  res.json({ success: true, profile, message: 'Farmer intelligence profile updated successfully' });
};

module.exports = { getMyProfile, updateMyProfile };
