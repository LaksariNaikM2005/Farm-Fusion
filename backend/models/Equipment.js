const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'Tractor',
        'Harvester / Combine',
        'Rotavator & Tiller',
        'Cultivator & Plough',
        'Boom Sprayer / Power Sprayer',
        'Seed Drill & Planter',
        'Drip / Sprinkler System',
        'Agricultural Drone',
        'Thresher',
        'Other Machinery',
      ],
      required: true,
    },
    description: { type: String, required: true },
    modelYear: { type: Number },
    horsepower: { type: String, default: '' },
    hourlyRate: { type: Number, default: 0 },
    dailyRate: { type: Number, required: true },
    securityDeposit: { type: Number, default: 0 },
    withOperator: { type: Boolean, default: false },
    operatorChargePerDay: { type: Number, default: 0 },
    location: {
      state: { type: String, default: 'Karnataka' },
      district: { type: String, default: '' },
      taluk: { type: String, default: '' },
      village: { type: String, default: '' },
    },
    images: [{ type: String }],
    condition: { type: String, enum: ['Excellent', 'Good', 'Fair'], default: 'Good' },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
