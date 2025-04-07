import userModel from "../model/UserModel.js";
import StudentInformation from "../model/StudentInformation.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

const Register = async (req, res) => {
    const { name, phone, parentPhone, department, rollNo, canteenNo, address } = req.body;
    try {
        const isExist = await userModel.findOne({ phone });
        if (isExist) {
            return res.json({ success: false, error: "User already exists!" });
        }
        const checkCanteenNo = await userModel.findOne({ canteenNo });
        if (checkCanteenNo) {
            return res.json({ success: false, error: "CanteenNo already exists!" });
        }

        const newStudent = new StudentInformation({
            name: name,
            phone: phone,
            parentPhone: parentPhone,
            department: department,
            rollNo: rollNo,
            canteenNo: canteenNo,
            address: address
        });
        await newStudent.save();

        const password = '00000';
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name: name,
            phone: phone,
            department: department,
            password: hashPassword,
            canteenNo: canteenNo,
            mealStatus: true,
            address: address
        });



        const user = await newUser.save();
        const token = createToken(user._id);
        return res.json({ success: true, message: "User created Successfully..", token: token });

    } catch (error) {
        return res.json({ success: false, error: "Internal server error" });
    }
}

const Login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await userModel.findOne({ phone });
        if (!user) {
            return res.json({ success: false, error: "User not exists!" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, error: "Incorrect Password!" });
        }
        const token = createToken(user._id);
        return res.json({ success: true, message: "Login Successfully..", token: token });


    } catch (error) {
        return res.json({ success: false, error: "Internal server error" });
    }
}

const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword, confirmPassword } = req.body;


        if (!userId || !currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, error: "Required field is missing" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, error: "New password and confirm password don't match!" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found!" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Incorrect password!" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.findByIdAndUpdate(userId, { password: hashedPassword });

        return res.json({ success: true, message: "Password changed successfully." });

    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal Server Error!" });
    }
};


const userProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId);
        if (!user) {
            return res.json({ success: false, error: "User not found!" });
        }
        const responseData = {
            name: user.name,
            role: user.role
        }
        res.json({ success: true, user: responseData });
    } catch (error) {
        return res.json({ success: false, error: "User not found!" });

    }
}

const userData = async (req, res) => {
    try {
        const { canteenNo } = req.query;

        if (!canteenNo) {
            return res.json({ success: false, error: "Required field is missing!" });
        }

        const userInformation = await StudentInformation.findOne({ canteenNo });

        if (!userInformation) {
            return res.json({ success: false, error: "User not found" });
        }

        res.json({ success: true, data: userInformation }); // assuming one user per canteenNo

    } catch (error) {
        return res.json({ success: false, error: "Internal Server error!" });
    }
};

const DuePageData = async (req, res) => {
    try {
        const user = await userModel.find({ role: "user" }, { canteenNo: 1, name: 1, department: 1, totalAmount: 1 });
        if (!user) {
            return res.json({ success: false, error: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        return res.json({ success: false, error: "Internal Server Error!" });
    }
}

const specificData = async (req, res) => {
    try {
        const { canteenNo } = req.body;
        if (!canteenNo) {
            return res.json({ success: false, error: "Required field is missing!" });
        }
        const user = await userModel.find({ canteenNo }, { canteenNo: 1, name: 1, department: 1, totalAmount: 1 });
        if (!user) {
            return res.json({ success: false, error: "User not found!" });
        }

        res.json({ success: true, user });
    } catch (error) {
        return res.json({ success: false, error: "Internal Server Error!" });

    }
}

const UserPendingAmount = async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.json({ success: false, error: "User not found" });
      }
      const totalAmount = user.totalAmount;
      res.json({ success: true, totalAmount: totalAmount });
    } catch (error) {
      return res.json({ success: false, error: "Internal Server error!" });
    }
  }
export { Register, Login,changePassword ,userProfile, userData, DuePageData, specificData, UserPendingAmount};