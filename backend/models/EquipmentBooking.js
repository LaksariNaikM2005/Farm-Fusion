const mongoose = require('mongoose');

const equipmentBookingSchema = new mongoose.Schema(
  {
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    rentalDays: { type: Number, required: true, default: 1 },
    needOperator: { type: Boolean, default: false },
    totalPrice: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Pending',
    },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
    notes: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EquipmentBooking', equipmentBookingSchema);
