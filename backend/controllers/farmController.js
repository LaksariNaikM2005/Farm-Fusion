const Farm = require('../models/Farm');

// GET /api/v1/farms
const getFarms = async (req, res) => {
  let farms = await Farm.find({ farmer: req.user._id, isActive: true });
  if (farms.length === 0) {
    // create default farm
    const defaultFarm = await Farm.create({
      farmer: req.user._id,
      farmName: `${req.user.name.split(' ')[0]}'s Green Acres`,
      surveyNumber: 'SY-42/1B',
      totalArea: 2.5,
      state: 'Karnataka',
      district: req.user.location?.split(',')?.[0]?.trim() || 'Mysuru',
      taluk: 'Hunsur',
      village: 'Bilikere',
      plots: [
        { plotName: 'Plot A - North Field', area: 1.5, soilType: 'Red Loam', soilPh: 6.5, currentCrop: 'Tomato', status: 'Growing' },
        { plotName: 'Plot B - South Field', area: 1.0, soilType: 'Red Loam', soilPh: 6.8, currentCrop: 'Ragi', status: 'Planted' },
      ],
      waterSources: ['Borewell (300ft)', 'Farm Pond'],
    });
    farms = [defaultFarm];
  }
  res.json({ success: true, farms });
};

// POST /api/v1/farms
const createFarm = async (req, res) => {
  const farm = await Farm.create({ ...req.body, farmer: req.user._id });
  res.status(201).json({ success: true, farm });
};

// PUT /api/v1/farms/:id
const updateFarm = async (req, res) => {
  const farm = await Farm.findOneAndUpdate({ _id: req.params.id, farmer: req.user._id }, req.body, { new: true });
  if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
  res.json({ success: true, farm });
};

// POST /api/v1/farms/:id/plots
const addPlot = async (req, res) => {
  const farm = await Farm.findOne({ _id: req.params.id, farmer: req.user._id });
  if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
  farm.plots.push(req.body);
  await farm.save();
  res.status(201).json({ success: true, farm });
};

module.exports = { getFarms, createFarm, updateFarm, addPlot };
