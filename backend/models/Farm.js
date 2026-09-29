const mongoose = require('mongoose');

const farmPlotSchema = new mongoose.Schema({
  plotName: { type: String, required: true },
  area: { type: Number, required: true }, // in acres
  soilType: { type: String, default: 'Red' },
  soilPh: { type: Number, default: 6.5 },
  irrigationSource: { type: String, default: 'Borewell' },
  currentCrop: { type: String, default: 'None' },
  status: { type: String, enum: ['Fallow', 'Prepared', 'Planted', 'Growing', 'Harvesting'], default: 'Fallow' },
});

const farmSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmName: { type: String, required: true, trim: true },
    surveyNumber: { type: String, default: '' },
    totalArea: { type: Number, required: true }, // in acres
    state: { type: String, required: true, default: 'Karnataka' },
    district: { type: String, required: true, default: '' },
    taluk: { type: String, default: '' },
    village: { type: String, default: '' },
    plots: [farmPlotSchema],
    primarySoilType: { type: String, default: 'Red' },
    waterSources: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farm', farmSchema);
