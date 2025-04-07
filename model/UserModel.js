import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    department: {type: String, required: true},
    password: { type: String, required: true},
    canteenNo: { type: String, required: true },
    mealStatus: {type: Boolean, required: true},
    totalAmount: {type: Number, default: 0},
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const userModel = mongoose.model('user',userSchema);

export default userModel;