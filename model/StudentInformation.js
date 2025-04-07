import mongoose from "mongoose";

const StudentSchema = mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    parentPhone: {type: String, required: true},
    department: { type: String, required: true },
    rollNo: { type: String, required: true },
    canteenNo: { type: String, required: true },
    address: { type: String, required: true },
})

const StudentInformation = mongoose.model('studentInformation',StudentSchema);

export default StudentInformation;