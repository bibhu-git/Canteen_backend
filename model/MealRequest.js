import mongoose from 'mongoose';

const MealStatusRequestSchema = new mongoose.Schema({
  canteenNo: { type: String, required: true },
  name: { type: String, required: true },
  currentMealStatus: { type: Boolean, required: true },  
  requestedMealStatus: { type: Boolean, required: true },
  notes: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MealStatusRequest', MealStatusRequestSchema);
