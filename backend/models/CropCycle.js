const mongoose = require('mongoose');

const cropCycleSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
    plotName: { type: String, default: 'Main Plot' },
    cropName: { type: String, required: true },
    variety: { type: String, default: '' },
    season: { type: String, enum: ['Kharif', 'Rabi', 'Zaid', 'Perennial'], default: 'Kharif' },
    allocatedArea: { type: Number, required: true }, // in acres
    stage: {
      type: String,
      enum: ['PLAN', 'PREPARE', 'PLANT', 'GROW', 'MONITOR', 'HARVEST', 'SELL', 'ANALYZE', 'COMPLETED'],
      default: 'PLAN',
    },
    startDate: { type: Date, default: Date.now },
    expectedHarvestDate: { type: Date },
    actualHarvestDate: { type: Date },
    targetYieldKg: { type: Number, default: 0 },
    actualYieldKg: { type: Number, default: 0 },
    budgetEstimated: { type: Number, default: 0 },
    totalExpenses: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    netProfit: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    stageHistory: [
      {
        stageName: { type: String },
        enteredAt: { type: Date, default: Date.now },
        notes: { type: String, default: '' },
      },
    ],
    status: { type: String, enum: ['Active', 'Completed', 'Abandoned'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CropCycle', cropCycleSchema);
