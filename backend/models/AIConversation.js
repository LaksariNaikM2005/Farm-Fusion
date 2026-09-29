const mongoose = require('mongoose');

const aiMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  detectedIntent: { type: String, default: 'general_query' },
  language: { type: String, default: 'en' },
  audioInputUrl: { type: String, default: '' },
  audioOutputUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  groundingSources: [
    {
      title: String,
      source: String,
      verificationLevel: String,
      url: String,
    },
  ],
  recommendedActions: [{ type: String }],
  escalatedToExpert: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const aiConversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'New Farm Advisory Chat' },
    contextSummary: { type: String, default: '' },
    messages: [aiMessageSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AIConversation', aiConversationSchema);
