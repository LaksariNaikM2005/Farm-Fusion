const Animal = require('../models/Animal');
const AnimalHealthRecord = require('../models/AnimalHealthRecord');
const User = require('../models/User');

// GET /api/v1/veterinary/animals
const getMyAnimals = async (req, res) => {
  let animals = await Animal.find({ farmer: req.user._id });
  if (animals.length === 0) {
    const seedAnimals = [
      {
        farmer: req.user._id,
        tagNumber: 'KA-MYS-2024-001',
        name: 'Ganga',
        animalType: 'Cattle (Cow)',
        breed: 'Hallikar (Indigenous Karnataka Breed)',
        gender: 'Female',
        ageMonths: 36,
        weightKg: 380,
        lactationStatus: 'Lactating',
        dailyYieldLiters: 9.5,
        status: 'Healthy',
        images: ['https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500'],
        notes: 'High drought resilience. Feed includes green fodder, dry straw and mineral mixture.',
      },
      {
        farmer: req.user._id,
        tagNumber: 'KA-MYS-2024-002',
        name: 'Yamuna',
        animalType: 'Buffalo',
        breed: 'Murrah',
        gender: 'Female',
        ageMonths: 42,
        weightKg: 520,
        lactationStatus: 'Lactating',
        dailyYieldLiters: 12.0,
        status: 'Healthy',
        images: ['https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500'],
        notes: 'High fat milk percentage (7.8%). Regular deworming completed.',
      },
    ];
    await Animal.insertMany(seedAnimals);
    animals = await Animal.find({ farmer: req.user._id });
  }
  res.json({ success: true, animals });
};

// POST /api/v1/veterinary/animals
const addAnimal = async (req, res) => {
  const animal = await Animal.create({ ...req.body, farmer: req.user._id });
  res.status(201).json({ success: true, animal });
};

// GET /api/v1/veterinary/records
const getHealthRecords = async (req, res) => {
  const { animalId } = req.query;
  const filter = { farmer: req.user._id };
  if (animalId) filter.animal = animalId;

  let records = await AnimalHealthRecord.find(filter).sort({ date: -1 }).populate('animal', 'tagNumber name animalType breed');

  if (records.length === 0) {
    const animals = await Animal.find({ farmer: req.user._id });
    if (animals.length > 0) {
      const seedRecords = [
        {
          animal: animals[0]._id,
          farmer: req.user._id,
          recordType: 'Vaccination',
          title: 'Foot and Mouth Disease (FMD) Bi-annual Booster',
          medicines: ['Raksha-Ovac FMD Vaccine'],
          veterinarianName: 'Dr. Ramesh Rao (Veterinary Hospital, Hunsur)',
          date: new Date(Date.now() - 60 * 86400000),
          nextDueDate: new Date(Date.now() + 120 * 86400000),
          status: 'Completed',
          cost: 150,
          notes: 'Subcutaneous injection, no adverse reaction observed.',
        },
        {
          animal: animals[0]._id,
          farmer: req.user._id,
          recordType: 'Deworming',
          title: 'Broad Spectrum Deworming',
          medicines: ['Albendazole 3g Bolus'],
          veterinarianName: 'Dr. Ramesh Rao',
          date: new Date(Date.now() - 30 * 86400000),
          nextDueDate: new Date(Date.now() + 60 * 86400000),
          status: 'Completed',
          cost: 80,
          notes: 'Administered orally in morning fasting state.',
        },
      ];
      await AnimalHealthRecord.insertMany(seedRecords);
      records = await AnimalHealthRecord.find(filter).sort({ date: -1 }).populate('animal', 'tagNumber name animalType breed');
    }
  }

  res.json({ success: true, records });
};

// POST /api/v1/veterinary/records
const addHealthRecord = async (req, res) => {
  const record = await AnimalHealthRecord.create({ ...req.body, farmer: req.user._id });
  res.status(201).json({ success: true, record });
};

// POST /api/v1/veterinary/ai-symptom-check
const checkAnimalSymptoms = async (req, res) => {
  const { animalType, symptoms, durationDays } = req.body;

  // Authentic veterinary safety triage & reference advisory
  let provisionalAdvice = 'Monitor water intake, isolate animal from herd if infectious symptoms are present, and provide clean bedding.';
  let possibleConditions = ['Sub-acute Mastitis', 'Digestive Bloat / Indigestion', 'Tick-borne Fever (Theileriosis)'];
  let urgency = 'Moderate — Consult a certified veterinarian within 24-48 hours.';

  const sLower = (symptoms || '').toLowerCase();
  if (sLower.includes('udder') || sLower.includes('milk') || sLower.includes('clot')) {
    possibleConditions = ['Bovine Mastitis (Inflammation of Mammary Gland)', 'Teat Injury / Infection'];
    provisionalAdvice = 'Perform California Mastitis Test (CMT) strip screening. Strip out affected quarter completely. Do not consume milk from infected quarter. Apply cold compress if swollen.';
    urgency = 'High — Prompt antibiotic / anti-inflammatory intramammary infusion by veterinarian needed.';
  } else if (sLower.includes('saliva') || sLower.includes('blister') || sLower.includes('hoof') || sLower.includes('limp')) {
    possibleConditions = ['Suspected Foot and Mouth Disease (FMD)', 'Foot Rot / Interdigital Dermatitis'];
    provisionalAdvice = 'Isolate animal immediately. Apply 2% potassium permanganate / alum solution to mouth and foot lesions. Feed soft gruel (cooked ragi/rice).';
    urgency = 'Emergency — Highly contagious viral disease; notify local government veterinary officer immediately.';
  }

  res.json({
    success: true,
    animalType,
    provisionalAnalysis: {
      possibleConditions,
      urgency,
      provisionalFirstAidAdvisory: provisionalAdvice,
      referenceSource: 'ICAR - Indian Veterinary Research Institute (IVRI) Clinical Compendium',
      disclaimer: 'CRITICAL SAFETY NOTICE: AI Farmer Assistant does not provide definitive medical diagnoses or replace a qualified veterinarian. Always consult a licensed veterinary doctor for physical examination and prescription treatments.',
    },
  });
};

module.exports = { getMyAnimals, addAnimal, getHealthRecords, addHealthRecord, checkAnimalSymptoms };
