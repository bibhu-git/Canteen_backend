import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    name: {type: String, required: true},
    canteenNo: {type: String, required: true},
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    image: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    createdAt: { type: Date, default: Date.now() }
});

export default mongoose.model('paymentRequest', paymentSchema);