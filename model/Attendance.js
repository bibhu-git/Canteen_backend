import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    canteenNo: String,
    name: String,
    breakfast: Boolean,
    lunch: Boolean,
    dinner: Boolean,
    extra: String,
    extraAmount: Number,
    total: Number,
    date: {
        type: Date,
        required: true
    }
});

export default mongoose.model("Attendance", attendanceSchema);
