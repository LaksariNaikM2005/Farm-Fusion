const mongoose = require('mongoose');

const farmHarvestSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropCycle: { type: mongoose.Schema.Types.ObjectId, ref: 'CropCycle' },
    cropName: { type: String, required: true },
    harvestDate: { type: Date, default: Date.now },
    quantity: { type: Number, required: true }, // in kg or quintals
    unit: { type: String, enum: ['kg', 'quintals', 'tonnes', 'crates', 'bags'], default: 'quintals' },
    gradeQuality: { type: String, enum: ['Grade A (Premium)', 'Grade B (Standard)', 'Grade C (Fair)'], default: 'Grade A (Premium)' },
    quantitySold: { type: Number, default: 0 },
    sellingPricePerUnit: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    soldTo: { type: String, default: 'APMC Mandi' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FarmHarvest', farmHarvestSchema);
