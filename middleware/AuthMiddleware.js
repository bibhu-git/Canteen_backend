import jwt from 'jsonwebtoken';
import userModel from '../model/UserModel.js';
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, error: "Not Authorized! Please login again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, error: 'Unauthorized: User not found' });
        }


        if (!req.body) {
            req.body = {};
        }
        req.body.userId = user._id;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: "Invalid Token" });
    }
};

export default authMiddleware;
