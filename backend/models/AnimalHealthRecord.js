const mongoose = require('mongoose');

const animalHealthRecordSchema = new mongoose.Schema(
  {
    animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recordType: {
      type: String,
      enum: ['Vaccination', 'Deworming', 'Disease Treatment', 'Artificial Insemination', 'Health Checkup', 'Emergency'],
      required: true,
    },
    title: { type: String, required: true },
    symptoms: { type: String, default: '' },
    provisionalAiAdvice: { type: String, default: '' },
    treatmentGiven: { type: String, default: '' },
    medicines: [{ type: String }],
    veterinarianName: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    nextDueDate: { type: Date },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Ongoing', 'Follow-up Required'], default: 'Completed' },
    cost: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AnimalHealthRecord', animalHealthRecordSchema);
