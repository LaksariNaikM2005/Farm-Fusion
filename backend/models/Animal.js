const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tagNumber: { type: String, required: true, trim: true },
    name: { type: String, default: '' },
    animalType: {
      type: String,
      enum: ['Cattle (Cow)', 'Buffalo', 'Goat', 'Sheep', 'Poultry (Broiler/Layer)', 'Dairy Cattle', 'Other Livestock'],
      required: true,
    },
    breed: { type: String, default: 'Indigenous / Local' },
    gender: { type: String, enum: ['Female', 'Male'], default: 'Female' },
    dateOfBirth: { type: Date },
    ageMonths: { type: Number, default: 12 },
    weightKg: { type: Number, default: 0 },
    lactationStatus: { type: String, enum: ['Lactating', 'Dry', 'Pregnant', 'Not Applicable'], default: 'Not Applicable' },
    dailyYieldLiters: { type: Number, default: 0 },
    status: { type: String, enum: ['Healthy', 'Under Treatment', 'Quarantined', 'Sold', 'Deceased'], default: 'Healthy' },
    images: [{ type: String }],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Animal', animalSchema);
