const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    personal: {
      age: { type: Number, min: 18, max: 120 },
      preferredLanguage: { type: String, enum: ['en', 'kn', 'hi'], default: 'en' },
      experienceYears: { type: Number, default: 0 },
      education: { type: String, default: '' },
    },
    location: {
      state: { type: String, default: 'Karnataka' },
      district: { type: String, default: '' },
      taluk: { type: String, default: '' },
      village: { type: String, default: '' },
      pincode: { type: String, default: '' },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    farmDetails: {
      totalLandArea: { type: Number, default: 0 }, // in acres
      landUnit: { type: String, enum: ['acres', 'hectares', 'guntha'], default: 'acres' },
      soilType: {
        type: String,
        enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Clay', 'Loamy', 'Saline', 'Other'],
        default: 'Red',
      },
      soilPh: { type: Number, min: 0, max: 14, default: 6.5 },
      nitrogen: { type: Number, default: 140 }, // kg/ha
      phosphorus: { type: Number, default: 40 }, // kg/ha
      potassium: { type: Number, default: 180 }, // kg/ha
      irrigationType: {
        type: String,
        enum: ['Drip', 'Sprinkler', 'Canal', 'Borewell / Tube Well', 'Rainfed', 'Flood', 'None'],
        default: 'Borewell / Tube Well',
      },
      waterAvailability: {
        type: String,
        enum: ['High (Year-round)', 'Moderate (Seasonal)', 'Low (Scare)', 'Critical'],
        default: 'Moderate (Seasonal)',
      },
      farmingMethod: {
        type: String,
        enum: ['Conventional', 'Organic', 'Natural Farming (ZBNF)', 'Hydroponic', 'Mixed'],
        default: 'Conventional',
      },
    },
    financial: {
      annualBudget: { type: Number, default: 0 },
      inputBudget: { type: Number, default: 0 },
      expectedYieldTarget: { type: String, default: '' },
      primaryGoal: {
        type: String,
        enum: ['Max Profit', 'Low Risk / High Stability', 'Organic Certification', 'Subsistence / Food Security'],
        default: 'Max Profit',
      },
    },
    machinery: [{ type: String }],
    livestock: [
      {
        animalType: { type: String, enum: ['Cattle', 'Buffalo', 'Goat', 'Sheep', 'Poultry', 'Fisheries', 'Other'] },
        count: { type: Number, default: 0 },
        breed: { type: String, default: '' },
      },
    ],
    currentCrops: [{ type: String }],
    previousCrops: [{ type: String }],
    sustainabilityScore: { type: Number, min: 0, max: 100, default: 75 },
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);
