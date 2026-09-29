const CropCycle = require('../models/CropCycle');
const FarmExpense = require('../models/FarmExpense');
const FarmHarvest = require('../models/FarmHarvest');

// GET /api/v1/lifecycle
const getCropCycles = async (req, res) => {
  let cycles = await CropCycle.find({ farmer: req.user._id }).sort({ createdAt: -1 });
  if (cycles.length === 0) {
    // initialize sample active cycle
    const sample = await CropCycle.create({
      farmer: req.user._id,
      cropName: 'Tomato (Hybrid Arka Rakshak)',
      variety: 'Arka Rakshak (Triple Disease Resistant)',
      season: 'Kharif',
      allocatedArea: 1.5,
      stage: 'GROW',
      targetYieldKg: 28000,
      budgetEstimated: 65000,
      totalExpenses: 42000,
      stageHistory: [
        { stageName: 'PLAN', enteredAt: new Date(Date.now() - 45 * 86400000), notes: 'Soil test NPK verified, seeds sourced' },
        { stageName: 'PREPARE', enteredAt: new Date(Date.now() - 35 * 86400000), notes: 'Deep plowing and vermicompost basal application' },
        { stageName: 'PLANT', enteredAt: new Date(Date.now() - 25 * 86400000), notes: '25-day old seedlings transplanted with drip lines' },
        { stageName: 'GROW', enteredAt: new Date(Date.now() - 10 * 86400000), notes: 'Flowering initiated, fertigation active' },
      ],
      notes: 'Monitored daily for early blight and moisture levels.',
    });
    cycles = [sample];
  }
  res.json({ success: true, cycles });
};

// POST /api/v1/lifecycle
const createCropCycle = async (req, res) => {
  const { cropName, variety, season, allocatedArea, targetYieldKg, budgetEstimated, notes } = req.body;
  const cycle = await CropCycle.create({
    farmer: req.user._id,
    cropName,
    variety,
    season,
    allocatedArea,
    targetYieldKg,
    budgetEstimated,
    stage: 'PLAN',
    stageHistory: [{ stageName: 'PLAN', enteredAt: new Date(), notes: 'Cycle planned' }],
    notes,
  });
  res.status(201).json({ success: true, cycle });
};

// PUT /api/v1/lifecycle/:id/stage
const updateStage = async (req, res) => {
  const { stage, notes } = req.body;
  const cycle = await CropCycle.findOne({ _id: req.params.id, farmer: req.user._id });
  if (!cycle) return res.status(404).json({ success: false, message: 'Crop cycle not found' });

  cycle.stage = stage;
  cycle.stageHistory.push({ stageName: stage, enteredAt: new Date(), notes: notes || `Moved to ${stage}` });
  if (stage === 'COMPLETED' || stage === 'ANALYZE') {
    cycle.status = 'Completed';
  }
  await cycle.save();
  res.json({ success: true, cycle });
};

module.exports = { getCropCycles, createCropCycle, updateStage };
