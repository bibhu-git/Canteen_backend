import userModel from '../model/UserModel.js'; // your student data model
import AttendanceModel from '../model/Attendance.js';


const MealOn = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

        // Get all students with mealStatus = true
        const students = await userModel.find({ mealStatus: true }, { canteenNo: 1, name: 1, _id: 0 });

        // Get today's attendance records
        const todaysRecords = await AttendanceModel.find({ date: today });

        // Map attendance by canteenNo
        const attendanceMap = {};
        todaysRecords.forEach(record => {
            attendanceMap[record.canteenNo] = record;
        });

        // Combine attendance or default
        const responseStudents = students.map(student => {
            const record = attendanceMap[student.canteenNo];
            return {
                canteenNo: student.canteenNo,
                name: student.name,
                breakfast: record?.breakfast ?? null,
                lunch: record?.lunch ?? null,
                dinner: record?.dinner ?? null,
                extra: record?.extra ?? "",
                rsExtra: record?.extraAmount ?? 0,
                rsTotal: record?.total ?? 0
            };
        });

        // Sort by canteenNo
        responseStudents.sort((a, b) => parseInt(a.canteenNo) - parseInt(b.canteenNo));

        res.json({ success: true, students: responseStudents });
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export default MealOn;


const ManageAttendance = async (req, res) => {
    try {
        const { canteenNo, breakfast, lunch, dinner, extra, rsExtra, rsTotal } = req.body;
        const today = new Date().toISOString().split("T")[0];


        if (!canteenNo) {
            return res.json({ success: false, error: "CanteenNo required" });
        }
        const result = await userModel.findOne({ canteenNo }, { _id: 0, totalAmount: 1 });
        let totalAmount = result?.totalAmount;

        const existing = await AttendanceModel.findOne({ canteenNo, date: today });

        if (existing) {
            const previousAmount = existing.total;

            await AttendanceModel.updateOne({ canteenNo, date: today }, {
                breakfast, lunch, dinner, extra,
                extraAmount: rsExtra,
                total: rsTotal
            });

            const amount = rsTotal - previousAmount;
            totalAmount += amount;
            await userModel.updateOne(
                { canteenNo: canteenNo },
                { $set: { totalAmount: totalAmount } }
            );
        } else {
            const attendanceData = new AttendanceModel({
                canteenNo,
                breakfast,
                lunch,
                dinner,
                extra,
                extraAmount: rsExtra,
                total: rsTotal,
                date: today
            });
            await attendanceData.save();
            
            totalAmount += rsTotal;
            await userModel.updateOne(
                { canteenNo: canteenNo },
                { $set: { totalAmount: totalAmount } }
            );

        }

        res.json({ success: true, message: "Attendance recorded successfully." });

    } catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


const getRecord = async (req, res) => {
    try {
        const { canteenNo } = req.query;
        if (!canteenNo) {
            return res.json({ success: false, error: "Required field is missing!" });
        }
        const responseData = await AttendanceModel.find({ canteenNo });
        if (!responseData || responseData.length === 0) {
            return res.json({ success: false, error: "User not found!" });
        }
        res.json({ success: true, records: responseData });
    } catch (error) {
        return res.json({ success: false, error: "Internal server error!" });
    }
}

const viewAttendance = async (req, res) => {
    try {
        const { month } = req.query;
        const { userId } = req.body;


        const result = await userModel.findOne({ _id: userId }, { canteenNo: 1 });
        const canteenNo = result?.canteenNo;

        if (!canteenNo || !month) {
            return res.json({ success: false, error: "Required field is missing!" });
        }

        // month is in format: "2025-04"
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1); // go to next month

        const attendance = await AttendanceModel.find({
            canteenNo,
            date: {
                $gte: startDate,
                $lt: endDate,
            },
        });

        if (!attendance || attendance.length === 0) {
            return res.json({ success: false, error: "No records found for this month." });
        }

        res.json({ success: true, data: attendance });
    } catch (error) {
        return res.json({ success: false, error: "Internal server error!" });
    }
};




export { MealOn, ManageAttendance, getRecord, viewAttendance };
