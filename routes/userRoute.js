import { Register,Login, userProfile, userData, DuePageData, specificData, changePassword} from "../controller/UserController.js";
import express from 'express';
import authMiddleware from "../middleware/AuthMiddleware.js";
import { isUser } from "../middleware/RoleMiddleware.js";
import { viewAttendance } from "../controller/Attendace.js";
import { currentMealStatus, submitMealStatusRequest } from "../controller/MealRequestController.js";
import { submitPaymentStatusRequest } from "../controller/PaymentRequest.js";
import multer from "multer";
const userRouter = express.Router();


userRouter.post('/login',Login);
userRouter.get('/profile',authMiddleware,userProfile);
userRouter.post('/changePassword',authMiddleware,changePassword);
userRouter.get('/viewAttendance',authMiddleware,isUser,viewAttendance);

//meal request
userRouter.post('/mealRequest/submit',authMiddleware,isUser, submitMealStatusRequest);
userRouter.get('/meal/status',authMiddleware,isUser,currentMealStatus);

//payment request
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})
const upload = multer({ storage: storage });
userRouter.post('/payment/submit',upload.single("image"),authMiddleware,isUser,submitPaymentStatusRequest);

export default userRouter;