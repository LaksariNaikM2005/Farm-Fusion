const Equipment = require('../models/Equipment');
const EquipmentBooking = require('../models/EquipmentBooking');

// GET /api/v1/equipment
const getAllEquipment = async (req, res) => {
  const { category, state, search } = req.query;
  const filter = { isAvailable: true };
  if (category) filter.category = category;
  if (state) filter['location.state'] = state;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  let equipmentList = await Equipment.find(filter).populate('owner', 'name phone location');

  // If none exist, seed authentic equipment listings
  if (equipmentList.length === 0) {
    const adminUser = req.user._id;
    const seedEquipment = [
      {
        owner: adminUser,
        name: 'Mahindra 575 DI Tractor (45 HP) with Rotavator',
        category: 'Tractor',
        description: 'Powerful 45 HP 4-cylinder diesel tractor equipped with 42-blade heavy duty rotavator. Ideal for deep tillage, puddling, and land levelling.',
        modelYear: 2023,
        horsepower: '45 HP',
        dailyRate: 2200,
        hourlyRate: 450,
        securityDeposit: 3000,
        withOperator: true,
        operatorChargePerDay: 500,
        location: { state: 'Karnataka', district: 'Mysuru', taluk: 'Hunsur', village: 'Bilikere' },
        images: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600'],
        condition: 'Excellent',
        rating: 4.8,
        totalReviews: 12,
      },
      {
        owner: adminUser,
        name: 'DJI Agras T40 Agricultural Drone Sprayer',
        category: 'Agricultural Drone',
        description: '40L spray payload capacity, coaxial twin-rotor drone with active phased array radar. Covers 1 acre in just 7 minutes with ultra-fine droplet dispersion.',
        modelYear: 2024,
        horsepower: 'Electric / Dual Battery',
        dailyRate: 4500,
        hourlyRate: 800,
        securityDeposit: 5000,
        withOperator: true,
        operatorChargePerDay: 800,
        location: { state: 'Karnataka', district: 'Mandya', taluk: 'Maddur', village: 'Shivapura' },
        images: ['https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=600'],
        condition: 'Excellent',
        rating: 4.9,
        totalReviews: 18,
      },
      {
        owner: adminUser,
        name: 'Multi-Crop High Efficiency Harvester / Thresher',
        category: 'Harvester / Combine',
        description: 'Paddy, wheat, soybean, and gram harvester with 10-foot cutter bar, grain tank unloader, and straw chopper.',
        modelYear: 2022,
        horsepower: '75 HP',
        dailyRate: 5800,
        hourlyRate: 950,
        securityDeposit: 6000,
        withOperator: true,
        operatorChargePerDay: 700,
        location: { state: 'Karnataka', district: 'Hassan', taluk: 'Channarayapatna', village: 'Bagur' },
        images: ['https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600'],
        condition: 'Good',
        rating: 4.7,
        totalReviews: 9,
      },
      {
        owner: adminUser,
        name: 'Honda 4-Stroke Power Sprayer with 100m Hose',
        category: 'Boom Sprayer / Power Sprayer',
        description: 'Portable brass pump power sprayer, high pressure up to 40 kg/cm2. Perfect for horticultural orchards and vegetable beds.',
        modelYear: 2023,
        horsepower: '1.5 HP',
        dailyRate: 650,
        hourlyRate: 120,
        securityDeposit: 1000,
        withOperator: false,
        location: { state: 'Karnataka', district: 'Mysuru', taluk: 'T Narasipura', village: 'Bannur' },
        images: ['https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600'],
        condition: 'Excellent',
        rating: 4.6,
        totalReviews: 15,
      },
    ];
    await Equipment.insertMany(seedEquipment);
    equipmentList = await Equipment.find(filter).populate('owner', 'name phone location');
  }

  res.json({ success: true, equipment: equipmentList, count: equipmentList.length });
};

// POST /api/v1/equipment/bookings
const bookEquipment = async (req, res) => {
  const { equipmentId, startDate, endDate, rentalDays, needOperator, deliveryAddress, notes } = req.body;
  const eq = await Equipment.findById(equipmentId);
  if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found' });

  const days = Number(rentalDays) || 1;
  let totalPrice = eq.dailyRate * days;
  if (needOperator && eq.operatorChargePerDay) {
    totalPrice += eq.operatorChargePerDay * days;
  }

  const booking = await EquipmentBooking.create({
    equipment: equipmentId,
    renter: req.user._id,
    owner: eq.owner,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    rentalDays: days,
    needOperator: !!needOperator,
    totalPrice,
    deliveryAddress,
    notes,
    status: 'Confirmed',
    paymentStatus: 'Paid',
  });

  res.status(201).json({ success: true, booking, message: 'Equipment booked successfully!' });
};

// GET /api/v1/equipment/bookings/my
const getMyBookings = async (req, res) => {
  const bookings = await EquipmentBooking.find({ renter: req.user._id })
    .sort({ createdAt: -1 })
    .populate('equipment')
    .populate('owner', 'name phone location');
  res.json({ success: true, bookings });
};

module.exports = { getAllEquipment, bookEquipment, getMyBookings };
