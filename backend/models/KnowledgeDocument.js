const mongoose = require('mongoose');

const knowledgeDocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Agronomy Manual', 'Crop Advisory', 'Pest & Disease Guide', 'Government Policy & Scheme', 'Veterinary Care', 'Soil Management', 'Organic Farming Standard'],
      required: true,
    },
    cropOrSubject: { type: String, required: true },
    authoritativeSource: {
      type: String,
      enum: ['ICAR / KVK', 'State Agriculture Department', 'Agricultural University (UAS / TNAU / PAU)', 'National Veterinary Research Institute (IVRI)', 'FAO / Global Agri Open Data', 'Verified Farm Fusion Expert'],
      required: true,
    },
    verificationLevel: {
      type: String,
      enum: ['OFFICIAL GOVERNMENT', 'ICAR / AGRICULTURAL UNIVERSITY', 'VERIFIED EXPERT', 'RESEARCH SOURCE'],
      default: 'ICAR / AGRICULTURAL UNIVERSITY',
    },
    sourceUrl: { type: String, default: '' },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    keywords: [{ type: String }],
    lastVerifiedDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

knowledgeDocumentSchema.index({ title: 'text', content: 'text', cropOrSubject: 'text', keywords: 'text' });

module.exports = mongoose.model('KnowledgeDocument', knowledgeDocumentSchema);
