import userModel from "../model/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

const AdminLogin = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await userModel.findOne({ phone });
        if (!user) {
            return res.json({ success: false, error: "User not exists!" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, error: "Invalid password!" });
        }
        const token = createToken(user._id);
        return res.json({ success: true, message: "Login Successfully..", token: token });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, error: "Internal server error" });
    }
}

export {AdminLogin};