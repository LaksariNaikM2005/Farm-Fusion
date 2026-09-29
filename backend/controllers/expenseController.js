const FarmExpense = require('../models/FarmExpense');
const CropCycle = require('../models/CropCycle');

// GET /api/v1/expenses
const getExpenses = async (req, res) => {
  const { cropName, category, season, startDate, endDate } = req.query;
  const filter = { farmer: req.user._id };
  if (cropName) filter.cropName = cropName;
  if (category) filter.category = category;
  if (season) filter.season = season;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  let expenses = await FarmExpense.find(filter).sort({ date: -1 });

  // If no expenses exist yet, populate sample realistic data for instant demonstration
  if (expenses.length === 0) {
    const seedExpenses = [
      { farmer: req.user._id, cropName: 'Tomato', category: 'Seeds & Seedlings', title: 'Arka Rakshak F1 Hybrid Trays (3000 seedlings)', amount: 7500, date: new Date(Date.now() - 30 * 86400000) },
      { farmer: req.user._id, cropName: 'Tomato', category: 'Fertilizers & Nutrients', title: 'Neem Cake & 19:19:19 Water Soluble Fertilizer', amount: 9200, date: new Date(Date.now() - 22 * 86400000) },
      { farmer: req.user._id, cropName: 'Tomato', category: 'Labor & Wages', title: 'Transplanting & Staking labor (4 workers x 2 days)', amount: 6400, date: new Date(Date.now() - 15 * 86400000) },
      { farmer: req.user._id, cropName: 'Tomato', category: 'Machinery & Equipment Rental', title: 'Tractor Bed Making & Furrowing (4 hrs)', amount: 3600, date: new Date(Date.now() - 32 * 86400000) },
      { farmer: req.user._id, cropName: 'Tomato', category: 'Pesticides & Crop Protection', title: 'Organic Trichoderma & Bio-Pesticide Spray', amount: 2800, date: new Date(Date.now() - 8 * 86400000) },
      { farmer: req.user._id, cropName: 'Tomato', category: 'Fuel & Electricity', title: 'Drip Pump Diesel / Power charges', amount: 2500, date: new Date(Date.now() - 5 * 86400000) },
    ];
    await FarmExpense.insertMany(seedExpenses);
    expenses = await FarmExpense.find(filter).sort({ date: -1 });
  }

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Category summary
  const categorySummary = {};
  expenses.forEach((e) => {
    categorySummary[e.category] = (categorySummary[e.category] || 0) + e.amount;
  });

  res.json({
    success: true,
    totalExpenses: totalAmount,
    count: expenses.length,
    categorySummary,
    expenses,
  });
};

// POST /api/v1/expenses
const addExpense = async (req, res) => {
  const { title, amount, category, cropName, date, notes, season } = req.body;
  const expense = await FarmExpense.create({
    farmer: req.user._id,
    title,
    amount: Number(amount),
    category,
    cropName: cropName || 'Tomato',
    date: date || new Date(),
    notes,
    season: season || 'Kharif 2026',
  });

  // Update total in active crop cycle if matching
  await CropCycle.findOneAndUpdate(
    { farmer: req.user._id, cropName: { $regex: cropName || 'Tomato', $options: 'i' }, status: 'Active' },
    { $inc: { totalExpenses: Number(amount) } }
  );

  res.status(201).json({ success: true, expense });
};

// DELETE /api/v1/expenses/:id
const deleteExpense = async (req, res) => {
  const expense = await FarmExpense.findOneAndDelete({ _id: req.params.id, farmer: req.user._id });
  if (!expense) return res.status(404).json({ success: false, message: 'Expense record not found' });
  res.json({ success: true, message: 'Expense deleted successfully' });
};

module.exports = { getExpenses, addExpense, deleteExpense };
