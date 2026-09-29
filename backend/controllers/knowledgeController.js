const KnowledgeDocument = require('../models/KnowledgeDocument');

// GET /api/v1/knowledge
const getKnowledgeDocs = async (req, res) => {
  const { category, search, crop } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (crop) filter.cropOrSubject = { $regex: crop, $options: 'i' };
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { summary: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { cropOrSubject: { $regex: search, $options: 'i' } },
    ];
  }

  let docs = await KnowledgeDocument.find(filter).sort({ createdAt: -1 });

  if (docs.length === 0) {
    const seedDocs = [
      {
        title: 'Integrated Pest Management (IPM) in Solanaceous Crops: Tomato & Chilli',
        category: 'Pest & Disease Guide',
        cropOrSubject: 'Tomato / Chilli',
        authoritativeSource: 'ICAR / KVK',
        verificationLevel: 'ICAR / AGRICULTURAL UNIVERSITY',
        sourceUrl: 'https://icar.org.in/ipm-solanaceous-2025',
        summary: 'Comprehensive scientific protocol for managing Early Blight, Bacterial Wilt, and Fruit Borer using bio-control agents and targeted threshold sprays.',
        content: `### 1. Cultural & Mechanical Control:
- Raise marigold (Tagetes erecta) as a trap crop (1:16 ratio) to manage Helicoverpa armigera.
- Deep summer ploughing to expose pupae and soil-borne fungal sclerotia to solar heat.

### 2. Biological Management:
- Soil application of Trichoderma harzianum or T. viride @ 5 kg/ha mixed with 500 kg FYM.
- Install yellow sticky traps (15-20 traps/acre) for whiteflies and blue sticky traps for thrips.

### 3. Chemical Intervention (ETL Based):
- Early Blight (Alternaria solani): Spray Mancozeb 75% WP @ 2g/L or Chlorothalonil 75% WP @ 2g/L.
- Fruit Borer: Spray Bacillus thuringiensis (Bt) @ 2g/L or Emamectin Benzoate 5% SG @ 0.4g/L.`,
        keywords: ['tomato', 'early blight', 'fruit borer', 'ipm', 'trichoderma', 'icar'],
        lastVerifiedDate: new Date('2026-03-10'),
      },
      {
        title: 'Package of Practices for Finger Millet (Ragi) under Rainfed & Irrigated Conditions',
        category: 'Agronomy Manual',
        cropOrSubject: 'Ragi (Finger Millet)',
        authoritativeSource: 'Agricultural University (UAS / TNAU / PAU)',
        verificationLevel: 'ICAR / AGRICULTURAL UNIVERSITY',
        sourceUrl: 'https://uasbangalore.edu.in/pop-ragi-2025',
        summary: 'Standard cultivation techniques for high-yielding varieties like GPU-28, ML-365, and KMR-301 with nutrient and moisture management.',
        content: `### 1. Seed Rate & Treatment:
- Sowing with seed drill requires 5 kg/ha; transplanting method requires 4 kg/ha.
- Treat seeds with Azospirillum brasilense and PSB @ 50g/kg seed for biological nitrogen and phosphate release.

### 2. Fertilizer Schedule:
- Recommended Dose of Fertilizer (RDF): 50:40:25 kg N:P2O5:K2O per hectare.
- Apply 50% N and 100% P & K as basal dose at the time of sowing. Remaining 50% N top-dressed at 25-30 days after sowing.

### 3. Moisture Conservation:
- Create dead furrows at 3.6m to 4.0m intervals for in-situ rainwater harvesting.`,
        keywords: ['ragi', 'finger millet', 'uas bangalore', 'gpu-28', 'drought resistance'],
        lastVerifiedDate: new Date('2026-02-28'),
      },
      {
        title: 'National Guidelines for Livestock Vaccination & Preventive Healthcare in Dairy Cattle',
        category: 'Veterinary Care',
        cropOrSubject: 'Cattle & Buffalo',
        authoritativeSource: 'National Veterinary Research Institute (IVRI)',
        verificationLevel: 'OFFICIAL GOVERNMENT',
        sourceUrl: 'https://ivri.nic.in/vaccine-calendar-2026',
        summary: 'Mandatory and advisory vaccination schedules for Foot and Mouth Disease (FMD), Haemorrhagic Septicaemia (HS), and Black Quarter (BQ).',
        content: `### 1. Foot & Mouth Disease (FMD):
- Primary vaccination at 4 months of age, booster after 6 months, and bi-annual revaccination (May-June & November-December).

### 2. Haemorrhagic Septicaemia (HS):
- Annual vaccination before monsoon onset (May-June) using alum-precipitated vaccine.

### 3. Deworming Protocol:
- Calves: First dose at 10-14 days of age, repeated monthly up to 6 months. Adult cattle: Bi-annual broad spectrum anthelmintic.`,
        keywords: ['veterinary', 'fmd', 'vaccination', 'livestock', 'ivri', 'dairy'],
        lastVerifiedDate: new Date('2026-04-01'),
      },
    ];
    await KnowledgeDocument.insertMany(seedDocs);
    docs = await KnowledgeDocument.find(filter).sort({ createdAt: -1 });
  }

  res.json({ success: true, count: docs.length, documents: docs });
};

// POST /api/v1/knowledge (Admin adds verified manual)
const createKnowledgeDoc = async (req, res) => {
  const doc = await KnowledgeDocument.create(req.body);
  res.status(201).json({ success: true, document: doc });
};

module.exports = { getKnowledgeDocs, createKnowledgeDoc };
