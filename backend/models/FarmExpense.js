const mongoose = require('mongoose');

const farmExpenseSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropCycle: { type: mongoose.Schema.Types.ObjectId, ref: 'CropCycle' },
    cropName: { type: String, default: 'General / Farm-Wide' },
    category: {
      type: String,
      enum: [
        'Seeds & Seedlings',
        'Fertilizers & Nutrients',
        'Pesticides & Crop Protection',
        'Labor & Wages',
        'Irrigation & Water Charges',
        'Machinery & Equipment Rental',
        'Fuel & Electricity',
        'Transportation & Logistics',
        'Storage & Packaging',
        'Other Inputs',
      ],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
    receiptUrl: { type: String, default: '' },
    season: { type: String, default: 'Kharif 2026' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FarmExpense', farmExpenseSchema);
