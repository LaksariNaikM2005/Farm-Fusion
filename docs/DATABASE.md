# 🗄️ Database Architecture & Schemas

## Schema Overview
Farm Fusion 2.0 preserves MongoDB for high-throughput relational and transactional farming workflows.

### 1. `FarmerProfile`
```javascript
{
  user: ObjectId,
  personal: { age: Number, preferredLanguage: String, experienceYears: Number },
  location: { state: String, district: String, taluk: String, village: String, pincode: String },
  farmDetails: {
    totalLandArea: Number,
    landUnit: String,
    soilType: String,
    soilPh: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    irrigationType: String,
    waterAvailability: String,
    farmingMethod: String
  },
  financial: { annualBudget: Number, inputBudget: Number, primaryGoal: String },
  currentCrops: [String],
  machinery: [String],
  livestock: [{ animalType: String, count: Number, breed: String }],
  sustainabilityScore: Number
}
```

### 2. `CropCycle`
Tracks the active 8-stage lifecycle from planning to harvest analysis.
* `stage`: `PLAN` | `PREPARE` | `PLANT` | `GROW` | `MONITOR` | `HARVEST` | `SELL` | `ANALYZE`
* `stageHistory`: Timestamped audit trail with agronomist notes.

### 3. `KnowledgeDocument` (RAG Store)
* `title`: String
* `cropOrSubject`: String
* `authoritativeSource`: `ICAR / KVK` | `State Agriculture Department` | `Agricultural University` | `IVRI`
* `verificationLevel`: `OFFICIAL GOVERNMENT` | `ICAR / AGRICULTURAL UNIVERSITY` | `VERIFIED EXPERT`
* `content`: Scientific management protocols with text indexes.
