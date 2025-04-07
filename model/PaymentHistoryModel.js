import mongoose from "mongoose";

const PaymentSchema = mongoose.Schema({
    canteenNo: {type: String, required: true},
    amount: {type: Number, required: true},
    mode: {type: String, enum: ['Online','Cash'], required: true},
    date: {type: Date, default: Date.now()}
})

export default mongoose.model('paymentHistory',PaymentSchema);